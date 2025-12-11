from fastapi import APIRouter, HTTPException
from app.models.interview import InterviewCreateRequest, InterviewResponse
from app.services.interview_service import InterviewService

router = APIRouter()

@router.post("/create-session", response_model=InterviewResponse)
async def create_interview_session(request: InterviewCreateRequest):
    """
    Creates a new interview session in Supabase.
    Links to a parsed resume_id if provided.
    """
    try:
        # Pass the request model directly to the service
        interview_id = await InterviewService.create_session(request)
        
        return InterviewResponse(
            interview_id=interview_id,
            status="success",
            message="Interview session initialized successfully"
        )
        
    except Exception as e:
        # Log the error and return a 500 to the frontend
        print(f"Error creating session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))