import { ShareCardPayload, ShareEvidenceItem } from '../components/share-cards/types';
import { colors } from '../design/tokens';
import { sampleShareCard } from '../data/sampleShareCard';
import { MusicSnapshot, SongCourtTrack, SongCourtUser } from '../types/songcourt';

type ScoreInputs = {
  artistDependency: number;
  genreWhiplash: number;
  mainstreamLiability: number;
  moodSwing: number;
  nightCourt: number;
  replayCrime: number;
};

const oneDayMs = 24 * 60 * 60 * 1000;

export function createDemoShareCardPayload(): ShareCardPayload {
  const today = new Date();
  const caseNumber = createCaseNumber(today);

  return {
    ...sampleShareCard,
    caseNumber,
    createdAt: formatDisplayDate(today),
  };
}

export function createShareCardPayloadFromSnapshot(
  snapshot: MusicSnapshot,
  user?: SongCourtUser | null,
): ShareCardPayload {
  const createdAt = new Date(snapshot.createdAt || Date.now());
  const recentTracks = snapshot.recentTracks ?? [];
  const topTracks = snapshot.topTracks ?? [];
  const allTracks = [...recentTracks, ...topTracks];
  const topArtists = snapshot.topArtists ?? [];

  if (allTracks.length === 0 && topArtists.length === 0) {
    return createInsufficientEvidencePayload(createdAt, user);
  }

  const inputs: ScoreInputs = {
    artistDependency: calculateArtistDependency(recentTracks, topTracks),
    genreWhiplash: calculateGenreWhiplash(allTracks, topArtists),
    mainstreamLiability: calculateMainstreamLiability(allTracks, topArtists),
    moodSwing: calculateMoodSwing(recentTracks),
    nightCourt: calculateNightCourt(recentTracks),
    replayCrime: calculateReplayCrime(recentTracks),
  };

  const auxRisk = calculateAuxRisk(inputs);
  const verdict = chooseVerdict(auxRisk, inputs);
  const strongestEvidence = strongestEvidenceKey(inputs);

  return {
    appName: 'SongCourt',
    auxRisk,
    badgeName: verdict.badgeName,
    caseNumber: createCaseNumber(createdAt),
    challengePrompt: challengeForEvidence(strongestEvidence),
    charge: verdict.charge,
    courtPersona: verdict.persona,
    courtRank: verdict.rank,
    createdAt: formatDisplayDate(createdAt),
    evidence: buildEvidence(inputs),
    musicDna: buildMusicDna(allTracks, topArtists),
    verdictTitle: verdict.title,
    watermarkEnabled: true,
  };
}

function createInsufficientEvidencePayload(createdAt: Date, user?: SongCourtUser | null): ShareCardPayload {
  const displayName = user?.displayName?.split(' ')[0] ?? 'Defendant';

  return {
    appName: 'SongCourt',
    auxRisk: 37,
    badgeName: 'Quiet Case',
    caseNumber: createCaseNumber(createdAt),
    challengePrompt: 'Who can produce stronger evidence?',
    charge: `${displayName} gave the court almost no evidence`,
    courtPersona: 'Mysterious Witness',
    courtRank: 'Witness',
    createdAt: formatDisplayDate(createdAt),
    evidence: [
      { key: 'replayCrime', label: 'Replay Crime', value: '0', caption: 'repeat plays found' },
      { key: 'artistDependency', label: 'Artist Dependency', value: '0%', caption: 'top artist share' },
      { key: 'genreWhiplash', label: 'Genre Whiplash', value: '0', caption: 'genres detected' },
      { key: 'mainstreamLiability', label: 'Mainstream Liability', value: '37', caption: 'court class score' },
    ],
    musicDna: [
      { label: 'Mystery', value: 40, color: colors.courtRed },
      { label: 'Silence', value: 30, color: colors.ink },
      { label: 'Unknown', value: 30, color: colors.gold },
    ],
    verdictTitle: 'MUSIC MYSTERY',
    watermarkEnabled: true,
  };
}

