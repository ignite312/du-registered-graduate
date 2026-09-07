"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AppState, MembershipType, Profile } from "@/lib/types";

const STORAGE_KEY = "du-rg-portal-state-v4";

export const emptyState: AppState = {
  phone: "",
  password: "",
  otpSent: false,
  otpVerified: false,
  loggedIn: false,
  rgStatus: "unknown",
  rgId: "",
  academic: null,
  eligibility: "unchecked",
  eligibilityReasons: [],
  lookup: "idle",
  profile: null,
  profileComplete: false,
  membership: null,
  heldMembership: null,
  payment: null,
  paymentSkipped: false,
  tickets: [],
};

type AppContextValue = {
  state: AppState;
  hydrated: boolean;
  update: (partial: Partial<AppState>) => void;
  setProfile: (profile: Profile) => void;
  setMembership: (membership: MembershipType) => void;
  reset: () => void;
  signOut: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setState({ ...emptyState, ...JSON.parse(raw) });
      } catch {
        /* ignore corrupt storage */
      }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const update = useCallback((partial: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const setProfile = useCallback((profile: Profile) => {
    setState((prev) => ({ ...prev, profile, profileComplete: true }));
  }, []);

  const setMembership = useCallback((membership: MembershipType) => {
    setState((prev) => ({ ...prev, membership }));
  }, []);

  const reset = useCallback(() => setState(emptyState), []);

  const signOut = useCallback(() => {
    setState((prev) => ({ ...prev, loggedIn: false }));
  }, []);

  const value = useMemo(
    () => ({ state, hydrated, update, setProfile, setMembership, reset, signOut }),
    [state, hydrated, update, setProfile, setMembership, reset, signOut],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}
