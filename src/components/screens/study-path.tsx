"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Compass, ListTree, PlayCircle, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { TOPIC_MAP } from "@/lib/questionBank";
import { rankTopics } from "@/lib/studyEngine";
import { TiltCard } from "@/components/tilt-card";
import { Button } from "@/components/ui/button";
import { AuroraBg } from "@/components/aurora-bg";

const accentRing: Record<string, string> = {
  emerald: "ring-emerald-400/40",
  violet: "ring-violet-400/40",
  amber: "ring-amber-400/40",
  fuchsia: "ring-fuchsia-400/40",
  rose: "ring-rose-400/40",
  teal: "ring-teal-400/40",
};
const accentBg: Record<string, string> = {
  emerald: "from-emerald-500/30 to-emerald-700/10",
  violet: "from-violet-500/30 to-violet-700/10",
  amber: "from-amber-500/30 to-amber-700/10",
  fuchsia: "from-fuchsia-500/30 to-fuchsia-700/10",
  rose: "from-rose-500/30 to-rose-700/10",
  teal: "from-teal-500/30 to-teal-700/10",
};
const accentText: Record<string, string> = {
  emerald: "text-emerald-300",
  violet: "text-violet-300",
  amber: "text-amber-300",
  fuchsia: "text-fuchsia-300",
  rose: "text-rose-300",
  teal: "text-teal-300",
};

