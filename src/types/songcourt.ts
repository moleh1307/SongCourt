export type SongCourtUser = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  spotifyConnected: boolean;
  createdAt: string;
};

export type SongCourtTrack = {
  id?: string;
  title: string;
  artist: string;
  album?: string;
  albumImageUrl?: string;
  playedAt?: string;
  durationMs?: number;
  popularity?: number;
  genres?: string[];
  moodTags?: string[];
};

export type SongCourtArtist = {
  id?: string;
  name: string;
  genres?: string[];
  imageUrl?: string;
  popularity?: number;
  moodTags?: string[];
};

export type MusicSnapshot = {
  id: string;
  userId: string;
  createdAt: string;
  recentTracks: SongCourtTrack[];
  topTracks: SongCourtTrack[];
  topArtists: SongCourtArtist[];
  warnings?: string[];
};
