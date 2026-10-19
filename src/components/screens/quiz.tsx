"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ListChecks,
  Loader2,
  RefreshCw,
  Send,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { TOPICS, TOPIC_MAP, diagnosticQuestionsForTopics } from "@/lib/questionBank";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AuroraBg } from "@/components/aurora-bg";
import type { QuizAnswer, TopicId } from "@/lib/types";

type Phase = "configure" | "running" | "submitting";

export function QuizScreen() {
  const quizTopicIds = useAppStore((s) => s.quizTopicIds);
  const setQuizTopics = useAppStore((s) => s.setQuizTopics);
  const recordQuizAnswer = useAppStore((s) => s.recordQuizAnswer);
  const quizAnswers = useAppStore((s) => s.quizAnswers);
  const submitQuiz = useAppStore((s) => s.submitQuiz);
  const resetQuiz = useAppStore((s) => s.resetQuiz);
  const quizComplete = useAppStore((s) => s.quizComplete);

  const [phase, setPhase] = useState<Phase>("configure");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const questions = useMemo(() => diagnosticQuestionsForTopics(quizTopicIds), [quizTopicIds]);
  const total = questions.length;
  const answeredCount = quizAnswers.length;
  const progressPct = total === 0 ? 0 : Math.round((answeredCount / total) * 100);

  function toggleTopic(id: TopicId) {
    const next = quizTopicIds.includes(id)
      ? quizTopicIds.filter((x) => x !== id)
      : [...quizTopicIds, id];
    setQuizTopics(next);
  }

  function begin() {
    if (quizTopicIds.length === 0) return;
    setPhase("running");
    setCurrentIdx(0);
  }

  function selectOption(questionId: string, topicId: TopicId, optionId: string) {
    const answer: QuizAnswer = { questionId, topicId, selectedOptionId: optionId };
    recordQuizAnswer(answer);
  }

  function nextQ() {
    if (currentIdx < total - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowSubmitConfirm(true);
    }
  }
  function prevQ() {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  }

  function confirmSubmit() {
    setShowSubmitConfirm(false);
    setPhase("submitting");
    setTimeout(() => {
      submitQuiz();
    }, 1100);
  }

  if (phase === "configure") {
    return (
      <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AuroraBg variant="calm" />
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <ListChecks className="h-3.5 w-3.5" />
            Configure your diagnostic quiz
          </motion.div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
            Diagnostic Quiz
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Select the topics to be quizzed on. All six are pre-selected. You can
            deselect any, but at least one must remain. Each topic gets three
            multiple-choice questions.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {TOPICS.map((t, i) => {
              const active = quizTopicIds.includes(t.id);
              return (
                <motion.button
                  key={t.id}
                  initial={{ opacity: 0, y: 18, rotateX: -8 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3, rotateY: 4 }}
                  style={{ transformStyle: "preserve-3d" }}
                  onClick={() => toggleTopic(t.id)}
                  className={`relative text-left rounded-2xl p-5 border transition-colors ${
                    active
                      ? "border-fuchsia-400/40 glass-strong"
                      : "border-border/30 glass opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center font-mono text-lg ${
                        active
                          ? "bg-gradient-to-br from-fuchsia-500/30 to-violet-700/10 ring-1 ring-fuchsia-400/30 text-fuchsia-200"
                          : "bg-muted/40 ring-1 ring-border/40"
                      }`}
                    >
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {t.blurb}
                      </p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        3 questions - ~90s
                      </p>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        active
                          ? "bg-emerald-400 border-emerald-400"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {active ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-950" />
                      ) : null}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl glass border border-border/30">
            <div>
              <p className="text-sm font-medium">
                {quizTopicIds.length} topic{quizTopicIds.length === 1 ? "" : "s"} - {quizTopicIds.length * 3} questions
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Estimated time: ~{Math.max(2, quizTopicIds.length * 2)} minutes
              </p>
            </div>
            <Button
              onClick={begin}
              disabled={quizTopicIds.length === 0}
              className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white shadow-lg shadow-fuchsia-500/30 border-0"
            >
              Begin quiz
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {quizComplete ? (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                You've already submitted a diagnostic. Retaking will overwrite
                your previous scores.
              </p>
              <Button
                onClick={() => {
                  resetQuiz();
                  setPhase("configure");
                }}
                variant="ghost"
                size="sm"
                className="ml-auto text-amber-100 hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (phase === "submitting") {
    return (
      <div className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <AuroraBg variant="vivid" />
        <div className="mx-auto max-w-md text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
            className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-fuchsia-500/30 to-emerald-500/20 ring-1 ring-fuchsia-400/40 flex items-center justify-center animate-pulse-glow"
          >
            <Loader2 className="h-10 w-10 animate-spin text-fuchsia-200" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 text-2xl font-semibold"
          >
            Scoring your answers...
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            Calculating per-topic scores and classifying mastery bands.
          </motion.p>
          <div className="mt-6 space-y-2">
            {["Scoring answers", "Classifying bands", "Saving results"].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.18 }}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {step}...
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const current = questions[currentIdx];
  if (!current) {
    return (
      <div className="px-4 sm:px-6 py-16 text-center">
        <p>No questions available.</p>
      </div>
    );
  }
  const topic = TOPIC_MAP[current.topicId];
  const selected = quizAnswers.find((a) => a.questionId === current.id)?.selectedOptionId;
  const answered = Boolean(selected);

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <AuroraBg variant="calm" />
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Question {currentIdx + 1} of {total}
          </span>
          <span className="font-mono">{progressPct}% done</span>
        </div>
        <Progress value={progressPct} className="mt-2 h-1.5" />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {questions.map((q, i) => {
            const isCurrent = i === currentIdx;
            const isAnswered = quizAnswers.some((a) => a.questionId === q.id);
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={`h-8 w-8 rounded-lg text-[11px] font-mono font-medium border transition-colors ${
                  isCurrent
                    ? "bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-100"
                    : isAnswered
                      ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-200"
                      : "bg-muted/30 border-border/40 text-muted-foreground hover:text-foreground"
                }`}
                aria-label={`Jump to question ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-2xl font-mono">{topic.icon}</span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Topic
            </p>
            <p className="text-sm font-semibold">{topic.name}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 60, rotateY: 12 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -60, rotateY: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
            className="mt-3 glass-strong rounded-2xl p-6 sm:p-8 border border-border/40"
          >
            <h2 className="text-lg sm:text-xl font-semibold leading-snug">
              {current.prompt}
            </h2>
            <div className="mt-5 space-y-2.5">
              {current.options.map((opt, idx) => {
                const isSelected = selected === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => selectOption(current.id, current.topicId, opt.id)}
                    className={`w-full text-left rounded-xl px-4 py-3.5 border transition-colors flex items-start gap-3 ${
                      isSelected
                        ? "bg-fuchsia-500/15 border-fuchsia-400/40 ring-1 ring-fuchsia-400/30"
                        : "bg-muted/30 border-border/40 hover:border-border/70"
                    }`}
                  >
                    <div
                      className={`h-6 w-6 rounded-md flex items-center justify-center text-xs font-mono font-semibold shrink-0 ${
                        isSelected
                          ? "bg-fuchsia-500 text-white"
                          : "bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm leading-snug">{opt.text}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button
            onClick={prevQ}
            disabled={currentIdx === 0}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="text-xs text-muted-foreground">
            {answered ? (
              <span className="flex items-center gap-1 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Answer saved
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-300">
                <XCircle className="h-3.5 w-3.5" />
                Not answered yet
              </span>
            )}
          </div>
          <Button
            onClick={nextQ}
            disabled={!answered}
            className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white border-0"
            size="sm"
          >
            {currentIdx === total - 1 ? (
              <>
                Review
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showSubmitConfirm ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSubmitConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              style={{ transformStyle: "preserve-3d" }}
              className="glass-strong rounded-2xl p-6 max-w-md w-full border border-border/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-fuchsia-300" />
                <h3 className="text-lg font-semibold">Submit the diagnostic?</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                You answered <strong className="text-foreground">{answeredCount}</strong> of{" "}
                <strong className="text-foreground">{total}</strong> questions.
                {answeredCount < total ? " Unanswered questions count as zero - better to leave none blank." : " All done - let's score it."}
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowSubmitConfirm(false)}>
                  Keep editing
                </Button>
                <Button
                  onClick={confirmSubmit}
                  size="sm"
                  className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white border-0"
                >
                  Submit &amp; score
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
