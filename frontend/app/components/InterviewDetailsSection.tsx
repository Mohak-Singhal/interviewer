"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient"; 
import { 
  FileText, 
  Sparkles, 
  Target, 
  Briefcase, 
  Mic, 
  Video, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Lock
} from "lucide-react";
import { ResumeUploadForm } from "./ResumeUploadForm";

// --- Types ---
type InterviewDetailsSectionProps = {
  role: string;
  jobType: "job" | "internship";
  selectedRounds: string[]; 
  description: string;
};

type DevicePermissionStatus = "idle" | "requesting" | "granted" | "denied";

export function InterviewDetailsSection({
  role,
  jobType,
  selectedRounds, 
  description,
}: InterviewDetailsSectionProps) {
  const router = useRouter();
  
  // --- Local State ---
  const [jdText, setJdText] = useState("");
  const [micStatus, setMicStatus] = useState<DevicePermissionStatus>("idle");
  const [cameraStatus, setCameraStatus] = useState<DevicePermissionStatus>("idle");
  
  const [status, setStatus] = useState<"input" | "checking_devices" | "connecting" | "ready">("input");

  // --- Handlers ---
  const handleStartProcess = async () => {
    setStatus("checking_devices");
    setMicStatus("requesting");
    setCameraStatus("requesting");

    try {
      // 1. Check Auth (Safety check)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
         // You might want to redirect to login here, or handle anonymous users
         throw new Error("User must be logged in to start an interview.");
      }

      // 2. Request Permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: true 
      });
      // Stop tracks immediately (we just needed to check permission)
      stream.getTracks().forEach(track => track.stop());
      setMicStatus("granted");
      setCameraStatus("granted");
      
      // 3. SEND DATA TO HOSTED BACKEND
      setStatus("connecting");

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      if (!backendUrl) {
        throw new Error("Backend URL is not configured.");
      }

      // Send POST request to your FastAPI backend
      const response = await fetch(`${backendUrl}/api/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optional: Add Authorization header if your backend requires it
          // 'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          role: role,
          job_type: jobType,
          rounds: selectedRounds,
          job_description: jdText || "", 
          // resume_url: resumeUrl // Add this if/when you implement resume upload URL capture
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to create session on server");
      }

      const result = await response.json();

      // 4. Redirect using the ID returned by your Backend
      if (result.interview_id) {
        router.push(`/interview/${result.interview_id}`); 
      } else {
        throw new Error("No interview ID returned from server.");
      }

    } catch (err: any) {
      console.error("Setup failed:", err);
      // Handle permission errors
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
         setMicStatus("denied");
         setCameraStatus("denied");
      } else {
         // Show alert for other errors (like backend connection failure)
         alert(`Error: ${err.message}`);
      }
      setStatus("input");
    }
  };

  return (
    <section className="grid h-full w-full gap-0 lg:grid-cols-[1fr_1.3fr] min-h-[600px]">
      
      {/* LEFT COLUMN: Static Context & Info */}
      <div className="hidden flex-col justify-between bg-slate-50 p-8 lg:flex lg:p-10 lg:border-r border-slate-200">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Session Configuration</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Our AI is reading your context. The more details you provide, the more realistic the mock interview will be.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Position</p>
              <div className="mt-1 text-lg font-bold text-slate-900">{role}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                 <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    {jobType === "internship" ? "Internship" : "Full-time"}
                 </span>
                 <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {selectedRounds.length} Rounds Selected
                 </span>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-semibold text-slate-700">Evaluation Criteria</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {["Technical Accuracy", "Communication Style", "JD Alignment"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-indigo-50 p-4 text-xs text-indigo-800">
          <Target className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            <strong>Pro Tip:</strong> Pasting the exact Job Description allows the AI to ask about specific requirements mentioned in the listing.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Inputs & Actions */}
      <div className="relative flex flex-col bg-white">
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
          
          {/* Job Description Input */}
          <div className="space-y-3">
             <label className="flex items-center justify-between text-sm font-medium text-slate-700">
               <span className="flex items-center gap-2">
                 <div className="p-1.5 rounded-md bg-blue-50 text-blue-600"><Briefcase className="h-4 w-4" /></div>
                 Job Description
               </span>
               <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                 Optional but Recommended
               </span>
             </label>
             <textarea 
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                disabled={status !== "input"}
                className="w-full min-h-[140px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-y disabled:opacity-50"
                placeholder="Paste the full job description here..."
             />
          </div>

          <div className="h-px w-full bg-slate-100" />

          {/* Resume Upload */}
          <div className="space-y-3">
             <label className="flex items-center justify-between text-sm font-medium text-slate-700">
               <span className="flex items-center gap-2">
                 <div className="p-1.5 rounded-md bg-purple-50 text-purple-600"><FileText className="h-4 w-4" /></div>
                 Resume / CV
               </span>
               <span className="text-xs text-slate-400 font-normal">
                 (Optional)
               </span>
             </label>
             <div className={status !== "input" ? "pointer-events-none opacity-50" : ""}>
               <ResumeUploadForm />
             </div>
          </div>
        </div>

        {/* Footer Action Area */}
        <div className="border-t border-slate-100 bg-white p-6 lg:px-10 lg:py-6">
          <AnimatePresence mode="wait">
            
            {status === "input" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {(micStatus === "denied" || cameraStatus === "denied") && (
                  <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-inset ring-red-600/10">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                    <div className="space-y-1">
                        <p className="font-semibold">Access Required</p>
                        <p className="text-red-600/90">
                           Camera and Microphone access are mandatory for the AI mock interview. Please enable permissions in your browser settings and try again.
                        </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Lock className="h-3 w-3" />
                    <p>Permissions required: Camera & Mic</p>
                  </div>
                  <button
                    onClick={handleStartProcess}
                    className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-600 hover:shadow-indigo-500/25 focus:ring-4 focus:ring-indigo-500/20 active:scale-95"
                  >
                    Start Interview
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            )}

            {status !== "input" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-6"
              >
                <div className="space-y-3">
                  <PermissionStep 
                    icon={Mic} 
                    label="Microphone Access" 
                    state={micStatus === "granted" ? "success" : micStatus === "denied" ? "error" : "loading"} 
                  />
                  
                  <PermissionStep 
                    icon={Video} 
                    label="Camera Access"
                    state={cameraStatus === "granted" ? "success" : cameraStatus === "denied" ? "error" : status === "checking_devices" ? "loading" : "waiting"} 
                  />

                  <PermissionStep 
                    icon={Sparkles} 
                    label="Creating Session..." 
                    state={status === "connecting" ? "loading" : "waiting"} 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span>{status === "checking_devices" ? "Checking Devices..." : "Connecting to Server..."}</span>
                    <span>{status === "checking_devices" ? "30%" : "90%"}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div 
                      className="h-full bg-indigo-600"
                      initial={{ width: "0%" }}
                      animate={{ width: status === "checking_devices" ? "30%" : "90%" }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// --- SUB-COMPONENTS ---

type PermissionStepProps = {
  icon: any;
  label: string;
  state: "waiting" | "loading" | "success" | "error";
  isOptional?: boolean;
};

function PermissionStep({ icon: Icon, label, state, isOptional }: PermissionStepProps) {
  return (
    <div className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
        state === 'error' ? 'border-red-200 bg-red-50' : 'border-slate-100 bg-slate-50/50'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`rounded-full p-2 ${
            state === 'success' ? 'bg-green-100 text-green-600' : 
            state === 'error' ? 'bg-red-100 text-red-600' : 
            'bg-white text-slate-400'
        }`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className={`text-sm font-medium ${
              state === 'success' ? 'text-slate-900' : 
              state === 'error' ? 'text-red-700' :
              'text-slate-500'
          }`}>
            {label}
          </p>
          {isOptional && state !== 'success' && <p className="text-[10px] text-slate-400">Optional</p>}
        </div>
      </div>
      
      <div>
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />}
        {state === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
        {state === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
        {state === "waiting" && <div className="h-2 w-2 rounded-full bg-slate-200" />}
      </div>
    </div>
  );
}

// --- HELPERS (Exported) ---

export function labelForRound(roundId: string) {
  if (roundId?.includes("technical")) return "Technical Deep Dive";
  if (roundId?.includes("coding")) return "Live Coding";
  if (roundId?.includes("system-design")) return "System Design";
  if (roundId?.includes("hr") || roundId?.includes("behavioral")) return "Behavioral / HR";
  return "General Interview";
}

export function descriptionForRound(roundId: string) {
  switch (roundId) {
    case "coding":
      return "Hands-on programming questions, live debugging, and algorithmic optimization problems.";
    case "technical":
      return "In-depth questions about frameworks, language specifics, databases, and core concepts tailored to the role.";
    case "system-design":
      return "High-level architecture discussions, scalability strategies, and component design.";
    case "behavioral":
    case "non-technical":
    case "hr":
      return "Situational questions focusing on soft skills, leadership, conflict resolution, and cultural fit.";
    default:
      return "A balanced mix of introductory and role-specific questions to gauge overall competency.";
  }
}