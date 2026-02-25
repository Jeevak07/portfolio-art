import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / 'data' / 'works.json'
UPLOAD_DIR = BASE_DIR / 'storage' / 'uploads'
ADMIN_KEY = os.getenv('ADMIN_KEY', 'changeme')

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
if not DATA_FILE.exists():
  DATA_FILE.write_text('[]', encoding='utf-8')
