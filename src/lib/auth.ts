"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { firebaseEnabled, getFirebaseAuth } from "./firebase";
import type { User } from "./types";

/**
 * Account access (register / sign in / reset / sign out).
 * Uses Firebase Authentication when configured - passwords are hashed and
 * stored by Firebase, never by this app (NFR-S1). Falls back to a local demo
 * account when Firebase keys are not set.
 */

export type AuthMode = "firebase" | "local";
export const authMode: AuthMode = firebaseEnabled ? "firebase" : "local";

export function toAppUser(fb: FirebaseUser): User {
  return {
    uid: fb.uid,
    email: fb.email ?? "",
    displayName: fb.displayName || (fb.email ? fb.email.split("@")[0] : "Learner"),
    createdAt: fb.metadata.creationTime ? Date.parse(fb.metadata.creationTime) : Date.now(),
    provider: "firebase",
  };
}

function localUser(email: string, displayName: string): User {
  return {
    uid: `local-${email.toLowerCase()}`,
    email,
    displayName,
    createdAt: Date.now(),
    provider: "local",
  };
}

export async function registerAccount(email: string, password: string, displayName: string): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) {
    await delay(700);
    return localUser(email, displayName);
  }
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  return { ...toAppUser(cred.user), displayName };
}

export async function signInAccount(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) {
    await delay(700);
    return localUser(email, email.split("@")[0]);
  }
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return toAppUser(cred.user);
}

export async function sendResetEmail(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Password reset needs Firebase - this deployment is running in local demo mode.");
  }
  await sendPasswordResetEmail(auth, email);
}

export async function signOutAccount(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) await signOut(auth);
}

/** Subscribe to Firebase session changes. Returns an unsubscribe fn. */
export function watchSession(cb: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) return () => {};
  return onAuthStateChanged(auth, (fb) => cb(fb ? toAppUser(fb) : null));
}

/** Turn Firebase error codes into plain-English messages for the form. */
export function friendlyAuthError(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/email-already-in-use":
        return "An account with that email already exists. Switch to Sign in.";
      case "auth/invalid-email":
        return "That email doesn't look right. Try again.";
      case "auth/weak-password":
        return "That password is too weak. Use at least 8 characters.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email or password is incorrect.";
      case "auth/too-many-requests":
        return "Too many attempts. Wait a minute and try again.";
      case "auth/network-request-failed":
        return "Network error - check your connection and try again.";
      case "auth/operation-not-allowed":
        return "Email/password sign-in is not enabled in the Firebase console.";
      default:
        return `Sign-in failed (${err.code}).`;
    }
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Try again.";
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
