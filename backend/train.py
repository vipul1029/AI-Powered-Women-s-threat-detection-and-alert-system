"""
Train YOLOv8n on the women-safety dataset.
Run: python train.py
"""
import shutil
import zipfile
from pathlib import Path

import torch
import torchvision.ops
import yaml
from ultralytics import YOLO

import config


def _patch_nms_cpu_fallback():
    """
    Patch torchvision NMS to run on CPU if the CUDA kernel isn't available.
    Happens when torchvision is the CPU-only build but torch is CUDA.
    NMS is tiny — CPU is fast enough and training still runs fully on GPU.
    """
    _orig_nms = torchvision.ops.nms

    def _nms_cpu_fallback(boxes, scores, iou_threshold):
        try:
            return _orig_nms(boxes, scores, iou_threshold)
        except (NotImplementedError, RuntimeError):
            device = boxes.device
            result = _orig_nms(boxes.cpu(), scores.cpu(), iou_threshold)
            return result.to(device)

    torchvision.ops.nms = _nms_cpu_fallback
    # also patch the internal reference used by ultralytics
    import torchvision.ops.boxes as _boxes
    _boxes.nms = _nms_cpu_fallback
    print("[Train] NMS CPU-fallback patch applied.")


def prepare_dataset() -> Path:
    out = config.EXTRACTED_DIR
    yaml_path = out / "data.yaml"

    if not out.exists():
        # Dataset not extracted yet — extract from zip
        if not config.DATASET_ZIP.exists():
            raise FileNotFoundError(f"Dataset zip not found: {config.DATASET_ZIP}")
        print(f"[Train] Extracting {config.DATASET_ZIP} ...")
        with zipfile.ZipFile(str(config.DATASET_ZIP), "r") as z:
            z.extractall(str(out))
        print("[Train] Extraction done.")
    else:
        print(f"[Train] Using existing dataset at {out}")

    # Always rewrite paths to absolute so YOLO can find them
    with open(yaml_path, "r") as f:
        meta = yaml.safe_load(f)

    meta["train"] = str((out / "train" / "images").resolve())
    meta["val"]   = str((out / "valid" / "images").resolve())
    meta["test"]  = str((out / "test"  / "images").resolve())

    with open(yaml_path, "w") as f:
        yaml.dump(meta, f, default_flow_style=False)

    print("[Train] data.yaml absolute paths set.")
    return yaml_path


def train():
    _patch_nms_cpu_fallback()

    yaml_path = prepare_dataset()
    config.MODEL_DIR.mkdir(parents=True, exist_ok=True)

    print("[Train] Starting YOLOv8n training on GPU ...")
    model = YOLO(config.MODEL_BASE)

    model.train(
        data=str(yaml_path),
        epochs=config.EPOCHS,
        imgsz=config.IMAGE_SIZE,
        batch=config.BATCH_SIZE,
        device=0,          # GPU 0 (RTX 4050)
        project=str(config.MODEL_DIR),
        name="run",
        exist_ok=True,
        patience=15,
        save=True,
        plots=True,
        verbose=True,
        workers=4,
        cache='disk',      # disk cache — avoids RAM pressure on laptop
    )

    best_src = config.MODEL_DIR / "run" / "weights" / "best.pt"
    if best_src.exists():
        shutil.copy(str(best_src), str(config.MODEL_PATH))
        print(f"[Train] Best weights saved → {config.MODEL_PATH}")
    else:
        print("[Train] WARNING: best.pt not found after training.")


if __name__ == "__main__":
    train()
