from pydantic import BaseModel
from typing import List, Optional

# Schema for incoming data from Frontend
class InterviewCreateRequest(BaseModel):
    user_id: str
    role: str
    job_type: str
    rounds: List[str]
    job_description: Optional[str] = None
    resume_id: Optional[int] = None  # Stores the ID of the parsed resume

# Schema for the API response
class InterviewResponse(BaseModel):
    interview_id: str
    status: str
    message: str