"use client";

import { TagButton } from "./FormControls";

export type RoundOption = {
  id: string;
  title: string;
  subtitle: string;
};

type SelectRoundGroupProps = {
  selectedRound: string;
  onSelect: (roundId: string) => void;
};

const roundOptions: RoundOption[] = [
  { id: "warmup", title: "Warm Up", subtitle: "Non Technical" },
  { id: "coding", title: "Coding", subtitle: "Programming" },
  { id: "role", title: "Role Related", subtitle: "Technical" },
  { id: "behavioral", title: "Behavioral", subtitle: "HR" },
];

export function SelectRoundGroup({ selectedRound, onSelect }: SelectRoundGroupProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-800">Select Round *</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {roundOptions.map((option) => (
          <TagButton
            key={option.id}
            title={option.title}
            subtitle={option.subtitle}
            active={selectedRound === option.id}
            onClick={() => onSelect(option.id)}
          />
        ))}
      </div>
    </div>
  );
}

export const rounds = roundOptions;

