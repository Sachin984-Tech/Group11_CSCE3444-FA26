"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Layers,
  PieChart,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppStore } from "@/lib/store";
import { TOPICS } from "@/lib/questionBank";
import { AuroraBg } from "@/components/aurora-bg";
import { TiltCard } from "@/components/tilt-card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const accentHex: Record<string, string> = {
  emerald: "#34d399",
  violet: "#a78bfa",
  amber: "#fbbf24",
  fuchsia: "#e879f9",
  rose: "#fb7185",
  teal: "#2dd4bf",
};

function classColor(cls: string | undefined) {
  if (cls === "mastered") return "#34d399";
  if (cls === "developing") return "#fbbf24";
  return "#fb7185";
}

export function ProgressScreen() {
  const masteryByTopic = useAppStore((s) => s.masteryByTopic);
  const quizComplete = useAppStore((s) => s.quizComplete);
  const go = useAppStore((s) => s.go);
  const [tab, setTab] = useState<"chart" | "table">("chart");

  const data = useMemo(
    () =>
      TOPICS.map((t) => {
        const m = masteryByTopic.get(t.id);
        return {
          name: t.name,
          topic: t.name,
          short: t.name.length > 9 ? t.name.slice(0, 7) + "…" : t.name,
          score: m?.score ?? 0,
          correct: m?.correctCount ?? 0,
          attempted: m?.attemptCount ?? 0,
          classification: m?.classification,
          color: classColor(m?.classification),
          icon: t.icon,
        };
      }),
    [masteryByTopic],
  );

  const mastered = data.filter((d) => d.classification === "mastered").length;
  const developing = data.filter((d) => d.classification === "developing").length;
  const needsWork = data.filter((d) => d.classification === "needs-work").length;
  const averageScore =
    data.length === 0
      ? 0
      : Math.round(data.reduce((s, d) => s + d.score, 0) / data.length);

  const radarData = useMemo(
    () =>
      TOPICS.map((t) => ({
        topic: t.name,
        mastery: masteryByTopic.get(t.id)?.score ?? 0,
        color: accentHex[t.accent],
      })),
    [masteryByTopic],
  );

  if (!quizComplete) {
    return (
      <div className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <AuroraBg variant="calm" />
        <div className="mx-auto max-w-md text-center">
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-emerald-700/10 ring-1 ring-violet-400/30 flex items-center justify-center"
          >
            <BarChart3 className="h-7 w-7 text-violet-200" />
          </motion.div>
          <h2 className="mt-5 text-xl font-semibold">No progress to chart yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Take the diagnostic quiz first - once you have at least one Mastery
            Score per topic, the chart and table will populate here.
          </p>
          <Button
            onClick={() => go("quiz")}
            className="mt-5 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white border-0"
          >
            Take the diagnostic
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <AuroraBg variant="calm" />
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              Live - recalculates after each answer
            </p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
              Topic progress
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Mastery scores per topic. Colors classify bands (Needs Work,
              Developing, Mastered) - labels are always shown alongside colors
              so information isn't locked to hue alone.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-muted/40 border border-border/30">
            {(["chart", "table"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                  tab === t ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="relative z-10">{t === "chart" ? "Chart" : "Table"}</span>
                {tab === t ? (
                  <motion.span
                    layoutId="progress-tab-pill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/25 to-emerald-500/20 border border-violet-400/30"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <SummaryCard label="Mastered" value={`${mastered} / ${TOPICS.length}`} icon={Trophy} tone="text-emerald-300" ring="ring-emerald-400/40" />
          <SummaryCard label="Developing" value={`${developing}`} icon={TrendingUp} tone="text-amber-300" ring="ring-amber-400/40" />
          <SummaryCard label="Needs Work" value={`${needsWork}`} icon={Layers} tone="text-rose-300" ring="ring-rose-400/40" />
          <SummaryCard label="Avg Mastery" value={`${averageScore}%`} icon={PieChart} tone="text-violet-300" ring="ring-violet-400/40" />
        </div>

        {tab === "chart" ? (
          <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-4">
            <TiltCard
              intensity={3}
              scale={1.003}
              glare={false}
              className="rounded-2xl"
            >
              <div className="rounded-2xl p-5 sm:p-6 glass-strong border border-border/40">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Mastery by topic
                    </p>
                    <h2 className="text-lg font-semibold">Bar chart</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    <LegendDot color="#fb7185" label="Needs Work" />
                    <LegendDot color="#fbbf24" label="Developing" />
                    <LegendDot color="#34d399" label="Mastered" />
                  </div>
                </div>
                <div className="w-full h-80" aria-label="Bar chart of mastery score per topic">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 8 }}>
                      <defs>
                        {data.map((d, i) => (
                          <linearGradient
                            key={i}
                            id={`grad-${i}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor={d.color} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={d.color} stopOpacity={0.4} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis
                        dataKey="short"
                        tick={{ fill: "rgba(200,200,220,0.7)", fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "rgba(200,200,220,0.7)", fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        contentStyle={{
                          background: "rgba(20, 12, 28, 0.95)",
                          border: "1px solid rgba(232, 121, 249, 0.3)",
                          borderRadius: 12,
                          color: "white",
                          fontSize: 12,
                        }}
                        formatter={(value: number, _name, item) => {
                          const d = item.payload;
                          return [
                            `${value}% - ${d.correct}/${d.attempted} correct`,
                            d.topic,
                          ];
                        }}
                        labelStyle={{ color: "rgba(220,220,240,0.6)" }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]} animationDuration={700}>
                        {data.map((d, i) => (
                          <Cell key={i} fill={`url(#grad-${i})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TiltCard>

            <TiltCard
              intensity={3}
              scale={1.003}
              glare={false}
              className="rounded-2xl"
            >
              <div className="rounded-2xl p-5 sm:p-6 glass-strong border border-border/40">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Bands
                </p>
                <h2 className="text-lg font-semibold">Mastery distribution</h2>
                <div className="mt-4 space-y-3">
                  {data
                    .slice()
                    .sort((a, b) => a.score - b.score)
                    .map((d, i) => (
                      <div key={d.topic}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="font-mono">{d.icon}</span>
                            {d.topic}
                          </span>
                          <span className="font-mono">{d.score}%</span>
                        </div>
                        <div className="relative h-2.5 rounded-full bg-muted/60 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${d.score}%` }}
                            transition={{ duration: 0.7, delay: i * 0.05, ease: "easeOut" }}
                            className={`absolute inset-y-0 left-0 rounded-full`}
                            style={{ background: `linear-gradient(90deg, ${d.color}, ${d.color}80)` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TiltCard>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl p-5 sm:p-6 glass-strong border border-border/40">
            <h2 className="text-lg font-semibold">Screen-reader table view</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Same data, accessible format. Each row shows mastery score, recent
              correct/attempted, and classification label.
            </p>
            <div className="mt-4 overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead className="text-right">Mastery</TableHead>
                    <TableHead className="text-right">Recent</TableHead>
                    <TableHead className="text-right">Band</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((d) => (
                    <TableRow key={d.topic}>
                      <TableCell className="font-medium">{d.topic}</TableCell>
                      <TableCell className="text-right font-mono">{d.score}%</TableCell>
                      <TableCell className="text-right font-mono">
                        {d.correct}/{d.attempted}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium"
                          style={{
                            background: `${d.color}22`,
                            color: d.color,
                            border: `1px solid ${d.color}66`,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: d.color }}
                          />
                          {d.classification === "mastered"
                            ? "Mastered"
                            : d.classification === "developing"
                              ? "Developing"
                              : "Needs Work"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 rounded-2xl glass border border-border/30 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Trophy className="h-5 w-5 text-amber-300 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">
              {mastered === TOPICS.length
                ? "Every topic mastered - you're ready for the next course."
                : `${mastered} of ${TOPICS.length} topics mastered. Practice the weakest to push it up.`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Summary updates within 1 second of any practice answer - see the
              SRS NFR-P4 response target.
            </p>
          </div>
          <Button
            onClick={() => go("practice")}
            size="sm"
            className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white border-0"
          >
            Practice now
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
  ring,
}: {
  label: string;
  value: string;
  icon: typeof Trophy;
  tone: string;
  ring: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ y: -3 }}
      style={{ transformStyle: "preserve-3d" }}
      className="rounded-xl p-3 sm:p-4 glass border border-border/30"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <div className={`h-7 w-7 rounded-md bg-muted/40 ring-1 ${ring} flex items-center justify-center`}>
          <Icon className={`h-3 w-3 ${tone}`} />
        </div>
      </div>
      <p className={`mt-2 text-xl sm:text-2xl font-mono font-bold ${tone}`}>
        {value}
      </p>
    </motion.div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
