"use client";

import { motion } from "framer-motion";
import {
  BookX,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Lightbulb,
  MinusCircle,
  PlayCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { QUESTION_MAP, TOPIC_MAP } from "@/lib/questionBank";
import { AuroraBg } from "@/components/aurora-bg";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/difficulty-badge";
import type { Question, TopicId } from "@/lib/types";

type Tab = "diagnostic" | "mistakes";
type DiagFilter = "all" | "wrong";
type MistakeFilter = "open" | "fixed" | "all";

interface DiagnosticRow {
  question: Question;
  selectedOptionId: string | null;
  correct: boolean;
}

interface MistakeRow {
  question: Question;
  timesWrong: number;
  lastWrongAt: number;
  lastSelectedOptionId?: string;
  fixed: boolean;
}

export function ReviewScreen() {
  const quizComplete = useAppStore((s) => s.quizComplete);
  const quizQuestionIds = useAppStore((s) => s.quizQuestionIds);
  const quizAnswers = useAppStore((s) => s.quizAnswers);
  const attempts = useAppStore((s) => s.attempts);
  const startPractice = useAppStore((s) => s.startPractice);
  const go = useAppStore((s) => s.go);

  const [tab, setTab] = useState<Tab>("diagnostic");
  const [diagFilter, setDiagFilter] = useState<DiagFilter>("all");
  const [mistakeFilter, setMistakeFilter] = useState<MistakeFilter>("open");

  // Every question from the last submitted diagnostic, with the student's pick.
  const diagnosticRows = useMemo<DiagnosticRow[]>(() => {
    if (!quizComplete) return [];
    const ids = quizQuestionIds.length > 0 ? quizQuestionIds : quizAnswers.map((a) => a.questionId);
    return ids
      .map((id) => QUESTION_MAP[id])
      .filter(Boolean)
      .map((question) => {
        const ans = quizAnswers.find((a) => a.questionId === question.id);
        const selectedOptionId = ans?.selectedOptionId ?? null;
        return { question, selectedOptionId, correct: selectedOptionId === question.correctOptionId };
      });
  }, [quizComplete, quizQuestionIds, quizAnswers]);

  // Practice questions answered wrong at least once. "Fixed" = the most
  // recent attempt at that question was correct.
  const mistakeRows = useMemo<MistakeRow[]>(() => {
    const byQuestion = new Map<string, MistakeRow>();
    for (const a of attempts) {
      const question = QUESTION_MAP[a.questionId];
      if (!question) continue;
      const row = byQuestion.get(a.questionId);
      if (!a.correct) {
        byQuestion.set(a.questionId, {
          question,
          timesWrong: (row?.timesWrong ?? 0) + 1,
          lastWrongAt: a.timestamp,
          lastSelectedOptionId: a.selectedOptionId,
          fixed: false,
        });
      } else if (row) {
        byQuestion.set(a.questionId, { ...row, fixed: true });
      }
    }
    return Array.from(byQuestion.values()).sort((x, y) => y.lastWrongAt - x.lastWrongAt);
  }, [attempts]);

  const diagCorrect = diagnosticRows.filter((r) => r.correct).length;
  const shownDiag = diagFilter === "wrong" ? diagnosticRows.filter((r) => !r.correct) : diagnosticRows;
  const openCount = mistakeRows.filter((m) => !m.fixed).length;
  const fixedCount = mistakeRows.length - openCount;
  const shownMistakes = mistakeRows.filter((m) =>
    mistakeFilter === "all" ? true : mistakeFilter === "open" ? !m.fixed : m.fixed,
  );

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <AuroraBg variant="calm" />
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
            <ClipboardCheck className="h-3.5 w-3.5" />
            Learn from every answer
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">Answer review</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            See every diagnostic question with the right answer and why, and keep a
            notebook of the practice questions you missed until you get them right.
          </p>
        </motion.div>

        <div
          role="tablist"
          aria-label="Review sections"
          className="mt-6 inline-grid grid-cols-2 gap-1 p-1 rounded-xl bg-muted/40 border border-border/30"
        >
          {(
            [
              ["diagnostic", `Diagnostic review${quizComplete ? ` (${diagCorrect}/${diagnosticRows.length})` : ""}`],
              ["mistakes", `Mistake notebook (${openCount})`],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                tab === id
                  ? "bg-gradient-to-r from-fuchsia-500/25 to-violet-500/25 border border-fuchsia-400/30 text-foreground"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "diagnostic" ? (
          !quizComplete ? (
            <EmptyState
              icon={Compass}
              title="No diagnostic to review yet"
              text="Take the diagnostic quiz and every question will show up here with the correct answer and an explanation."
              action={
                <Button
                  onClick={() => go("quiz")}
                  className="bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white border-0"
                >
                  <Compass className="h-4 w-4 mr-1" />
                  Take the quiz
                </Button>
              }
            />
          ) : (
            <>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  You got <strong className="text-foreground">{diagCorrect}</strong> of{" "}
                  <strong className="text-foreground">{diagnosticRows.length}</strong> right on your last diagnostic.
                </p>
                <FilterGroup
                  label="Filter diagnostic questions"
                  value={diagFilter}
                  onChange={(v) => setDiagFilter(v as DiagFilter)}
                  options={[
                    ["all", `All (${diagnosticRows.length})`],
                    ["wrong", `Wrong only (${diagnosticRows.length - diagCorrect})`],
                  ]}
                />
              </div>
              <div className="mt-4 space-y-3">
                {shownDiag.length === 0 ? (
                  <p className="text-sm text-emerald-300 p-4 rounded-xl glass border border-emerald-400/30">
                    No wrong answers - nice work.
                  </p>
                ) : (
                  shownDiag.map((row, i) => (
                    <QuestionCard
                      key={row.question.id}
                      index={i}
                      question={row.question}
                      selectedOptionId={row.selectedOptionId}
                      status={row.selectedOptionId === null ? "skipped" : row.correct ? "correct" : "wrong"}
                      actions={
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass border-border/50"
                          onClick={() => startPractice(row.question.topicId)}
                        >
                          <PlayCircle className="h-3.5 w-3.5 mr-1" />
                          Practice {TOPIC_MAP[row.question.topicId].name}
                        </Button>
                      }
                    />
                  ))
                )}
              </div>
            </>
          )
        ) : mistakeRows.length === 0 ? (
          <EmptyState
            icon={BookX}
            title="Your mistake notebook is empty"
            text="Any practice question you answer wrong is saved here so you can come back and retry it."
            action={
              <Button
                onClick={() => go("practice")}
                className="bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white border-0"
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                Start practicing
              </Button>
            }
          />
        ) : (
          <>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{openCount}</strong> still to fix ·{" "}
                <strong className="text-foreground">{fixedCount}</strong> fixed by a later correct answer.
              </p>
              <FilterGroup
                label="Filter mistakes"
                value={mistakeFilter}
                onChange={(v) => setMistakeFilter(v as MistakeFilter)}
                options={[
                  ["open", `To fix (${openCount})`],
                  ["fixed", `Fixed (${fixedCount})`],
                  ["all", `All (${mistakeRows.length})`],
                ]}
              />
            </div>
            <div className="mt-4 space-y-3">
              {shownMistakes.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 rounded-xl glass border border-border/30">
                  Nothing in this filter.
                </p>
              ) : (
                shownMistakes.map((m, i) => (
                  <QuestionCard
                    key={m.question.id}
                    index={i}
                    question={m.question}
                    selectedOptionId={m.lastSelectedOptionId ?? null}
                    status={m.fixed ? "fixed" : "wrong"}
                    meta={`Missed ${m.timesWrong}× · last on ${formatWhen(m.lastWrongAt)}`}
                    actions={
                      <Button
                        size="sm"
                        onClick={() => startPractice(m.question.topicId, m.question.id)}
                        className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white border-0"
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Retry this question
                      </Button>
                    }
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type Status = "correct" | "wrong" | "skipped" | "fixed";

const STATUS_STYLE: Record<Status, { label: string; tone: string; icon: typeof CheckCircle2 }> = {
  correct: { label: "Correct", tone: "text-emerald-300 bg-emerald-500/10 ring-emerald-400/30", icon: CheckCircle2 },
  wrong: { label: "Wrong", tone: "text-rose-300 bg-rose-500/10 ring-rose-400/30", icon: XCircle },
  skipped: { label: "Not answered", tone: "text-amber-300 bg-amber-500/10 ring-amber-400/30", icon: MinusCircle },
  fixed: { label: "Fixed", tone: "text-emerald-300 bg-emerald-500/10 ring-emerald-400/30", icon: CheckCircle2 },
};

function QuestionCard({
  index,
  question,
  selectedOptionId,
  status,
  meta,
  actions,
}: {
  index: number;
  question: Question;
  selectedOptionId: string | null;
  status: Status;
  meta?: string;
  actions?: React.ReactNode;
}) {
  const topic = TOPIC_MAP[question.topicId as TopicId];
  const st = STATUS_STYLE[status];
  const Icon = st.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="rounded-2xl p-5 glass border border-border/30"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 ring-1 font-medium ${st.tone}`}>
          <Icon className="h-3 w-3" aria-hidden="true" />
          {st.label}
        </span>
        <span className="text-muted-foreground">
          {topic.icon} {topic.name}
        </span>
        <DifficultyBadge level={question.difficulty} />
        {meta ? <span className="text-muted-foreground ml-auto">{meta}</span> : null}
      </div>
      <h3 className="mt-3 text-sm sm:text-base font-semibold leading-snug">{question.prompt}</h3>
      <ul className="mt-3 space-y-1.5">
        {question.options.map((opt, idx) => {
          const isCorrect = opt.id === question.correctOptionId;
          const isPicked = opt.id === selectedOptionId;
          return (
            <li
              key={opt.id}
              className={`flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm border ${
                isCorrect
                  ? "bg-emerald-500/10 border-emerald-400/40"
                  : isPicked
                    ? "bg-rose-500/10 border-rose-400/40"
                    : "bg-muted/20 border-border/30 text-muted-foreground"
              }`}
            >
              <span className="font-mono text-xs mt-0.5 w-4 shrink-0">{String.fromCharCode(65 + idx)}</span>
              <span className="flex-1">{opt.text}</span>
              {isCorrect ? <span className="text-[11px] font-medium text-emerald-300 shrink-0">Correct answer</span> : null}
              {isPicked && !isCorrect ? (
                <span className="text-[11px] font-medium text-rose-300 shrink-0">Your answer</span>
              ) : null}
              {isPicked && isCorrect ? (
                <span className="sr-only">(your answer)</span>
              ) : null}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-start gap-1.5">
        <Lightbulb className="h-3.5 w-3.5 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-muted-foreground leading-relaxed">{question.explanation}</p>
      </div>
      {actions ? <div className="mt-4 flex justify-end">{actions}</div> : null}
    </motion.article>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div role="group" aria-label={label} className="flex gap-1 p-1 rounded-lg bg-muted/30 border border-border/30">
      {options.map(([id, text]) => (
        <button
          key={id}
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
            value === id ? "bg-fuchsia-500/20 text-fuchsia-100" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: typeof Compass;
  title: string;
  text: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mt-8 rounded-2xl p-8 glass border border-border/30 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/25 to-violet-700/10 ring-1 ring-fuchsia-400/30 flex items-center justify-center">
        <Icon className="h-6 w-6 text-fuchsia-200" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto">{text}</p>
      <div className="mt-5 flex justify-center">{action}</div>
    </div>
  );
}

function formatWhen(ts: number) {
  return new Date(ts).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
