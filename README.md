# Adaptive Study Path Engine - FR-03

**Commit 3 of 6 - Personalized Study Path (FR-03)**

Builds on FR-01 + FR-02. Adds the personalized study path: per-topic Mastery Scores classified into Needs Work / Developing / Mastered, ranked weakest-first, with weak prerequisites pulled ahead of dependents, and mastered topics demoted to "Optional Review" at the tail.

## What's new in this commit

- `masteryByTopic: Map<TopicId, MasteryScore>` persisted in the store
- `rankTopics()` algorithm in studyEngine:
  - Sorts topics by Mastery Score ascending (weakest first)
  - Default course order as tiebreaker (Arrays -> Linked Lists -> Stacks & Queues -> Trees -> Graphs -> Sorting & Searching)
  - Weak prerequisite promotion: if a topic is weak AND its prerequisite is weak AND the prerequisite ranks after it, the prerequisite moves ahead
  - Mastered topics grouped at the tail as "Optional Review"
- Study Path screen with 3D-tilted ranked cards, mastery bars, classification badges, and prerequisite chips
- Dashboard shows top-3 weakest topics preview
- Quiz submit now navigates to study-path screen
- App shell nav includes "Study Path"
- 3-band summary tiles (Needs Work / Developing / Mastered counts)

## What's NOT in this commit (intentional)

- FR-04 Practice + Recalculation (next commit - practice questions + live mastery recalculation)
- FR-05 Recommendation Explanations
- FR-06 Topic Progress Chart

## Run

```bash
bun install   # or npm install
bun run dev   # or npm run dev
```

Open http://localhost:3000 -> register -> dashboard -> "Take diagnostic quiz" -> answer questions -> submit -> study path appears ranked.

## Tech

Next.js 16 / React 19 / TypeScript 5 / Tailwind CSS 4 / Zustand (persist) / framer-motion / lucide-react.
