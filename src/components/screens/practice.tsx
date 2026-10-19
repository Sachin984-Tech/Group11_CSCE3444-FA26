"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Flame,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { TOPIC_MAP, QUESTIONS } from "@/lib/questionBank";
import { TiltCard } from "@/components/tilt-card";
import { Button } from "@/components/ui/button";
import { AuroraBg } from "@/components/aurora-bg";
import type { PracticeAttempt } from "@/lib/types";

const accentRing: Record<string, string> = {
  emerald: "ring-emerald-400/40",
  violet: "ring-violet-400/40",
  amber: "ring-amber-400/40",
  fuchsia: "ring-fuchsia-400/40",
  rose: "ring-rose-400/40",
  teal: "ring-teal-400/40",
};
const accentText: Record<string, string> = {
  emerald: "text-emerald-300",
  violet: "text-violet-300",
  amber: "text-amber-300",
  fuchsia: "text-fuchsia-300",
  rose: "text-rose-300",
  teal: "text-teal-300",
};
const accentBg: Record<string, string> = {
  emerald: "from-emerald-500/30 to-emerald-700/10",
  violet: "from-violet-500/30 to-violet-700/10",
  amber: "from-amber-500/30 to-amber-700/10",
  fuchsia: "from-fuchsia-500/30 to-fuchsia-700/10",
  rose: "from-rose-500/30 to-rose-700/10",
  teal: "from-teal-500/30 to-teal-700/10",
};

type FeedbackState = {
  correct: boolean;
  correctOptionId: string;
  selectedOptionId: string;
  explanation: string;
  questionId: string;
} | null;

