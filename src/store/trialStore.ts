import { create } from 'zustand';
import * as Haptics from 'expo-haptics';
import { spotifyService } from '../services/spotifyService';
import { verdictService } from '../services/verdictService';
import type { AppError } from '../types/error';
import type { Verdict } from '../types/verdict';
import { useHistoryStore } from './historyStore';
import { useSettingsStore } from './settingsStore';

type TrialState = {
  currentVerdict?: Verdict;
  isGenerating: boolean;
  generationStage: number;
  error?: AppError;
  setCurrentVerdict: (verdict?: Verdict) => void;
  setGenerationStage: (stage: number) => void;
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
  generateDemoVerdict: async () => {
    set({ isGenerating: true, error: undefined, generationStage: 0 });
    await haptic(Haptics.ImpactFeedbackStyle.Light);
    try {
      const snapshot = await spotifyService.getDemoSnapshot();
      const verdict = await verdictService.generateVerdict(snapshot);
      useHistoryStore.getState().addVerdict(verdict);
      set({ currentVerdict: verdict, isGenerating: false, generationStage: 4 });
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
