"use client";

import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDb } from "./firebase";
import type { MasteryScore, PracticeAttempt, QuizAnswer, QuizResult, TopicId, User } from "./types";

/**
 * Cloud Firestore persistence for a student's progress.
 *
 * Data model (matches the SRS / design doc):
 *   users/{uid}                          profile + latest progress snapshot
 *   users/{uid}/diagnosticQuizzes/{id}   one document per submitted diagnostic
 *
 * Security rules (firestore.rules) only let a signed-in user read and write
 * documents under their own uid.
 */

export interface ProgressSnapshot {
  quizTopicIds: TopicId[];
  quizAnswers: QuizAnswer[];
  quizComplete: boolean;
  quizResults: QuizResult[];
  mastery: MasteryScore[];
  attempts: PracticeAttempt[];
  practicedQuestionIds: string[];
}

/** Firestore rejects `undefined`, so strip it by round-tripping through JSON. */
function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function loadProgress(uid: string): Promise<ProgressSnapshot | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return (data.progress as ProgressSnapshot | undefined) ?? null;
}

export async function saveProgress(user: User, progress: ProgressSnapshot): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(
    doc(db, "users", user.uid),
    {
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: serverTimestamp(),
      progress: clean(progress),
    },
    { merge: true },
  );
}

export async function recordDiagnosticSubmission(
  uid: string,
  answers: QuizAnswer[],
  results: QuizResult[],
): Promise<void> {
  const db = getDb();
  if (!db) return;
  await addDoc(collection(db, "users", uid, "diagnosticQuizzes"), {
    userId: uid,
    answers: clean(answers),
    results: clean(results),
    submittedAt: serverTimestamp(),
  });
}
