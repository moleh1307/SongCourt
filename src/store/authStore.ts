import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { spotifyService } from '../services/spotifyService';
import type { User } from '../types/user';
import { secureJsonStorage } from './persist';

type AuthState = {
  user?: User;
  hasCompletedOnboarding: boolean;
  spotifyConnected: boolean;
  isDemoMode: boolean;
  setUser: (user: User) => void;
  completeOnboarding: () => void;
  connectSpotifyDemo: () => Promise<void>;
  disconnectSpotify: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      spotifyConnected: false,
      isDemoMode: false,
      setUser: (user) => set({ user, spotifyConnected: user.spotifyConnected }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      connectSpotifyDemo: async () => {
        const user = await spotifyService.connect();
        set({ user, spotifyConnected: true, isDemoMode: true, hasCompletedOnboarding: true });
      },
      disconnectSpotify: () => set({ user: undefined, spotifyConnected: false, isDemoMode: false }),
    }),
    { name: 'songcourt-auth', storage: secureJsonStorage },
  ),
);
