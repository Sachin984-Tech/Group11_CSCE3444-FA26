"use client";

import { useEffect, useRef } from "react";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "visibilitychange"] as const;
const STORAGE_KEY = "aspe-last-activity";

/**
 * Signs the user out after `timeoutMs` without any activity (NFR-S3: 30 min).
 * Last activity is kept in localStorage so the timeout also applies across
 * tabs and after closing / reopening the browser.
 */
export function useIdleLogout(active: boolean, onIdle: () => void, timeoutMs = 30 * 60 * 1000) {
  const onIdleRef = useRef(onIdle);
  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  useEffect(() => {
    if (!active || typeof window === "undefined") return;

    const readLast = () => {
      try {
        const v = Number(window.localStorage.getItem(STORAGE_KEY));
        return Number.isFinite(v) && v > 0 ? v : Date.now();
      } catch {
        return Date.now();
      }
    };
    const touch = () => {
      try {
        window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        /* storage blocked - timer still works in memory */
      }
    };

    // Came back after being away too long? Sign out right away.
    if (Date.now() - readLast() > timeoutMs) {
      onIdleRef.current();
      return;
    }
    touch();

    let lastWrite = 0;
    const onActivity = () => {
      const now = Date.now();
      if (now - lastWrite > 5000) {
        lastWrite = now;
        touch();
      }
    };
    for (const ev of ACTIVITY_EVENTS) window.addEventListener(ev, onActivity, { passive: true });

    const timer = window.setInterval(() => {
      if (Date.now() - readLast() > timeoutMs) onIdleRef.current();
    }, 15_000);

    return () => {
      for (const ev of ACTIVITY_EVENTS) window.removeEventListener(ev, onActivity);
      window.clearInterval(timer);
    };
  }, [active, timeoutMs]);
}
