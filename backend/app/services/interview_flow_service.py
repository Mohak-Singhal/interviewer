import logging
from app.db.database import supabase

logger = logging.getLogger("interview_flow")

class InterviewFlowService:
    
    @staticmethod
    def fetch_interview_context(interview_id: str):
        """
        Fetches interview details AND the linked resume data from Supabase.
        """
        try:
            # 1. Get Interview Data
            interview_res = supabase.table("interviews").select("*").eq("id", interview_id).execute()
            
            if not interview_res.data:
                logger.error(f"Interview {interview_id} not found.")
                return None
            
            interview_data = interview_res.data[0]
            resume_id = interview_data.get("resume_id")

            # 2. Get Resume Data (if linked)
            resume_data = {}
            if resume_id:
                # Note: resume_id is a BigInt, so we query directly
                resume_res = supabase.table("resume_data").select("*").eq("id", resume_id).execute()
                if resume_res.data:
                    resume_data = resume_res.data[0]

            logger.info(f"✅ Context loaded for Interview: {interview_id}")
            
            return {
                "interview": interview_data,
                "resume": resume_data
            }

        except Exception as e:
            logger.error(f"Failed to fetch context: {e}")
            return None

    @staticmethod
    def generate_system_prompt(context: dict):
        """
        Builds the 'Personality' of the AI based on the data.
        """
        interview = context["interview"]
        resume = context["resume"]

        role = interview.get("role", "General Role")
        rounds = interview.get("rounds", [])
        job_desc = interview.get("job_description", "No description provided.")
        
        # Candidate Details
        candidate_name = resume.get("name", "the candidate")
        skills = ", ".join(resume.get("skills", []))
        experience = ", ".join(resume.get("experience", []))
        projects = ", ".join(resume.get("projects", []))

        # Dynamic System Prompt
        system_prompt = f"""
        You are an expert AI Interviewer conducting a {role} interview.
        
        SESSION CONTEXT:
        - Role: {role}
        - Round Type: {', '.join(rounds)}
        - Job Description: {job_desc}
        
        CANDIDATE PROFILE:
        - Name: {candidate_name}
        - Key Skills: {skills}
        - Experience: {experience}
        - Projects: {projects}

        YOUR GOAL:
        Conduct a professional, realistic interview. Start by welcoming the candidate.
        Ask relevant questions based on their resume skills and the job description.
        If the candidate mentions a project, ask deep technical questions about it.
        Keep your responses concise (under 2-3 sentences) to keep the conversation flowing.
        Do not be repetitive.
        """
        
        return system_prompt.strip()

# Singleton Instance
flow_service = InterviewFlowService()