"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Layers,
  Loader2,
  Lock,
  Mail,
  Repeat,
  Sparkles,
  Target,
  User as UserIcon,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuroraBg } from "@/components/aurora-bg";
import { TiltCard } from "@/components/tilt-card";

type Mode = "login" | "register";

const FEATURES = [
  {
    icon: UserIcon,
    title: "Login & Account Access",
    desc: "Email + password registration and login with validation. Account state persists locally between sessions.",
    color: "from-emerald-400/30 to-emerald-500/10",
    ring: "ring-emerald-400/30",
    status: "Live now",
  },
  {
    icon: Target,
    title: "Diagnostic Quiz",
    desc: "Six DSA topics, three questions each. Pinpoint what you actually know in fifteen minutes.",
    color: "from-fuchsia-400/30 to-fuchsia-500/10",
    ring: "ring-fuchsia-400/30",
    status: "FR-02 · planned",
  },
  {
    icon: Layers,
    title: "Personalized Path",
    desc: "Weakest topics first. Prerequisites pulled ahead of dependents. Recalculated after every answer.",
    color: "from-violet-400/30 to-violet-500/10",
    ring: "ring-violet-400/30",
    status: "FR-03 · planned",
  },
  {
    icon: Brain,
    title: "Why this topic?",
    desc: "Every ranking ships with a plain-English explanation tied to your scores and the prerequisite graph.",
    color: "from-violet-400/30 to-violet-500/10",
    ring: "ring-violet-400/30",
    status: "FR-05 · planned",
  },
  {
    icon: BarChart3,
    title: "Progress Chart",
    desc: "Bar chart per topic with mastery bands - Needs Work, Developing, Mastered - and a screen-reader table.",
    color: "from-amber-400/30 to-amber-500/10",
    ring: "ring-amber-400/30",
    status: "FR-06 · planned",
  },
];

