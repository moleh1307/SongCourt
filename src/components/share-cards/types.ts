export type EvidenceKey =
  | 'replayCrime'
  | 'artistDependency'
  | 'genreWhiplash'
  | 'moodSwing'
  | 'nightCourt'
  | 'mainstreamLiability';

export type ShareEvidenceItem = {
  key: EvidenceKey;
  label: string;
  value: string;
  caption: string;
};

export type MusicDnaSlice = {
  label: string;
  value: number;
  color: string;
};

export type ShareCardPayload = {
  appName: 'SongCourt';
  caseNumber: string;
  verdictTitle: string;
  auxRisk: number;
  charge: string;
  courtPersona: string;
  courtRank: string;
  badgeName?: string;
  evidence: ShareEvidenceItem[];
  musicDna?: MusicDnaSlice[];
  challengePrompt?: string;
  createdAt: string;
  watermarkEnabled: boolean;
};
