import type { Difficulty } from "@/lib/types";

const STYLES: Record<Difficulty, string> = {
  easy: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30",
  medium: "bg-amber-500/10 text-amber-300 ring-amber-400/30",
  hard: "bg-rose-500/10 text-rose-300 ring-rose-400/30",
};

/** Small text label for question difficulty (text, not colour alone - NFR-U2). */
export function DifficultyBadge({ level, className = "" }: { level: Difficulty; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] ring-1 ${STYLES[level]} ${className}`}
    >
      {level}
    </span>
  );
}
