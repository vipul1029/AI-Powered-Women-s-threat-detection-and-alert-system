import argparse
import base64
import threading
import time
import uuid
from pathlib import Path

import cv2
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

import config
from alert_manager import AlertManager
from inference import ThreatDetector

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    max_http_buffer_size=20 * 1024 * 1024,  # 20 MB per frame message
    async_mode="threading",
)

detector = ThreatDetector()
alert_mgr = AlertManager(socketio)

config.UPLOADS_DIR.mkdir(exist_ok=True)
config.MODEL_DIR.mkdir(exist_ok=True)
config.INPUT_DIR.mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# Stream state (one active stream at a time)
# ---------------------------------------------------------------------------
_stream = {"stop": False, "thread": None, "active": False}


def _stop_stream():
    _stream["stop"] = True
    t = _stream["thread"]
    if t and t.is_alive():
        t.join(timeout=3)
    _stream["active"] = False
    alert_mgr.reset_buffer()


def _run_stream(source):
    """Reads from `source` (file path or RTSP URL), emits frames via socket."""
    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        socketio.emit("stream_error", {"message": f"Cannot open: {source}"})
        _stream["active"] = False
        return

    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    delay = max(1.0 / fps, 0.01)
    socketio.emit("stream_started", {"fps": fps})

    while not _stream["stop"]:
        ret, frame = cap.read()
        if not ret:
            break

        annotated, detections, is_threat = detector.detect(frame)

        if is_threat:
            alert_mgr.add_detection(annotated, detections, str(source))
        else:
            alert_mgr.reset_buffer()

        _, buf = cv2.imencode(".jpg", annotated, [cv2.IMWRITE_JPEG_QUALITY, 75])
        b64 = base64.b64encode(buf).decode("utf-8")

        socketio.emit(
            "video_frame",
            {
                "frame": f"data:image/jpeg;base64,{b64}",
                "detections": detections,
                "is_threat": is_threat,
                "status": "UNSAFE" if is_threat else "SAFE",
            },
        )

        time.sleep(delay)

    cap.release()
    _stream["active"] = False
    socketio.emit("stream_ended", {})


# ---------------------------------------------------------------------------
# REST endpoints
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": detector.model is not None,
            "stream_active": _stream["active"],
        }
    )


@app.post("/api/upload")
def upload_video():
    if "video" not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    f = request.files["video"]
    ext = Path(f.filename).suffix.lower()
    if ext not in {".mp4", ".avi", ".mov", ".mkv", ".webm"}:
        return jsonify({"error": "Unsupported file type"}), 400

    save_path = config.UPLOADS_DIR / f"{uuid.uuid4().hex}{ext}"
    f.save(str(save_path))

    _stop_stream()
    _stream["stop"] = False
    _stream["active"] = True
    t = threading.Thread(target=_run_stream, args=(str(save_path),), daemon=True)
    _stream["thread"] = t
    t.start()

    return jsonify({"status": "processing", "filename": f.filename})


@app.post("/api/stream/rtsp")
def start_rtsp():
    data = request.get_json(silent=True) or {}
    url = data.get("url", "").strip()
    if not url:
        return jsonify({"error": "RTSP URL required"}), 400

    _stop_stream()
    _stream["stop"] = False
    _stream["active"] = True
    t = threading.Thread(target=_run_stream, args=(url,), daemon=True)
    _stream["thread"] = t
    t.start()

    return jsonify({"status": "streaming", "url": url})


@app.post("/api/stream/stop")
def stop_stream_ep():
    _stop_stream()
    return jsonify({"status": "stopped"})


@app.get("/api/alerts")
def get_alerts():
    return jsonify(alert_mgr.get_alerts())


@app.post("/api/alerts/clear")
def clear_alerts():
    alert_mgr.clear_alerts()
    return jsonify({"status": "cleared"})


