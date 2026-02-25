from fastapi import HTTPException, Request

from app.config import ADMIN_KEY


def require_admin(request: Request) -> None:
  admin_header = request.headers.get('X-Admin-Key')
  if not admin_header or admin_header != ADMIN_KEY:
    raise HTTPException(status_code=401, detail='Unauthorized')
