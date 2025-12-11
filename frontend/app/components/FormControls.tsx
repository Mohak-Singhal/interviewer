type SelectInputProps = {
  label: string;
  placeholder: string;
  children?: React.ReactNode;
};

export function SelectInput({ label, placeholder, children }: SelectInputProps) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm">
      {label}
      <div className="flex items-center justify-between text-xs font-normal text-slate-500">
        <span>{placeholder}</span>
        <span className="text-lg text-slate-400">▾</span>
      </div>
      {children}
    </label>
  );
}

type TextInputProps = {
  label: string;
  placeholder: string;
};

export function TextInput({ label, placeholder }: TextInputProps) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm">
      {label}
      <input
        className="w-full border-0 bg-transparent text-xs font-normal text-slate-600 outline-none placeholder:text-slate-400"
        placeholder={placeholder}
      />
    </label>
  );
}

type TagButtonProps = {
  title: string;
  subtitle: string;
  active?: boolean;
  onClick?: () => void;
};

export function TagButton({ title, subtitle, active = false, onClick }: TagButtonProps) {
  return (
    <button
      className={`flex flex-col items-start rounded-xl border px-4 py-3 text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow-md ${
        active
          ? "border-indigo-200 bg-indigo-50 text-indigo-800"
          : "border-slate-200 bg-white text-slate-800"
      }`}
      type="button"
      onClick={onClick}
    >
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-xs text-slate-500">{subtitle}</span>
    </button>
  );
}

type DurationButtonProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function DurationButton({ label, active = false, onClick }: DurationButtonProps) {
  return (
    <button
      className={`rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-[1px] hover:shadow-md ${
        active
          ? "border-indigo-200 bg-indigo-50 text-indigo-800"
          : "border-slate-200 bg-white text-slate-800"
      }`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

