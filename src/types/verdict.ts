export type VerdictLabel =
  | 'GUILTY'
  | 'SUSPICIOUS'
  | 'AUX PROBATION'
  | 'NOT GUILTY BUT WEIRD'
  | 'REPEAT OFFENDER'
  | 'GENRE CHAOS'
  | 'MAIN CHARACTER FELONY'
  | 'NPC PLAYLIST DEPENDENCY'
  | 'GYM ARC VIOLATION';

export type VerdictScoreKey =
  | 'auxRisk'
  | 'sadnessIndex'
  | 'repeatOffender'
  | 'genreChaos'
  | 'mainCharacterEnergy'
  | 'npcScore';

export type VerdictScore = {
  key: VerdictScoreKey;
  label: string;
  value: number;
  roast: string;
};

export type Evidence = {
  id: string;
  label: string;
  text: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
};

export type CourtRank = 'Witness' | 'Suspect' | 'Defendant' | 'Repeat Offender' | 'Aux Menace' | 'Court Legend';

export type BadgeId =
  | 'repeat-offender'
  | 'aux-menace'
  | 'sad-hours-witness'
  | 'genre-fugitive'
  | 'npc-playlist-suspect'
  | 'main-character-felony';

export type Badge = {
  id: BadgeId;
  title: string;
  subtitle: string;
  unlockedAt?: string;
};

export type DailyChallenge = {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
};

export type DerivedVerdictStatKey =
  | 'replayCrime'
  | 'artistDependency'
  | 'genreWhiplash'
  | 'moodSwing'
  | 'nightCourt'
  | 'mainstreamLiability';

export type DerivedVerdictStat = {
  key: DerivedVerdictStatKey;
  label: string;
  value: number;
  unit?: string;
  detail: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
};

export type Rarity =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Legendary'
  | 'Cursed'
  | 'Divine'
  | 'Illegal';

export type Verdict = {
  id: string;
  userId: string;
  date: string;
  verdictLabel: VerdictLabel;
  title: string;
  primaryCharge: string;
  sentence: string;
  rarity: Rarity;
  raritySubtitle: string;
  caseNumber: string;
  courtPersona: string;
  courtRank: CourtRank;
  xpAwarded: number;
  unlockedBadge?: Badge;
  dailyChallenge?: DailyChallenge;
  derivedStats: DerivedVerdictStat[];
  scores: VerdictScore[];
  evidence: Evidence[];
  shareCaption: string;
  shareCaptions: string[];
  createdAt: string;
};

export type ShareCardStyle = 'poster' | 'receipt' | 'challenge';
