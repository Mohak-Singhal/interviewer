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

print("SUPABASE_URL =", SUPABASE_URL)
print("SUPABASE_KEY =", SUPABASE_KEY)

if not SUPABASE_URL or not SUPABASE_KEY:
    print("SUPABASE_URL =", SUPABASE_URL)
    print("SUPABASE_KEY =", SUPABASE_KEY)
    raise ValueError("Supabase credentials missing in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --------------------------------------------------------------------------------------
#  CREATE THE RESUME_DATA TABLE IF IT DOESN'T EXIST
# --------------------------------------------------------------------------------------

def create_resume_data_table():
    """
    Create the 'resume_data' table if it does not already exist.
    """
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS public.resume_data (
        id SERIAL PRIMARY KEY,
        resume_filename TEXT,
        name TEXT,
        email TEXT,
        phone TEXT,
        skills TEXT[] DEFAULT '{}',
        education TEXT[] DEFAULT '{}',
        experience TEXT[] DEFAULT '{}',
        projects TEXT[] DEFAULT '{}',
        raw_text TEXT
    );
    """

    try:
        # Execute the raw SQL query using Supabase client
        result = supabase.postgrest.from_("resume_data").upsert(create_table_sql).execute()

        if result.error:
            logging.error(f"Failed to create table: {result.error}")
        else:
            logging.info("Table 'resume_data' created successfully (if it didn't already exist).")

    except Exception as e:
        logging.error(f"Error creating table: {e}")
