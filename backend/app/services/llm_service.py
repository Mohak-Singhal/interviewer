import os
import logging
from groq import Groq

# Configure logging to see EVERYTHING
logger = logging.getLogger("ai_brain")
logger.setLevel(logging.INFO)

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            logger.warning("⚠️ GROQ_API_KEY not found in .env")
        self.client = Groq(api_key=self.api_key)
        self.model = "llama-3.3-70b-versatile" # Good balance of speed/intelligence

    def get_ai_response(self, system_prompt: str, user_message: str):
        try:
            logger.info("🧠 Sending request to Groq...")
            
            # Call Groq API
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                model=self.model,
                temperature=0.6, # Slightly creative but focused
                max_tokens=250,  # Keep answers concise (good for interviews)
            )

            response_text = chat_completion.choices[0].message.content
            logger.info("✅ Groq Response Received")
            return response_text

        except Exception as e:
            logger.error(f"❌ AI Generation Failed: {e}")
            return "I apologize, I am having trouble processing that right now."

llm_service = LLMService()