# Adaptive Study Path Engine - FR-04

**Commit 4 of 6 - Practice + Dynamic Recalculation (FR-04)**

Builds on FR-01 + FR-02 + FR-03. Adds practice questions for any topic with live mastery recalculation after every answer. The study path reranks in real time as mastery scores change.

## What's new in this commit

- `attempts: PracticeAttempt[]`, `practiceTopicId`, `practicedQuestionIds[]` in store
- `recomputeMasteryWithAttempts()` in studyEngine - recomputes mastery from the last 10 attempts for a topic
- `startPractice(topicId)`, `recordAttempt(attempt)`, `exitPractice()` actions
- Practice screen with two modes:
  - Topic picker (shows all available topics with current mastery)
  - Question flow with 4-option MCQ, animated feedback panel, correct/wrong highlighting, explanation from the question bank, streak counter (3+ correct = flame indicator)
- Practice questions not re-served until the topic pool is exhausted
- Mastery recalculates after every answer and propagates back to `masteryByTopic`
- Study path automatically reranks when mastery changes (via `useMemo` dependency on `masteryByTopic`)
- Study Path screen now has a "Practice" button on each topic row and a "Practice weakest" button in the header
- App shell nav includes "Practice"
- Live metric tiles: Streak / Mastery / Recent (correct/attempted from last 10)

## What's NOT in this commit (intentional)

- FR-05 Recommendation Explanations (the "Why?" modal lands next)
- FR-06 Topic Progress Chart

## Run

```bash
bun install   # or npm install
bun run dev   # or npm run dev
```

Open http://localhost:3000 -> register -> take diagnostic quiz -> on study path, click "Practice" on a topic -> answer questions -> watch the path rerank live.

## Tech

Next.js 16 / React 19 / TypeScript 5 / Tailwind CSS 4 / Zustand (persist) / framer-motion / lucide-react.
