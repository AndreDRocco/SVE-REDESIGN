'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAchievements } from '@/lib/achievements/AchievementsProvider';
import { ACHIEVEMENTS } from '@/lib/achievements/types';

export default function AchievementToast() {
  const { lastUnlocked, clearToast } = useAchievements();

  useEffect(() => {
    if (!lastUnlocked) return;
    const timer = setTimeout(clearToast, 4500);
    return () => clearTimeout(timer);
  }, [lastUnlocked, clearToast]);

  const def = lastUnlocked ? ACHIEVEMENTS[lastUnlocked] : null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
      <AnimatePresence>
        {def && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-gold/40 bg-forest-deep/95 px-5 py-3 shadow-xl backdrop-blur"
          >
            <span className="text-lg" aria-hidden>
              🏅
            </span>
            <div>
              <p className="text-sm font-semibold text-sunset-light">{def.titulo}</p>
              <p className="text-xs text-mist-dim">{def.descricao}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
