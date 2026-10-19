# Adaptive Study Path Engine - FR-01

**Commit 1 of 6 - User Registration & Login (FR-01)**

This commit implements the first functional requirement: account access. Users can register with email + password (8-char min, password confirmation), or sign in to an existing account. State persists to `localStorage` via Zustand. Firebase Auth integration is pending Sprint 5.

## What's in this commit

- Landing page with split-screen hero + glassmorphic auth card
- Login / Register tab switch with animated pill indicator
- Validation: email format, 8-char password, password match, display name required
- 3D tilt cards with glare on the feature highlights
- Aurora background with animated radial-gradient orbs
- Dashboard with welcome message + FR-01 through FR-06 status pills (only FR-01 is "live")
- App shell with sticky glass nav, user avatar, sign-out button
- Hydration-safe Zustand store (`skipHydration: true` + manual `rehydrate()`)
- Loading spinner during hydration to prevent blank-page hydration mismatch

## What's NOT in this commit (intentional)

- FR-02 Diagnostic Quiz
- FR-03 Personalized Study Path
- FR-04 Practice + Recalculation
- FR-05 Recommendation Explanations
- FR-06 Topic Progress Chart

These land in subsequent commits.

## Run

```bash
bun install   # or npm install
bun run dev   # or npm run dev
```

Open http://localhost:3000 - click "Fill demo credentials" - click "Create account".

## Tech

Next.js 16 / React 19 / TypeScript 5 / Tailwind CSS 4 / Zustand (persist) / framer-motion / lucide-react / Inter + JetBrains Mono.
