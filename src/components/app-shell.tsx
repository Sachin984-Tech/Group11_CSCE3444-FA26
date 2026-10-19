"use client";

import { motion } from "framer-motion";
import { BarChart3, Brain, Compass, Home, LogOut, PlayCircle, Route as RouteIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import type { Screen } from "@/lib/types";

const NAV: { id: Screen; label: string; icon: typeof Brain }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "quiz", label: "Diagnostic", icon: Compass },
  { id: "study-path", label: "Study Path", icon: RouteIcon },
  { id: "practice", label: "Practice", icon: PlayCircle },
  { id: "progress", label: "Progress", icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user);
  const screen = useAppStore((s) => s.screen);
  const go = useAppStore((s) => s.go);
  const logout = useAppStore((s) => s.logout);

  const initial = (user?.displayName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-border/40">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => go("dashboard")}
            className="flex items-center gap-2.5 group"
            aria-label="Go to dashboard"
          >
            <motion.div
              whileHover={{ rotateY: 25, rotateX: -10 }}
              style={{ transformStyle: "preserve-3d" }}
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-fuchsia-500/30"
            >
              <Brain className="h-5 w-5 text-white" />
            </motion.div>
            <div className="text-left">
              <p className="text-sm font-semibold leading-tight">
                Adaptive Study Path
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Engine · v1.0
              </p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </span>
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-fuchsia-500/20 via-violet-500/15 to-emerald-400/20 border border-fuchsia-400/30"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 pr-2 border-r border-border/50">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-fuchsia-500/30">
                {initial}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold leading-tight truncate max-w-[12rem]">
                  {user?.displayName || "Learner"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate max-w-[12rem]">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-rose-300"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1 px-3 pb-2 overflow-x-auto scrollbar-thin">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = screen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  active
                    ? "bg-fuchsia-500/15 text-fuchsia-200 border border-fuchsia-400/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3 w-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 18, rotateX: 4 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -12, rotateX: -4 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </main>

      <footer className="mt-auto border-t border-border/30 glass">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            Adaptive Study Path Engine - built by Group 11 - CSCE 3444 - Fall 2026
          </p>
          <p className="font-mono">
            FR-01 through FR-06 complete - Release 1.0
          </p>
        </div>
      </footer>
    </div>
  );
}
