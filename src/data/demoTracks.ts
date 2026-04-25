import { DEMO_USER_ID } from '../constants/app';
import type { Artist, MusicSnapshot, Track } from '../types/music';

export const demoRecentTracks: Track[] = [
  { id: 't1', title: 'Midnight Damage', artist: 'The Courtroom Echo', popularity: 72, genres: ['alt pop'], moodTags: ['sad', 'cinematic'], playedAt: '2026-04-25T19:12:00Z' },
  { id: 't2', title: 'Midnight Damage', artist: 'The Courtroom Echo', popularity: 72, genres: ['alt pop'], moodTags: ['sad', 'cinematic'], playedAt: '2026-04-25T18:40:00Z' },
  { id: 't3', title: 'PR Mode', artist: 'Bench Press Saints', popularity: 64, genres: ['gym rap'], moodTags: ['gym', 'intense'], playedAt: '2026-04-25T16:20:00Z' },
  { id: 't4', title: 'Text Back Anthem', artist: 'Vibe Defendant', popularity: 89, genres: ['pop'], moodTags: ['mainstream', 'romantic'], playedAt: '2026-04-25T15:08:00Z' },
  { id: 't5', title: 'Club Evidence', artist: 'Neon Bailiff', popularity: 81, genres: ['dance'], moodTags: ['party', 'mainstream'], playedAt: '2026-04-25T14:01:00Z' },
  { id: 't6', title: 'Midnight Damage', artist: 'The Courtroom Echo', popularity: 72, genres: ['alt pop'], moodTags: ['sad', 'cinematic'], playedAt: '2026-04-25T12:22:00Z' },
  { id: 't7', title: 'Wrong Exit Freestyle', artist: 'Chaos Cab', popularity: 48, genres: ['hyperpop'], moodTags: ['chaotic'], playedAt: '2026-04-25T10:44:00Z' },
  { id: 't8', title: 'Rain Window Monologue', artist: 'Soft Witness', popularity: 58, genres: ['indie'], moodTags: ['sad', 'romantic'], playedAt: '2026-04-24T23:30:00Z' },
  { id: 't9', title: 'PR Mode', artist: 'Bench Press Saints', popularity: 64, genres: ['gym rap'], moodTags: ['gym', 'intense'], playedAt: '2026-04-24T21:10:00Z' },
  { id: 't10', title: 'The Group Chat Knows', artist: 'Vibe Defendant', popularity: 86, genres: ['pop rap'], moodTags: ['mainstream', 'chaotic'], playedAt: '2026-04-24T20:05:00Z' },
];

export const demoTopTracks: Track[] = [
  ...demoRecentTracks,
  { id: 't11', title: 'Main Character Walk', artist: 'Soft Witness', popularity: 77, genres: ['indie pop'], moodTags: ['cinematic', 'romantic'] },
  { id: 't12', title: 'Receipt Printer', artist: 'Neon Bailiff', popularity: 66, genres: ['electronic'], moodTags: ['party', 'chaotic'] },
];

export const demoTopArtists: Artist[] = [
  { id: 'a1', name: 'The Courtroom Echo', genres: ['alt pop', 'sad pop'], popularity: 72, moodTags: ['sad', 'cinematic'] },
  { id: 'a2', name: 'Vibe Defendant', genres: ['pop', 'pop rap'], popularity: 89, moodTags: ['mainstream', 'romantic'] },
  { id: 'a3', name: 'Bench Press Saints', genres: ['gym rap'], popularity: 64, moodTags: ['gym', 'intense'] },
  { id: 'a4', name: 'Neon Bailiff', genres: ['dance', 'electronic'], popularity: 81, moodTags: ['party', 'chaotic'] },
  { id: 'a5', name: 'Soft Witness', genres: ['indie', 'indie pop'], popularity: 58, moodTags: ['sad', 'romantic'] },
];

export const getDemoSnapshot = (): MusicSnapshot => ({
  id: `snapshot-${new Date().toISOString().slice(0, 10)}`,
  userId: DEMO_USER_ID,
  createdAt: new Date().toISOString(),
  recentTracks: demoRecentTracks,
  topTracks: demoTopTracks,
  topArtists: demoTopArtists,
});
