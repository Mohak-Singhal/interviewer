"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Code2, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  Play,
  X
} from "lucide-react";

// --- Component Imports ---
import { HeaderNav } from "./components/HeaderNav"; 
import { InterviewDetailsSection } from "./components/InterviewDetailsSection"; 
import { descriptionForRound } from "./components/InterviewDetailsSection";

// --- DATA CONSTANTS ---

const ROLES_LIST = [
  "ReactJS Developer",
  "Software Development Engineer",
  "Web Designer",
  "Financial Analyst",
  "Java Developer",
  "Business Development",
  "Python Developer",
  "Sales",
  "Data Analyst",
  "Web Developer",
  "Software Engineer",
  "Data Science",
  "Full Stack Developer",
  "DevOps Engineer",
  "Project Manager",
  "Cybersecurity Analyst",
];

const ROUNDS = [
  { id: "non-technical", label: "Behavioral / HR", icon: Users },
  { id: "technical", label: "Technical Deep Dive", icon: Code2 },
  { id: "coding", label: "Live Coding", icon: Sparkles },
  { id: "system-design", label: "System Design", icon: Briefcase }, 
];

// --- MAIN COMPONENT ---

export default function Home() {
  const [role, setRole] = useState("Full Stack Developer");
  const [jobType, setJobType] = useState<"job" | "internship">("job");
  
  // Stores multiple selected rounds
  const [selectedRounds, setSelectedRounds] = useState<string[]>(["technical"]); 
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Toggle Logic: Add or remove round ID from array
  const toggleRound = (id: string) => {
    setSelectedRounds((prev) => 
      prev.includes(id) 
        ? prev.filter((item) => item !== id) // Remove
        : [...prev, id] // Add
    );
  };

  const handleStart = () => {
    if (!role || !termsAccepted || selectedRounds.length === 0) return;
    setShowModal(true);
  };

  // Combine descriptions for all selected rounds for the preview text
  const currentDescription = useMemo(() => {
     return selectedRounds
       .map(r => descriptionForRound(r))
       .join("\n\n");
  }, [selectedRounds]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
        <div className="absolute right-0 top-0 -z-10 h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <HeaderNav />

        <main className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-12 px-6 pt-20 pb-32 lg:pt-32">
          
          {/* Hero Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1 text-sm font-medium text-indigo-600 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AI-Powered Interview Prep
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
              Master your next <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Interview
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 md:text-xl leading-relaxed">
              Configure your role, select your rounds, and let our AI agent <br className="hidden md:block"/>
              conduct a realistic mock interview tailored to you.
            </p>
          </motion.div>

          {/* Control Center Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl md:p-10"
          >
            <div className="grid gap-8 md:grid-cols-2">
              
              {/* LEFT COLUMN: Configuration */}
              <div className="space-y-6">
                
                {/* Job Type Toggle */}
                <div className="flex rounded-lg bg-slate-100 p-1">
                  {(["job", "internship"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setJobType(type)}
                      className={`flex-1 rounded-md py-2 text-sm font-semibold capitalize transition-all ${
                        jobType === type
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Role Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Target Role
                  </label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 shadow-sm transition-all hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    >
                      {ROLES_LIST.map((r) => (
                        <option key={r} value={r}>
                          {r} {jobType === 'internship' ? 'Intern' : ''}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <ChevronRight className="h-5 w-5 rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Multi-Select Round Selector */}
                <div className="space-y-2">
                   <label className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span>Interview Rounds</span>
                    <span className="text-indigo-600">{selectedRounds.length} selected</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {ROUNDS.map((rnd) => {
                      const Icon = rnd.icon;
                      const isSelected = selectedRounds.includes(rnd.id);
                      return (
                        <button
                          key={rnd.id}
                          onClick={() => toggleRound(rnd.id)}
                          className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all duration-200 ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                          <span className="text-xs font-medium">{rnd.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Preview & Action */}
              <div className="flex flex-col justify-between rounded-2xl bg-slate-900 p-6 text-white shadow-inner md:p-8">
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white">Session Summary</h3>
                  <div className="space-y-4 text-sm text-slate-300">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-indigo-400 shrink-0" />
                      <p><span className="text-white font-medium">Role:</span> {role} {jobType === 'internship' ? '(Intern)' : ''}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-indigo-400 shrink-0" />
                      <div className="w-full">
                        <span className="text-white font-medium">Selected Rounds:</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedRounds.length > 0 ? (
                            selectedRounds.map(id => (
                              <span key={id} className="inline-block rounded bg-slate-700 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-200">
                                {ROUNDS.find(r => r.id === id)?.label}
                              </span>
                            ))
                          ) : (
                            <span className="text-red-400 italic">No rounds selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <label className="flex cursor-pointer items-start gap-3 group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="peer h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                      />
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                      I agree to the <span className="underline decoration-indigo-500/50 underline-offset-2">terms & conditions</span>.
                    </span>
                  </label>

                  <button
                    onClick={handleStart}
                    disabled={!termsAccepted || selectedRounds.length === 0}
                    className={`group relative flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white transition-all duration-300 ${
                      termsAccepted && selectedRounds.length > 0
                        ? "bg-indigo-600 hover:bg-indigo-700 hover:translate-y-[-2px] shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40" 
                        : "cursor-not-allowed bg-slate-800 text-slate-500"
                    }`}
                  >
                    Start Interview
                    <Play className="h-4 w-4 fill-current transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Modal with AnimatePresence */}
      <AnimatePresence>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <InterviewDetailsSection
              role={role}
              jobType={jobType}
              selectedRounds={selectedRounds} // Passing the full array
              description={currentDescription}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- REUSABLE MODAL COMPONENT ---

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/5"
      >
        <button
          className="absolute right-6 top-6 z-10 rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
}