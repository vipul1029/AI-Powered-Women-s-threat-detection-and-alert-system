import base64
import threading
import uuid
from datetime import datetime

import cv2

import config


class AlertManager:
    def __init__(self, socketio):
        self.socketio = socketio
        self.alerts: list[dict] = []
        self._lock = threading.Lock()

        self._snapshot_buf: list[str] = []
        self._detection_buf: list[dict] = []
        self._cooldown = False
        self._cooldown_timer: threading.Timer | None = None

    # ------------------------------------------------------------------
    # Called per threat frame
    # ------------------------------------------------------------------
    def add_detection(self, frame, detections: list[dict], source: str):
        with self._lock:
            if len(self._snapshot_buf) < 5:
                _, buf = cv2.imencode(
                    ".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 82]
                )
                self._snapshot_buf.append(
                    base64.b64encode(buf).decode("utf-8")
                )
                self._detection_buf.extend(detections)

            if len(self._snapshot_buf) >= 5 and not self._cooldown:
                self._fire_alert(source)
                self._start_cooldown()

    # ------------------------------------------------------------------
    # Reset on non-threat frame
    # ------------------------------------------------------------------
    def reset_buffer(self):
        with self._lock:
            self._snapshot_buf.clear()
            self._detection_buf.clear()

    # ------------------------------------------------------------------
    # REST helpers
    # ------------------------------------------------------------------
    def get_alerts(self) -> list[dict]:
        return self.alerts

    def clear_alerts(self):
        with self._lock:
            self.alerts.clear()
        self.socketio.emit("alerts_cleared")

    def resolve_alert(self, alert_id: str) -> bool:
        for a in self.alerts:
            if a["id"] == alert_id:
                a["resolved"] = True
                self.socketio.emit("alert_resolved", {"id": alert_id})
                return True
        return False

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------
    def _fire_alert(self, source: str):
        max_severity = "LOW"
        max_conf = 0.0
        threat_class = "unknown"

        for d in self._detection_buf:
            if d["class"] == "none":
                continue
            sev = d["severity"]
            if config.SEVERITY_ORDER.get(sev, 0) > config.SEVERITY_ORDER.get(
                max_severity, 0
            ):
                max_severity = sev
            if d["confidence"] > max_conf:
                max_conf = d["confidence"]
                threat_class = d["class"]

        alert = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "threat_class": threat_class,
            "confidence": round(max_conf, 3),
            "severity": max_severity,
            "snapshots": list(self._snapshot_buf),
            "source": source if len(str(source)) < 120 else "video file",
            "resolved": False,
        }

        self.alerts.insert(0, alert)
        if len(self.alerts) > 200:
            self.alerts.pop()

        self.socketio.emit("new_alert", alert)
        self._snapshot_buf.clear()
        self._detection_buf.clear()

    def _start_cooldown(self):
        self._cooldown = True

        def _reset():
            self._cooldown = False

        self._cooldown_timer = threading.Timer(
            config.ALERT_COOLDOWN_SECONDS, _reset
        )
        self._cooldown_timer.daemon = True
        self._cooldown_timer.start()
