from fastapi import FastAPI
from app.routes.resume_routes import router as resume_router

app = FastAPI()

app.include_router(resume_router, prefix="/resume", tags=["Resume Parsing"])
