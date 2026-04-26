import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { spotifyService } from '../services/spotifyService';
import type { User } from '../types/user';
import { secureJsonStorage } from './persist';

type AuthState = {
  user?: User;
  authToken?: string;
  hasCompletedOnboarding: boolean;
  spotifyConnected: boolean;
  isDemoMode: boolean;
  setUser: (user: User) => void;
  completeOnboarding: () => void;
  startSpotifyLogin: () => Promise<void>;
  completeSpotifyLogin: (ticket: string, state?: string) => Promise<void>;
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
      startSpotifyLogin: () => spotifyService.startLogin(),
      completeSpotifyLogin: async (ticket, state) => {
        const { user, token } = await spotifyService.completeLogin(ticket, state);
        set({ user, authToken: token, spotifyConnected: true, isDemoMode: false, hasCompletedOnboarding: true });
      },
      connectSpotifyDemo: async () => {
        const user = await spotifyService.connectDemo();
        set({ user, authToken: undefined, spotifyConnected: true, isDemoMode: true, hasCompletedOnboarding: true });
      },
      disconnectSpotify: () => {
        const token = useAuthStore.getState().authToken;
        void spotifyService.disconnect(token).catch(() => undefined);
        set({ user: undefined, authToken: undefined, spotifyConnected: false, isDemoMode: false });
      },
    }),
    { name: 'songcourt-auth', storage: secureJsonStorage },
  ),
);
