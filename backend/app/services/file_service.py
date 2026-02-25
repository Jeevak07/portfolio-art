import json
from datetime import datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import UploadFile

from app.config import DATA_FILE, UPLOAD_DIR


def load_works() -> list[dict[str, Any]]:
  return json.loads(DATA_FILE.read_text(encoding='utf-8-sig'))


def save_works(items: list[dict[str, Any]]) -> None:
  DATA_FILE.write_text(json.dumps(items, indent=2), encoding='utf-8')


async def create_work_item(
  image: UploadFile,
  title: str,
  description: str | None,
  tag: str | None,
  year: str | None,
  base_url: str,
) -> dict[str, Any]:
  if not image.content_type or not image.content_type.startswith('image/'):
    raise ValueError('Only image uploads are allowed.')

  ext = Path(image.filename or '').suffix or '.jpg'
  file_name = f"{uuid4().hex}{ext}"
  file_path = UPLOAD_DIR / file_name

  content = await image.read()
  file_path.write_bytes(content)

  new_work = {
    'id': uuid4().hex,
    'title': title,
    'description': description or '',
    'tag': tag or 'Sketch',
    'year': year or str(datetime.utcnow().year),
    'imageUrl': f"{base_url}/uploads/{file_name}",
    'created_at': datetime.utcnow().isoformat(),
  }

  items = load_works()
  items.insert(0, new_work)
  save_works(items)
  return new_work


def remove_work_item(work_id: str) -> bool:
  items = load_works()
  target = next((item for item in items if item.get('id') == work_id), None)
  if not target:
    return False

  image_url = target.get('imageUrl', '')
  if image_url:
    file_name = image_url.split('/')[-1]
    file_path = UPLOAD_DIR / file_name
    if file_path.exists():
      file_path.unlink(missing_ok=True)

  updated_items = [item for item in items if item.get('id') != work_id]
  save_works(updated_items)
  return True
