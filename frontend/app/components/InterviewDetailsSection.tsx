"use client";

import { useState } from "react";
import { DurationSelector } from "./DurationSelector";
import { ResumeUploadForm } from "./ResumeUploadForm";
import { SelectRoundGroup } from "./SelectRoundGroup";

export function InterviewDetailsSection() {
  const [selectedRound, setSelectedRound] = useState("warmup");
  const [selectedDuration, setSelectedDuration] = useState("5");

  return (
    <section
      id="interviews"
      className="grid gap-10 rounded-3xl bg-white p-10 shadow-[0_30px_80px_rgba(67,56,202,0.06)] lg:grid-cols-[1fr_1.1fr]"
    >
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700">
          Interview Details
        </p>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-lg font-semibold text-slate-900">Customer Service Representative</div>
          <div className="text-sm font-semibold text-indigo-700 capitalize">
            {labelForRound(selectedRound)}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 p-4 text-white shadow-lg">
          <div>
            <p className="text-sm font-semibold">Resume Based Interview (Optional)</p>
            <p className="text-xs text-indigo-100">Get interview questions personalized to your resume.</p>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Recommended
          </span>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Why Prepzo?</p>
          <ul className="space-y-1">
            <li>• Adaptive AI that mirrors real interviewers</li>
            <li>• Real-time analytics across articulation, domain depth, and clarity</li>
            <li>• Resume-aware prompts to highlight your strengths</li>
          </ul>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <SelectRoundGroup selectedRound={selectedRound} onSelect={setSelectedRound} />
          <div className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
            <span className="mt-0.5 text-base">ℹ️</span>
            <div>
              <p className="font-semibold">{labelForRound(selectedRound)}</p>
              <p>{descriptionForRound(selectedRound)}</p>
            </div>
          </div>
        </div>

        <DurationSelector selectedDuration={selectedDuration} onSelect={setSelectedDuration} />
        <ResumeUploadForm />
      </div>
    </section>
  );
}

function labelForRound(roundId: string) {
  switch (roundId) {
    case "coding":
      return "Coding";
    case "role":
      return "Role Related";
    case "behavioral":
      return "Behavioral";
    default:
      return "Warm Up";
  }
}

function descriptionForRound(roundId: string) {
  switch (roundId) {
    case "coding":
      return "Hands-on programming questions, live debugging, and code walkthroughs.";
    case "role":
      return "Technical depth tailored to your role: systems, product sense, or architecture.";
    case "behavioral":
      return "HR-style conversations covering teamwork, leadership, and conflict resolution.";
    default:
      return "Non-technical and introductory questions, such as “Tell me about yourself.”";
  }
}

