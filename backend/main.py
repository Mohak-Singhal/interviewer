from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.resume_routes import router as resume_router
from app.routes.interview_routes import router as interview_router

app = FastAPI(title="Interviewer AI Backend")

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

app.include_router(resume_router, prefix="/api/resume", tags=["Resume Parsing"])
app.include_router(interview_router, prefix="/api", tags=["Interview"])

@app.get("/")
def read_root():
    return {"status": "Backend is running", "docs_url": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
