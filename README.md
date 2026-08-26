# SafeAura — Women Threat Detection System

**Final Year Project** | Real-time AI-powered threat detection for women's safety via CCTV, webcam, and video surveillance.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [How It Works (System Flow)](#2-how-it-works-system-flow)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Dataset](#5-dataset)
6. [AI Model — YOLOv8n](#6-ai-model--yolov8n)
7. [Backend — Flask + SocketIO](#7-backend--flask--socketio)
8. [Frontend — React + Vite](#8-frontend--react--vite)
9. [Alert System](#9-alert-system)
10. [REST API Reference](#10-rest-api-reference)
11. [WebSocket Events Reference](#11-websocket-events-reference)
12. [Prerequisites & Installation](#12-prerequisites--installation)
13. [Running the Project](#13-running-the-project)
14. [Training the Model](#14-training-the-model)
15. [Configuration Reference](#15-configuration-reference)
16. [Severity & Class Reference](#16-severity--class-reference)
17. [Known Issues & Notes](#17-known-issues--notes)

---

## 1. Project Overview

SafeAura is a full-stack real-time video surveillance system that uses a fine-tuned YOLOv8 object detection model to identify threats to women — such as abuse, assault, chain snatching, harassment, and weapons — directly from live or pre-recorded video.

When a threat is detected across 5 consecutive frames, the system fires an alert with visual evidence (5 annotated snapshots), the threat class, confidence score, severity level, and timestamp. The frontend provides a live annotated video feed and a full alert management panel.

**Key capabilities:**
- Real-time inference at under 50 ms per frame (GPU)
- 4 video input modes: local file folder, drag-drop upload, webcam, RTSP IP camera
- 5-frame consensus system to eliminate false positives
- 10-second alert cooldown to avoid spam
- Severity-routed alerts: SAFE → LOW → MEDIUM → HIGH → CRITICAL
- HIGH/CRITICAL alerts auto-switch the UI to the Alerts tab
- Full alert log with 5-snapshot carousels and resolve/clear actions
- Entirely local — no cloud upload, no data leaves the machine
- Dark/light theme toggle

---

## 2. How It Works (System Flow)

```
Video Source (file / webcam / RTSP)
        │
        ▼
  OpenCV frame read
        │
        ▼
  YOLOv8n inference (backend/inference.py)
  ├── Draws bounding boxes + labels on frame
  └── Determines: class, confidence, severity, is_threat
        │
        ▼
  Alert buffer (backend/alert_manager.py)
  ├── Non-threat frame  →  reset buffer
  └── Threat frame      →  add snapshot to buffer
                              └── 5 snapshots collected?
                                    YES → fire new_alert via WebSocket
                                          (10s cooldown starts)
                                    NO  → keep collecting
        │
        ▼
  Annotated JPEG (base64) emitted via WebSocket
  → React frontend renders on <canvas>
  → Detections shown in sidebar
  → Alerts appear in AlertPanel
```

---

## 3. Tech Stack

### Backend
| Component | Version |
|-----------|---------|
| Python | 3.10 |
| Flask | 3.0.3 |
| Flask-SocketIO | 5.3.6 |
| Flask-CORS | 4.0.1 |
| Ultralytics (YOLOv8) | 8.2.84 |
| OpenCV | 4.10.0.84 |
| NumPy | 1.26.4 |
| Pillow | 10.4.0 |
| PyYAML | 6.0.2 |
| PyTorch | 2.5.1+cu124 |
| torchvision | 0.20.1+cu124 |

### Frontend
| Component | Version |
|-----------|---------|
| React | 18.3.1 |
| Vite | 5.3.4 |
| Tailwind CSS | 3.4.6 |
| socket.io-client | 4.7.5 |
| lucide-react | 0.400.0 |

### Hardware (development)
| Component | Spec |
|-----------|------|
| GPU | NVIDIA RTX 4050 Laptop |
| CUDA | 12.7 |
| PyTorch build | cu124 |

---

## 4. Project Structure

```
SIH-women-threat-detection-system/
│
├── start.bat                    # One-click launcher (starts both servers)
│
├── backend/
│   ├── app.py                   # Main Flask app — REST endpoints + SocketIO handlers
│   ├── inference.py             # ThreatDetector class — YOLOv8 detection + frame annotation
│   ├── alert_manager.py         # Alert buffer logic — 5-frame consensus + socket emit
│   ├── train.py                 # Model training script (with NMS CPU-fallback patch)
│   ├── config.py                # All constants: paths, thresholds, class names, severity map
│   ├── requirements.txt         # Python dependencies
│   │
│   ├── models/
│   │   └── best.pt              # Trained YOLOv8n weights (produced by train.py)
│   │
│   ├── input/                   # Drop video files here for easy playback
│   │   └── (your .mp4 files)
│   │
│   └── uploads/                 # Temporary storage for browser-uploaded videos
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js           # Vite config — port 5173, /api proxy → localhost:5000
│   ├── tailwind.config.js
│   │
│   └── src/
│       ├── App.jsx              # Root — socket events, tab routing, theme, alert state
│       ├── socket.js            # socket.io-client singleton
│       │
│       └── components/
│           ├── Header.jsx           # Top nav — connection/model status, alert badge, tabs
│           ├── LandingPage.jsx      # Home/intro page with stats and feature highlights
│           ├── MonitorPage.jsx      # Main monitor view — video + source tabs + sidebar
│           ├── VideoCanvas.jsx      # Renders annotated base64 frames from backend
│           ├── InputFolderPicker.jsx  # Browse backend/input/ folder or enter absolute path
│           ├── VideoUpload.jsx      # Drag-drop video upload to /api/upload
│           ├── WebcamFeed.jsx       # Browser webcam capture → send frames → display annotated
│           ├── RTSPFeed.jsx         # RTSP URL input → /api/stream/rtsp
│           ├── DetectionList.jsx    # Per-frame detection list in sidebar
│           ├── AlertPanel.jsx       # Alert log with severity filter
│           ├── AlertCard.jsx        # Individual alert card — 5-snapshot carousel + resolve btn
│           ├── AboutPage.jsx        # About page
│           ├── ContactPage.jsx      # Contact page
│           └── FeedbackPage.jsx     # Feedback page
│
└── Women-Safety/
    └── women-safety.v1i.yolov8/    # Dataset (YOLOv8 format)
        ├── data.yaml               # Dataset config (paths rewritten to absolute by train.py)
        ├── train/images/           # 1,176 training images
        ├── train/labels/           # YOLO format annotations
        ├── valid/images/           # 126 validation images
        ├── valid/labels/
        ├── test/images/            # 63 test images
        └── test/labels/
```

---

## 5. Dataset

- **Source:** Roboflow — `women-safety.v1i.yolov8`
- **Format:** YOLOv8 (bounding box annotations in `.txt` files, normalized XYWH)
- **Location:** `Women-Safety/women-safety.v1i.yolov8/`

### Split

| Split | Images |
|-------|--------|
| Train | 1,176 |
| Valid | 126 |
| Test | 63 |
| **Total** | **1,365** |

### Classes (7 total)

| ID | Class | Severity |
|----|-------|----------|
| 0 | `abuse` | MEDIUM |
| 1 | `attack` | HIGH |
| 2 | `chain snatching` | MEDIUM |
| 3 | `harash` | LOW |
| 4 | `none` | SAFE |
| 5 | `rape` | CRITICAL |
| 6 | `women-men-knife-gun` | CRITICAL |

The `none` class is used for safe scenes. Any detection where class ≠ `none` sets `is_threat = True`.

---

## 6. AI Model — YOLOv8n

### Architecture
- **Base:** YOLOv8n (nano — fastest YOLOv8 variant, ~3.2M params)
- **Input size:** 640×640
- **Framework:** Ultralytics + PyTorch

### Training Details

| Parameter | Value |
|-----------|-------|
| Base weights | `yolov8n.pt` (COCO pretrained) |
| Epochs configured | 50 |
| Epochs actually run | 26 (early stop at epoch 11 = best) |
| Early stop patience | 15 |
| Batch size | 16 |
| Image size | 640 |
| Device | GPU 0 (RTX 4050) |
| Cache | disk (avoids RAM pressure on laptop) |
| Workers | 4 |
| Training time | ~13 minutes |

### Performance

| Metric | Value |
|--------|-------|
| Overall mAP50 | 46.3% |
| Abuse | 85.7% |
| Rape | 56.1% |
| Attack | 42.3% |
| Confidence threshold (inference) | 0.45 |

### Weights Location
```
backend/models/best.pt
```
The model is loaded on startup by `ThreatDetector`. If `best.pt` is missing, the backend still runs but shows "Model not loaded — run train.py" on every frame.

### NMS CPU-Fallback Patch
`train.py` includes a patch for a known bug where `torchvision`'s CUDA NMS kernel crashes when the torchvision build doesn't match the CUDA version. The patch falls back NMS to CPU transparently. Training still runs fully on GPU — NMS is tiny and doesn't affect speed.

---

## 7. Backend — Flask + SocketIO

**Entry point:** `backend/app.py`  
**Port:** `5000`  
**SocketIO async mode:** `threading`  
**Max HTTP buffer:** 20 MB (for large frame payloads)

### Core Modules

#### `app.py`
- Initializes Flask, CORS (allows `localhost:5173`), SocketIO
- Creates `ThreatDetector` and `AlertManager` singletons at startup
- Ensures `uploads/`, `models/`, `input/` directories exist
- Manages a single active stream thread (`_stream` dict)
- Supports `--input VIDEO_PATH` CLI flag for auto-play on browser connect

#### `inference.py` — `ThreatDetector`
- Loads `best.pt` via Ultralytics YOLO on init
- `detect(frame)` method:
  - Runs YOLOv8 inference with `conf=0.45`
  - Draws colored bounding boxes (color = severity)
  - Draws label: `classname  XX%` on filled rectangle
  - Draws status bar overlay at top of frame: `✔ SAFE` or `⚠ UNSAFE — THREAT DETECTED`
  - Returns `(annotated_frame, detections_list, is_threat)`
- `detections_list` items: `{ class, confidence, severity, bbox: [x1,y1,x2,y2] }`
- `reload()` reloads weights from disk (used by `/api/model/reload`)

#### `alert_manager.py` — `AlertManager`
See [Section 9 — Alert System](#9-alert-system) for full details.

#### `config.py`
See [Section 15 — Configuration Reference](#15-configuration-reference) for all values.

#### `train.py`
See [Section 14 — Training the Model](#14-training-the-model).

### Stream Threading Model
Only one stream runs at a time. Every endpoint that starts a stream first calls `_stop_stream()` which sets a stop flag, joins the existing thread (3s timeout), and resets the alert buffer. A new daemon thread is then started running `_run_stream(source)`.

`_run_stream` reads frames with OpenCV, calls `detector.detect()`, feeds results to `alert_mgr`, then emits the annotated base64 JPEG and detection metadata via `video_frame` socket event.

---

## 8. Frontend — React + Vite

**Port:** `5173`  
**API proxy:** All `/api/*` requests are proxied by Vite to `http://localhost:5000` (configured in `vite.config.js`). This means you never hard-code `localhost:5000` in frontend fetch calls.

### Pages / Tabs

| Tab | Component | Description |
|-----|-----------|-------------|
| Landing | `LandingPage.jsx` | Intro with stats (mAP, classes, speed), feature list, launch button |
| Monitor | `MonitorPage.jsx` | Main surveillance view |
| Alerts | `AlertPanel.jsx` | Alert log and management |
| About | `AboutPage.jsx` | Project info |
| Contact | `ContactPage.jsx` | Contact info |
| Feedback | `FeedbackPage.jsx` | Feedback form |

### Component Breakdown

#### `App.jsx` (root)
- Manages all socket subscriptions (connect, disconnect, video_frame, annotated_frame, new_alert, etc.)
- Holds global state: `connected`, `modelLoaded`, `frame`, `status`, `detections`, `alerts`
- AUTO-SWITCHES to Alerts tab when a HIGH or CRITICAL alert arrives
- Persists dark/light theme preference in `localStorage` (`sa-theme`)
- Fetches existing alerts from `/api/alerts` on mount
- Fetches `/api/health` on mount to confirm model status

#### `Header.jsx`
- Shows connection status (green dot = connected, red = disconnected)
- Shows model status (loaded / not loaded)
- Shows unresolved alert count badge
- Navigation tabs: Landing, Monitor, Alerts, About, Contact, Feedback
- Dark/light theme toggle button

#### `MonitorPage.jsx`
- Left column: `VideoCanvas` (annotated frame) + source selector card
- Right sidebar (w-72):
  - System Status card (SAFE/UNSAFE with glow effect when UNSAFE)
  - Mini stats: total objects detected / threat count
  - Live Detections card (`DetectionList`)
  - AI Engine info card (model name, backend, inference speed, class count)

#### `VideoCanvas.jsx`
- Renders the base64 JPEG string from backend as an `<img>` tag
- Shows placeholder when no stream is active

#### `InputFolderPicker.jsx`
- Lists video files available in `backend/input/` via `GET /api/input/files`
- User can pick from the list or type an absolute path
- Calls `POST /api/stream/file` with the chosen path

#### `VideoUpload.jsx`
- Drag-and-drop or click-to-browse for local video files
- Uploads via `POST /api/upload` as multipart form data
- Supported formats: `.mp4`, `.avi`, `.mov`, `.mkv`, `.webm`

#### `WebcamFeed.jsx`
- Accesses browser webcam via `getUserMedia`
- Captures frames from a `<video>` element using a `<canvas>`
- Emits each frame as base64 JPEG via the `webcam_frame` socket event
- Receives `annotated_frame` events back and updates the display

#### `RTSPFeed.jsx`
- Input for an RTSP URL (e.g., `rtsp://admin:password@192.168.1.100:554/stream`)
- Calls `POST /api/stream/rtsp` to start backend streaming

#### `AlertPanel.jsx`
- Lists all alerts, newest first
- Severity filter buttons: ALL, LOW, MEDIUM, HIGH, CRITICAL
- Clear All button
- Renders each alert as an `AlertCard`

#### `AlertCard.jsx`
- Shows severity badge (color-coded), threat class, timestamp, confidence %
- Confidence bar
- Source path/label
- 5-snapshot carousel with prev/next arrows and thumbnail strip
- "Mark as Resolved" button → calls `POST /api/alerts/{id}/resolve`
- Resolved alerts shown greyed out at 55% opacity

---

## 9. Alert System

The alert system is designed to avoid false positives by requiring **5 consecutive threat frames** before firing an alert.

### Flow

```
Threat frame arrives
  └── snapshot_buf.length < 5?
        YES → encode frame as JPEG (quality 82), append to buffer
              also extend detection_buf with frame's detections
        NO  → cooldown active?
                YES → skip (rate-limited)
                NO  → _fire_alert()
```

### `_fire_alert()`
1. Scans `detection_buf` to find: highest severity class, highest confidence score
2. Constructs alert dict:
   ```json
   {
     "id": "<uuid4>",
     "timestamp": "2026-08-22T14:30:00.123456",
     "threat_class": "abuse",
     "confidence": 0.873,
     "severity": "MEDIUM",
     "snapshots": ["<base64 jpeg>", ...],  // 5 items
     "source": "path/to/video.mp4",
     "resolved": false
   }
   ```
3. Inserts at front of `alerts` list (max 200 alerts retained)
4. Emits `new_alert` socket event to all connected clients
5. Clears `snapshot_buf` and `detection_buf`
6. Starts 10-second cooldown timer

### Non-Threat Frame
When a non-threat frame arrives, `reset_buffer()` is called — the snapshot buffer is cleared and the system starts fresh. This means the 5 frames must be **consecutive**.

### Cooldown
After an alert fires, no new alert can fire for **10 seconds** (`ALERT_COOLDOWN_SECONDS = 10` in `config.py`).

### Alert Cap
The alert list is capped at **200 alerts** in memory (oldest are dropped when the cap is hit).

---

## 10. REST API Reference

All endpoints are served by the Flask backend on port 5000. When accessed through the React frontend, the Vite proxy forwards `/api/*` automatically.

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Returns `{ status, model_loaded, stream_active }` |

### Video Streaming

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/upload` | `multipart/form-data` with `video` field | Upload and immediately stream a video file |
| POST | `/api/stream/file` | `{ "path": "video.mp4" }` | Stream a file from `backend/input/` (relative) or any absolute path |
| POST | `/api/stream/rtsp` | `{ "url": "rtsp://..." }` | Start streaming an RTSP/IP camera URL |
| POST | `/api/stream/stop` | — | Stop the current stream |
| GET | `/api/input/files` | — | List `.mp4/.avi/.mov/.mkv/.webm` files in `backend/input/` |

Supported video extensions for upload and file stream: `.mp4`, `.avi`, `.mov`, `.mkv`, `.webm`

### Alerts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/alerts` | Returns all alerts (newest first) |
| POST | `/api/alerts/clear` | Deletes all alerts |
| POST | `/api/alerts/<alert_id>/resolve` | Marks one alert as resolved |

### Model

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/model/reload` | Reloads `best.pt` from disk without restarting the server |

---

## 11. WebSocket Events Reference

The system uses Socket.IO for real-time bidirectional communication. The frontend connects to `http://localhost:5000` via `socket.io-client`.

### Server → Client (backend emits)

| Event | Payload | Description |
|-------|---------|-------------|
| `connected` | `{ model_loaded }` | Fires immediately on client connect |
| `video_frame` | `{ frame, detections, is_threat, status }` | Annotated frame from file/RTSP stream |
| `annotated_frame` | `{ frame, detections, is_threat, status }` | Annotated frame from webcam stream |
| `stream_started` | `{ fps }` | Stream has successfully opened |
| `stream_ended` | `{}` | Video file finished playing |
| `stream_error` | `{ message }` | Failed to open source |
| `new_alert` | Full alert object (see Section 9) | Threat alert fired |
| `alert_resolved` | `{ id }` | An alert was resolved |
| `alerts_cleared` | `{}` | All alerts cleared |

### Client → Server (frontend emits)

| Event | Payload | Description |
|-------|---------|-------------|
| `webcam_frame` | `{ frame: "data:image/jpeg;base64,..." }` | Browser webcam frame to annotate |

### Frame Payload Shape
```json
{
  "frame": "data:image/jpeg;base64,/9j/4AAQ...",
  "detections": [
    {
      "class": "abuse",
      "confidence": 0.873,
      "severity": "MEDIUM",
      "bbox": [120, 45, 380, 290]
    }
  ],
  "is_threat": true,
  "status": "UNSAFE"
}
```

---

## 12. Prerequisites & Installation

### System Requirements
- Python 3.10
- Node.js 18+ and npm
- NVIDIA GPU with CUDA 12.x (for fast inference; CPU-only mode works but is slower)

### Python Environment Setup

```bash
cd backend
pip install -r requirements.txt
```

**For GPU acceleration (CUDA 12.4):**
```bash
pip install torch==2.5.1+cu124 torchvision==0.20.1+cu124 --index-url https://download.pytorch.org/whl/cu124
```
Install the CUDA-enabled PyTorch **before** running `pip install -r requirements.txt` so the GPU build isn't overwritten.

### Frontend Setup

```bash
cd frontend
npm install
```

### Dataset
The dataset should be extracted at:
```
Women-Safety/women-safety.v1i.yolov8/
```
If you have the zip (`Women-Safety/women-safety.v1i.yolov8.zip`), `train.py` extracts it automatically on first run.

---

## 13. Running the Project

### Option A — One-click (Windows)

Double-click `start.bat` or run from terminal:
```bat
.\start.bat
```
This opens two CMD windows: one for the Flask backend, one for the React frontend.

### Option B — Manual (two terminals)

**Terminal 1 — Backend:**
```bash
cd backend
python app.py
```
Backend runs at `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at `http://localhost:5173`

Open `http://localhost:5173` in your browser.

### Option C — Auto-play a video on startup

Pass a video path to the backend so it starts streaming automatically when the browser connects:

```bash
# Relative to backend/input/ folder:
cd backend
python app.py --input myvideo.mp4

# Absolute path:
python app.py --input "C:\Users\krbip\Videos\recording.mp4"
```
The backend waits up to 30 seconds for a client to connect, then starts streaming automatically.

### Stopping

Press `Ctrl+C` in each terminal, or close the CMD windows opened by `start.bat`.

---

## 14. Training the Model

Training requires the dataset to be present at `Women-Safety/women-safety.v1i.yolov8/` (or the zip at `Women-Safety/women-safety.v1i.yolov8.zip`).

```bash
cd backend
python train.py
```

**What `train.py` does:**
1. Applies the NMS CPU-fallback patch (see Section 6)
2. Extracts the dataset zip if `women-safety.v1i.yolov8/` doesn't exist yet
3. Rewrites `data.yaml` paths to absolute so YOLOv8 can find the data
4. Loads `yolov8n.pt` (COCO pretrained nano weights — downloaded automatically by Ultralytics if not cached)
5. Trains for up to 50 epochs with early stopping (patience=15), disk cache, 4 workers
6. Copies the best weights to `backend/models/best.pt`

Training artifacts (loss curves, confusion matrix, etc.) are saved at:
```
backend/models/run/
```

After training finishes, restart the backend — it picks up `best.pt` automatically on startup. Or call `POST /api/model/reload` without restarting.

---

## 15. Configuration Reference

All project-wide constants live in `backend/config.py`. Edit this file to change thresholds or training hyperparameters.

```python
# Paths
BASE_DIR        # backend/ directory
DATASET_DIR     # Women-Safety/
EXTRACTED_DIR   # Women-Safety/women-safety.v1i.yolov8/
MODEL_DIR       # backend/models/
MODEL_PATH      # backend/models/best.pt
UPLOADS_DIR     # backend/uploads/
INPUT_DIR       # backend/input/

# Inference
CONFIDENCE_THRESHOLD = 0.45   # Minimum confidence to show a detection
ALERT_COOLDOWN_SECONDS = 10   # Seconds between alerts from the same stream

# Training
EPOCHS      = 50
IMAGE_SIZE  = 640
BATCH_SIZE  = 16
MODEL_BASE  = 'yolov8n.pt'   # Change to yolov8s.pt for larger model

# Bounding box colors (BGR) per severity
BOX_COLORS_BGR = {
    'SAFE':     (0, 200, 0),     # Green
    'LOW':      (0, 200, 255),   # Yellow
    'MEDIUM':   (0, 140, 255),   # Orange
    'HIGH':     (0, 0, 255),     # Red
    'CRITICAL': (60, 20, 220),   # Deep red/purple
}
```

---

## 16. Severity & Class Reference

### Severity Levels

| Level | Color in UI | Color on frame | Meaning |
|-------|-------------|----------------|---------|
| SAFE | Green | Green | `none` class — no threat detected |
| LOW | Yellow | Yellow | Harassment (`harash`) |
| MEDIUM | Orange | Orange | Abuse, chain snatching |
| HIGH | Red | Red | Physical attack — auto-switches to Alerts tab |
| CRITICAL | Deep red/rose | Deep red | Rape, weapons (knife/gun) — auto-switches to Alerts tab |

### Full Class → Severity Map

```
none               → SAFE
harash             → LOW
chain snatching    → MEDIUM
abuse              → MEDIUM
attack             → HIGH
women-men-knife-gun → CRITICAL
rape               → CRITICAL
```

When multiple detections appear in the same alert, the **highest severity** across all detections is used for the alert's severity. The **highest confidence** detection determines the alert's `threat_class`.

---

## 17. Known Issues & Notes

### torchvision NMS CUDA bug
If you get a `NotImplementedError` or `RuntimeError` during training related to NMS, this is the torchvision CUDA NMS kernel issue. `train.py` patches this automatically with a CPU fallback — training still runs on GPU.

### Disk space before setup
The pip cache can grow large. If installation fails due to disk space, clear it:
```bash
pip cache purge
```

### RTSP streams
RTSP streams from IP cameras must be reachable from the machine running the backend. If using a mobile hotspot or different subnet, ensure the camera URL is accessible. Some cameras require credentials in the URL: `rtsp://user:pass@ip:port/path`.

### Webcam frame rate
The webcam mode sends one frame at a time (send → wait for `annotated_frame` → send next). This is intentional to avoid overwhelming the socket buffer. Throughput depends on network latency between browser and backend.

### One active stream at a time
The backend supports only one active stream thread. Starting a new stream (file, upload, RTSP) automatically stops the previous one.

### Model not found
If `backend/models/best.pt` does not exist, the backend starts but the detector is non-functional. Every frame will display "Model not loaded — run train.py". Run `python train.py` to produce the weights.

### CORS
The backend CORS policy allows only `http://localhost:5173` and `http://127.0.0.1:5173`. If you run the frontend on a different port or host, update the `origins` list in `backend/app.py` line 22.

### Alert persistence
Alerts are stored in memory only. They are lost when the backend restarts. The frontend fetches them from `/api/alerts` on mount to restore the session, but if the backend was restarted they will be gone.

---

*Built for Smart India Hackathon (SIH) — Women Safety Track.*
