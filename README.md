# Adaptive Study Path Engine - Release 1.1

**Commit 3 of 6 (Release 1.1) - F-08: Expanded & randomized diagnostic**

Release 1.0 (FR-01 to FR-06) shipped for Project Status 1. Release 1.1 adds cloud accounts and new study features.

## What's new in this commit

- Question bank expanded from 25 to **60 questions** (10 per topic), each with a plain-English explanation and a difficulty tag
- Each diagnostic draws a **random 3 questions per topic** (one easy, one medium, one hard where possible), so a retake is a different quiz
- The question set is locked in when the quiz starts, so it doesn't change mid-quiz or on reload
- Practice has a deeper pool per topic, so questions repeat less

## Release 1.1 progress

- [x] Commit 1: F-07 (1/2): Firebase Authentication
- [x] Commit 2: F-07 (2/2): Cloud Firestore progress sync
- [x] Commit 3: F-08: Expanded & randomized diagnostic
- [ ] Commit 4: F-09: Answer review & mistake notebook
- [ ] Commit 5: F-10: Study history & progress trend
- [ ] Commit 6: F-11: Smart recommendations (FR-05 v2)

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
