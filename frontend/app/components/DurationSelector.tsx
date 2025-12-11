"use client";

import { DurationButton } from "./FormControls";

type DurationOption = {
  id: string;
  label: string;
};

type DurationSelectorProps = {
  selectedDuration: string;
  onSelect: (durationId: string) => void;
};

const durationOptions: DurationOption[] = [
  { id: "5", label: "5 mins" },
  { id: "15", label: "15 mins" },
  { id: "30", label: "30 mins" },
];

export function DurationSelector({ selectedDuration, onSelect }: DurationSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-800">Interview Duration *</p>
      <div className="grid grid-cols-3 gap-3">
        {durationOptions.map((option) => (
          <DurationButton
            key={option.id}
            label={option.label}
            active={selectedDuration === option.id}
            onClick={() => onSelect(option.id)}
          />
        ))}
      </div>
    </div>
  );
}

export const durations = durationOptions;

