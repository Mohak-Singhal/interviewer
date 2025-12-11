import { AnalyticsGrid } from "./AnalyticsGrid";
import { SelectInput } from "./FormControls";

type HeroSectionProps = {
  role: string;
  onRoleChange: (value: string) => void;
  jobType: "job" | "internship";
  onJobTypeChange: (value: "job" | "internship") => void;
  onStart: () => void;
  termsAccepted: boolean;
  onToggleTerms: () => void;
};

const popularRoles = [
  "Full-Stack Developer",
  "AI Engineer",
  "Machine Learning Engineer",
  "Backend Engineer",
  "Frontend Developer",
  "Data Analyst",
  "DevOps Engineer",
  "Mobile Developer",
  "QA Engineer",
  "Product Manager (Tech)",
];

export function HeroSection({
  role,
  onRoleChange,
  jobType,
  onJobTypeChange,
  onStart,
  termsAccepted,
  onToggleTerms,
}: HeroSectionProps) {
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
            <SelectInput label="Job type" placeholder={jobType === "job" ? "Job" : "Internship"}>
              <select
                className="w-full border-0 bg-transparent text-xs font-normal text-slate-600 outline-none"
                value={jobType}
                onChange={(e) => onJobTypeChange(e.target.value as "job" | "internship")}
              >
                <option value="job">Job</option>
                <option value="internship">Internship</option>
              </select>
            </SelectInput>

            <SelectInput label="Search position" placeholder="Full-Stack Developer">
              <input
                className="w-full border-0 bg-transparent text-xs font-normal text-slate-600 outline-none placeholder:text-slate-400"
                list="popular-roles"
                placeholder="Full-Stack Developer"
                value={role}
                onChange={(e) => onRoleChange(e.target.value)}
              />
              <datalist id="popular-roles">
                {popularRoles.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </SelectInput>

            <SelectInput label="Select Round" placeholder="Warm Up">
              <div className="text-xs font-normal text-slate-500">Choose in the next step</div>
            </SelectInput>
            <button
              className="h-full rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              onClick={onStart}
              disabled={!role || !termsAccepted}
            >
              Start Practice
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={onToggleTerms}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            I agree to the Terms & Conditions
          </label>

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

