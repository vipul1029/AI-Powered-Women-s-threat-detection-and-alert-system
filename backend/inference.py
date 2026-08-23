import cv2
import numpy as np
from pathlib import Path
from ultralytics import YOLO
import config


class ThreatDetector:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        path = config.MODEL_PATH
        if path.exists():
            self.model = YOLO(str(path))
            print(f"[Detector] Model loaded: {path}")
        else:
            print(f"[Detector] No model at {path}. Run train.py first.")

    def reload(self):
        self._load_model()

    def detect(self, frame: np.ndarray):
        """
        Returns (annotated_frame, detections_list, is_threat).
        detections_list: [{'class', 'confidence', 'severity', 'bbox'}]
        """
        if self.model is None:
            annotated = self._draw_no_model(frame)
            return annotated, [], False

        results = self.model(frame, conf=config.CONFIDENCE_THRESHOLD, verbose=False)
        detections = []
        is_threat = False
        annotated = frame.copy()

        for result in results:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                cls_name = (
                    config.CLASS_NAMES[cls_id]
                    if cls_id < len(config.CLASS_NAMES)
                    else "unknown"
                )
                severity = config.SEVERITY_MAP.get(cls_name, "MEDIUM")

                if cls_name != "none":
                    is_threat = True

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                color = config.BOX_COLORS_BGR.get(severity, (0, 0, 255))

                cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)

                label = f"{cls_name}  {conf:.0%}"
                (lw, lh), bl = cv2.getTextSize(
                    label, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 2
                )
                cv2.rectangle(
                    annotated,
                    (x1, y1 - lh - bl - 4),
                    (x1 + lw + 4, y1),
                    color, -1,
                )
                cv2.putText(
                    annotated, label,
                    (x1 + 2, y1 - bl - 2),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55,
                    (255, 255, 255), 2,
                )

                detections.append({
                    "class": cls_name,
                    "confidence": round(conf, 3),
                    "severity": severity,
                    "bbox": [x1, y1, x2, y2],
                })

        annotated = self._draw_status_bar(annotated, is_threat)
        return annotated, detections, is_threat

    def _draw_status_bar(self, frame, is_threat):
        h, w = frame.shape[:2]
        bar_h = 44
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, bar_h), (20, 20, 20), -1)
        cv2.addWeighted(overlay, 0.65, frame, 0.35, 0, frame)

        status = "⚠  UNSAFE — THREAT DETECTED" if is_threat else "✔  SAFE"
        color = (50, 50, 255) if is_threat else (50, 220, 50)
        cv2.putText(
            frame, status,
            (12, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.85, color, 2,
        )
        return frame

    def _draw_no_model(self, frame):
        h, w = frame.shape[:2]
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, 44), (20, 20, 20), -1)
        cv2.addWeighted(overlay, 0.65, frame, 0.35, 0, frame)
        cv2.putText(
            frame, "Model not loaded — run train.py",
            (12, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (100, 100, 255), 2,
        )
        return frame
