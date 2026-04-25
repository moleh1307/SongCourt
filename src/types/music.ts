export type MoodTag =
  | 'sad'
  | 'gym'
  | 'party'
  | 'chill'
  | 'romantic'
  | 'mainstream'
  | 'chaotic'
  | 'cinematic'
  | 'intense';

export type Track = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumImageUrl?: string;
  playedAt?: string;
  durationMs?: number;
  popularity?: number;
  genres?: string[];
  moodTags?: MoodTag[];
};

export type Artist = {
  id: string;
  name: string;
  genres: string[];
  imageUrl?: string;
  popularity?: number;
  moodTags?: MoodTag[];
};

export type MusicSnapshot = {
  id: string;
  userId: string;
  createdAt: string;
  recentTracks: Track[];
  topTracks: Track[];
  topArtists: Artist[];
};
