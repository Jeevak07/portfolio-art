from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

from app.services.file_service import create_work_item, load_works, remove_work_item
from app.utils.security import require_admin

router = APIRouter()


@router.get('/')
async def root() -> dict[str, str]:
  return {'status': 'ok', 'message': 'Drawing Portfolio API'}


@router.get('/api/works')
async def list_works() -> JSONResponse:
  items = load_works()
  items.sort(key=lambda item: item.get('created_at', ''), reverse=True)
  return JSONResponse({'items': items})


@router.get('/api/admin/verify')
async def verify_admin(request: Request) -> JSONResponse:
  require_admin(request)
  return JSONResponse({'status': 'ok'})


@router.post('/api/works')
async def create_work(
  request: Request,
  title: str = Form(...),
  description: str | None = Form(None),
  tag: str | None = Form(None),
  year: str | None = Form(None),
  image: UploadFile = File(...),
) -> JSONResponse:
  require_admin(request)

  try:
    base_url = str(request.base_url).rstrip('/')
    new_work = await create_work_item(image, title, description, tag, year, base_url)
  except ValueError as error:
    raise HTTPException(status_code=400, detail=str(error)) from error

  return JSONResponse(new_work)


@router.delete('/api/works/{work_id}')
async def delete_work(work_id: str, request: Request) -> JSONResponse:
  require_admin(request)

  deleted = remove_work_item(work_id)
  if not deleted:
    raise HTTPException(status_code=404, detail='Work not found')

  return JSONResponse({'status': 'deleted', 'id': work_id})
