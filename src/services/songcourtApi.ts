import { Linking } from 'react-native';

import { MusicSnapshot, SongCourtUser } from '../types/songcourt';

type SessionResponse = {
  token: string;
  user: SongCourtUser;
};

export const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://song-court.vercel.app';

export const spotifyReturnUri =
  process.env.EXPO_PUBLIC_SPOTIFY_RETURN_URI ?? 'songcourt://auth/spotify/callback';

export function createAuthState() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function openSpotifyLogin(state: string) {
  const url = `${apiBaseUrl}/auth/spotify/start?${new URLSearchParams({
    returnUri: spotifyReturnUri,
    state,
  }).toString()}`;

  await Linking.openURL(url);
}

export async function createSessionFromTicket(ticket: string): Promise<SessionResponse> {
  const response = await fetch(`${apiBaseUrl}/auth/spotify/session`, {
    body: JSON.stringify({ ticket }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  return parseJsonResponse<SessionResponse>(response);
}

export async function fetchMusicSnapshot(token: string): Promise<MusicSnapshot> {
  const response = await fetch(`${apiBaseUrl}/spotify/snapshot`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<MusicSnapshot>(response);
}

export async function disconnectSpotify(token: string) {
  const response = await fetch(`${apiBaseUrl}/auth/spotify/disconnect`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'POST',
  });

  return parseJsonResponse<{ ok: boolean }>(response);
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => undefined);

  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : `Request failed with ${response.status}`;

    throw new Error(message);
  }

  return body as T;
}
