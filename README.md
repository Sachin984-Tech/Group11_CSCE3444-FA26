# Adaptive Study Path Engine - FR-02

**Commit 2 of 6 - Diagnostic Quiz (FR-02)**

Builds on FR-01 (login + register). Adds the diagnostic quiz across six DSA topics - three questions per topic, eighteen total - with per-topic scoring saved to the store.

## What's new in this commit

- Six DSA topics defined: Arrays, Linked Lists, Stacks & Queues, Trees, Graphs, Sorting & Searching
- 23 multiple-choice questions with explanations in the question bank
- Topic selection grid (all six pre-selected, can deselect any)
- One-question-at-a-time flow with question jump chips and progress bar
- Back / Next navigation, can change answers before submit
- Submit confirmation modal with answered count
- Animated scoring loader (scoring -> classifying -> saving results)
- Per-topic results saved as `QuizResult[]` in the store
- Dashboard updated to show per-topic scores with mastery bands (Needs Work / Developing / Mastered) and animated bars

## What's NOT in this commit (intentional)

- FR-03 Personalized Study Path (next commit - ranking logic with prerequisites)
- FR-04 Practice + Recalculation
- FR-05 Recommendation Explanations
- FR-06 Topic Progress Chart

## Run

```bash
bun install   # or npm install
bun run dev   # or npm run dev
```

Open http://localhost:3000 -> register -> dashboard -> "Take diagnostic quiz" -> answer questions -> submit -> see scores on dashboard.

## Tech

Next.js 16 / React 19 / TypeScript 5 / Tailwind CSS 4 / Zustand (persist) / framer-motion / lucide-react.
