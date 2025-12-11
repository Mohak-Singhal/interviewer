import os
import logging
from dotenv import load_dotenv
from supabase import create_client, Client

# absolute path to the backend/.env file
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
ENV_PATH = os.path.join(BACKEND_DIR, ".env")

print("Loading .env from:", ENV_PATH)
print("Exists:", os.path.exists(ENV_PATH))

load_dotenv(ENV_PATH)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


if not SUPABASE_URL or not SUPABASE_KEY:

    raise ValueError("Supabase credentials missing in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --------------------------------------------------------------------------------------
#  CREATE THE RESUME_DATA TABLE IF IT DOESN'T EXIST
# --------------------------------------------------------------------------------------

def create_tables():
    """Creates users and resume_data tables if they don't exist."""

    users_sql = """
    CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    );
    """

    resume_sql = """
    CREATE TABLE IF NOT EXISTS public.resume_data (
        id SERIAL PRIMARY KEY,
        user_id TEXT,
        name TEXT,
        email TEXT,
        phone TEXT,
        skills TEXT[] DEFAULT '{}',
        education TEXT[] DEFAULT '{}',
        experience TEXT[] DEFAULT '{}',
        projects TEXT[] DEFAULT '{}',
        raw_text TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    );
    """

    # Execute SQL on Supabase
    try:
        supabase.rpc("exec", {"query": users_sql})
        supabase.rpc("exec", {"query": resume_sql})
        print("✅ Tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")