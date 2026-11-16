"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Compass,
  Flame,
  History as HistoryIcon,
  ListChecks,
  PlayCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAppStore } from "@/lib/store";
import { TOPICS, TOPIC_MAP } from "@/lib/questionBank";
import { AuroraBg } from "@/components/aurora-bg";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { HistoryEntry, TopicId } from "@/lib/types";

const TOPIC_HEX: Record<string, string> = {
  emerald: "#34d399",
  violet: "#a78bfa",
  amber: "#fbbf24",
  fuchsia: "#e879f9",
  rose: "#fb7185",
  teal: "#2dd4bf",
};

interface TimelineItem {
  key: string;
  time: number;
  kind: "diagnostic" | "practice";
  topicId?: TopicId;
  answered: number;
  correct: number;
  before?: number;
  after: number;
}

export function HistoryScreen() {
  const history = useAppStore((s) => s.history);
  const go = useAppStore((s) => s.go);
  const [view, setView] = useState<"chart" | "table">("chart");
  const [shownTopics, setShownTopics] = useState<TopicId[]>([]);

  const stats = useMemo(() => buildStats(history), [history]);
  const timeline = useMemo(() => buildTimeline(history), [history]);

  const chartData = useMemo(
    () =>
      history.map((h, i) => ({
        step: i + 1,
        when: formatTime(h.timestamp),
        event: h.kind === "diagnostic" ? "Diagnostic" : `Practice: ${TOPIC_MAP[h.topicId as TopicId]?.name ?? ""}`,
        average: h.average,
        ...Object.fromEntries(TOPICS.map((t) => [t.id, h.mastery[t.id] ?? null])),
      })),
    [history],
  );

  function toggleTopic(id: TopicId) {
    setShownTopics((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  if (history.length === 0) {
    return (
      <div className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <AuroraBg variant="calm" />
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-700/10 ring-1 ring-violet-400/30 flex items-center justify-center">
            <HistoryIcon className="h-7 w-7 text-violet-200" />
          </div>
          <h1 className="mt-5 text-xl font-semibold">No study history yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your history starts with your first diagnostic. Every quiz and practice
            answer after that adds a point to your progress trend.
          </p>
          <Button
            onClick={() => go("quiz")}
            className="mt-5 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white border-0"
          >
            <Compass className="h-4 w-4 mr-1" />
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
            <HistoryIcon className="h-3.5 w-3.5" />
            Study history
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">Your progress over time</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Every diagnostic and practice answer is saved, so you can see whether your
            mastery is actually going up and how consistently you study.
          </p>
        </motion.div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatTile icon={ListChecks} label="Questions answered" value={String(stats.answered)} tone="text-violet-300" />
          <StatTile icon={Target} label="Practice accuracy" value={stats.accuracy === null ? "—" : `${stats.accuracy}%`} tone="text-emerald-300" />
          <StatTile icon={CalendarDays} label="Study days" value={String(stats.studyDays)} tone="text-amber-300" />
          <StatTile
            icon={Flame}
            label="Day streak"
            value={`${stats.streak} day${stats.streak === 1 ? "" : "s"}`}
            tone={stats.streak >= 2 ? "text-rose-300" : "text-muted-foreground"}
          />
        </div>

        <section aria-labelledby="trend-heading" className="mt-6 rounded-2xl p-5 sm:p-6 glass-strong border border-border/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="trend-heading" className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-300" />
                Mastery trend
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Average mastery {stats.firstAverage}% → {stats.lastAverage}%
                {stats.lastAverage - stats.firstAverage !== 0
                  ? ` (${stats.lastAverage - stats.firstAverage > 0 ? "+" : ""}${stats.lastAverage - stats.firstAverage} points)`
                  : ""}{" "}
                across {history.length} recorded events.
              </p>
            </div>
            <div role="group" aria-label="Trend view" className="flex gap-1 p-1 rounded-lg bg-muted/30 border border-border/30">
              {(["chart", "table"] as const).map((v) => (
                <button
                  key={v}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize ${
                    view === v ? "bg-fuchsia-500/20 text-fuchsia-100" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div role="group" aria-label="Show topic lines" className="mt-4 flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const on = shownTopics.includes(t.id);
              return (
                <button
                  key={t.id}
                  aria-pressed={on}
                  onClick={() => toggleTopic(t.id)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs border transition-colors ${
                    on ? "bg-muted/50 border-border/70 text-foreground" : "border-border/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: TOPIC_HEX[t.accent] }} />
                  {t.name}
                </button>
              );
            })}
          </div>

          {view === "chart" ? (
            <div className="mt-4 h-72" role="img" aria-label={`Line chart of average mastery from ${stats.firstAverage}% to ${stats.lastAverage}%`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 12, left: -16, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="step" tick={{ fill: "#a1a1aa", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#a1a1aa", fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 12, 30, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    labelFormatter={(_, payload) => {
                      const d = payload?.[0]?.payload as { when?: string; event?: string } | undefined;
                      return d ? `${d.event} · ${d.when}` : "";
                    }}
                    formatter={(value, name) => [
                      `${value}%`,
                      name === "average" ? "Average" : TOPIC_MAP[name as TopicId]?.name ?? String(name),
                    ]}
                  />
                  <Legend
                    formatter={(v) => (v === "average" ? "Average mastery" : TOPIC_MAP[v as TopicId]?.name ?? v)}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="average" stroke="#f4f4f5" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                  {shownTopics.map((id) => (
                    <Line
                      key={id}
                      type="stepAfter"
                      dataKey={id}
                      stroke={TOPIC_HEX[TOPIC_MAP[id].accent]}
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                      dot={false}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-border/30">
              <Table>
                <caption className="sr-only">Mastery after each recorded study event</caption>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead className="text-right">Average</TableHead>
                    {shownTopics.map((id) => (
                      <TableHead key={id} className="text-right">
                        {TOPIC_MAP[id].name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...chartData].reverse().map((row) => (
                    <TableRow key={row.step}>
                      <TableCell className="font-mono text-xs">{row.step}</TableCell>
                      <TableCell className="text-xs">{row.when}</TableCell>
                      <TableCell className="text-xs">{row.event}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{row.average}%</TableCell>
                      {shownTopics.map((id) => {
                        const v = (row as Record<string, unknown>)[id];
                        return (
                          <TableCell key={id} className="text-right font-mono text-xs">
                            {typeof v === "number" ? `${v}%` : "—"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        <section aria-labelledby="timeline-heading" className="mt-6">
          <h2 id="timeline-heading" className="text-lg font-semibold flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-amber-300" />
            Session timeline
          </h2>
          <div className="mt-3 space-y-5">
            {timeline.map((day) => (
              <div key={day.day}>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{day.label}</p>
                <ol className="mt-2 space-y-2">
                  {day.items.map((item) => (
                    <TimelineRow key={item.key} item={item} />
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function TimelineRow({ item }: { item: TimelineItem }) {
  const topic = item.topicId ? TOPIC_MAP[item.topicId] : null;
  const delta = item.before === undefined ? null : item.after - item.before;
  return (
    <li className="flex items-start gap-3 rounded-xl p-3.5 glass border border-border/30">
      <div
        className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ring-1 ${
          item.kind === "diagnostic" ? "bg-fuchsia-500/15 ring-fuchsia-400/30" : "bg-violet-500/15 ring-violet-400/30"
        }`}
      >
        {item.kind === "diagnostic" ? (
          <Compass className="h-4 w-4 text-fuchsia-200" aria-hidden="true" />
        ) : (
          <PlayCircle className="h-4 w-4 text-violet-200" aria-hidden="true" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {item.kind === "diagnostic" ? "Took the diagnostic quiz" : `Practiced ${topic?.name ?? "a topic"}`}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatTime(item.time)}
          {item.kind === "practice"
            ? ` · ${item.answered} answer${item.answered === 1 ? "" : "s"}, ${item.correct} correct`
            : ` · ${item.answered} questions · average mastery ${item.after}%`}
        </p>
      </div>
      {item.kind === "practice" && item.before !== undefined ? (
        <div className="text-right shrink-0">
          <p className="font-mono text-sm">
            {item.before}% → {item.after}%
          </p>
          <p
            className={`text-[11px] ${
              delta && delta > 0 ? "text-emerald-300" : delta && delta < 0 ? "text-rose-300" : "text-muted-foreground"
            }`}
          >
            {delta && delta > 0 ? `+${delta} pts` : delta && delta < 0 ? `${delta} pts` : "no change"}
          </p>
        </div>
      ) : null}
    </li>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-3 sm:p-4 glass border border-border/30"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <Icon className={`h-3.5 w-3.5 ${tone}`} aria-hidden="true" />
      </div>
      <p className={`mt-2 text-xl sm:text-2xl font-mono font-bold ${tone}`}>{value}</p>
    </motion.div>
  );
}

/* ---------- pure helpers ---------- */

function dayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function buildStats(history: HistoryEntry[]) {
  const practice = history.filter((h) => h.kind === "practice");
  const diagnostics = history.filter((h) => h.kind === "diagnostic");
  const correct = practice.filter((h) => h.correct).length;
  const days = Array.from(new Set(history.map((h) => dayKey(h.timestamp)))).sort();

  // Consecutive study days ending today (or yesterday, so the streak isn't
  // lost before you've studied today).
  let streak = 0;
  const daySet = new Set(days);
  const cursor = new Date();
  if (!daySet.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
  while (daySet.has(dayKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    answered: practice.length + diagnostics.reduce((sum, d) => sum + (d.questions ?? 18), 0),
    accuracy: practice.length === 0 ? null : Math.round((correct / practice.length) * 100),
    studyDays: days.length,
    streak,
    firstAverage: history[0]?.average ?? 0,
    lastAverage: history[history.length - 1]?.average ?? 0,
  };
}

export function buildTimeline(history: HistoryEntry[]) {
  // Group consecutive practice answers on the same topic into one session.
  const items: TimelineItem[] = [];
  let prevMastery: Partial<Record<TopicId, number>> = {};
  for (const h of history) {
    if (h.kind === "diagnostic") {
      items.push({
        key: `d-${h.timestamp}`,
        time: h.timestamp,
        kind: "diagnostic",
        answered: h.questions ?? 0,
        correct: 0,
        after: h.average,
      });
    } else if (h.topicId) {
      const last = items[items.length - 1];
      const after = h.mastery[h.topicId] ?? 0;
      if (
        last &&
        last.kind === "practice" &&
        last.topicId === h.topicId &&
        dayKey(last.time) === dayKey(h.timestamp) &&
        h.timestamp - last.time < 30 * 60 * 1000
      ) {
        last.answered += 1;
        last.correct += h.correct ? 1 : 0;
        last.after = after;
        last.time = h.timestamp;
      } else {
        items.push({
          key: `p-${h.timestamp}`,
          time: h.timestamp,
          kind: "practice",
          topicId: h.topicId,
          answered: 1,
          correct: h.correct ? 1 : 0,
          before: prevMastery[h.topicId] ?? 0,
          after,
        });
      }
    }
    prevMastery = h.mastery;
  }

  const byDay = new Map<string, TimelineItem[]>();
  for (const item of items.reverse()) {
    const k = dayKey(item.time);
    byDay.set(k, [...(byDay.get(k) ?? []), item]);
  }
  const today = dayKey(Date.now());
  const yesterday = dayKey(Date.now() - 86_400_000);
  return Array.from(byDay.entries()).map(([day, dayItems]) => ({
    day,
    label:
      day === today
        ? "Today"
        : day === yesterday
          ? "Yesterday"
          : new Date(dayItems[0].time).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }),
    items: dayItems,
  }));
}
