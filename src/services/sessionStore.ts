import * as SecureStore from 'expo-secure-store';

import { SongCourtUser } from '../types/songcourt';

export type StoredSongCourtSession = {
  token: string;
  user: SongCourtUser;
  savedAt: string;
};

const sessionKey = 'songcourt:spotify-session';

export async function getStoredSession(): Promise<StoredSongCourtSession | null> {
  try {
    const rawSession = await SecureStore.getItemAsync(sessionKey);
    if (!rawSession) return null;

    const session = JSON.parse(rawSession) as Partial<StoredSongCourtSession>;
    if (!session.token || !session.user) return null;

    return {
      savedAt: session.savedAt ?? new Date().toISOString(),
      token: session.token,
      user: session.user,
    };
  } catch {
    return null;
  }
}

export async function saveStoredSession(token: string, user: SongCourtUser) {
  const session: StoredSongCourtSession = {
    savedAt: new Date().toISOString(),
    token,
    user,
  };

  await SecureStore.setItemAsync(sessionKey, JSON.stringify(session));
  return session;
}

export async function clearStoredSession() {
  await SecureStore.deleteItemAsync(sessionKey);
}
