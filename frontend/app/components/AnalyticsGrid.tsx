type AnalyticsCardProps = {
  label: string;
  level: string;
  accent: "green" | "orange" | "purple" | "pink";
};

const accentClasses = {
  green: "from-emerald-100 via-white to-emerald-50 text-emerald-700 border-emerald-100",
  orange: "from-orange-100 via-white to-orange-50 text-orange-700 border-orange-100",
  purple: "from-purple-100 via-white to-purple-50 text-purple-700 border-purple-100",
  pink: "from-pink-100 via-white to-pink-50 text-pink-700 border-pink-100",
};

function AnalyticsCard({ label, level, accent }: AnalyticsCardProps) {
  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-4 text-sm font-semibold shadow-sm ${accentClasses[accent]}`}
    >
      <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-lg">{level}</div>
    </div>
  );
}

export function AnalyticsGrid() {
  return (
    <div className="rounded-2xl bg-[#f7f9ff] p-6 shadow-inner">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>Interview Level</span>
        <span className="text-indigo-700">Business Solutions</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <AnalyticsCard label="Interview Level" level="Advanced" accent="green" />
        <AnalyticsCard label="Domain Knowledge" level="Advanced" accent="orange" />
        <AnalyticsCard label="Articulation" level="Advanced" accent="purple" />
        <AnalyticsCard label="Communication" level="Expert" accent="pink" />
      </div>
      <div className="mt-4 text-center">
        <a className="text-sm font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-4" href="#analytics">
          View sample analytics
        </a>
      </div>
    </div>
  );
}


