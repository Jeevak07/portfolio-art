# Drawing Portfolio

This project includes a React (Vite) frontend and a FastAPI backend for storing and serving artwork images.

## Quick Start

### Backend (FastAPI)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
setx ADMIN_KEY "changeme"
uvicorn main:app --reload
```

Backend will run at `http://localhost:8000` and serve images from `/uploads`.

### Frontend (React + Vite)

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and reads the API base from `frontend/.env`.

## Notes
- Update the placeholders in `frontend/src/App.jsx` with your real name, bio, WhatsApp number, and Instagram ID.
- Uploaded images are stored in `backend/storage/uploads` and metadata in `backend/data/works.json`.
- Admin uploads require a shared key. Update `ADMIN_KEY` (backend) and `VITE_ADMIN_KEY` (frontend) to match.