export function LandingScreen() {
  const login = useAppStore((s) => s.login);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("That email doesn't look right. Try again.");
      return;
    }
    if (password.length < 8) {
      setError("Passwords need to be at least 8 characters.");
      return;
    }
    if (mode === "register") {
      if (password !== confirm) {
        setError("Those passwords don't match.");
        return;
      }
      if (!name.trim()) {
        setError("Add a display name so we can greet you.");
        return;
      }
    }
    setBusy(true);
    setTimeout(() => {
      const display = mode === "register" ? name.trim() : email.split("@")[0];
      login(email, display);
    }, 900);
  }

  function fillDemo() {
    setEmail("sachin@unt.edu");
    setPassword("csci-rocks");
    setConfirm("csci-rocks");
    setName("Sachin B");
    setMode("register");
    setError(null);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuroraBg variant="vivid" />
      <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-0 min-h-screen">
        <section className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.7 }}
              style={{ transformStyle: "preserve-3d" }}
              className="h-11 w-11 rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-emerald-400 flex items-center justify-center shadow-xl shadow-fuchsia-500/40"
            >
              <Brain className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                Adaptive Study Path Engine
              </p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Group 11 - CSCE 3444
              </p>
            </div>
          </motion.div>

          <div className="my-10 lg:my-0">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium glass-strong border border-fuchsia-400/30 text-fuchsia-200"
            >
              <Sparkles className="h-3 w-3" />
              FR-01 live - account access is ready · Release 0.1
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight"
            >
              <span className="block">Stop relearning</span>
              <span className="block bg-gradient-to-r from-fuchsia-300 via-violet-200 to-emerald-300 bg-clip-text text-transparent animate-gradient-pan text-glow">
                what you
              </span>
              <span className="block">already know.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              The Adaptive Study Path Engine is being built one functional
              requirement at a time. FR-01 - account access - is live today.
              The diagnostic quiz, study path, and progress chart land in
              upcoming commits.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                onClick={() =>
                  document.getElementById("auth-card")?.scrollIntoView({ behavior: "smooth" })
                }
                size="lg"
                className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white shadow-lg shadow-fuchsia-500/30 border-0"
              >
                Create your account
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                onClick={fillDemo}
                size="lg"
                variant="outline"
                className="glass border-border/50"
              >
                Fill demo credentials
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8 lg:mt-12">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const isLive = f.status.startsWith("Live");
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24, rotateY: -12 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -6, rotateY: 6 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TiltCard
                    intensity={8}
                    scale={1.03}
                    className={`h-full rounded-xl p-4 glass ring-1 ${f.ring}`}
                  >
                    <div
                      className={`h-9 w-9 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center ring-1 ${f.ring}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-sm font-semibold">{f.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                    <p
                      className={`mt-2 text-[10px] font-mono uppercase tracking-[0.16em] ${
                        isLive ? "text-emerald-300" : "text-muted-foreground"
                      }`}
                    >
                      {f.status}
                    </p>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="relative flex items-center justify-center p-6 sm:p-10">
          <motion.div
            id="auth-card"
            initial={{ opacity: 0, y: 30, rotateX: -8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3, duration: 0.7, type: "spring", stiffness: 80 }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-full max-w-md perspective-1000"
          >
            <TiltCard
              intensity={6}
              scale={1}
              glare={false}
              className="rounded-3xl"
            >
              <div className="glass-strong rounded-3xl p-7 sm:p-9 shadow-2xl shadow-fuchsia-500/10 border border-border/40">
                <div className="flex items-center gap-2 mb-1.5">
                  <Zap className="h-4 w-4 text-fuchsia-300" />
                  <span className="text-[11px] uppercase tracking-[0.18em] text-fuchsia-200">
                    Sign in to begin
                  </span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {mode === "login" ? "Welcome back." : "Create your account."}
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                  {mode === "login"
                    ? "Pick up where you left off - your progress is saved."
                    : "It takes about a minute. We don't ask for anything extra."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-1 p-1 rounded-xl bg-muted/40 border border-border/30">
                  {(["login", "register"] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        setError(null);
                      }}
                      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        mode === m
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="relative z-10 capitalize">
                        {m === "login" ? "Sign in" : "Register"}
                      </span>
                      {mode === m ? (
                        <motion.span
                          layoutId="auth-mode-pill"
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-fuchsia-500/25 to-violet-500/25 border border-fuchsia-400/30"
                          transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        />
                      ) : null}
                    </button>
                  ))}
                </div>

                <form onSubmit={submit} className="mt-5 space-y-3.5">
                  <AnimatePresence>
                    {mode === "register" ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5"
                      >
                        <Label htmlFor="name" className="text-xs">Display name</Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Sachin B"
                            className="pl-9 bg-input/60 border-border/50 focus-visible:border-fuchsia-400/60 focus-visible:ring-fuchsia-400/20"
                          />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@unt.edu"
                        className="pl-9 bg-input/60 border-border/50 focus-visible:border-fuchsia-400/60 focus-visible:ring-fuchsia-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs">
                      Password
                      <span className="text-muted-foreground/70 ml-1 normal-case">
                        (min 8 chars)
                      </span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9 bg-input/60 border-border/50 focus-visible:border-fuchsia-400/60 focus-visible:ring-fuchsia-400/20"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {mode === "register" ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5"
                      >
                        <Label htmlFor="confirm" className="text-xs">Confirm password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm"
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="••••••••"
                            className="pl-9 bg-input/60 border-border/50 focus-visible:border-fuchsia-400/60 focus-visible:ring-fuchsia-400/20"
                          />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <AnimatePresence>
                    {error ? (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        role="alert"
                        className="text-xs text-rose-300 bg-rose-500/10 border border-rose-400/30 rounded-lg px-3 py-2"
                      >
                        {error}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 text-white shadow-lg shadow-fuchsia-500/30 border-0 h-11"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                    {mode === "login" ? "Sign in" : "Create account"}
                    {busy ? " - working" : ""}
                  </Button>
                </form>

                <p className="text-[11px] text-muted-foreground/80 mt-5 text-center leading-relaxed">
                  Demo mode - credentials stored locally in your browser.
                  <br />
                  <span className="text-muted-foreground/60">
                    Firebase Auth integration pending in a later sprint.
                  </span>
                </p>

                <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Repeat className="h-3 w-3" />
                    Auto-logout: 30 min idle
                  </span>
                  <span>WCAG 2.1 AA target</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
