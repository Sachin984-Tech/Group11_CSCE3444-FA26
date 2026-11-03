"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Layers,
  PlayCircle,
  Route as RouteIcon,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { TOPICS } from "@/lib/questionBank";
import { summaryStats } from "@/lib/studyEngine";
import { TiltCard } from "@/components/tilt-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  const masteryByTopic = useAppStore((s) => s.masteryByTopic);
  const summary = useMemo(() => summaryStats(masteryByTopic), [masteryByTopic]);
  const attempts = useAppStore((s) => s.attempts);
  const quizComplete = useAppStore((s) => s.quizComplete);

  const totalAttempted = attempts.length;
  const totalCorrect = attempts.filter((a) => a.correct).length;
  const accuracy = totalAttempted === 0 ? 0 : Math.round((totalCorrect / totalAttempted) * 100);

  const hourOfDay = new Date().getHours();
  const greeting = hourOfDay < 12 ? "Good morning" : hourOfDay < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.displayName?.split(" ")[0] || "learner";

  const rankTrend = summary.mastered === summary.total && summary.total > 0;

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <AuroraBg variant="calm" />
      <div className="mx-auto max-w-7xl">
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
                ? "Diagnostic quiz done - your study path is live. Answer practice questions and watch it reorder in real time."
                : "Take the diagnostic quiz first. It takes about 12 minutes and unlocks your personalized study path."}
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

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Topics Tracked"
            value={`${summary.total} / ${TOPICS.length}`}
            sub={`${summary.mastered} mastered`}
            icon={Layers}
            delay={0.05}
            accent="from-emerald-500/30 to-emerald-700/5"
            ring="ring-emerald-400/30"
          />
          <StatCard
            label="Practice Answers"
            value={String(totalAttempted)}
            sub={`${totalCorrect} correct`}
            icon={Sparkles}
            delay={0.12}
            accent="from-fuchsia-500/30 to-fuchsia-700/5"
            ring="ring-fuchsia-400/30"
          />
          <StatCard
            label="Avg Mastery"
            value={`${summary.average}%`}
            sub={rankTrend ? "All mastered" : "Across all topics"}
            icon={TrendingUp}
            delay={0.19}
            accent="from-violet-500/30 to-violet-700/5"
            ring="ring-violet-400/30"
          />
          <StatCard
            label="Practice Accuracy"
            value={`${accuracy}%`}
            sub="Last 10 answers per topic"
            icon={Trophy}
            delay={0.26}
            accent="from-amber-500/30 to-amber-700/5"
            ring="ring-amber-400/30"
          />
        </div>

        <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-4 sm:gap-6">
          <TiltCard
            intensity={4}
            scale={1.005}
            className="rounded-2xl"
          >
            <div className="rounded-2xl p-6 glass-strong border border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Recommended next
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    {quizComplete ? "Pick up where you left off" : "Start the diagnostic"}
                  </h2>
                </div>
                <motion.div
                  whileHover={{ rotateY: 25 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="h-12 w-12 rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-violet-700/10 ring-1 ring-fuchsia-400/30 flex items-center justify-center"
                >
                  {quizComplete ? <RouteIcon className="h-5 w-5" /> : <Compass className="h-5 w-5" />}
                </motion.div>
              </div>

              {quizComplete ? (
                <div className="mt-5 space-y-3">
                  {Array.from(masteryByTopic.values())
                    .sort((a, b) => a.score - b.score)
                    .slice(0, 3)
                    .map((m) => {
                      const topic = TOPICS.find((t) => t.id === m.topicId)!;
                      const barColor =
                        m.classification === "mastered"
                          ? "bg-emerald-400"
                          : m.classification === "developing"
                            ? "bg-amber-400"
                            : "bg-rose-400";
                      return (
                        <button
                          key={m.topicId}
                          onClick={() => go("study-path")}
                          className="w-full text-left group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="flex items-center gap-2 text-sm font-medium">
                              <span className={`h-2 w-2 rounded-full ${barColor}`} />
                              {topic.name}
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
                          <Progress value={m.score} className="sr-only" />
                        </button>
                      );
                    })}
                  <Button
                    onClick={() => go("study-path")}
                    variant="ghost"
                    size="sm"
                    className="mt-2 -ml-2 text-muted-foreground hover:text-foreground"
                  >
                    Open full study path
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="mt-5 p-4 rounded-xl bg-muted/30 border border-border/40">
                  <p className="text-sm text-muted-foreground">
                    The diagnostic quiz covers six DSA topics with three questions
                    each - 18 questions total. Plan for ~12 minutes.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
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
              )}
            </div>
          </TiltCard>

          <div className="grid gap-4 sm:gap-6">
            <QuickAction
              onClick={() => go("progress")}
              icon={BarChart3}
              title="Progress Chart"
              blurb="Mastery band visualization with screen-reader table view."
              accent="from-violet-500/30 to-violet-700/10"
              ring="ring-violet-400/30"
              delay={0.1}
            />
            <QuickAction
              onClick={() => go("practice")}
              icon={PlayCircle}
              title="Practice Round"
              blurb={quizComplete ? "Pick a topic and start answering - the path reranks as you go." : "Unlock by completing the diagnostic."}
              accent="from-emerald-500/30 to-emerald-700/10"
              ring="ring-emerald-400/30"
              delay={0.18}
              disabled={!quizComplete}
            />
            <QuickAction
              onClick={() => go("quiz")}
              icon={Brain}
              title="Retake diagnostic"
              blurb="Reset scores and walk the quiz again. Your previous scores are overwritten."
              accent="from-amber-500/30 to-amber-700/10"
              ring="ring-amber-400/30"
              delay={0.26}
            />
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold tracking-tight flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              Topics in your path
            </h3>
            <span className="text-xs text-muted-foreground">
              {quizComplete ? "Sorted by mastery" : "Default course order"}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {TOPICS.map((t, i) => {
              const m = masteryByTopic.get(t.id);
              return (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, y: 18, rotateX: -8 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  whileHover={{ y: -4, rotateY: 6, rotateX: -4 }}
                  onClick={() => go("study-path")}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TiltCard
                    intensity={10}
                    scale={1.04}
                    className={`rounded-xl p-3.5 h-full glass ring-1 ${accentRing[t.accent]}`}
                  >
                    <div
                      className={`h-8 w-8 rounded-lg bg-gradient-to-br ${accentBg[t.accent]} ring-1 ${accentRing[t.accent]} flex items-center justify-center text-base font-mono`}
                    >
                      {t.icon}
                    </div>
                    <p className="mt-2.5 text-sm font-medium leading-tight">{t.name}</p>
                    <p className="mt-1 text-[11px] font-mono text-muted-foreground">
                      {m ? `${m.score}%` : " - "}
                    </p>
                    {m ? (
                      <p className="text-xs text-muted-foreground">
                        {m.classification === "mastered"
                          ? "Mastered"
                          : m.classification === "developing"
                            ? "Developing"
                            : "Needs work"}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Not taken</p>
                    )}
                  </TiltCard>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Path recalculates in &lt; 1s after each answer
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            Auto-saved to local session - Firestore pending
          </span>
          <span className="flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-violet-300" />
            Explanations grounded in your actual scores
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  ring,
  delay,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Layers;
  accent: string;
  ring: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <TiltCard
        intensity={8}
        scale={1.02}
        className={`rounded-2xl p-4 sm:p-5 glass border border-border/30 h-full`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-1 text-2xl sm:text-3xl font-bold font-mono">{value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
          </div>
          <div
            className={`h-10 w-10 rounded-xl bg-gradient-to-br ${accent} ring-1 ${ring} flex items-center justify-center`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

function QuickAction({
  onClick,
  icon: Icon,
  title,
  blurb,
  accent,
  ring,
  delay,
  disabled,
}: {
  onClick: () => void;
  icon: typeof Layers;
  title: string;
  blurb: string;
  accent: string;
  ring: string;
  delay: number;
  disabled?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3, rotateY: 4 }}
      style={{ transformStyle: "preserve-3d" }}
      className="text-left disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="rounded-2xl p-5 glass border border-border/30 h-full">
        <div className="flex items-start gap-3">
          <div
            className={`h-10 w-10 rounded-xl bg-gradient-to-br ${accent} ring-1 ${ring} flex items-center justify-center shrink-0`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {blurb}
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
