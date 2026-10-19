"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, User as UserIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { AuroraBg } from "@/components/aurora-bg";

export function DashboardScreen() {
  const user = useAppStore((s) => s.user);

  const hourOfDay = new Date().getHours();
  const greeting = hourOfDay < 12 ? "Good morning" : hourOfDay < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.displayName?.split(" ")[0] || "learner";

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <AuroraBg variant="calm" />
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {greeting}, {firstName}
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
            Your adaptive learning hub
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Account access is live. The diagnostic quiz, personalized study
            path, practice flow, and progress chart will land in upcoming
            sprints (FR-02 through FR-06).
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 rounded-2xl p-6 glass-strong border border-border/40"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-violet-700/10 ring-1 ring-fuchsia-400/30 flex items-center justify-center">
              <Brain className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Welcome aboard</h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                FR-01 (User Registration &amp; Login) is the foundation. Account
                state persists in <span className="font-mono text-xs">localStorage</span>{" "}
                via Zustand - Firebase Auth integration is pending Sprint 5.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: "FR-01", text: "Login & Access", done: true },
                  { label: "FR-02", text: "Diagnostic Quiz", done: false },
                  { label: "FR-03", text: "Study Path", done: false },
                  { label: "FR-04", text: "Practice + Recalc", done: false },
                  { label: "FR-05", text: "Why? Explanations", done: false },
                  { label: "FR-06", text: "Progress Chart", done: false },
                ].map((fr) => (
                  <span
                    key={fr.label}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-mono ${
                      fr.done
                        ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30"
                        : "bg-muted/40 text-muted-foreground ring-1 ring-border/40"
                    }`}
                  >
                    {fr.label} · {fr.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-start gap-2 text-xs text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 mt-0.5" />
          <p>
            Sign out and back in to test the persistence flow. The next commit
            (FR-02) adds the diagnostic quiz across six DSA topics.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-xl p-4 glass border border-border/30 flex items-center gap-3"
        >
          <UserIcon className="h-4 w-4 text-fuchsia-300" />
          <p className="text-xs">
            <span className="text-muted-foreground">Logged in as:</span>{" "}
            <span className="font-mono">{user?.email}</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
