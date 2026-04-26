import type { MusicSnapshot, MoodTag } from '../types/music';
import type { Rarity, VerdictLabel, VerdictScore } from '../types/verdict';
import { clampScore } from './formatting';

const countMood = (snapshot: MusicSnapshot, mood: MoodTag) =>
  [...snapshot.recentTracks, ...snapshot.topTracks, ...snapshot.topArtists].filter((item) =>
    item.moodTags?.includes(mood),
  ).length;

export const calculateScores = (snapshot: MusicSnapshot): VerdictScore[] => {
  const trackCounts = snapshot.recentTracks.reduce<Record<string, number>>((counts, track) => {
    counts[track.title] = (counts[track.title] ?? 0) + 1;
    return counts;
  }, {});
  const maxRepeat = Math.max(0, ...Object.values(trackCounts));
  const uniqueGenres = new Set([
    ...snapshot.recentTracks.flatMap((track) => track.genres ?? []),
    ...snapshot.topArtists.flatMap((artist) => artist.genres),
  ]).size;
  const sadnessIndex = clampScore(countMood(snapshot, 'sad') * 13 + countMood(snapshot, 'romantic') * 5);
  const repeatOffender = clampScore(maxRepeat * 24 + Object.values(trackCounts).filter((count) => count > 1).length * 12);
  const genreChaos = clampScore(uniqueGenres * 10 + countMood(snapshot, 'chaotic') * 9);
  const mainCharacterEnergy = clampScore(countMood(snapshot, 'cinematic') * 18 + countMood(snapshot, 'intense') * 10);
  const npcScore = clampScore(
    snapshot.recentTracks.length
      ? snapshot.recentTracks.reduce((sum, track) => sum + (track.popularity ?? 50), 0) / snapshot.recentTracks.length
      : 50,
  );
  const auxRisk = clampScore(
    0.3 * repeatOffender +
      0.25 * genreChaos +
      0.2 * sadnessIndex +
      0.15 * npcScore +
      0.1 * mainCharacterEnergy,
  );

  return [
    { key: 'auxRisk', label: 'Aux Risk', value: auxRisk, roast: 'The aux cable has requested distance.' },
    { key: 'sadnessIndex', label: 'Sadness Index', value: sadnessIndex, roast: 'This playlist has emotional evidence.' },
    { key: 'repeatOffender', label: 'Repeat Offender', value: repeatOffender, roast: 'One song is fighting for its life.' },
    { key: 'genreChaos', label: 'Genre Chaos', value: genreChaos, roast: 'The genre map left the courtroom.' },
    { key: 'mainCharacterEnergy', label: 'Main Character Energy', value: mainCharacterEnergy, roast: 'A camera crew was implied.' },
    { key: 'npcScore', label: 'NPC Score', value: npcScore, roast: 'The algorithm recognizes you immediately.' },
  ];
};

export const chooseVerdictLabel = (scores: VerdictScore[]): VerdictLabel => {
  const byKey = Object.fromEntries(scores.map((score) => [score.key, score.value]));
  if (byKey.repeatOffender > 80) return 'REPEAT OFFENDER';
  if (byKey.sadnessIndex > 75) return 'SUSPICIOUS';
  if (byKey.genreChaos > 75) return 'GENRE CHAOS';
  if (byKey.auxRisk > 85) return 'GUILTY';
  if (byKey.mainCharacterEnergy > 80) return 'MAIN CHARACTER FELONY';
  if (byKey.npcScore > 80) return 'NPC PLAYLIST DEPENDENCY';
  if (byKey.auxRisk > 60) return 'AUX PROBATION';
  return 'NOT GUILTY BUT WEIRD';
};

export const chooseRarity = (scores: VerdictScore[]): Rarity => {
  const byKey = Object.fromEntries(scores.map((score) => [score.key, score.value]));
  if (byKey.auxRisk > 90 && byKey.repeatOffender > 85) return 'Illegal';
  if (byKey.sadnessIndex > 90) return 'Cursed';
  if (byKey.mainCharacterEnergy > 92) return 'Legendary';
  if (byKey.auxRisk > 82 && byKey.genreChaos > 70) return 'Epic';
  if (byKey.auxRisk > 72) return 'Rare';
  if (byKey.auxRisk > 48) return 'Uncommon';
  return 'Common';
};
