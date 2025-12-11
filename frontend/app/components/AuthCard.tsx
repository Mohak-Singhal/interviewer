"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";

type AuthMode = "login" | "signup";

type AuthCardProps = {
  mode: AuthMode;
};

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const isSignup = mode === "signup";

  const syncUserProfile = async (email: string, fullName: string) => {
    try {
      await supabase.from("users").upsert(
        { email: email, name: fullName },
        { onConflict: "email" }
      );
    } catch (err) {
      console.error("Profile sync error:", err);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      if (isSignup) {
        // --- SIGN UP ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;

        if (data.user?.email) {
          await syncUserProfile(data.user.email, name);
        }

        // CHECK: If Supabase returned a session, the user is logged in (Auto-confirm is ON)
        if (data.session) {
          setStatus("success");
          setMessage("Account created! Redirecting...");
          router.refresh(); // Update the UI state
          router.push("/"); // Go to Home
        } else {
          // If no session, Supabase is waiting for email verification
          setStatus("success");
          setMessage("Success! Please check your email to verify your account.");
        }

      } else {
        // --- LOG IN ---
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Sync profile to be safe
        if (data.user?.email) {
            const storedName = data.user.user_metadata.full_name || name || "";
            await syncUserProfile(data.user.email, storedName);
        }

        setStatus("success");
        setMessage("Signed in successfully. Redirecting...");
        
        // CRITICAL STEPS FOR REDIRECT
        router.refresh(); // Refreshes server components (like your Navbar)
        router.push("/"); // Navigate to home
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
        // Only reset status if we hit an error (otherwise keep 'success' while redirecting)
        if (status === 'error') {
            setStatus("idle"); 
        }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {message && (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
            status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {status === "error" && <AlertCircle className="h-4 w-4" />}
          {message}
        </div>
      )}

      {isSignup && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Full Name
          </label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            placeholder="Alex Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Email
        </label>
        <input
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
          Password
          {!isSignup && (
            <a href="#" className="text-[10px] text-indigo-600 hover:underline">
              Forgot?
            </a>
          )}
        </label>
        <input
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        className="group relative w-full overflow-hidden rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-600 hover:shadow-indigo-500/25 active:scale-[0.98]"
        type="submit"
        disabled={status === "loading" || status === "success"}
      >
        <div className="flex items-center justify-center gap-2">
          {status === "loading" || status === "success" ? (
            <>
               <Loader2 className="h-4 w-4 animate-spin" />
               <span>{status === 'success' ? 'Redirecting...' : 'Processing...'}</span>
            </>
          ) : (
            <>
               <span>{isSignup ? "Create Account" : "Sign In"}</span>
               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </div>
      </button>
    </form>
  );
}