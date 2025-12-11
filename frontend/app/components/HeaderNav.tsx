"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { 
  Sparkles, 
  User, 
  LogOut, 
  ChevronDown, 
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function HeaderNav() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // State to track scrolling
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Check Auth State on Load
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Scroll Effect Logic
  useEffect(() => {
    const handleScroll = () => {
      // Switch style if scrolled more than 20px
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Click Outside Handler (Closes dropdown)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsMenuOpen(false);
    router.refresh();
    router.push("/login");
  };

  const getInitials = () => {
    if (!user) return "";
    const name = user.user_metadata?.full_name || user.email || "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          scrolled 
            ? "bg-white/70 border-b border-slate-200/50 backdrop-blur-xl shadow-sm py-2" 
            : "bg-transparent border-b border-transparent py-4"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 transition-all group-hover:scale-105 group-hover:shadow-indigo-500/40">
              <Sparkles className="h-4 w-4 fill-white/20" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Prepzo.</span>
          </Link>

          {/* DESKTOP NAV - Floating Capsule Style */}
          <nav className={`hidden items-center gap-1 rounded-full p-1 md:flex transition-all ${
             scrolled ? "bg-transparent" : "bg-slate-100/50 border border-slate-200/50 backdrop-blur-sm"
          }`}>
            {["Interviews", "Resume", "Jobs", "Pricing"].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-sm"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* AUTH ACTIONS */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              // LOGGED IN: Avatar & Dropdown
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`flex items-center gap-2 rounded-full border p-1 pl-1 pr-3 transition-all ${
                    isMenuOpen 
                      ? "bg-white border-indigo-200 ring-4 ring-indigo-500/10" 
                      : "bg-transparent border-transparent hover:bg-white/50 hover:border-slate-200"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-inner">
                    {getInitials()}
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-60 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-indigo-500/10 ring-1 ring-black/5"
                    >
                      <div className="px-3 py-3 border-b border-slate-50 mb-1">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs font-medium text-slate-500 truncate">{user.email}</p>
                      </div>

                      <div className="space-y-0.5">
                        <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link href="/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600">
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </div>

                      <div className="mt-1 border-t border-slate-50 pt-1">
                        <button 
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // LOGGED OUT Buttons
              <>
                <Link 
                  href="/login"
                  className="rounded-full px-5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 hover:bg-slate-100/50"
                >
                  Log in
                </Link>
                <Link 
                  href="/signup"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 -z-10 translate-y-[100%] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-transform duration-300 group-hover:translate-y-0" />
                </Link>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
             {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: "auto" }}
             exit={{ opacity: 0, height: 0 }}
             className="fixed top-[60px] left-0 right-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl md:hidden overflow-hidden shadow-xl"
           >
              <nav className="flex flex-col p-6 space-y-4">
                {["Interviews", "Resume", "Jobs", "Pricing"].map((item) => (
                  <Link 
                    key={item} 
                    href={`#${item.toLowerCase()}`} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-slate-600 hover:text-indigo-600"
                  >
                    {item}
                  </Link>
                ))}
                
                <div className="h-px bg-slate-100 w-full my-2" />
                
                {user ? (
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {getInitials()}
                         </div>
                         <div>
                            <p className="font-semibold text-slate-900">{user.user_metadata?.full_name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                         </div>
                      </div>
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block w-full rounded-xl bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-900">
                         Dashboard
                      </Link>
                      <button onClick={handleSignOut} className="block w-full rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">
                         Sign Out
                      </button>
                   </div>
                ) : (
                   <div className="grid grid-cols-2 gap-3">
                     <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
                       Log In
                     </Link>
                     <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                       Sign Up
                     </Link>
                   </div>
                )}
              </nav>
           </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
