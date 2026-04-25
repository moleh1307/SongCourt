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
  scores: VerdictScore[];
  evidence: Evidence[];
  shareCaption: string;
  createdAt: string;
};

export type ShareCardStyle = 'neon' | 'receipt' | 'mugshot' | 'minimal';
