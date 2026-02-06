from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

import os

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "works.json"
UPLOAD_DIR = BASE_DIR / "storage" / "uploads"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

if not DATA_FILE.exists():
    DATA_FILE.write_text("[]", encoding="utf-8")

app = FastAPI(title="Drawing Portfolio API")
ADMIN_KEY = os.getenv("ADMIN_KEY", "changeme")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


def load_works() -> list[dict[str, Any]]:
    return json.loads(DATA_FILE.read_text(encoding="utf-8-sig"))


def save_works(items: list[dict[str, Any]]) -> None:
    DATA_FILE.write_text(json.dumps(items, indent=2), encoding="utf-8")


@app.get("/")
async def root() -> dict[str, str]:
    return {"status": "ok", "message": "Drawing Portfolio API"}


@app.get("/api/works")
async def list_works() -> JSONResponse:
    items = load_works()
    items.sort(key=lambda item: item.get("created_at", ""), reverse=True)
    return JSONResponse({"items": items})


@app.post("/api/works")
async def create_work(
    request: Request,
    title: str = Form(...),
    description: str | None = Form(None),
    tag: str | None = Form(None),
    year: str | None = Form(None),
    image: UploadFile = File(...),
) -> JSONResponse:
    admin_header = request.headers.get("X-Admin-Key")
    if not admin_header or admin_header != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed.")

    ext = Path(image.filename or "").suffix or ".jpg"
    file_name = f"{uuid4().hex}{ext}"
    file_path = UPLOAD_DIR / file_name

    content = await image.read()
    file_path.write_bytes(content)

    base_url = str(request.base_url).rstrip("/")
    image_url = f"{base_url}/uploads/{file_name}"

    new_work = {
        "id": uuid4().hex,
        "title": title,
        "description": description or "",
        "tag": tag or "Sketch",
        "year": year or str(datetime.utcnow().year),
        "imageUrl": image_url,
        "created_at": datetime.utcnow().isoformat(),
    }

    items = load_works()
    items.insert(0, new_work)
    save_works(items)

    return JSONResponse(new_work)


@app.delete("/api/works/{work_id}")
async def delete_work(work_id: str, request: Request) -> JSONResponse:
    admin_header = request.headers.get("X-Admin-Key")
    if not admin_header or admin_header != ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    items = load_works()
    target = next((item for item in items if item.get("id") == work_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Work not found")

    image_url = target.get("imageUrl", "")
    if image_url:
        file_name = image_url.split("/")[-1]
        file_path = UPLOAD_DIR / file_name
        if file_path.exists():
            file_path.unlink(missing_ok=True)

    items = [item for item in items if item.get("id") != work_id]
    save_works(items)

    return JSONResponse({"status": "deleted", "id": work_id})
