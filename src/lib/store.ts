"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TOPICS, buildDiagnostic } from "./questionBank";
import { classify, masteryFromQuiz, recomputeMasteryWithAttempts, scoreQuiz } from "./studyEngine";
import type { ProgressSnapshot } from "./cloudSync";
import type { HistoryEntry, MasteryScore, PracticeAttempt, QuizAnswer, QuizResult, Screen, TopicId, User } from "./types";

export type SyncStatus = "local" | "loading" | "saving" | "saved" | "offline";

interface AppState {
  user: User | null;
  syncStatus: SyncStatus;
  screen: Screen;
  quizTopicIds: TopicId[];
  quizQuestionIds: string[];
  quizAnswers: QuizAnswer[];
  quizComplete: boolean;
  quizResults: QuizResult[];
  masteryByTopic: Map<TopicId, MasteryScore>;
  attempts: PracticeAttempt[];
  practiceTopicId: TopicId | null;
  /** A specific question to open in practice (Retry from the mistake notebook). */
  practiceQuestionId: string | null;
  practicedQuestionIds: string[];
  history: HistoryEntry[];

  login: (user: User) => void;
  setSyncStatus: (status: SyncStatus) => void;
  applyProgress: (p: ProgressSnapshot) => void;
  logout: () => void;
  go: (screen: Screen) => void;
  setQuizTopics: (ids: TopicId[]) => void;
  startQuiz: () => void;
  recordQuizAnswer: (q: QuizAnswer) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  startPractice: (topicId: TopicId, questionId?: string) => void;
  recordAttempt: (attempt: PracticeAttempt) => void;
  exitPractice: () => void;
}

