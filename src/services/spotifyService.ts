import * as Linking from 'expo-linking';
import { DEMO_DISPLAY_NAME, DEMO_USER_ID } from '../constants/app';
import { getDemoSnapshot } from '../data/demoTracks';
import type { MusicSnapshot } from '../types/music';
import type { User } from '../types/user';
import { apiClient, ApiClientError, API_BASE_URL, futureApiEndpoints } from './apiClient';
import { storageService } from './storageService';

type SpotifySessionResponse = {
  user: User;
  token: string;
};

const OAUTH_STATE_KEY = 'songcourt-spotify-oauth-state';
const APP_RETURN_URI = process.env.EXPO_PUBLIC_SPOTIFY_RETURN_URI ?? 'songcourt://auth/spotify/callback';

const randomState = () => {
  const bytes = new Uint8Array(18);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const demoUser = (): User => ({
  id: DEMO_USER_ID,
  displayName: DEMO_DISPLAY_NAME,
  spotifyConnected: true,
  createdAt: new Date().toISOString(),
});

export const spotifyService = {
  isConfigured() {
    return Boolean(API_BASE_URL);
  },
  getReturnUri() {
    return APP_RETURN_URI;
  },
  async startLogin(): Promise<void> {
    if (!API_BASE_URL) {
      throw new ApiClientError('SongCourt API is not configured for this build.');
    }

    const state = randomState();
    await storageService.setItem(OAUTH_STATE_KEY, state);
    const query = new URLSearchParams({
      returnUri: APP_RETURN_URI,
      state,
    });

    await Linking.openURL(`${API_BASE_URL}${futureApiEndpoints.spotifyStart}?${query.toString()}`);
  },
  async completeLogin(ticket: string, state?: string): Promise<SpotifySessionResponse> {
    const expectedState = await storageService.getItem(OAUTH_STATE_KEY);
    await storageService.removeItem(OAUTH_STATE_KEY);

    if (!state || !expectedState || state !== expectedState) {
      throw new ApiClientError('Spotify login state did not match.');
    }

    return apiClient.request<SpotifySessionResponse, { ticket: string }>(futureApiEndpoints.spotifySession, {
      method: 'POST',
      body: { ticket },
    });
  },
  async connectDemo(): Promise<User> {
    return demoUser();
  },
  async disconnect(token?: string) {
    if (token) {
      await apiClient.request<{ ok: boolean }>(futureApiEndpoints.spotifyDisconnect, { method: 'POST', token });
    }
    return true;
  },
  async getCurrentUser(token?: string): Promise<User> {
    if (!token) return demoUser();
    return apiClient.request<User>(futureApiEndpoints.me, { token });
  },
  async getMusicSnapshot(token?: string): Promise<MusicSnapshot> {
    if (!token) return getDemoSnapshot();
    return apiClient.request<MusicSnapshot>(futureApiEndpoints.spotifySnapshot, { token });
  },
  async getRecentlyPlayed(token?: string): Promise<MusicSnapshot['recentTracks']> {
    return (await this.getMusicSnapshot(token)).recentTracks;
  },
  async getTopTracks(token?: string): Promise<MusicSnapshot['topTracks']> {
    return (await this.getMusicSnapshot(token)).topTracks;
  },
  async getTopArtists(token?: string): Promise<MusicSnapshot['topArtists']> {
    return (await this.getMusicSnapshot(token)).topArtists;
  },
  async getDemoSnapshot(): Promise<MusicSnapshot> {
    return getDemoSnapshot();
  },
};
