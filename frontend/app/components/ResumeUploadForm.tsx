"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type UploadState = "idle" | "uploading" | "success" | "error";

interface ResumeUploadFormProps {
  onUploadSuccess?: (id: string) => void;
}

export function ResumeUploadForm({ onUploadSuccess }: ResumeUploadFormProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadMessage(null);

    // 1. Validation
    if (!resumeFile) {
      setUploadState("error");
      setUploadMessage("Please choose a PDF resume before uploading.");
      return;
    }

    if (resumeFile.type !== "application/pdf") {
      setUploadState("error");
      setUploadMessage("Only PDF files are supported for resume uploads.");
      return;
    }

    // 2. Get User
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user?.id) {
      setUploadState("error");
      setUploadMessage("You must be logged in to upload a resume.");
      return;
    }

    // 3. Prepare Data
    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("user_id", user.id);

    try {
      setUploadState("uploading");
      
      const response = await fetch(`${backendUrl}/api/resume/upload-resume`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(data.details?.error || "Upload failed. Please try again.");
      }

      setUploadState("success");
      setUploadMessage("Resume uploaded successfully.");
      setResumeFile(null);
      
      // 4. Pass the ID to Parent
      if (onUploadSuccess && data.resume_id) {
        onUploadSuccess(data.resume_id);
      }
      
    } catch (error) {
      setUploadState("error");
      setUploadMessage(
        error instanceof Error ? error.message : "Something went wrong. Please retry."
      );
    }
  };

  return (
    <form 
      className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-inner" 
      onSubmit={handleSubmit} 
      id="resume"
    >
      <p className="text-sm font-semibold text-slate-800">Upload Resume (PDF)</p>
      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-4">
        <input
          accept="application/pdf"
          className="w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setResumeFile(file ?? null);
            setUploadState("idle");
            setUploadMessage(null);
          }}
          aria-label="Upload resume PDF"
        />
        <p className="text-xs text-slate-500">We only support PDF uploads for now.</p>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={uploadState === "uploading"}
        >
          {uploadState === "uploading" ? "Uploading..." : "Upload Resume"}
        </button>
        {uploadMessage && (
          <div
            className={`rounded-lg px-3 py-2 text-sm ${
              uploadState === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {uploadMessage}
          </div>
        )}
      </div>
    </form>
  );
}