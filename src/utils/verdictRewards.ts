import type { MusicSnapshot, MoodTag, Track } from '../types/music';
import type {
  Badge,
  BadgeId,
  CourtRank,
  DailyChallenge,
  DerivedVerdictStat,
  Rarity,
  Verdict,
  VerdictScore,
  VerdictScoreKey,
} from '../types/verdict';
import { clampScore } from './formatting';
import { hashSeed, pickBySeed } from './random';

type CasePacket = {
  caseNumber: string;
  courtPersona: string;
  courtRank: CourtRank;
  xpAwarded: number;
  unlockedBadge: Badge;
  dailyChallenge: DailyChallenge;
  derivedStats: DerivedVerdictStat[];
  shareCaptions: string[];
};

export const rankLadder: Array<{ rank: CourtRank; minXp: number }> = [
  { rank: 'Witness', minXp: 0 },
  { rank: 'Suspect', minXp: 120 },
  { rank: 'Defendant', minXp: 280 },
  { rank: 'Repeat Offender', minXp: 520 },
  { rank: 'Aux Menace', minXp: 860 },
  { rank: 'Court Legend', minXp: 1320 },
];

export const badgeCatalog: Record<BadgeId, Badge> = {
  'repeat-offender': {
    id: 'repeat-offender',
    title: 'Repeat Offender',
    subtitle: 'The replay button filed for protection.',
  },
  'aux-menace': {
    id: 'aux-menace',
    title: 'Aux Menace',
    subtitle: 'Passengers should review the evidence first.',
  },
  'sad-hours-witness': {
    id: 'sad-hours-witness',
    title: 'Sad Hours Witness',
    subtitle: 'The court found emotional fingerprints.',
  },
  'genre-fugitive': {
    id: 'genre-fugitive',
    title: 'Genre Fugitive',
    subtitle: 'No single playlist can contain this behavior.',
  },
  'npc-playlist-suspect': {
    id: 'npc-playlist-suspect',
    title: 'NPC Playlist Suspect',
    subtitle: 'The algorithm recognized the defendant immediately.',
  },
  'main-character-felony': {
    id: 'main-character-felony',
    title: 'Main Character Felony',
    subtitle: 'A camera crew was heavily implied.',
  },
};

const badgeRules: Array<{ id: BadgeId; scoreKey: VerdictScoreKey }> = [
  { id: 'repeat-offender', scoreKey: 'repeatOffender' },
  { id: 'aux-menace', scoreKey: 'auxRisk' },
  { id: 'sad-hours-witness', scoreKey: 'sadnessIndex' },
  { id: 'genre-fugitive', scoreKey: 'genreChaos' },
  { id: 'npc-playlist-suspect', scoreKey: 'npcScore' },
  { id: 'main-character-felony', scoreKey: 'mainCharacterEnergy' },
];

const rarityXp: Record<Rarity, number> = {
  Common: 12,
  Uncommon: 20,
  Rare: 34,
  Epic: 48,
  Legendary: 68,
  Cursed: 76,
  Divine: 88,
  Illegal: 96,
};

const getScore = (scores: VerdictScore[], key: VerdictScoreKey) =>
  scores.find((score) => score.key === key)?.value ?? 0;

export const getAuxRisk = (verdict: Pick<Verdict, 'scores'>) =>
  verdict.scores.find((score) => score.key === 'auxRisk')?.value ?? 0;

export const rankForXp = (xp: number): CourtRank =>
  [...rankLadder].reverse().find((item) => xp >= item.minXp)?.rank ?? 'Witness';

export const getRankProgress = (xp: number) => {
  const currentIndex = rankLadder.findIndex((item) => item.rank === rankForXp(xp));
  const current = rankLadder[currentIndex] ?? rankLadder[0];
  const next = rankLadder[currentIndex + 1];
  if (!next) {
    return {
      current: current.rank,
      next: undefined,
      progress: 1,
      xpIntoRank: xp - current.minXp,
      xpForNext: 0,
    };
  }

  const xpIntoRank = Math.max(0, xp - current.minXp);
  const xpForNext = Math.max(1, next.minXp - current.minXp);
  return {
    current: current.rank,
    next: next.rank,
    progress: Math.min(1, xpIntoRank / xpForNext),
    xpIntoRank,
    xpForNext,
  };
};

const rankForAuxRisk = (auxRisk: number): CourtRank => {
  if (auxRisk >= 92) return 'Court Legend';
  if (auxRisk >= 82) return 'Aux Menace';
  if (auxRisk >= 70) return 'Repeat Offender';
  if (auxRisk >= 54) return 'Defendant';
  if (auxRisk >= 32) return 'Suspect';
  return 'Witness';
};

const severityFor = (value: number): DerivedVerdictStat['severity'] => {
  if (value >= 80) return 'critical';
  if (value >= 60) return 'high';
  if (value >= 35) return 'medium';
  return 'low';
};

