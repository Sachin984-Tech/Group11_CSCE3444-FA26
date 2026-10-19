"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Compass,
  ListChecks,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TOPICS, TOPIC_MAP } from "@/lib/questionBank";
import { classify } from "@/lib/studyEngine";
import { TiltCard } from "@/components/tilt-card";
import { Button } from "@/components/ui/button";
import { AuroraBg } from "@/components/aurora-bg";

const accentRing: Record<string, string> = {
  emerald: "ring-emerald-400/40 text-emerald-300",
  violet: "ring-violet-400/40 text-violet-300",
  amber: "ring-amber-400/40 text-amber-300",
  fuchsia: "ring-fuchsia-400/40 text-fuchsia-300",
  rose: "ring-rose-400/40 text-rose-300",
  teal: "ring-teal-400/40 text-teal-300",
};
const accentBg: Record<string, string> = {
  emerald: "from-emerald-500/25 to-emerald-700/5",
  violet: "from-violet-500/25 to-violet-700/5",
  amber: "from-amber-500/25 to-amber-700/5",
  fuchsia: "from-fuchsia-500/25 to-fuchsia-700/5",
  rose: "from-rose-500/25 to-rose-700/5",
  teal: "from-teal-500/25 to-teal-700/5",
};

export function DashboardScreen() {
  const user = useAppStore((s) => s.user);
  const go = useAppStore((s) => s.go);
  const quizComplete = useAppStore((s) => s.quizComplete);
  const quizResults = useAppStore((s) => s.quizResults);
  const quizTopicIds = useAppStore((s) => s.quizTopicIds);

  const hourOfDay = new Date().getHours();
  const greeting = hourOfDay < 12 ? "Good morning" : hourOfDay < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.displayName?.split(" ")[0] || "learner";

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
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {greeting}, {firstName}
            </p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
              Your adaptive learning hub
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              {quizComplete
                ? "Diagnostic quiz done. Your per-topic scores are below. The personalized study path lands in FR-03."
                : "Take the diagnostic quiz to get your per-topic mastery scores. The personalized study path lands in the next commit (FR-03)."}
            </p>
          </div>
          <Button
            onClick={() => go("quiz")}
            className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white shadow-lg shadow-fuchsia-500/30 border-0"
          >
            <Compass className="h-4 w-4 mr-1" />
            {quizComplete ? "Retake quiz" : "Take diagnostic quiz"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>

        {quizComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.15 }}
          >
            <TiltCard
              intensity={4}
              scale={1.005}
              className="rounded-2xl"
            >
              <div className="rounded-2xl p-6 glass-strong border border-border/40 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Quiz results
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">Per-topic scores</h2>
                  </div>
                  <motion.div
                    whileHover={{ rotateY: 25 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-violet-700/10 ring-1 ring-fuchsia-400/30 flex items-center justify-center"
                  >
                    <Trophy className="h-5 w-5" />
                  </motion.div>
                </div>

                <div className="mt-5 space-y-3">
                  {quizResults.map((r) => {
                    const topic = TOPIC_MAP[r.topicId];
                    const cls = classify(r.score);
                    const barColor =
                      cls === "mastered"
                        ? "bg-emerald-400"
                        : cls === "developing"
                          ? "bg-amber-400"
                          : "bg-rose-400";
                    const clsLabel =
                      cls === "mastered" ? "Mastered" : cls === "developing" ? "Developing" : "Needs work";
                    return (
                      <div key={r.topicId}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <span className={`h-2 w-2 rounded-full ${barColor}`} />
                            {topic.name}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {r.score}% - {r.correct}/{r.total} correct - {clsLabel}
                          </span>
                        </div>
                        <div className="relative h-2 rounded-full bg-muted/60 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${r.score}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`absolute inset-y-0 left-0 ${barColor} rounded-full`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 p-3 rounded-xl bg-muted/30 border border-border/30 text-xs text-muted-foreground flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 mt-0.5" />
                  <p>
                    FR-03 (personalized study path with prerequisite-aware
                    ranking) lands in the next commit. For now, your scores are
                    saved and ready.
                  </p>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.15 }}
          >
            <TiltCard
              intensity={4}
              scale={1.005}
              className="rounded-2xl"
            >
              <div className="rounded-2xl p-6 glass-strong border border-border/40 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-violet-700/10 ring-1 ring-fuchsia-400/30 flex items-center justify-center">
                    <Compass className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Take the diagnostic</h2>
                    <p className="text-sm text-muted-foreground">
                      Six DSA topics - three questions each - 18 questions total.
                      About 12 minutes.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => {
                    const selected = quizTopicIds.includes(t.id);
                    return (
                      <span
                        key={t.id}
                        className={`text-[11px] px-2 py-1 rounded-md bg-gradient-to-br ${accentBg[t.accent]} ring-1 ${accentRing[t.accent]} ${selected ? "" : "opacity-50"}`}
                      >
                        {t.icon} {t.name}
                      </span>
                    );
                  })}
                </div>

                <Button
                  onClick={() => go("quiz")}
                  size="sm"
                  className="mt-4 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white border-0"
                >
                  Start now
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </TiltCard>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs"
        >
          {[
            { label: "FR-01", text: "Login & Access", done: true },
            { label: "FR-02", text: "Diagnostic Quiz", done: true },
            { label: "FR-03", text: "Study Path", done: false },
            { label: "FR-04", text: "Practice + Recalc", done: false },
            { label: "FR-05", text: "Why? Explanations", done: false },
            { label: "FR-06", text: "Progress Chart", done: false },
          ].map((fr) => (
            <div
              key={fr.label}
              className={`rounded-xl p-3 glass border border-border/30 ${fr.done ? "" : "opacity-60"}`}
            >
              <div className="flex items-center gap-1.5">
                {fr.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <ListChecks className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <p className="font-mono font-semibold">{fr.label}</p>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{fr.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
