from fastapi import APIRouter, UploadFile, File
from app.services.resume_service import parse_resume, save_resume_to_db

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    parsed = await parse_resume(file)

    if "error" in parsed:
        return {"status": "error", "details": parsed}

    # Need bytes again (because parse_resume consumes file bytes)
    file_bytes = await file.read()

    saved = await save_resume_to_db(file.filename, parsed)

    return {
        "status": "success",
        "parsed": parsed,
        "saved": saved
    }
