from fastapi import APIRouter, UploadFile, File, Form
from app.services.resume_service import parse_resume, save_resume_to_db

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    user_id: str = Form(...)
):
    parsed = await parse_resume(file)

    if "error" in parsed:
        return {"status": "error", "details": parsed}
    await file.seek(0)

    saved = await save_resume_to_db(parsed, user_id)
    if "error" in saved:
        return {"status": "error", "details": saved}

    return {
        "status": "success",
        "resume_id": saved.get("id"), 
        "parsed": parsed,
        "saved": saved
    }
