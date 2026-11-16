import { AlertTriangle, ArrowUpRight, Clock, GitBranch, Sparkles, TrendingDown, Trophy } from "lucide-react";
import type { ReasonTag, ReasonTagKind } from "@/lib/types";

const STYLE: Record<ReasonTagKind, { tone: string; icon: typeof Clock }> = {
  lowest: { tone: "bg-rose-500/10 text-rose-200 ring-rose-400/30", icon: TrendingDown },
  "weak-prereq": { tone: "bg-amber-500/10 text-amber-200 ring-amber-400/30", icon: AlertTriangle },
  "pulled-ahead": { tone: "bg-violet-500/10 text-violet-200 ring-violet-400/30", icon: ArrowUpRight },
  unlocks: { tone: "bg-fuchsia-500/10 text-fuchsia-200 ring-fuchsia-400/30", icon: GitBranch },
  stale: { tone: "bg-sky-500/10 text-sky-200 ring-sky-400/30", icon: Clock },
  mastered: { tone: "bg-emerald-500/10 text-emerald-200 ring-emerald-400/30", icon: Trophy },
  "no-data": { tone: "bg-muted/40 text-muted-foreground ring-border/40", icon: Sparkles },
};

/** Chips that say in a few words why a topic sits where it does (FR-05). */
export function ReasonTags({ tags, className = "" }: { tags: ReasonTag[]; className?: string }) {
  if (tags.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Ranking reasons">
      {tags.map((t) => {
        const s = STYLE[t.kind];
        const Icon = s.icon;
        return (
          <li
            key={t.kind}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ${s.tone}`}
          >
            <Icon className="h-3 w-3" aria-hidden="true" />
            {t.label}
          </li>
        );
      })}
    </ul>
  );
}
