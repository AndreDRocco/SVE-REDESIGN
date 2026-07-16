'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AchievementId } from './types';

const STORAGE_KEY = 'sve:achievements';

interface AchievementsContextValue {
  unlocked: AchievementId[];
  lastUnlocked: AchievementId | null;
  unlock: (id: AchievementId) => void;
  isUnlocked: (id: AchievementId) => boolean;
  clearToast: () => void;
}

const AchievementsContext = createContext<AchievementsContextValue | null>(null);

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<AchievementId[]>([]);
  const [lastUnlocked, setLastUnlocked] = useState<AchievementId | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setUnlocked(JSON.parse(stored));
    } catch {
      // localStorage indisponível (modo privado, etc.) — segue sem persistência.
    }
  }, []);

  const unlock = useCallback((id: AchievementId) => {
    setUnlocked((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignora falha de persistência, o selo ainda aparece nesta sessão
      }
      setLastUnlocked(id);
      return next;
    });
  }, []);

  const isUnlocked = useCallback((id: AchievementId) => unlocked.includes(id), [unlocked]);
  const clearToast = useCallback(() => setLastUnlocked(null), []);

  return (
    <AchievementsContext.Provider value={{ unlocked, lastUnlocked, unlock, isUnlocked, clearToast }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext);
  if (!ctx) throw new Error('useAchievements deve ser usado dentro de AchievementsProvider');
  return ctx;
}
