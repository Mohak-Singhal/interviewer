"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type AuthMode = "login" | "signup";

type AuthCardProps = {
  mode: AuthMode;
};

export function AuthCard({ mode }: AuthCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const isSignup = mode === "signup";
  const title = isSignup ? "Create your account" : "Welcome back";
  const cta = isSignup ? "Sign Up" : "Login";
  const helper = isSignup ? "Already have an account?" : "New to Prepzo?";
  const helperLink = isSignup ? "/login" : "/signup";
  const helperText = isSignup ? "Login" : "Sign Up";

  const persistProfile = async (profileName: string, profileEmail: string) => {
    const { error } = await supabase.from("users").upsert(
      {
        name: profileName || profileEmail,
        email: profileEmail,
      },
      { onConflict: "email" }
    );
    if (error) throw error;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setMessage(null);

    try {
      setStatus("loading");
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (data.user?.email) {
          await persistProfile(name, data.user.email);
        }
        setStatus("success");
        setMessage("Account created. Check your email to confirm.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user?.email) {
          await persistProfile(name || data.user.user_metadata.full_name || data.user.email, data.user.email);
        }
        setStatus("success");
        setMessage("Signed in successfully.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Authentication failed. Please retry.");
    }
  };

  const handleGoogle = async () => {
    try {
      setStatus("loading");
      setMessage(null);
      const redirectTo = `${window.location.origin}/login`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
      setStatus("success");
      setMessage("Redirecting to Google...");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Google sign-in failed. Please retry.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_25px_60px_rgba(67,56,202,0.08)]">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-11 w-28 items-center justify-center rounded-md bg-black text-lg font-bold text-white shadow-lg">
          Prepzo
        </div>
        <h1 className="text-2xl font-black text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">AI-powered mock interviews and analytics.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isSignup && (
          <label className="block text-sm font-semibold text-slate-800">
            Full Name
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
              placeholder="Alex Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
        )}
        <label className="block text-sm font-semibold text-slate-800">
          Email
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-semibold text-slate-800">
          Password
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button
          className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01]"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Please wait..." : cta}
        </button>
      </form>

      <div className="my-4 flex items-center gap-2 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        <span>or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
        type="button"
        onClick={handleGoogle}
        disabled={status === "loading"}
      >
        <span className="text-lg">🔒</span>
        Continue with Google
      </button>

      {message && (
        <div
          className={`mt-4 rounded-xl px-3 py-2 text-sm ${
            status === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-4 text-center text-sm text-slate-600">
        {helper}{" "}
        <Link className="font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-4" href={helperLink}>
          {helperText}
        </Link>
      </div>
    </div>
  );
}

