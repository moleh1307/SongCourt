import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Badge, CourtRank, Verdict } from '../types/verdict';
import { getRankProgress, rankForXp } from '../utils/verdictRewards';
import { secureJsonStorage } from './persist';

type RankProgress = ReturnType<typeof getRankProgress>;

type RewardState = {
  xp: number;
  rank: CourtRank;
  totalTrials: number;
  trialDates: string[];
  recordedVerdictIds: string[];
  unlockedBadges: Badge[];
  completedDailyChallenges: string[];
  recordVerdict: (verdict: Verdict) => void;
  completeDailyChallenge: (challengeId: string, rewardXp: number) => void;
  getStreak: () => number;
  getWeeklyCaseCount: () => number;
  getRankProgress: () => RankProgress;
  resetRewards: () => void;
};

const normalizeDates = (dates: string[]) => Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a));

const getCurrentDateKey = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const calculateStreak = (dates: string[]) => {
  const dateSet = new Set(dates);
  let streak = 0;
  let offset = 0;
  while (dateSet.has(getCurrentDateKey(-offset))) {
    streak += 1;
    offset += 1;
  }
  return streak;
};

const calculateWeeklyCaseCount = (dates: string[]) => {
  const dateSet = new Set(dates);
  let count = 0;
  for (let offset = 0; offset < 7; offset += 1) {
    if (dateSet.has(getCurrentDateKey(-offset))) count += 1;
  }
  return count;
};

const mergeBadge = (badges: Badge[], badge?: Badge) => {
  if (!badge || badges.some((item) => item.id === badge.id)) return badges;
  return [...badges, badge];
};

export const useRewardStore = create<RewardState>()(
  persist(
    (set, get) => ({
      xp: 0,
      rank: 'Witness',
      totalTrials: 0,
      trialDates: [],
      recordedVerdictIds: [],
      unlockedBadges: [],
      completedDailyChallenges: [],
      recordVerdict: (verdict) =>
        set((state) => {
          if (state.recordedVerdictIds.includes(verdict.id)) return state;
          const xp = state.xp + (verdict.xpAwarded ?? 0);
          const trialDates = normalizeDates([...state.trialDates, verdict.date]);
          return {
            xp,
            rank: rankForXp(xp),
            totalTrials: state.totalTrials + 1,
            trialDates,
            recordedVerdictIds: [...state.recordedVerdictIds, verdict.id],
            unlockedBadges: mergeBadge(state.unlockedBadges, verdict.unlockedBadge),
          };
        }),
      completeDailyChallenge: (challengeId, rewardXp) =>
        set((state) => {
          if (state.completedDailyChallenges.includes(challengeId)) return state;
          const xp = state.xp + rewardXp;
          return {
            xp,
            rank: rankForXp(xp),
            completedDailyChallenges: [...state.completedDailyChallenges, challengeId],
          };
        }),
      getStreak: () => calculateStreak(get().trialDates),
      getWeeklyCaseCount: () => calculateWeeklyCaseCount(get().trialDates),
      getRankProgress: () => getRankProgress(get().xp),
      resetRewards: () =>
        set({
          xp: 0,
          rank: 'Witness',
          totalTrials: 0,
          trialDates: [],
          recordedVerdictIds: [],
          unlockedBadges: [],
          completedDailyChallenges: [],
        }),
    }),
    { name: 'songcourt-rewards', storage: secureJsonStorage },
  ),
);
