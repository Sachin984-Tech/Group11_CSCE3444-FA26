# Adaptive Study Path Engine - FR-05

**Commit 5 of 6 - Recommendation Explanations (FR-05)**

Builds on FR-01 through FR-04. Adds the "Why this topic?" explanation modal on every study-path row, providing plain-English reasoning tied to the student's actual mastery score, recent correct/attempted counts, classification band, and any weak prerequisites.

## What's new in this commit

- `buildReason()` in studyEngine generates the explanation text:
  - If Mastered (>=80%): "ranked low-priority because you answered X of Y correctly (Z%) - that's Mastered. Marked as Optional Review..."
  - Otherwise: "sits at rank here because you answered X of Y correctly (Z%), classifying as Needs Work / Developing. It also depends on [weak prereqs] - those scored below 50%, so they're scheduled ahead..."
  - Updates every time mastery recalculates (after each practice answer)
- `RankedTopic.reason` field now populated (was empty in FR-03)
- "Why?" button on each study-path row, opens a 3D-animated modal
- Modal shows: topic icon, "Why is X ranked #N?" header, plain-English reason text, three stat tiles (Mastery %, Recent X/Y, Prereqs count), info note about live updates, "Practice this" CTA
- Dashboard FR pills now mark FR-05 as done

## What's NOT in this commit (intentional)

- FR-06 Topic Progress Chart (final commit - Recharts bar chart + table view)

## Run

```bash
bun install   # or npm install
bun run dev   # or npm run dev
```

Open http://localhost:3000 -> register -> take quiz -> on study path, click "Why?" on any topic -> see plain-English explanation.

## Tech

Next.js 16 / React 19 / TypeScript 5 / Tailwind CSS 4 / Zustand (persist) / framer-motion / lucide-react.
