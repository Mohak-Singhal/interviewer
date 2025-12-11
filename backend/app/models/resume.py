from pydantic import BaseModel
from typing import List, Optional

class ResumeParsed(BaseModel):
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    skills: Optional[List[str]] = []
    education: Optional[List[str]] = []
    experience: Optional[List[str]] = []
    projects: Optional[List[str]] = []
    raw_text: Optional[str]
