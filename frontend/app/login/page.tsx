import { AuthCard } from "../components/AuthCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f3ff] via-white to-[#f6f8ff] px-6 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-[#c6b3ff] opacity-40 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-80 w-80 rounded-full bg-[#ffcfeb] opacity-50 blur-3xl" />
      </div>
      <AuthCard mode="login" />
    </div>
  );
}

