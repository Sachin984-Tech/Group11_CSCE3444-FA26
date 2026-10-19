"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Screen, User } from "./types";

interface AppState {
  user: User | null;
  screen: Screen;

  login: (email: string, displayName: string) => void;
  logout: () => void;
  go: (screen: Screen) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      screen: "landing",

      login: (email, displayName) =>
        set({ user: { email, displayName, createdAt: Date.now() }, screen: "dashboard" }),

      logout: () =>
        set({
          user: null,
          screen: "landing",
        }),

      go: (screen) => set({ screen }),
    }),
    {
      name: "aspe-store-v1",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      partialize: (s) => ({ user: s.user }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...p,
          screen: "landing",
        } as AppState;
      },
      skipHydration: true,
    },
  ),
);

if (typeof window !== "undefined") {
  const api = (useAppStore as unknown as { persist?: { rehydrate: () => Promise<unknown> } }).persist;
  if (api && typeof api.rehydrate === "function") {
    api.rehydrate();
  }
}