@app.post("/api/alerts/<alert_id>/resolve")
def resolve_alert(alert_id):
    ok = alert_mgr.resolve_alert(alert_id)
    return jsonify({"ok": ok})


@app.post("/api/model/reload")
def reload_model():
    detector.reload()
    return jsonify({"model_loaded": detector.model is not None})


@app.post("/api/stream/file")
def stream_file():
    """Stream any file path from the server filesystem (input folder or absolute path)."""
    data = request.get_json(silent=True) or {}
    rel = data.get("path", "").strip()
    if not rel:
        return jsonify({"error": "path required"}), 400

    # Resolve relative paths against the input folder
    p = Path(rel)
    if not p.is_absolute():
        p = config.INPUT_DIR / p

    if not p.exists():
        return jsonify({"error": f"File not found: {p}"}), 404

    ext = p.suffix.lower()
    if ext not in {".mp4", ".avi", ".mov", ".mkv", ".webm"}:
        return jsonify({"error": "Unsupported file type"}), 400

    _stop_stream()
    _stream["stop"] = False
    _stream["active"] = True
    t = threading.Thread(target=_run_stream, args=(str(p),), daemon=True)
    _stream["thread"] = t
    t.start()

    return jsonify({"status": "streaming", "path": str(p)})


@app.get("/api/input/files")
def list_input_files():
    """List video files available in the input folder."""
    exts = {".mp4", ".avi", ".mov", ".mkv", ".webm"}
    files = [
        f.name for f in config.INPUT_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in exts
    ]
    return jsonify({"files": sorted(files)})


# ---------------------------------------------------------------------------
# WebSocket — webcam frames sent from browser
# ---------------------------------------------------------------------------
@socketio.on("webcam_frame")
def handle_webcam_frame(data):
    raw = data.get("frame", "")
    if not raw:
        return

    # Strip data-URL prefix if present
    if "," in raw:
        raw = raw.split(",", 1)[1]

    img_bytes = base64.b64decode(raw)
    nparr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if frame is None:
        return

    annotated, detections, is_threat = detector.detect(frame)

    if is_threat:
        alert_mgr.add_detection(annotated, detections, "webcam")
    else:
        alert_mgr.reset_buffer()

    _, buf = cv2.imencode(".jpg", annotated, [cv2.IMWRITE_JPEG_QUALITY, 78])
    b64 = base64.b64encode(buf).decode("utf-8")

    emit(
        "annotated_frame",
        {
            "frame": f"data:image/jpeg;base64,{b64}",
            "detections": detections,
            "is_threat": is_threat,
            "status": "UNSAFE" if is_threat else "SAFE",
        },
    )


@socketio.on("connect")
def on_connect():
    _stream["client_connected"] = True
    emit("connected", {"model_loaded": detector.model is not None})


@socketio.on("disconnect")
def on_disconnect():
    pass


# ---------------------------------------------------------------------------
def _auto_stream(path: str):
    """Wait for first client connection then start streaming the input file."""
    print(f"[App] Input video queued: {path}")
    for _ in range(60):
        time.sleep(0.5)
        if _stream.get("client_connected"):
            break
    time.sleep(0.8)  # small grace period after connect
    _stream["stop"] = False
    _stream["active"] = True
    t = threading.Thread(target=_run_stream, args=(path,), daemon=True)
    _stream["thread"] = t
    t.start()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SafeAura backend")
    parser.add_argument(
        "--input", "-i",
        metavar="VIDEO_PATH",
        help="Path to input video (relative to input/ folder or absolute). "
             "Streaming starts automatically when the browser connects.",
    )
    args = parser.parse_args()

    if args.input:
        p = Path(args.input)
        if not p.is_absolute():
            p = config.INPUT_DIR / p
        if not p.exists():
            print(f"[App] ERROR: input file not found: {p}")
        else:
            threading.Thread(target=_auto_stream, args=(str(p),), daemon=True).start()

    socketio.run(app, host="0.0.0.0", port=5000, debug=False, use_reloader=False)
