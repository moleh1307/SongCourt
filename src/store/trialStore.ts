import { create } from 'zustand';
import * as Haptics from 'expo-haptics';
import { spotifyService } from '../services/spotifyService';
import { analyticsService } from '../services/analyticsService';
import { verdictService } from '../services/verdictService';
import type { AppError } from '../types/error';
import type { Verdict } from '../types/verdict';
import { useAuthStore } from './authStore';
import { useHistoryStore } from './historyStore';
import { useRewardStore } from './rewardStore';
import { useSettingsStore } from './settingsStore';

type TrialState = {
  currentVerdict?: Verdict;
  isGenerating: boolean;
  generationStage: number;
  error?: AppError;
  setCurrentVerdict: (verdict?: Verdict) => void;
  setGenerationStage: (stage: number) => void;
  generateVerdict: () => Promise<Verdict>;
  generateDemoVerdict: () => Promise<Verdict>;
  clearCurrentVerdict: () => void;
};

const haptic = async (style: Haptics.ImpactFeedbackStyle) => {
  if (!useSettingsStore.getState().hapticsEnabled) return;
  try {
    await Haptics.impactAsync(style);
  } catch {
    // Haptics are enhancement-only.
  }
};

export const useTrialStore = create<TrialState>((set) => ({
  isGenerating: false,
  generationStage: 0,
  setCurrentVerdict: (verdict) => set({ currentVerdict: verdict }),
  setGenerationStage: (stage) => set({ generationStage: stage }),
  generateVerdict: async () => {
    set({ isGenerating: true, error: undefined, generationStage: 0 });
    const auth = useAuthStore.getState();
    analyticsService.track('trial_generation_started', { is_demo_mode: auth.isDemoMode });
    await haptic(Haptics.ImpactFeedbackStyle.Light);
    try {
      const snapshot = auth.isDemoMode ? await spotifyService.getDemoSnapshot() : await spotifyService.getMusicSnapshot(auth.authToken);
      const verdict = await verdictService.generateVerdict(snapshot);
      useHistoryStore.getState().addVerdict(verdict);
      useRewardStore.getState().recordVerdict(verdict);
      set({ currentVerdict: verdict, isGenerating: false, generationStage: 4 });
      analyticsService.track('trial_generation_completed', {
        is_demo_mode: auth.isDemoMode,
        verdict_id: verdict.id,
        aux_risk_score: verdict.scores.find((score) => score.key === 'auxRisk')?.value,
        rarity: verdict.rarity,
        badge: verdict.unlockedBadge?.id,
        court_rank: verdict.courtRank,
        xp_awarded: verdict.xpAwarded,
        date: verdict.date,
      });
      await haptic(Haptics.ImpactFeedbackStyle.Heavy);
      return verdict;
    } catch (cause) {
      console.warn('SongCourt trial generation failed', cause);
      const error = {
        code: 'trial_generation_failed',
        title: 'The evidence room is locked.',
        message: 'The verdict could not leave the courtroom.',
        actionLabel: 'Try Again',
      };
      set({ error, isGenerating: false });
      throw error;
    }
  },
  generateDemoVerdict: async () => {
    set({ isGenerating: true, error: undefined, generationStage: 0 });
    analyticsService.track('trial_generation_started', { is_demo_mode: true });
    await haptic(Haptics.ImpactFeedbackStyle.Light);
    try {
      const snapshot = await spotifyService.getDemoSnapshot();
      const verdict = await verdictService.generateVerdict(snapshot);
      useHistoryStore.getState().addVerdict(verdict);
      useRewardStore.getState().recordVerdict(verdict);
      set({ currentVerdict: verdict, isGenerating: false, generationStage: 4 });
      analyticsService.track('trial_generation_completed', {
        is_demo_mode: true,
        verdict_id: verdict.id,
        aux_risk_score: verdict.scores.find((score) => score.key === 'auxRisk')?.value,
        rarity: verdict.rarity,
        badge: verdict.unlockedBadge?.id,
        court_rank: verdict.courtRank,
        xp_awarded: verdict.xpAwarded,
        date: verdict.date,
      });
      await haptic(Haptics.ImpactFeedbackStyle.Heavy);
      return verdict;
    } catch {
      const error = {
        code: 'trial_generation_failed',
        title: 'The evidence room is locked.',
        message: 'The verdict could not leave the courtroom.',
        actionLabel: 'Try Again',
      };
      set({ error, isGenerating: false });
      throw error;
    }
  },
  clearCurrentVerdict: () => set({ currentVerdict: undefined, generationStage: 0 }),
}));