export function StudyPathScreen() {
  const quizComplete = useAppStore((s) => s.quizComplete);
  const masteryByTopic = useAppStore((s) => s.masteryByTopic);
  const go = useAppStore((s) => s.go);
  const startPractice = useAppStore((s) => s.startPractice);
  const quizTopicIds = useAppStore((s) => s.quizTopicIds);

  const ranked = useMemo(
    () => rankTopics(masteryByTopic, quizTopicIds),
    [masteryByTopic, quizTopicIds],
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
            className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-violet-700/10 ring-1 ring-amber-400/30 flex items-center justify-center"
          >
            <Compass className="h-7 w-7 text-amber-200" />
          </motion.div>
          <h2 className="mt-5 text-xl font-semibold">No study path yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Take the diagnostic quiz first - your personalized study path
            appears here, ranked by your weakest topics and pulled-apart
            prerequisites.
          </p>
          <Button
            onClick={() => go("quiz")}
            className="mt-5 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white border-0"
          >
            <Compass className="h-4 w-4 mr-1" />
            Take the quiz
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
              <ListTree className="h-3.5 w-3.5" />
              Personalized - recalculates live
            </p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
              Your study path
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Ranked weakest-first. Topics with weak prerequisites are pulled
              ahead of their dependents. Mastered topics are grouped at the end
              as <em>Optional Review</em>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => go("practice")}
              variant="outline"
              size="sm"
              className="glass border-border/50"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Practice weakest
            </Button>
          </div>
        </motion.div>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          {(["needs-work", "developing", "mastered"] as const).map((cls, i) => {
            const count = ranked.filter(
              (r) => (r.mastery?.classification ?? "needs-work") === cls,
            ).length;
            const colors = {
              "needs-work": "bg-rose-500/15 ring-rose-400/40 text-rose-300",
              developing: "bg-amber-500/15 ring-amber-400/40 text-amber-300",
              mastered: "bg-emerald-500/15 ring-emerald-400/40 text-emerald-300",
            }[cls];
            const labels = {
              "needs-work": "Needs work",
              developing: "Developing",
              mastered: "Mastered",
            };
            return (
              <motion.div
                key={cls}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-xl p-3 sm:p-4 ring-1 ${colors} text-center`}
              >
                <p className="text-2xl sm:text-3xl font-bold font-mono">{count}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] opacity-90">
                  {labels[cls]}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 space-y-3">
          <AnimatePresence>
            {ranked.map((entry, i) => {
              const topic = entry.topic;
              const mastery = entry.mastery;
              const cls = mastery?.classification;
              const isOptional = cls === "mastered";
              const barColor =
                cls === "mastered"
                  ? "bg-emerald-400"
                  : cls === "developing"
                    ? "bg-amber-400"
                    : "bg-rose-400";
              return (
                <motion.div
                  key={topic.id}
                  layout
                  initial={{ opacity: 0, y: 30, rotateX: -8 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 90 }}
                  whileHover={{ y: -3 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TiltCard
                    intensity={4}
                    scale={1.005}
                    className={`rounded-2xl border ${isOptional ? "border-emerald-400/20" : "border-border/30"}`}
                  >
                    <div className={`rounded-2xl p-5 sm:p-6 glass border ${isOptional ? "border-emerald-400/20" : "border-border/30"}`}>
                      <div className="flex items-start gap-4">
                        <div
                          className={`relative h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br ${accentBg[topic.accent]} ring-1 ${accentRing[topic.accent]} flex items-center justify-center font-mono text-2xl ${accentText[topic.accent]}`}
                          style={{ transform: "translateZ(20px)" }}
                        >
                          {topic.icon}
                          <span
                            className={`absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border border-border/60 flex items-center justify-center text-[10px] font-mono font-bold`}
                          >
                            {entry.rank}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <h3 className="text-base sm:text-lg font-semibold">{topic.name}</h3>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md uppercase tracking-[0.16em] ${
                                cls === "mastered"
                                  ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30"
                                  : cls === "developing"
                                    ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30"
                                    : "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30"
                              }`}
                            >
                              {isOptional ? "Optional review" : labelFor(cls)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {topic.blurb}
                          </p>

                          {mastery ? (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground font-mono">
                                  {mastery.correctCount}/{mastery.attemptCount} correct - {mastery.score}%
                                </span>
                                <span className="text-muted-foreground">Mastery</span>
                              </div>
                              <div className="mt-1.5 relative h-2 rounded-full bg-muted/60 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${mastery.score}%` }}
                                  transition={{ duration: 0.6, ease: "easeOut" }}
                                  className={`absolute inset-y-0 left-0 ${barColor} rounded-full`}
                                />
                              </div>
                            </div>
                          ) : (
                            <p className="mt-3 text-xs text-muted-foreground italic">
                              No diagnostic data - take the quiz to populate this row.
                            </p>
                          )}

                          {topic.prerequisites.length > 0 ? (
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                              <span>Depends on:</span>
                              {topic.prerequisites.map((pid) => {
                                const pm = masteryByTopic.get(pid);
                                const pcls = pm?.classification;
                                const dot =
                                  pcls === "mastered"
                                    ? "bg-emerald-400"
                                    : pcls === "developing"
                                      ? "bg-amber-400"
                                      : "bg-rose-400";
                                return (
                                  <span
                                    key={pid}
                                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/40 border border-border/40"
                                  >
                                    <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                                    {TOPIC_MAP[pid].name}
                                  </span>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>

                        <div className="flex sm:flex-col gap-2 shrink-0">
                          <Button
                            onClick={() => startPractice(topic.id)}
                            size="sm"
                            className={`bg-gradient-to-r ${accentBg[topic.accent]} ring-1 ${accentRing[topic.accent]} border-0 ${accentText[topic.accent]} hover:opacity-90`}
                          >
                            <PlayCircle className="h-3.5 w-3.5 mr-1" />
                            <span className="hidden sm:inline">Practice</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-6 p-4 rounded-2xl glass border border-border/30 flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-fuchsia-300 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Answer practice questions and watch the path rerank in real time.
            Mastery recalculates from your last 10 attempts per topic.
            <strong className="text-foreground"> FR-05 (Why? Explanations)</strong>{" "}
            lands in the next commit.
          </p>
        </div>
      </div>
    </div>
  );
}

function labelFor(cls: string | undefined) {
  if (cls === "mastered") return "Mastered";
  if (cls === "developing") return "Developing";
  return "Needs work";
}