const EMPTY_PROGRESS = {
  quizTopicIds: TOPICS.map((t) => t.id),
  quizQuestionIds: [] as string[],
  quizAnswers: [] as QuizAnswer[],
  quizComplete: false,
  quizResults: [] as QuizResult[],
  masteryByTopic: new Map<TopicId, MasteryScore>(),
  attempts: [] as PracticeAttempt[],
  practiceTopicId: null as TopicId | null,
  practiceQuestionId: null as string | null,
  practicedQuestionIds: [] as string[],
  history: [] as HistoryEntry[],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      syncStatus: "local",
      screen: "landing",
      quizTopicIds: TOPICS.map((t) => t.id),
      quizQuestionIds: [],
      quizAnswers: [],
      quizComplete: false,
      quizResults: [],
      masteryByTopic: new Map<TopicId, MasteryScore>(),
      attempts: [],
      practiceTopicId: null,
      practiceQuestionId: null,
      practicedQuestionIds: [],
      history: [],

      login: (user) =>
        set((s) => {
          // A different account signing in on this browser must not inherit
          // the previous account's local progress.
          if (s.user && s.user.uid !== user.uid) {
            return { ...EMPTY_PROGRESS, user, screen: "dashboard" as Screen };
          }
          return { user, screen: "dashboard" as Screen };
        }),

      setSyncStatus: (syncStatus) => set({ syncStatus }),

      applyProgress: (p) =>
        set({
          quizTopicIds: p.quizTopicIds?.length ? p.quizTopicIds : TOPICS.map((t) => t.id),
          quizQuestionIds: p.quizQuestionIds ?? [],
          quizAnswers: p.quizAnswers ?? [],
          quizComplete: Boolean(p.quizComplete),
          quizResults: p.quizResults ?? [],
          masteryByTopic: new Map<TopicId, MasteryScore>((p.mastery ?? []).map((m) => [m.topicId, m])),
          attempts: p.attempts ?? [],
          practicedQuestionIds: p.practicedQuestionIds ?? [],
          history: p.history ?? [],
        }),

      logout: () => set({ ...EMPTY_PROGRESS, user: null, screen: "landing", syncStatus: "local" }),

      go: (screen) => set({ screen }),

      setQuizTopics: (ids) =>
        set({
          quizTopicIds: ids.length === 0 ? TOPICS.map((t) => t.id) : ids,
        }),

      // Draw a new random question set and start a fresh attempt.
      startQuiz: () =>
        set((s) => ({
          quizQuestionIds: buildDiagnostic(s.quizTopicIds).map((q) => q.id),
          quizAnswers: [],
        })),

      recordQuizAnswer: (q) =>
        set((s) => {
          const others = s.quizAnswers.filter((a) => a.questionId !== q.questionId);
          return { quizAnswers: [...others, q] };
        }),

      submitQuiz: () => {
        set((s) => {
          const results = scoreQuiz(s.quizAnswers, s.quizQuestionIds);
          const mastery = masteryFromQuiz(results);
          const nextMastery = new Map<TopicId, MasteryScore>(s.masteryByTopic);
          for (const m of mastery) nextMastery.set(m.topicId, m);
          return {
            quizResults: results,
            quizComplete: true,
            masteryByTopic: nextMastery,
            history: appendHistory(
              s.history,
              { kind: "diagnostic", questions: s.quizQuestionIds.length || s.quizAnswers.length },
              nextMastery,
            ),
            screen: "study-path" as Screen,
          };
        });
      },

      resetQuiz: () =>
        set({
          quizQuestionIds: [],
          quizAnswers: [],
          quizComplete: false,
          quizResults: [],
          masteryByTopic: new Map<TopicId, MasteryScore>(),
          quizTopicIds: TOPICS.map((t) => t.id),
        }),

      startPractice: (topicId, questionId) =>
        set({ practiceTopicId: topicId, practiceQuestionId: questionId ?? null, screen: "practice" }),

      recordAttempt: (attempt) =>
        set((s) => {
          const nextAttempts = [...s.attempts, attempt];
          const nextMastery = new Map<TopicId, MasteryScore>(s.masteryByTopic);
          const updated = recomputeMasteryWithAttempts(attempt.topicId, nextAttempts);
          nextMastery.set(attempt.topicId, updated);
          return {
            attempts: nextAttempts,
            masteryByTopic: nextMastery,
            history: appendHistory(
              s.history,
              { kind: "practice", topicId: attempt.topicId, correct: attempt.correct },
              nextMastery,
            ),
            practicedQuestionIds: [...s.practicedQuestionIds, attempt.questionId],
          };
        }),

      exitPractice: () => set({ practiceTopicId: null, practiceQuestionId: null, screen: "study-path" }),
    }),
    {
      name: "aspe-store-v6",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      partialize: (s) => ({
        user: s.user,
        quizTopicIds: s.quizTopicIds,
        quizQuestionIds: s.quizQuestionIds,
        quizAnswers: s.quizAnswers,
        quizComplete: s.quizComplete,
        quizResults: s.quizResults,
        masteryByTopic: Array.from(s.masteryByTopic.entries()),
        attempts: s.attempts,
        practicedQuestionIds: s.practicedQuestionIds,
        history: s.history,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState> & {
          masteryByTopic?: [TopicId, MasteryScore][];
        };
        return {
          ...current,
          ...p,
          masteryByTopic: p.masteryByTopic
            ? new Map<TopicId, MasteryScore>(p.masteryByTopic)
            : current.masteryByTopic,
          // Signed-in users land on the dashboard after a reload.
          screen: p.user ? "dashboard" : "landing",
        } as AppState;
      },
      skipHydration: true,
    },
  ),
);

if (typeof window !== "undefined") {
  const api = (useAppStore as unknown as { persist?: { rehydrate: () => Promise<unknown> } }).persist;
  if (api && typeof api.rehydrate === "function") {
    api.rehydrate();
  }
}

export { classify };

/** The part of the state that is saved to Cloud Firestore. */
export function progressSnapshot(s: AppState): ProgressSnapshot {
  return {
    quizTopicIds: s.quizTopicIds,
    quizQuestionIds: s.quizQuestionIds,
    quizAnswers: s.quizAnswers,
    quizComplete: s.quizComplete,
    quizResults: s.quizResults,
    mastery: Array.from(s.masteryByTopic.values()),
    attempts: s.attempts,
    practicedQuestionIds: s.practicedQuestionIds,
    history: s.history,
  };
}

const HISTORY_LIMIT = 1000;

function appendHistory(
  history: HistoryEntry[],
  event: Pick<HistoryEntry, "kind" | "topicId" | "correct" | "questions">,
  mastery: Map<TopicId, MasteryScore>,
): HistoryEntry[] {
  const scores = Array.from(mastery.values());
  const entry: HistoryEntry = {
    ...event,
    timestamp: Date.now(),
    average: scores.length === 0 ? 0 : Math.round(scores.reduce((sum, m) => sum + m.score, 0) / scores.length),
    mastery: Object.fromEntries(scores.map((m) => [m.topicId, m.score])),
  };
  return [...history, entry].slice(-HISTORY_LIMIT);
}
