"use client";

import { useEffect } from "react";
import { loadProgress, saveProgress } from "@/lib/cloudSync";
import { progressSnapshot, useAppStore } from "@/lib/store";

const SAVE_DEBOUNCE_MS = 800;
const SAVE_TIMEOUT_MS = 8000;

/**
 * Keeps the signed-in student's progress in Cloud Firestore.
 *  1. On sign-in: load users/{uid}. If the cloud has progress it wins
 *     (so a second device picks up where the first left off); otherwise the
 *     local progress is uploaded.
 *  2. After that: every change to progress is saved (debounced 800 ms,
 *     inside the 2-second NFR-R2 target).
 */
export function useCloudSync() {
  const uid = useAppStore((s) => (s.user?.provider === "firebase" ? s.user.uid : null));

  useEffect(() => {
    if (!uid) return;
    const store = useAppStore;
    let cancelled = false;
    let ready = false;
    let lastSaved = "";
    let timer: ReturnType<typeof setTimeout> | null = null;

    const save = async () => {
      const state = store.getState();
      if (!state.user || state.user.uid !== uid) return;
      const snap = progressSnapshot(state);
      const key = JSON.stringify(snap);
      if (key === lastSaved) return;
      state.setSyncStatus("saving");
      try {
        await Promise.race([
          saveProgress(state.user, snap),
          new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), SAVE_TIMEOUT_MS)),
        ]);
        lastSaved = key;
        if (!cancelled) store.getState().setSyncStatus("saved");
      } catch {
        if (!cancelled) store.getState().setSyncStatus("offline");
      }
    };

    (async () => {
      store.getState().setSyncStatus("loading");
      try {
        const remote = await loadProgress(uid);
        if (cancelled) return;
        if (remote) {
          store.getState().applyProgress(remote);
          lastSaved = JSON.stringify(progressSnapshot(store.getState()));
          store.getState().setSyncStatus("saved");
        } else {
          await save();
        }
      } catch {
        if (!cancelled) store.getState().setSyncStatus("offline");
      }
      ready = true;
    })();

    const unsub = store.subscribe((state, prev) => {
      if (!ready) return;
      const changed =
        state.quizAnswers !== prev.quizAnswers ||
        state.quizResults !== prev.quizResults ||
        state.quizComplete !== prev.quizComplete ||
        state.quizTopicIds !== prev.quizTopicIds ||
        state.quizQuestionIds !== prev.quizQuestionIds ||
        state.masteryByTopic !== prev.masteryByTopic ||
        state.attempts !== prev.attempts ||
        state.practicedQuestionIds !== prev.practicedQuestionIds ||
        state.history !== prev.history;
      if (!changed) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void save(), SAVE_DEBOUNCE_MS);
    });

    return () => {
      cancelled = true;
      unsub();
      if (timer) clearTimeout(timer);
    };
  }, [uid]);
}
