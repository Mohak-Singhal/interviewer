from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.resume_routes import router as resume_router

app = FastAPI()

# CORS settings
origins = [
    "http://localhost:3000", 
    "https://interviewer-ashy.vercel.app/"  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],     
    allow_headers=["*"],     
)

# Include your router
app.include_router(resume_router, prefix="/resume", tags=["Resume Parsing"])
