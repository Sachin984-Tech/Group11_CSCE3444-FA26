"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TOPICS } from "./questionBank";
import { classify, masteryFromQuiz, recomputeMasteryWithAttempts, scoreQuiz } from "./studyEngine";
import type { ProgressSnapshot } from "./cloudSync";
import type { MasteryScore, PracticeAttempt, QuizAnswer, QuizResult, Screen, TopicId, User } from "./types";

export type SyncStatus = "local" | "loading" | "saving" | "saved" | "offline";

interface AppState {
  user: User | null;
  syncStatus: SyncStatus;
  screen: Screen;
  quizTopicIds: TopicId[];
  quizAnswers: QuizAnswer[];
  quizComplete: boolean;
  quizResults: QuizResult[];
  masteryByTopic: Map<TopicId, MasteryScore>;
  attempts: PracticeAttempt[];
  practiceTopicId: TopicId | null;
  practicedQuestionIds: string[];

  login: (user: User) => void;
  setSyncStatus: (status: SyncStatus) => void;
  applyProgress: (p: ProgressSnapshot) => void;
  logout: () => void;
  go: (screen: Screen) => void;
  setQuizTopics: (ids: TopicId[]) => void;
  recordQuizAnswer: (q: QuizAnswer) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  startPractice: (topicId: TopicId) => void;
  recordAttempt: (attempt: PracticeAttempt) => void;
  exitPractice: () => void;
}

const EMPTY_PROGRESS = {
  quizTopicIds: TOPICS.map((t) => t.id),
  quizAnswers: [] as QuizAnswer[],
  quizComplete: false,
  quizResults: [] as QuizResult[],
  masteryByTopic: new Map<TopicId, MasteryScore>(),
  attempts: [] as PracticeAttempt[],
  practiceTopicId: null as TopicId | null,
  practicedQuestionIds: [] as string[],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      syncStatus: "local",
      screen: "landing",
      quizTopicIds: TOPICS.map((t) => t.id),
      quizAnswers: [],
      quizComplete: false,
      quizResults: [],
      masteryByTopic: new Map<TopicId, MasteryScore>(),
      attempts: [],
      practiceTopicId: null,
      practicedQuestionIds: [],

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
          quizAnswers: p.quizAnswers ?? [],
          quizComplete: Boolean(p.quizComplete),
          quizResults: p.quizResults ?? [],
          masteryByTopic: new Map<TopicId, MasteryScore>((p.mastery ?? []).map((m) => [m.topicId, m])),
          attempts: p.attempts ?? [],
          practicedQuestionIds: p.practicedQuestionIds ?? [],
        }),

      logout: () => set({ ...EMPTY_PROGRESS, user: null, screen: "landing", syncStatus: "local" }),

      go: (screen) => set({ screen }),

      setQuizTopics: (ids) =>
        set({
          quizTopicIds: ids.length === 0 ? TOPICS.map((t) => t.id) : ids,
        }),

      recordQuizAnswer: (q) =>
        set((s) => {
          const others = s.quizAnswers.filter((a) => a.questionId !== q.questionId);
          return { quizAnswers: [...others, q] };
        }),

      submitQuiz: () => {
        set((s) => {
          const results = scoreQuiz(s.quizAnswers);
          const mastery = masteryFromQuiz(results);
          const nextMastery = new Map<TopicId, MasteryScore>(s.masteryByTopic);
          for (const m of mastery) nextMastery.set(m.topicId, m);
          return {
            quizResults: results,
            quizComplete: true,
            masteryByTopic: nextMastery,
            screen: "study-path" as Screen,
          };
        });
      },

      resetQuiz: () =>
        set({
          quizAnswers: [],
          quizComplete: false,
          quizResults: [],
          masteryByTopic: new Map<TopicId, MasteryScore>(),
          quizTopicIds: TOPICS.map((t) => t.id),
        }),

      startPractice: (topicId) =>
        set({ practiceTopicId: topicId, screen: "practice" }),

      recordAttempt: (attempt) =>
        set((s) => {
          const nextAttempts = [...s.attempts, attempt];
          const nextMastery = new Map<TopicId, MasteryScore>(s.masteryByTopic);
          const updated = recomputeMasteryWithAttempts(attempt.topicId, nextAttempts);
          nextMastery.set(attempt.topicId, updated);
          return {
            attempts: nextAttempts,
            masteryByTopic: nextMastery,
            practicedQuestionIds: [...s.practicedQuestionIds, attempt.questionId],
          };
        }),

      exitPractice: () => set({ practiceTopicId: null, screen: "study-path" }),
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
        quizAnswers: s.quizAnswers,
        quizComplete: s.quizComplete,
        quizResults: s.quizResults,
        masteryByTopic: Array.from(s.masteryByTopic.entries()),
        attempts: s.attempts,
        practicedQuestionIds: s.practicedQuestionIds,
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
    quizAnswers: s.quizAnswers,
    quizComplete: s.quizComplete,
    quizResults: s.quizResults,
    mastery: Array.from(s.masteryByTopic.values()),
    attempts: s.attempts,
    practicedQuestionIds: s.practicedQuestionIds,
  };
}
