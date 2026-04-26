import { colors } from '../design/tokens';
import { ShareCardPayload } from '../components/share-cards/types';

export const sampleShareCard: ShareCardPayload = {
  appName: 'SongCourt',
  caseNumber: 'CASE #10247',
  verdictTitle: 'AUX MENACE',
  auxRisk: 91,
  charge: 'Guilty of replaying the same 4 songs',
  courtPersona: 'Main Character Felony',
  courtRank: 'Defendant',
  badgeName: 'Repeat Offender',
  createdAt: 'Apr 26, 2026',
  watermarkEnabled: true,
  challengePrompt: 'Who gave me the aux?',
  evidence: [
    {
      key: 'replayCrime',
      label: 'Replay Crime',
      value: '28',
      caption: 'replays',
    },
    {
      key: 'artistDependency',
      label: 'Artist Dependency',
      value: '73%',
      caption: 'top artist share',
    },
    {
      key: 'nightCourt',
      label: 'Night Court',
      value: '14',
      caption: 'late-night sessions',
    },
    {
      key: 'genreWhiplash',
      label: 'Genre Whiplash',
      value: '4.2',
      caption: 'genres per week',
    },
  ],
  musicDna: [
    { label: 'Hip-Hop', value: 28, color: colors.courtRed },
    { label: 'Indie', value: 24, color: colors.cobalt },
    { label: 'R&B', value: 20, color: colors.violet },
    { label: 'Pop', value: 16, color: colors.lime },
    { label: 'Rock', value: 12, color: colors.gold },
  ],
};
