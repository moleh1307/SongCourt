import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Verdict } from '../types/verdict';
import { todayKey } from '../utils/date';
import { fileJsonStorage } from './persist';

type HistoryState = {
  verdicts: Verdict[];
  addVerdict: (verdict: Verdict) => void;
  getVerdictById: (id: string) => Verdict | undefined;
  getTodayVerdict: () => Verdict | undefined;
  getStreak: () => number;
  clearHistory: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      verdicts: [],
      addVerdict: (verdict) =>
        set((state) => ({
          verdicts: [verdict, ...state.verdicts.filter((item) => item.date !== verdict.date)],
        })),
      getVerdictById: (id) => get().verdicts.find((verdict) => verdict.id === id),
      getTodayVerdict: () => get().verdicts.find((verdict) => verdict.date === todayKey()),
      getStreak: () => {
        const dates = new Set(get().verdicts.map((verdict) => verdict.date));
        let streak = 0;
        const cursor = new Date();
        while (dates.has(cursor.toISOString().slice(0, 10))) {
          streak += 1;
          cursor.setDate(cursor.getDate() - 1);
        }
        return streak;
      },
      clearHistory: () => set({ verdicts: [] }),
    }),
    { name: 'songcourt-history', storage: fileJsonStorage },
  ),
);
