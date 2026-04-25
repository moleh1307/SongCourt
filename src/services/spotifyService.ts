import { DEMO_DISPLAY_NAME, DEMO_USER_ID } from '../constants/app';
import { getDemoSnapshot } from '../data/demoTracks';
import type { MusicSnapshot } from '../types/music';
import type { User } from '../types/user';

export const spotifyService = {
  async connect(): Promise<User> {
    return {
      id: DEMO_USER_ID,
      displayName: DEMO_DISPLAY_NAME,
      spotifyConnected: true,
      createdAt: new Date().toISOString(),
    };
  },
  async disconnect() {
    return true;
  },
  async getCurrentUser(): Promise<User> {
    return this.connect();
  },
  async getRecentlyPlayed(): Promise<MusicSnapshot['recentTracks']> {
    return getDemoSnapshot().recentTracks;
  },
  async getTopTracks(): Promise<MusicSnapshot['topTracks']> {
    return getDemoSnapshot().topTracks;
  },
  async getTopArtists(): Promise<MusicSnapshot['topArtists']> {
    return getDemoSnapshot().topArtists;
  },
  async refreshToken() {
    return 'demo-token';
  },
  async getDemoSnapshot(): Promise<MusicSnapshot> {
    return getDemoSnapshot();
  },
};
