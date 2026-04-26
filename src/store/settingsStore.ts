import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { secureJsonStorage } from './persist';

type SettingsState = {
  hapticsEnabled: boolean;
  theme: 'dark';
  watermarkEnabled: boolean;
  toggleHaptics: () => void;
  toggleWatermark: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hapticsEnabled: true,
      theme: 'dark',
      watermarkEnabled: true,
      toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
      toggleWatermark: () => set((state) => ({ watermarkEnabled: !state.watermarkEnabled })),
    }),
    { name: 'songcourt-settings', storage: secureJsonStorage },
  ),
);
