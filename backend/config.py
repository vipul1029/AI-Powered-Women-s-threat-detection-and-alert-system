from pathlib import Path

BASE_DIR = Path(__file__).parent
DATASET_DIR = BASE_DIR.parent / 'Women-Safety'
DATASET_ZIP = DATASET_DIR / 'women-safety.v1i.yolov8.zip'
EXTRACTED_DIR = DATASET_DIR / 'women-safety.v1i.yolov8'
MODEL_DIR = BASE_DIR / 'models'
MODEL_PATH = MODEL_DIR / 'best.pt'
UPLOADS_DIR = BASE_DIR / 'uploads'
INPUT_DIR = BASE_DIR / 'input'

CONFIDENCE_THRESHOLD = 0.45
ALERT_COOLDOWN_SECONDS = 10

EPOCHS = 50
IMAGE_SIZE = 640
BATCH_SIZE = 16
MODEL_BASE = 'yolov8n.pt'

CLASS_NAMES = ['abuse', 'attack', 'chain snatching', 'harash', 'none', 'rape', 'women-men-knife-gun']

SEVERITY_MAP = {
    'none': 'SAFE',
    'harash': 'LOW',
    'chain snatching': 'MEDIUM',
    'abuse': 'MEDIUM',
    'attack': 'HIGH',
    'women-men-knife-gun': 'CRITICAL',
    'rape': 'CRITICAL',
}

SEVERITY_ORDER = {'SAFE': 0, 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4}

BOX_COLORS_BGR = {
    'SAFE':     (0,   200,   0),
    'LOW':      (0,   200, 255),
    'MEDIUM':   (0,   140, 255),
    'HIGH':     (0,     0, 255),
    'CRITICAL': (60,   20, 220),
}
