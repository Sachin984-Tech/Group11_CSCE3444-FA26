"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  ListChecks,
  Route as RouteIcon,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TOPICS, TOPIC_MAP } from "@/lib/questionBank";
import { classify, rankTopics } from "@/lib/studyEngine";
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
  const masteryByTopic = useAppStore((s) => s.masteryByTopic);
  const quizTopicIds = useAppStore((s) => s.quizTopicIds);

  const ranked = quizComplete ? rankTopics(masteryByTopic, quizTopicIds).slice(0, 3) : [];

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
                ? "Diagnostic done. Your personalized study path is live - ranked weakest-first with prerequisites pulled ahead of dependents."
                : "Take the diagnostic quiz to unlock your personalized study path."}
            </p>
          </div>
          <Button
            onClick={() => go(quizComplete ? "study-path" : "quiz")}
            className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white shadow-lg shadow-fuchsia-500/30 border-0"
          >
            {quizComplete ? (
              <>
                <RouteIcon className="h-4 w-4 mr-1" />
                View study path
              </>
            ) : (
              <>
                <Compass className="h-4 w-4 mr-1" />
                Take diagnostic quiz
              </>
            )}
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
                      Recommended next
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Your top 3 topics to study
                    </h2>
                  </div>
                  <motion.div
                    whileHover={{ rotateY: 25 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-violet-700/10 ring-1 ring-fuchsia-400/30 flex items-center justify-center"
                  >
                    <RouteIcon className="h-5 w-5" />
                  </motion.div>
                </div>

                <div className="mt-5 space-y-3">
                  {ranked.map((entry) => {
                    const m = entry.mastery;
                    if (!m) return null;
                    const barColor =
                      m.classification === "mastered"
                        ? "bg-emerald-400"
                        : m.classification === "developing"
                          ? "bg-amber-400"
                          : "bg-rose-400";
                    return (
                      <button
                        key={entry.topic.id}
                        onClick={() => go("study-path")}
                        className="w-full text-left group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <span className="font-mono text-xs text-muted-foreground">#{entry.rank}</span>
                            <span className={`h-2 w-2 rounded-full ${barColor}`} />
                            {entry.topic.name}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {m.score}% - {m.correctCount}/{m.attemptCount}
                          </span>
                        </div>
                        <div className="relative h-2 rounded-full bg-muted/60 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${m.score}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`absolute inset-y-0 left-0 ${barColor} rounded-full`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button
                  onClick={() => go("study-path")}
                  variant="ghost"
                  size="sm"
                  className="mt-4 -ml-2 text-muted-foreground hover:text-foreground"
                >
                  Open full study path
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
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
                  {TOPICS.map((t) => (
                    <span
                      key={t.id}
                      className={`text-[11px] px-2 py-1 rounded-md bg-gradient-to-br ${accentBg[t.accent]} ring-1 ${accentRing[t.accent]}`}
                    >
                      {t.icon} {t.name}
                    </span>
                  ))}
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
            { label: "FR-03", text: "Study Path", done: true },
            { label: "FR-04", text: "Practice + Recalc", done: true },
            { label: "FR-05", text: "Why? Explanations", done: true },
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