const trackKey = (track: Track) => `${track.title.toLowerCase()}::${track.artist.toLowerCase()}`;

const topRecentArtist = (tracks: Track[]) => {
  const counts = tracks.reduce<Record<string, number>>((acc, track) => {
    acc[track.artist] = (acc[track.artist] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
};

const primaryGenre = (track: Track) => track.genres?.[0] ?? 'unknown';
const primaryMood = (track: Track) => track.moodTags?.[0] ?? 'chill';

const countChanges = <T>(items: T[]) =>
  items.reduce((total, item, index) => (index > 0 && item !== items[index - 1] ? total + 1 : total), 0);

const isNightListen = (playedAt?: string) => {
  if (!playedAt) return false;
  const parsed = new Date(playedAt);
  if (Number.isNaN(parsed.getTime())) return false;
  const hour = parsed.getHours();
  return hour >= 0 && hour < 5;
};

const formatPercent = (value: number) => `${Math.round(value)}%`;

export const deriveVerdictStats = (snapshot: MusicSnapshot): DerivedVerdictStat[] => {
  const recentTracks = snapshot.recentTracks;
  const trackCounts = recentTracks.reduce<Record<string, { title: string; count: number }>>((acc, track) => {
    const key = trackKey(track);
    acc[key] = { title: track.title, count: (acc[key]?.count ?? 0) + 1 };
    return acc;
  }, {});
  const repeatEntries = Object.values(trackCounts).sort((a, b) => b.count - a.count);
  const topRepeat = repeatEntries[0] ?? { title: 'No repeats', count: 1 };
  const repeatedTrackCount = repeatEntries.filter((entry) => entry.count > 1).length;
  const replayScore = clampScore(topRepeat.count * 22 + repeatedTrackCount * 10);

  const [artistName = snapshot.topArtists[0]?.name ?? 'Top artist', artistCount = 0] = topRecentArtist(recentTracks) ?? [];
  const artistShare = recentTracks.length ? (artistCount / recentTracks.length) * 100 : 0;

  const genres = recentTracks.map(primaryGenre);
  const uniqueGenres = new Set([
    ...genres.filter((genre) => genre !== 'unknown'),
    ...snapshot.topArtists.flatMap((artist) => artist.genres),
  ]);
  const genreShiftCount = countChanges(genres);
  const genreScore = clampScore(uniqueGenres.size * 8 + genreShiftCount * 7);

  const moods = recentTracks.map(primaryMood as (track: Track) => MoodTag | 'chill');
  const moodShiftCount = countChanges(moods);
  const moodScore = clampScore(moodShiftCount * 11 + new Set(moods).size * 8);

  const nightCount = recentTracks.filter((track) => isNightListen(track.playedAt)).length;
  const nightShare = recentTracks.length ? (nightCount / recentTracks.length) * 100 : 0;

  const knownPopularity = recentTracks.map((track) => track.popularity).filter((value): value is number => value !== undefined);
  const averagePopularity = knownPopularity.length
    ? knownPopularity.reduce((sum, value) => sum + value, 0) / knownPopularity.length
    : 50;

  return [
    {
      key: 'replayCrime',
      label: 'Replay crime',
      value: replayScore,
      detail: `${topRepeat.title} appeared ${topRepeat.count} times in recent evidence.`,
      severity: severityFor(replayScore),
    },
    {
      key: 'artistDependency',
      label: 'Artist dependency',
      value: Math.round(artistShare),
      unit: '%',
      detail: `${artistName} owns ${formatPercent(artistShare)} of the recent docket.`,
      severity: severityFor(artistShare),
    },
    {
      key: 'genreWhiplash',
      label: 'Genre whiplash',
      value: genreScore,
      detail: `${uniqueGenres.size} genre signals with ${genreShiftCount} sharp turns.`,
      severity: severityFor(genreScore),
    },
    {
      key: 'moodSwing',
      label: 'Mood swing',
      value: moodScore,
      detail: `${moodShiftCount} mood shifts across recent listens.`,
      severity: severityFor(moodScore),
    },
    {
      key: 'nightCourt',
      label: 'Night court',
      value: Math.round(nightShare),
      unit: '%',
      detail: `${nightCount} listens landed between midnight and 5 AM.`,
      severity: severityFor(nightShare),
    },
    {
      key: 'mainstreamLiability',
      label: 'Mainstream liability',
      value: Math.round(averagePopularity),
      detail: `Average popularity score across recent tracks is ${Math.round(averagePopularity)}.`,
      severity: severityFor(averagePopularity),
    },
  ];
};

const chooseBadge = (scores: VerdictScore[], createdAt: string): Badge => {
  const best = badgeRules
    .map((rule) => ({ ...rule, value: getScore(scores, rule.scoreKey) }))
    .sort((a, b) => b.value - a.value)[0];
  const badge = badgeCatalog[best?.id ?? 'aux-menace'];
  return { ...badge, unlockedAt: createdAt };
};

const challengePool: Array<Omit<DailyChallenge, 'id'>> = [
  {
    title: 'Break one habit',
    description: 'Play one artist outside your usual top three before tomorrow.',
    rewardXp: 35,
  },
  {
    title: 'Defend yourself publicly',
    description: 'Share your verdict and let the group chat judge the evidence.',
    rewardXp: 30,
  },
  {
    title: 'Genre alibi',
    description: "Listen to a genre that did not appear in today's case packet.",
    rewardXp: 40,
  },
  {
    title: 'Night court curfew',
    description: 'Keep the midnight-to-5 AM evidence clean for one night.',
    rewardXp: 45,
  },
  {
    title: 'Aux redemption arc',
    description: 'Make a five-song playlist that would survive a car ride.',
    rewardXp: 50,
  },
];

const buildCaptions = (verdict: {
  auxRisk: number;
  primaryCharge: string;
  verdictLabel: string;
  badgeTitle: string;
  caseNumber: string;
  rarity: Rarity;
  seed: string;
}) => {
  const captions = [
    `SongCourt gave me ${verdict.auxRisk}/100 Aux Risk. The charge: ${verdict.primaryCharge}`,
    `My Spotify evidence unlocked ${verdict.badgeTitle}. I need a lawyer and a better queue.`,
    `${verdict.caseNumber}: ${verdict.verdictLabel}. I am accepting no questions at this time.`,
    `The court called this ${verdict.rarity}. My group chat will decide if that is fair.`,
    `Who gave me the aux? SongCourt says the evidence is already on file.`,
  ];
  const rotation = hashSeed(`${verdict.seed}-captions`) % captions.length;
  return [...captions.slice(rotation), ...captions.slice(0, rotation)];
};

export const buildCasePacket = ({
  snapshot,
  scores,
  rarity,
  primaryCharge,
  verdictLabel,
  date,
  seed,
  createdAt,
}: {
  snapshot: MusicSnapshot;
  scores: VerdictScore[];
  rarity: Rarity;
  primaryCharge: string;
  verdictLabel: string;
  date: string;
  seed: string;
  createdAt: string;
}): CasePacket => {
  const auxRisk = getScore(scores, 'auxRisk');
  const badge = chooseBadge(scores, createdAt);
  const challenge = pickBySeed(challengePool, `${seed}-challenge`);
  const caseNumber = `SC-${date.replace(/-/g, '').slice(2)}-${String((hashSeed(seed) % 9000) + 1000)}`;
  const xpAwarded = Math.round(30 + auxRisk * 0.7 + rarityXp[rarity]);
  const courtRank = rankForAuxRisk(auxRisk);
  const dailyChallenge = { ...challenge, id: `${date}-${hashSeed(`${seed}-${challenge.title}`)}` };

  return {
    caseNumber,
    courtPersona: badge.title,
    courtRank,
    xpAwarded,
    unlockedBadge: badge,
    dailyChallenge,
    derivedStats: deriveVerdictStats(snapshot),
    shareCaptions: buildCaptions({
      auxRisk,
      primaryCharge,
      verdictLabel,
      badgeTitle: badge.title,
      caseNumber,
      rarity,
      seed,
    }),
  };
};

export const getVerdictCaseNumber = (verdict: Verdict) => verdict.caseNumber ?? `SC-${verdict.date.replace(/-/g, '').slice(2)}`;
export const getVerdictBadge = (verdict: Verdict) => verdict.unlockedBadge ?? chooseBadge(verdict.scores, verdict.createdAt);
export const getVerdictChallenge = (verdict: Verdict) =>
  verdict.dailyChallenge ?? {
    id: `${verdict.date}-share-verdict`,
    title: 'Defend yourself publicly',
    description: 'Share your verdict and let the group chat judge the evidence.',
    rewardXp: 30,
  };
export const getVerdictStats = (verdict: Verdict) =>
  verdict.derivedStats?.length
    ? verdict.derivedStats
    : verdict.scores.map<DerivedVerdictStat>((score, index) => {
        const fallbackKeys: DerivedVerdictStat['key'][] = [
          'mainstreamLiability',
          'replayCrime',
          'artistDependency',
          'genreWhiplash',
          'moodSwing',
          'nightCourt',
        ];
        return {
          key: fallbackKeys[index] ?? 'replayCrime',
          label: score.label,
          value: score.value,
          detail: score.roast,
          severity: severityFor(score.value),
        };
      });
export const getVerdictCaptions = (verdict: Verdict) =>
  verdict.shareCaptions?.length ? verdict.shareCaptions : [verdict.shareCaption];
