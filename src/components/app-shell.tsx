"use client";

import { motion } from "framer-motion";
import { BarChart3, Brain, ClipboardCheck, History, Cloud, CloudOff, Compass, HardDrive, Home, Loader2, LogOut, PlayCircle, Route as RouteIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import type { Screen } from "@/lib/types";
import { signOutAccount } from "@/lib/auth";
import { useIdleLogout } from "@/hooks/use-idle-logout";
import { useCloudSync } from "@/hooks/use-cloud-sync";
import { toast } from "@/hooks/use-toast";

const NAV: { id: Screen; label: string; icon: typeof Brain }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "quiz", label: "Diagnostic", icon: Compass },
  { id: "study-path", label: "Study Path", icon: RouteIcon },
  { id: "practice", label: "Practice", icon: PlayCircle },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "review", label: "Review", icon: ClipboardCheck },
  { id: "history", label: "History", icon: History },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user);
  const screen = useAppStore((s) => s.screen);
  const go = useAppStore((s) => s.go);
  const logout = useAppStore((s) => s.logout);
  const syncStatus = useAppStore((s) => s.syncStatus);

  useCloudSync();

  // Start each screen at the top instead of keeping the old scroll position.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen]);

  const initial = (user?.displayName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  const handleSignOut = useCallback(async () => {
    try {
      await signOutAccount();
    } finally {
      logout();
    }
  }, [logout]);

  // NFR-S3: end the session after 30 minutes without activity.
  const handleIdle = useCallback(() => {
    void handleSignOut();
    toast({
      title: "Signed out for inactivity",
      description: "You were idle for 30 minutes. Sign in again to continue - your progress is saved.",
    });
  }, [handleSignOut]);
  useIdleLogout(Boolean(user), handleIdle);

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
              <p className="text-sm font-semibold leading-tight whitespace-nowrap">
                Adaptive Study Path
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Engine · v1.0
              </p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" aria-label="Main">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                  title={item.label}
                  className={`relative px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="hidden xl:inline">{item.label}</span>
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
            <SyncBadge status={user?.provider === "firebase" ? syncStatus : "local"} />
            <div className="hidden sm:flex items-center gap-2.5 pr-2 border-r border-border/50">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-fuchsia-500/30">
                {initial}
              </div>
              <div className="hidden 2xl:block">
                <p className="text-xs font-semibold leading-tight truncate max-w-[12rem]">
                  {user?.displayName || "Learner"}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[12rem]">
                  {user?.email}
                </p>
                <p
                  className={`mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] ${
                    user?.provider === "firebase" ? "text-emerald-300" : "text-amber-300"
                  }`}
                >
                  {user?.provider === "firebase" ? (
                    <Cloud className="h-2.5 w-2.5" aria-hidden="true" />
                  ) : (
                    <HardDrive className="h-2.5 w-2.5" aria-hidden="true" />
                  )}
                  {user?.provider === "firebase" ? "Firebase account" : "Local demo account"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-rose-300"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>

        <nav aria-label="Main" className="lg:hidden flex items-center gap-1 px-3 pb-2 overflow-x-auto scrollbar-thin">
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
            FR-01 to FR-06 + Firebase cloud sync - Release 1.1
          </p>
        </div>
      </footer>
    </div>
  );
}

function SyncBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: string; icon: typeof Cloud; spin?: boolean }> = {
    local: { label: "Saved on this device", tone: "text-amber-300 border-amber-400/30", icon: HardDrive },
    loading: { label: "Loading from cloud", tone: "text-violet-200 border-violet-400/30", icon: Loader2, spin: true },
    saving: { label: "Saving", tone: "text-violet-200 border-violet-400/30", icon: Loader2, spin: true },
    saved: { label: "Saved to cloud", tone: "text-emerald-300 border-emerald-400/30", icon: Cloud },
    offline: { label: "Cloud offline", tone: "text-rose-300 border-rose-400/30", icon: CloudOff },
  };
  const item = map[status] ?? map.local;
  const Icon = item.icon;
  return (
    <span
      role="status"
      aria-live="polite"
      title={item.label}
      className={`hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-[11px] ${item.tone}`}
    >
      <Icon className={`h-3 w-3 ${item.spin ? "animate-spin" : ""}`} aria-hidden="true" />
      <span className="sr-only 2xl:not-sr-only">{item.label}</span>
    </span>
  );
}
