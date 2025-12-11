import { AnalyticsGrid } from "./AnalyticsGrid";
import { SelectInput, TextInput } from "./FormControls";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white p-10 shadow-[0_30px_80px_rgba(67,56,202,0.08)]">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-[#f8f3ff]" />
      <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="text-center text-sm font-medium text-indigo-700 lg:text-left">
            Today, I want to prepare for Full-Stack Developer
          </div>
          <div className="space-y-4 text-center lg:text-left">
            <h1 className="text-4xl font-black leading-tight text-[#2c2163] sm:text-5xl">
              Ready to Ace Your Next Interview?
            </h1>
            <p className="text-lg text-slate-600">
              AI mock interviews with personalized practice and real-time analytics – everything on Prepzo.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SelectInput label="Job" placeholder="Product Designer" />
            <TextInput label="Search position" placeholder="Full-Stack Developer" />
            <SelectInput label="Select Round" placeholder="Warm Up" />
            <button className="h-full rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01]">
              Start Practice
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-2 font-semibold text-indigo-700">
              ✨ Just Dropped: Our new job portal with top startup opportunities
            </span>
            <a className="text-indigo-700 underline decoration-indigo-300 underline-offset-4" href="#jobs">
              Explore
            </a>
          </div>
        </div>

        <AnalyticsGrid />
      </div>
    </section>
  );
}

