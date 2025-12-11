"use client";

import { HeaderNav } from "./components/HeaderNav";
import { HeroSection } from "./components/HeroSection";
import { InterviewDetailsSection } from "./components/InterviewDetailsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f3ff] via-white to-[#f6f8ff] text-slate-900">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-[#c6b3ff] opacity-40 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-80 w-80 rounded-full bg-[#ffcfeb] opacity-50 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e0e7ff] opacity-40 blur-3xl" />
      </div>

      <HeaderNav />

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20">
        <HeroSection />
        <InterviewDetailsSection />
      </main>
    </div>
  );
}
