# Realistic AI Interviewer

An AI-powered interview preparation platform that conducts realistic mock interviews tailored to your target role and selected interview rounds. The platform uses advanced AI models to parse resumes, generate personalized interview questions, and provide comprehensive feedback.

**Live Demo:** [https://interviewer-ashy.vercel.app/](https://interviewer-ashy.vercel.app/)

## 🎯 Project Overview

Realistic AI Interviewer is a full-stack web application designed to help job seekers and students prepare for technical and behavioral interviews. The platform allows users to:

- **Upload and Parse Resumes**: Automatically extract structured information from PDF resumes using AI
- **Configure Interview Sessions**: Select target roles, job types (job/internship), and multiple interview rounds
- **Conduct Mock Interviews**: Experience realistic AI-powered interviews across different rounds:
  - Behavioral / HR
  - Technical Deep Dive
  - Live Coding
  - System Design
- **Track Progress**: Monitor interview sessions and performance through an integrated dashboard

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port: 3000    │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│   Backend       │
│   (FastAPI)     │
│   Port: 8000    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────────┐
│Supabase│ │  Groq API │
│  DB    │ │ (Llama 3.3│
│        │ │   70B)    │
└────────┘ └───────────┘
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 16.0.8 (React 19.2.1)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with Framer Motion animations
- **Authentication**: Supabase Auth
- **State Management**: React Hooks
- **Deployment**: Vercel

#### Backend
- **Framework**: FastAPI 0.111.0
- **Language**: Python 3.12
- **AI Model**: Groq API (Llama 3.3 70B Versatile)
- **Database**: Supabase (PostgreSQL)
- **PDF Processing**: PyMuPDF (fitz)
- **HTTP Client**: httpx
- **Server**: Uvicorn/Gunicorn

### Data Flow

1. **Resume Upload Flow**:
   ```
   User → Frontend → Backend API → PDF Parser → Groq AI → Structured JSON → Supabase DB
   ```

2. **Interview Session Flow**:
   ```
   User Config → Frontend → Supabase Auth → Interview Session Created → AI Interview Engine
   ```

## 📁 Project Structure

```
interviewer/
├── backend/
│   ├── app/
│   │   ├── config.py                 # Application configuration
│   │   ├── dependencies.py           # FastAPI dependencies
│   │   ├── db/
│   │   │   ├── database.py           # Supabase connection & table creation
│   │   │   ├── models.py             # Database models
│   │   │   └── crud.py               # Database operations
│   │   ├── models/
│   │   │   ├── resume.py             # Resume Pydantic models
│   │   │   ├── interview.py          # Interview Pydantic models
│   │   │   └── user.py               # User Pydantic models
│   │   ├── routes/
│   │   │   └── resume_routes.py      # Resume upload endpoints
│   │   ├── services/
│   │   │   └── resume_service.py    # Resume parsing & AI integration
│   │   └── utils/
│   │       ├── file_utils.py        # File handling utilities
│   │       ├── logging.py            # Logging configuration
│   │       └── validation.py        # Input validation
│   ├── main.py                       # FastAPI application entry point
│   ├── requirements.txt              # Python dependencies
│   └── .env                          # Environment variables (not in repo)
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── HeaderNav.tsx         # Navigation header
│   │   │   ├── HeroSection.tsx       # Landing page hero
│   │   │   ├── InterviewDetailsSection.tsx  # Interview configuration
│   │   │   ├── ResumeUploadForm.tsx   # Resume upload component
│   │   │   └── ...                   # Other UI components
│   │   ├── lib/
│   │   │   └── supabaseClient.ts     # Supabase client configuration
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── signup/
│   │   │   └── page.tsx              # Signup page
│   │   ├── page.tsx                  # Main landing page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── package.json                  # Node.js dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   └── next.config.ts                # Next.js configuration
│
└── README.md                         # This file
```

## 🚀 Setup Instructions

### Prerequisites

- **Python**: 3.12 or higher
- **Node.js**: 18.x or higher
- **npm** or **yarn**: Latest version
- **Supabase Account**: For database and authentication
- **Groq API Key**: For AI model access ([Get API Key](https://console.groq.com/))

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Create `.env` file** in the `backend/` directory:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_service_role_key
   GROQ_API_KEY=your_groq_api_key
   ```

6. **Run the backend server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create `.env.local` file** in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will be available at `http://localhost:3000`

### Database Setup

The application uses Supabase PostgreSQL. The `resume_data` table is automatically created on first use. Ensure your Supabase project has:

1. **Database tables**:
   - `resume_data`: Stores parsed resume information
   - `interviews`: Stores interview session data
   - `users`: Managed by Supabase Auth

2. **Row Level Security (RLS)** policies configured appropriately for your use case

## 📡 API Endpoints

### Resume Management

#### `POST /resume/upload-resume`
Upload and parse a PDF resume using AI.

**Request**:
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Body**: 
  - `file`: PDF file (multipart/form-data)

**Response**:
```json
{
  "status": "success",
  "parsed": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "skills": ["Python", "React", "FastAPI"],
    "education": ["BS Computer Science, University XYZ"],
    "experience": ["Software Engineer at Company ABC"],
    "projects": ["Project Name - Description"],
    "raw_text": "Full extracted text from PDF"
  },
  "saved": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    ...
  }
}
```

**Error Response**:
```json
{
  "status": "error",
  "details": {
    "error": "Error message description"
  }
}
```

## 🔧 Example Inputs/Outputs

### Example 1: Resume Upload

**Input**: PDF resume file

**Output**:
```json
{
  "status": "success",
  "parsed": {
    "name": "Jane Smith",
    "email": "jane.smith@email.com",
    "phone": "+1-555-0123",
    "skills": [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "PostgreSQL"
    ],
    "education": [
      "Master of Science in Computer Science, MIT (2020-2022)",
      "Bachelor of Science in Software Engineering, Stanford (2016-2020)"
    ],
    "experience": [
      {
        "title": "Senior Full Stack Developer",
        "company": "Tech Corp",
        "duration": "2022 - Present",
        "description": "Led development of microservices architecture"
      }
    ],
    "projects": [
      {
        "name": "E-commerce Platform",
        "description": "Built scalable e-commerce solution using React and Node.js"
      }
    ],
    "raw_text": "Full extracted resume text..."
  },
  "saved": {
    "id": 1,
    "resume_filename": "jane_smith_resume.pdf",
    "name": "Jane Smith",
    ...
  }
}
```

### Example 2: Interview Configuration

**Input**:
- Role: "Full Stack Developer"
- Job Type: "job"
- Selected Rounds: ["technical", "behavioral"]
- Job Description: (Optional text)

**Output**: Interview session created in database with unique session ID

## 📦 Dependencies

### Backend Dependencies (`requirements.txt`)

```
uvicorn==0.26.1
gunicorn
python-dotenv
supabase
PyMuPDF==1.22.5
httpx
fastapi==0.111.0
python-multipart==0.0.6
pydantic==2.6.0
```

### Frontend Dependencies (`package.json`)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.87.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.23.26",
    "lucide-react": "^0.560.0",
    "next": "16.0.8",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

## 🧪 Running Locally

### Complete Local Setup

1. **Start Backend**:
   ```bash
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn main:app --reload --port 8000
   ```

2. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Testing the API

You can test the resume upload endpoint using curl:

```bash
curl -X POST "http://localhost:8000/resume/upload-resume" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/resume.pdf"
```

Or use the interactive Swagger UI at `http://localhost:8000/docs`

## 🌐 Deployment

### Frontend Deployment (Vercel)

The frontend is deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automatically on push to main branch

**Live URL**: [https://interviewer-ashy.vercel.app/](https://interviewer-ashy.vercel.app/)

### Backend Deployment

The backend can be deployed on:

- **Render**: Connect GitHub repo and configure environment variables
- **Railway**: Similar setup with environment variables
- **Heroku**: Use Procfile with `gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker`
- **AWS/GCP/Azure**: Use containerized deployment (Docker)

**Environment Variables Required**:
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `GROQ_API_KEY`

## 🔐 Environment Variables

### Backend (`.env`)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
GROQ_API_KEY=your-groq-api-key
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🎨 Features

- ✅ **AI-Powered Resume Parsing**: Extract structured data from PDF resumes using Groq's Llama 3.3 70B model
- ✅ **Multi-Round Interview Selection**: Choose from Behavioral, Technical, Coding, and System Design rounds
- ✅ **Role-Based Customization**: Select from 16+ predefined roles or customize
- ✅ **Job/Internship Mode**: Configure for different application types
- ✅ **Real-time Session Management**: Track interview sessions with Supabase
- ✅ **Modern UI/UX**: Beautiful, responsive interface with smooth animations
- ✅ **Authentication**: Secure user authentication via Supabase Auth
- ✅ **Database Integration**: Persistent storage for resumes and interview data

## 🛠️ Development Workflow

1. **Feature Development**:
   - Create feature branch from `main`
   - Implement changes in backend/frontend
   - Test locally
   - Commit and push

2. **API Development**:
   - Add routes in `backend/app/routes/`
   - Implement services in `backend/app/services/`
   - Update models in `backend/app/models/`

3. **Frontend Development**:
   - Add components in `frontend/app/components/`
   - Update pages in `frontend/app/`
   - Style with Tailwind CSS

## 📊 Architecture Decisions

1. **FastAPI**: Chosen for high performance, automatic API documentation, and async support
2. **Next.js**: Selected for server-side rendering, excellent developer experience, and Vercel deployment
3. **Groq API**: Utilized for fast inference with Llama 3.3 70B model
4. **Supabase**: Used for database, authentication, and real-time capabilities
5. **TypeScript**: Ensures type safety across the frontend codebase

## 🐛 Troubleshooting

### Backend Issues

**Issue**: `GROQ_API_KEY environment variable is missing`
- **Solution**: Ensure `.env` file exists in `backend/` directory with `GROQ_API_KEY` set

**Issue**: `Supabase credentials missing`
- **Solution**: Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`

**Issue**: PDF parsing fails
- **Solution**: Ensure PyMuPDF is installed: `pip install PyMuPDF`

### Frontend Issues

**Issue**: Supabase client initialization fails
- **Solution**: Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

**Issue**: CORS errors
- **Solution**: Ensure backend CORS settings include frontend URL in `main.py`

## 📝 License

This project is part of a hackathon/competition submission. All rights reserved.

## 👥 Contributors

- [Your Name/Team Name]

## 🔮 Future Roadmap

- [ ] Real-time voice/video interview simulation
- [ ] AI-powered interview feedback and scoring
- [ ] Interview analytics dashboard
- [ ] Integration with job boards
- [ ] Multi-language support
- [ ] Advanced resume analysis and suggestions
- [ ] Mock interview recording and playback
- [ ] Peer review and community features

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Built with ❤️ using FastAPI, Next.js, and Groq AI**

