"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useAppStore } from "@/lib/store";
import { authMode, watchSession } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { LandingScreen } from "@/components/screens/landing";
import { DashboardScreen } from "@/components/screens/dashboard";
import { QuizScreen } from "@/components/screens/quiz";
import { StudyPathScreen } from "@/components/screens/study-path";
import { PracticeScreen } from "@/components/screens/practice";
import { ProgressScreen } from "@/components/screens/progress";
import { ReviewScreen } from "@/components/screens/review";

const subscribeNoop = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function useHydrated() {
  return useSyncExternalStore(subscribeNoop, clientSnapshot, serverSnapshot);
}

export default function Home() {
  const hydrated = useHydrated();
  const user = useAppStore((s) => s.user);
  const screen = useAppStore((s) => s.screen);
  const login = useAppStore((s) => s.login);
  const logout = useAppStore((s) => s.logout);
  // In local demo mode there is no remote session to wait for.
  const [sessionChecked, setSessionChecked] = useState(authMode === "local");

  // Keep the app in sync with the Firebase session: restores a signed-in
  // user after reload and signs out locally if the session ended elsewhere.
  useEffect(() => {
    if (authMode !== "firebase") return;
    return watchSession((sessionUser) => {
      const current = useAppStore.getState().user;
      if (sessionUser) {
        if (!current || current.uid !== sessionUser.uid) login(sessionUser);
      } else if (current) {
        logout();
      }
      setSessionChecked(true);
    });
  }, [login, logout]);

  if (!hydrated || !sessionChecked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        aria-busy="true"
        aria-label="Loading Adaptive Study Path Engine"
      >
        <div className="h-10 w-10 rounded-full border-2 border-fuchsia-400/40 border-t-fuchsia-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LandingScreen />;
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        {screen === "dashboard" ? <DashboardScreen key="dashboard" /> : null}
        {screen === "quiz" ? <QuizScreen key="quiz" /> : null}
        {screen === "study-path" ? <StudyPathScreen key="study-path" /> : null}
        {screen === "practice" ? <PracticeScreen key="practice" /> : null}
        {screen === "progress" ? <ProgressScreen key="progress" /> : null}
        {screen === "review" ? <ReviewScreen key="review" /> : null}
      </AnimatePresence>
    </AppShell>
  );
}
