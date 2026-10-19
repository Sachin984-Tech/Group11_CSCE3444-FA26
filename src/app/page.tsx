"use client";

import { AnimatePresence } from "framer-motion";
import { useSyncExternalStore } from "react";
import { useAppStore } from "@/lib/store";
import { AppShell } from "@/components/app-shell";
import { LandingScreen } from "@/components/screens/landing";
import { DashboardScreen } from "@/components/screens/dashboard";
import { QuizScreen } from "@/components/screens/quiz";
import { StudyPathScreen } from "@/components/screens/study-path";

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

  if (!hydrated) {
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
      </AnimatePresence>
    </AppShell>
  );
}
