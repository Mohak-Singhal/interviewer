from app.db.database import supabase
from app.models.interview import InterviewCreateRequest

class InterviewService:
    
    @staticmethod
    async def create_session(data: InterviewCreateRequest):
        try:
            print(f"Creating session for User: {data.user_id} | Resume ID: {data.resume_id}")

            # Prepare data for Supabase 'interviews' table
            interview_data = {
                "user_id": data.user_id,
                "role": data.role,
                "job_type": data.job_type,
                "rounds": data.rounds, 
                "job_description": data.job_description,
                "resume_id": data.resume_id, # Linking the parsed resume
                "status": "active"
            }

            # Insert into Supabase
            response = supabase.table("interviews").insert(interview_data).execute()

            # Check for success
            if not response.data:
                raise Exception("Failed to insert interview record into Supabase")

            new_interview_id = response.data[0]['id']

            # --- FUTURE AI HOOK ---
            # This is where you will trigger the AI to read the resume data
            # if data.resume_id:
            #     resume_data = supabase.table("resume_data").select("*").eq("id", data.resume_id).execute()
            #     AIService.generate_first_question(resume_data, data.job_description)
            # ----------------------

            return new_interview_id

        except Exception as e:
            print(f"[InterviewService] Error: {str(e)}")
            raise e