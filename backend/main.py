# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Database init
from app.db.database import create_tables

# Import Routes
from app.routes.resume_routes import router as resume_router
from app.routes.interview_routes import router as interview_router
from app.routes.websocket_routes import router as websocket_router # <--- New Import
from app.routes.test_routes import router as test_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(title="Interviewer AI Backend", lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "https://interviewer-ashy.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(resume_router, prefix="/api/resume", tags=["Resume Parsing"])
app.include_router(interview_router, prefix="/api/interview", tags=["Interview"])
app.include_router(websocket_router, tags=["WebSockets"]) 
app.include_router(test_router, prefix="/api/test", tags=["Debug"])

@app.get("/")
def read_root():
    return {"status": "Backend is running", "docs_url": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)