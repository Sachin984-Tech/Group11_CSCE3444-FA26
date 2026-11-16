# Adaptive Study Path Engine - Release 1.1

**Commit 6 of 6 (Release 1.1) - F-11: Smart recommendations (FR-05 v2)**

Release 1.0 (FR-01 to FR-06) shipped for Project Status 1. Release 1.1 adds cloud accounts and new study features.

## What's new in this commit

- The *why* for each topic now shows **right on every study-path card**, not only in the popup
- Reason tags on each card: *Lowest score*, *Weak prerequisite*, *Blocks N topics*, *Not practiced recently*, *Mastered*
- Dashboard **Next best step** card: the top topic, the reason, and a one-click Practice button
- After a practice answer that changes the order, a **Path updated** alert explains which topic moved and why
- Fix: prerequisite reordering now repeats until stable, so a pulled-forward topic's own weak prerequisite also moves ahead of it
- Fix: diagnostic answers count toward the 10-answer mastery window, so one practice answer can't jump a topic to 100%

## Release 1.1 progress

- [x] Commit 1: F-07 (1/2): Firebase Authentication
- [x] Commit 2: F-07 (2/2): Cloud Firestore progress sync
- [x] Commit 3: F-08: Expanded & randomized diagnostic
- [x] Commit 4: F-09: Answer review & mistake notebook
- [x] Commit 5: F-10: Study history & progress trend
- [x] Commit 6: F-11: Smart recommendations (FR-05 v2)

## Release 1.0 features (done)

- FR-01: User Registration & Login
- FR-02: Diagnostic Quiz
- FR-03: Personalized Study Path Generation
- FR-04: Dynamic Study Path Recalculation
- FR-05: Recommendation Explanations
- FR-06: Topic Progress Chart

## Setup

```bash
bun install   # or npm install
cp .env.example .env.local   # then paste your Firebase web config
bun run dev   # or npm run dev
```

Without Firebase keys the app runs in local demo mode (data stays in the browser).

Live: https://group11-csce-3444-fa-26-6vom.vercel.app

## Tech

Next.js 16 / React 19 / TypeScript 5 / Tailwind CSS 4 / Zustand (persist) / Firebase Auth + Cloud Firestore / framer-motion / Recharts / lucide-react.
