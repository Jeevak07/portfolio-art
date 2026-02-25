from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import UPLOAD_DIR
from app.routes.works import router as works_router

app = FastAPI(title='Drawing Portfolio API')

app.add_middleware(
  CORSMiddleware,
  allow_origin_regex=r'http://(localhost|127\.0\.0\.1):\d+',
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*'],
)

app.mount('/uploads', StaticFiles(directory=UPLOAD_DIR), name='uploads')
app.include_router(works_router)