export function PracticeScreen() {
  const practiceTopicId = useAppStore((s) => s.practiceTopicId);
  const masteryByTopic = useAppStore((s) => s.masteryByTopic);
  const practicedQuestionIds = useAppStore((s) => s.practicedQuestionIds);
  const attempts = useAppStore((s) => s.attempts);
  const recordAttempt = useAppStore((s) => s.recordAttempt);
  const exitPractice = useAppStore((s) => s.exitPractice);
  const startPractice = useAppStore((s) => s.startPractice);
  const go = useAppStore((s) => s.go);
  const quizTopicIds = useAppStore((s) => s.quizTopicIds);

  const questionBank = useMemo(() => QUESTIONS, []);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!practiceTopicId) return;
    const topicQs = questionBank.filter((q) => q.topicId === practiceTopicId);
    const pick = topicQs[Math.floor(Math.random() * topicQs.length)] ?? topicQs[0];
    if (pick) {
      setCurrentQuestionId(pick.id);
      setSelected(null);
      setFeedback(null);
    }
  }, [practiceTopicId, questionBank]);

  if (!practiceTopicId) {
    return (
      <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <AuroraBg variant="calm" />
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5" />
            Choose a topic
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
            Practice round
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Pick any topic to start answering practice questions. The mastery
            score for that topic recalculates from your last 10 answers, and
            your study path reranks in real time.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quizTopicIds.map((id) => {
              const topic = TOPIC_MAP[id];
              const m = masteryByTopic.get(id);
              return (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 18, rotateX: -8 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  whileHover={{ y: -4, rotateY: 6 }}
                  style={{ transformStyle: "preserve-3d" }}
                  onClick={() => startPractice(id)}
                >
                  <TiltCard
                    intensity={10}
                    scale={1.04}
                    className={`rounded-2xl p-5 glass border border-border/30 h-full`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-11 w-11 rounded-xl bg-gradient-to-br ${accentBg[topic.accent]} ring-1 ${accentRing[topic.accent]} flex items-center justify-center font-mono text-xl ${accentText[topic.accent]}`}
                      >
                        {topic.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{topic.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {m ? `Mastery ${m.score}%` : "No score yet"}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TiltCard>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const topic = TOPIC_MAP[practiceTopicId];
  const currentQuestion = questionBank.find((q) => q.id === currentQuestionId);
  const mastery = masteryByTopic.get(practiceTopicId);

  if (!currentQuestion) {
    return (
      <div className="px-4 sm:px-6 py-16 text-center">
        <Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Loading question...</p>
      </div>
    );
  }

  function submitAnswer(optionId: string) {
    if (!currentQuestion || feedback) return;
    setSelected(optionId);
    const correct = optionId === currentQuestion.correctOptionId;
    const attempt: PracticeAttempt = {
      questionId: currentQuestion.id,
      topicId: currentQuestion.topicId,
      correct,
      timestamp: Date.now(),
    };
    setFeedback({
      correct,
      correctOptionId: currentQuestion.correctOptionId,
      selectedOptionId: optionId,
      explanation: currentQuestion.explanation,
      questionId: currentQuestion.id,
    });
    setStreak((s) => (correct ? s + 1 : 0));
    recordAttempt(attempt);
  }

  function nextQuestion() {
    const topicQs = questionBank.filter((q) => q.topicId === practiceTopicId);
    const exclude = [...practicedQuestionIds, currentQuestion!.id];
    const fresh = topicQs.filter((q) => !exclude.includes(q.id));
    const pool = fresh.length > 0 ? fresh : topicQs.filter((q) => q.id !== currentQuestion!.id);
    const source = pool.length > 0 ? pool : topicQs;
    const pick = source[Math.floor(Math.random() * source.length)] ?? topicQs[0];
    if (pick) {
      setCurrentQuestionId(pick.id);
      setSelected(null);
      setFeedback(null);
    }
  }

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <AuroraBg variant="calm" />
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <Button
            onClick={exitPractice}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to path
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${accentBg[topic.accent]}`} />
              {topic.name}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="font-mono">
              Mastery {mastery ? `${mastery.score}%` : "—"}
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Metric
            label="Streak"
            value={String(streak)}
            icon={Flame}
            tone={streak >= 3 ? "text-amber-300" : "text-muted-foreground"}
          />
          <Metric
            label="Mastery"
            value={mastery ? `${mastery.score}%` : "—"}
            icon={Target}
            tone={mastery ? (mastery.score >= 80 ? "text-emerald-300" : mastery.score >= 50 ? "text-amber-300" : "text-rose-300") : "text-muted-foreground"}
          />
          <Metric
            label="Recent"
            value={mastery ? `${mastery.correctCount}/${mastery.attemptCount}` : "0/0"}
            icon={Sparkles}
            tone="text-violet-300"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50, rotateY: 12 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -50, rotateY: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
            className="mt-4"
          >
            <TiltCard
              intensity={3}
              scale={1}
              glare={false}
              className="rounded-2xl"
            >
              <div className="rounded-2xl p-6 sm:p-8 glass-strong border border-border/40">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xl font-mono ${accentText[topic.accent]}`}>
                    {topic.icon}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {topic.name} · practice
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold leading-snug">
                  {currentQuestion.prompt}
                </h2>
                <div className="mt-5 space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selected === opt.id;
                    const isCorrectAnswer = opt.id === currentQuestion.correctOptionId;
                    const showCorrect = feedback && isCorrectAnswer;
                    const showWrong = feedback && isSelected && !isCorrectAnswer;
                    return (
                      <motion.button
                        key={opt.id}
                        whileHover={feedback ? undefined : { x: 4 }}
                        whileTap={feedback ? undefined : { scale: 0.99 }}
                        onClick={() => !feedback && submitAnswer(opt.id)}
                        disabled={Boolean(feedback)}
                        className={`w-full text-left rounded-xl px-4 py-3.5 border transition-colors flex items-start gap-3 ${
                          showCorrect
                            ? "bg-emerald-500/15 border-emerald-400/50 ring-1 ring-emerald-400/40"
                            : showWrong
                              ? "bg-rose-500/15 border-rose-400/50 ring-1 ring-rose-400/40"
                              : isSelected
                                ? "bg-fuchsia-500/15 border-fuchsia-400/40"
                                : "bg-muted/30 border-border/40 hover:border-border/70"
                        }`}
                      >
                        <div
                          className={`h-6 w-6 rounded-md flex items-center justify-center text-xs font-mono font-semibold shrink-0 ${
                            showCorrect
                              ? "bg-emerald-400 text-emerald-950"
                              : showWrong
                                ? "bg-rose-400 text-rose-950"
                                : isSelected
                                  ? "bg-fuchsia-500 text-white"
                                  : "bg-muted/60 text-muted-foreground"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-sm leading-snug flex-1">{opt.text}</span>
                        {showCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                        ) : null}
                        {showWrong ? (
                          <XCircle className="h-4 w-4 text-rose-300 shrink-0" />
                        ) : null}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {feedback ? (
            <motion.div
              initial={{ opacity: 0, y: 18, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              style={{ transformStyle: "preserve-3d" }}
              className={`mt-4 rounded-2xl p-5 border ${
                feedback.correct
                  ? "bg-emerald-500/10 border-emerald-400/30"
                  : "bg-rose-500/10 border-rose-400/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    feedback.correct
                      ? "bg-emerald-500/20 ring-1 ring-emerald-400/40"
                      : "bg-rose-500/20 ring-1 ring-rose-400/40"
                  }`}
                >
                  {feedback.correct ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">
                    {feedback.correct ? "Nice - that's correct." : "Not quite - let's lock this in."}
                  </p>
                  <div className="mt-2 flex items-start gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-300 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feedback.explanation}
                    </p>
                  </div>
                  {streak >= 3 ? (
                    <p className="mt-2 text-[11px] text-amber-300 flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {streak}-answer streak - keep going!
                    </p>
                  ) : null}
                </div>
                <Button
                  onClick={nextQuestion}
                  size="sm"
                  className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white border-0"
                >
                  Next question
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Practice session: {attempts.filter((a) => a.topicId === practiceTopicId).length} answered</span>
          <button
            onClick={() => go("study-path")}
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            See updated path
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Flame;
  tone: string;
}) {
  return (
    <div className="rounded-xl p-3 glass border border-border/30 text-center">
      <Icon className={`h-3.5 w-3.5 mx-auto ${tone}`} />
      <p className={`mt-1 text-lg font-mono font-bold ${tone}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
