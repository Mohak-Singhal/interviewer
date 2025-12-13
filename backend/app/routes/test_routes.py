from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.interview_flow_service import flow_service
from app.services.llm_service import llm_service
import logging

# Setup Logger
logger = logging.getLogger("test_debug")
logger.setLevel(logging.INFO)

router = APIRouter()

class TestChatRequest(BaseModel):
    interview_id: str
    user_message: str

@router.post("/chat/test")
async def test_interview_chat(request: TestChatRequest):
    """
    Simulates one turn of conversation:
    1. Fetches DB Context (Resume + Interview settings)
    2. Builds System Prompt
    3. Gets AI Response
    """
    
    # 1. Fetch Data from Supabase
    logger.info(f"🔍 Fetching Context for ID: {request.interview_id}")
    context = flow_service.fetch_interview_context(request.interview_id)
    
    if not context:
        raise HTTPException(status_code=404, detail="Interview ID not found")

    # --- DEBUG LOGGING: SEE WHAT IS COMING FROM DB ---
    print("\n" + "="*50)
    print("🛑 DATABASE DATA RETRIEVED:")
    print(f"📌 Role: {context['interview'].get('role')}")
    print(f"📌 Candidate: {context['resume'].get('name')}")
    print(f"📌 Skills: {context['resume'].get('skills')}")
    print("="*50 + "\n")

    # 2. Generate Prompt
    system_prompt = flow_service.generate_system_prompt(context)
    
    # --- DEBUG LOGGING: SEE THE EXACT PROMPT ---
    print("\n" + "="*50)
    print("🤖 SYSTEM PROMPT GENERATED:")
    print(system_prompt)
    print("="*50 + "\n")

    # 3. Get AI Response
    ai_reply = llm_service.get_ai_response(system_prompt, request.user_message)

    return {
        "status": "success",
        "input_message": request.user_message,
        "ai_response": ai_reply,
        "debug_info": {
            "role": context['interview'].get('role'),
            "skills_found": len(context['resume'].get('skills', []))
        }
    }