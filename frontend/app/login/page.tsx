"use client";

import { AuthCard } from "../components/AuthCard";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`, // Ensure this route exists or points to home
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Google login error:", error);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      
      {/* LEFT COLUMN: Visual & Dashboard Preview */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-slate-900"></div>
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 text-lg font-bold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-indigo-500/20 shadow-lg text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          Prepzo.
        </div>

        {/* Center Graphic: Stats Card */}
        <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <TrendingUp className="text-white h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-300">Interview Readiness</div>
                  <div className="text-2xl font-bold text-white">94%</div>
                </div>
              </div>
              {/* Fake Graph Lines */}
              <div className="h-24 flex items-end justify-between gap-2">
                 {[40, 65, 50, 80, 75, 94].map((h, i) => (
                    <div key={i} className="w-full bg-indigo-500/20 rounded-t-sm relative h-full">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${h}%` }}
                         transition={{ duration: 1, delay: i * 0.1 }}
                         className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm" 
                       />
                    </div>
                 ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                <ShieldCheck className="h-3 w-3" />
                <span>Ready for Technical Rounds</span>
              </div>
            </div>
            
            <p className="mt-8 text-center text-lg font-medium text-slate-300 max-w-xs leading-relaxed">
              "Track your progress from novice to expert."
            </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © 2025 Prepzo Inc.
        </div>
      </div>

      {/* RIGHT COLUMN: Auth Form */}
      <div className="flex w-full flex-col items-center justify-center overflow-y-auto bg-white px-6 py-8 lg:w-1/2">
        <div className="w-full max-w-[380px] space-y-6">
          
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-500">Sign in to continue your preparation</p>
          </div>

          {/* GOOGLE BUTTON - ON TOP */}
          {/* <button 
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1 disabled:opacity-70"
          >
            {googleLoading ? (
               <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
            ) : (
               <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            )}
            <span>Continue with Google</span>
          </button> */}

          {/* Divider */}
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">Or with email</span>
            </div>
          </div> */}

          {/* Auth Form */}
          <AuthCard mode="login" />

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
