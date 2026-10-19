"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TOPICS } from "./questionBank";
import { classify, masteryFromQuiz, scoreQuiz } from "./studyEngine";
import type { MasteryScore, QuizAnswer, QuizResult, Screen, TopicId, User } from "./types";

interface AppState {
  user: User | null;
  screen: Screen;
  quizTopicIds: TopicId[];
  quizAnswers: QuizAnswer[];
  quizComplete: boolean;
  quizResults: QuizResult[];
  masteryByTopic: Map<TopicId, MasteryScore>;

  login: (email: string, displayName: string) => void;
  logout: () => void;
  go: (screen: Screen) => void;
  setQuizTopics: (ids: TopicId[]) => void;
  recordQuizAnswer: (q: QuizAnswer) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      screen: "landing",
      quizTopicIds: TOPICS.map((t) => t.id),
      quizAnswers: [],
      quizComplete: false,
      quizResults: [],
      masteryByTopic: new Map<TopicId, MasteryScore>(),

      login: (email, displayName) =>
        set({ user: { email, displayName, createdAt: Date.now() }, screen: "dashboard" }),

      logout: () =>
        set({
          user: null,
          screen: "landing",
          quizAnswers: [],
          quizComplete: false,
          quizResults: [],
          masteryByTopic: new Map<TopicId, MasteryScore>(),
        }),

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
    }),
    {
      name: "aspe-store-v3",
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
          screen: "landing",
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
