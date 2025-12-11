"use client";

export function HeaderNav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-28 items-center justify-center rounded-md bg-black text-lg font-bold text-white shadow-lg">
          Prepzo
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          <a className="hover:text-indigo-700" href="#interviews">
            Interviews
          </a>
          <a className="hover:text-indigo-700" href="#resume">
            Resume
          </a>
          <a className="hover:text-indigo-700" href="#jobs">
            Jobs
          </a>
          <a className="hover:text-indigo-700" href="#pricing">
            Pricing
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <a className="text-sm font-semibold text-indigo-700 hover:text-indigo-900" href="#contact">
          Contact Us
        </a>
        <a
          className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 shadow-sm hover:border-indigo-200"
          href="/login"
        >
          Login
        </a>
        <a
          className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:scale-[1.01]"
          href="/signup"
        >
          Sign Up
        </a>
      </div>
    </header>
  );
}