function calculateReplayCrime(recentTracks: SongCourtTrack[]) {
  const counts = new Map<string, number>();

  recentTracks.forEach((track) => {
    const key = `${track.title}-${track.artist}`.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return [...counts.values()].reduce((total, count) => total + Math.max(0, count - 1), 0);
}

function calculateArtistDependency(recentTracks: SongCourtTrack[], topTracks: SongCourtTrack[]) {
  const tracks = recentTracks.length > 0 ? recentTracks : topTracks;
  if (tracks.length === 0) return 0;

  const counts = new Map<string, number>();
  tracks.forEach((track) => {
    const artist = track.artist.split(',')[0]?.trim() || 'Unknown';
    counts.set(artist, (counts.get(artist) ?? 0) + 1);
  });

  return Math.round((Math.max(...counts.values()) / tracks.length) * 100);
}

function calculateGenreWhiplash(tracks: SongCourtTrack[], artists: Array<{ genres?: string[] }>) {
  const genres = new Set(
    [
      ...tracks.flatMap((track) => track.genres ?? []),
      ...artists.flatMap((artist) => artist.genres ?? []),
    ].map((genre) => genre.toLowerCase()),
  );

  return genres.size;
}

function calculateMoodSwing(recentTracks: SongCourtTrack[]) {
  const moods = recentTracks.map((track) => track.moodTags?.[0]).filter(Boolean);

  return moods.reduce((changes, mood, index) => {
    if (index === 0) return changes;
    return mood !== moods[index - 1] ? changes + 1 : changes;
  }, 0);
}

function calculateNightCourt(recentTracks: SongCourtTrack[]) {
  return recentTracks.filter((track) => {
    if (!track.playedAt) return false;
    const hour = new Date(track.playedAt).getHours();
    return hour >= 0 && hour < 5;
  }).length;
}

function calculateMainstreamLiability(
  tracks: SongCourtTrack[],
  artists: Array<{ popularity?: number }>,
) {
  const popularityScores = [
    ...tracks.map((track) => track.popularity),
    ...artists.map((artist) => artist.popularity),
  ].filter((score): score is number => typeof score === 'number');

  if (popularityScores.length === 0) return 48;

  return Math.round(
    popularityScores.reduce((total, score) => total + score, 0) / popularityScores.length,
  );
}

function calculateAuxRisk(inputs: ScoreInputs) {
  const replay = Math.min(inputs.replayCrime * 6, 28);
  const dependency = inputs.artistDependency * 0.22;
  const whiplash = Math.min(inputs.genreWhiplash * 2.1, 20);
  const mood = Math.min(inputs.moodSwing * 2.4, 16);
  const night = Math.min(inputs.nightCourt * 3, 14);
  const mainstream = inputs.mainstreamLiability * 0.18;

  return clamp(Math.round(12 + replay + dependency + whiplash + mood + night + mainstream), 18, 98);
}

function chooseVerdict(auxRisk: number, inputs: ScoreInputs) {
  if (inputs.replayCrime >= 8) {
    return {
      badgeName: 'Repeat Offender',
      charge: 'Guilty of looping evidence until it confessed',
      persona: 'Main Character Felony',
      rank: rankForRisk(auxRisk),
      title: 'AUX MENACE',
    };
  }

  if (inputs.genreWhiplash >= 12 || inputs.moodSwing >= 10) {
    return {
      badgeName: 'Genre Fugitive',
      charge: 'Guilty of swerving across genres without signaling',
      persona: 'Playlist Flight Risk',
      rank: rankForRisk(auxRisk),
      title: 'GENRE FUGITIVE',
    };
  }

  if (inputs.nightCourt >= 6) {
    return {
      badgeName: 'Sad Hours Witness',
      charge: 'Guilty of bringing evidence after midnight',
      persona: 'Night Court Regular',
      rank: rankForRisk(auxRisk),
      title: 'NIGHT COURT',
    };
  }

  if (inputs.mainstreamLiability >= 72) {
    return {
      badgeName: 'NPC Playlist Suspect',
      charge: 'Guilty of trusting the algorithm with the aux',
      persona: 'Chart Court Defendant',
      rank: rankForRisk(auxRisk),
      title: 'CHART SUSPECT',
    };
  }

  return {
    badgeName: auxRisk >= 70 ? 'Aux Menace' : 'Taste Witness',
    charge: auxRisk >= 70 ? 'Guilty of risky but entertaining taste' : 'Suspiciously balanced taste',
    persona: auxRisk >= 70 ? 'Aux Risk Defendant' : 'Reliable Witness',
    rank: rankForRisk(auxRisk),
    title: auxRisk >= 70 ? 'AUX MENACE' : 'CLEAN RECORD',
  };
}

function buildEvidence(inputs: ScoreInputs): ShareEvidenceItem[] {
  return [
    {
      caption: 'repeat plays found',
      key: 'replayCrime',
      label: 'Replay Crime',
      value: String(inputs.replayCrime),
    },
    {
      caption: 'top artist share',
      key: 'artistDependency',
      label: 'Artist Dependency',
      value: `${inputs.artistDependency}%`,
    },
    {
      caption: 'genres detected',
      key: 'genreWhiplash',
      label: 'Genre Whiplash',
      value: String(inputs.genreWhiplash),
    },
    {
      caption: 'late-night listens',
      key: 'nightCourt',
      label: 'Night Court',
      value: String(inputs.nightCourt),
    },
    {
      caption: 'mood changes',
      key: 'moodSwing',
      label: 'Mood Swing',
      value: String(inputs.moodSwing),
    },
    {
      caption: 'court class score',
      key: 'mainstreamLiability',
      label: 'Mainstream Liability',
      value: String(inputs.mainstreamLiability),
    },
  ];
}

function buildMusicDna(tracks: SongCourtTrack[], artists: Array<{ genres?: string[] }>) {
  const counts = new Map<string, number>();
  const palette = [colors.courtRed, colors.cobalt, colors.violet, colors.lime, colors.gold];

  [...tracks.flatMap((track) => track.genres ?? []), ...artists.flatMap((artist) => artist.genres ?? [])]
    .map((genre) => simplifyGenre(genre))
    .filter(Boolean)
    .forEach((genre) => counts.set(genre, (counts.get(genre) ?? 0) + 1));

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (sorted.length === 0) {
    return [
      { label: 'Replay', value: 30, color: colors.courtRed },
      { label: 'Mood', value: 25, color: colors.violet },
      { label: 'Night', value: 20, color: colors.ink },
      { label: 'Charts', value: 15, color: colors.lime },
      { label: 'Wild', value: 10, color: colors.gold },
    ];
  }

  const total = sorted.reduce((sum, [, count]) => sum + count, 0);

  return sorted.map(([label, count], index) => ({
    color: palette[index % palette.length],
    label,
    value: Math.max(8, Math.round((count / total) * 100)),
  }));
}

function simplifyGenre(genre: string) {
  const cleaned = genre
    .replace(/\bmodern\b|\bindie\b|\balternative\b|\bclassic\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return 'Alt';

  return cleaned
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function strongestEvidenceKey(inputs: ScoreInputs): keyof ScoreInputs {
  const normalized: Record<keyof ScoreInputs, number> = {
    artistDependency: inputs.artistDependency,
    genreWhiplash: inputs.genreWhiplash * 6,
    mainstreamLiability: inputs.mainstreamLiability,
    moodSwing: inputs.moodSwing * 8,
    nightCourt: inputs.nightCourt * 10,
    replayCrime: inputs.replayCrime * 10,
  };

  return Object.entries(normalized).sort((a, b) => b[1] - a[1])[0][0] as keyof ScoreInputs;
}

function challengeForEvidence(key: keyof ScoreInputs) {
  const challenges: Record<keyof ScoreInputs, string> = {
    artistDependency: 'Tag someone more loyal to one artist.',
    genreWhiplash: 'Send this to the friend with chaotic playlists.',
    mainstreamLiability: 'Who trusted the algorithm harder?',
    moodSwing: 'Who changed moods faster this week?',
    nightCourt: 'Who else was listening after midnight?',
    replayCrime: 'Who replayed one song more than this?',
  };

  return challenges[key];
}

function rankForRisk(auxRisk: number) {
  if (auxRisk >= 92) return 'Court Legend';
  if (auxRisk >= 82) return 'Aux Menace';
  if (auxRisk >= 68) return 'Repeat Offender';
  if (auxRisk >= 52) return 'Defendant';
  if (auxRisk >= 35) return 'Suspect';
  return 'Witness';
}

function createCaseNumber(date: Date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / oneDayMs);
  return `CASE #${String(date.getFullYear()).slice(2)}${String(dayOfYear).padStart(3, '0')}`;
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
