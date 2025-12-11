"use client";

import { AuthCard } from "../components/AuthCard";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Cpu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
      
      {/* LEFT COLUMN: Developer Aesthetic */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-slate-950 p-12 text-white lg:flex">
        {/* Tech Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
        <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 text-lg font-bold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          Prepzo.
        </div>

        {/* Center Graphic: Code Editor / Success */}
        <div className="relative z-10 flex flex-col items-center justify-center">
            
            {/* Terminal Window */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="relative w-full max-w-md overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-sm"
            >
              {/* Window Header */}
              <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-3">
                 <div className="flex gap-1.5">
                   <div className="h-3 w-3 rounded-full bg-red-500/20" />
                   <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                   <div className="h-3 w-3 rounded-full bg-green-500/20" />
                 </div>
                 <div className="ml-4 text-xs font-mono text-slate-500">problem_solver.ts</div>
              </div>
              
              {/* Code Content */}
              <div className="p-6 font-mono text-xs leading-relaxed text-slate-300">
                 <div className="flex gap-4">
                    <span className="text-slate-600">1</span>
                    <span><span className="text-purple-400">function</span> <span className="text-blue-400">optimizeSolution</span>(input) {'{'}</span>
                 </div>
                 <div className="flex gap-4">
                    <span className="text-slate-600">2</span>
                    <span className="pl-4"><span className="text-slate-500">// AI analyzing complexity...</span></span>
                 </div>
                 <div className="flex gap-4">
                    <span className="text-slate-600">3</span>
                    <span className="pl-4"><span className="text-purple-400">return</span> input.improve();</span>
                 </div>
                 <div className="flex gap-4">
                    <span className="text-slate-600">4</span>
                    <span>{'}'}</span>
                 </div>
                 
                 <div className="mt-6 flex items-center gap-2 rounded bg-green-500/10 px-3 py-2 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>All Test Cases Passed (12/12)</span>
                 </div>
              </div>
            </motion.div>

             <p className="mt-8 text-center text-lg font-medium text-slate-400 max-w-xs">
              "Master technical rounds with real-time AI feedback."
            </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Cpu className="h-3 w-3" />
          <span>Powered by Advanced LLMs</span>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex w-full flex-col items-center justify-center overflow-y-auto bg-white px-6 py-8 lg:w-1/2">
        <div className="w-full max-w-[380px] space-y-6">
          
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Account</h1>
            <p className="mt-2 text-sm text-slate-500">Join the community of developers.</p>
          </div>

           {/* GOOGLE BUTTON - TOP */}
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
            <span>Sign up with Google</span>
          </button> */}

          {/* Divider */}
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">Or</span>
            </div>
          </div> */}

          <AuthCard mode="signup" />

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-2">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}