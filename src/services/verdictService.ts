import { DEMO_USER_ID } from '../constants/app';
import { chargeTemplates, sentenceTemplates, shareCaptions } from '../data/copyTemplates';
import { rarityConfig } from '../data/rarityConfig';
import type { MusicSnapshot } from '../types/music';
import type { Evidence, Verdict } from '../types/verdict';
import { todayKey } from '../utils/date';
import { pickBySeed } from '../utils/random';
import { calculateScores, chooseRarity, chooseVerdictLabel } from '../utils/scoring';

const buildEvidence = (snapshot: MusicSnapshot): Evidence[] => {
  const titleCounts = snapshot.recentTracks.reduce<Record<string, number>>((counts, track) => {
    counts[track.title] = (counts[track.title] ?? 0) + 1;
    return counts;
  }, {});
  const [topRepeatedTitle, topRepeatedCount] = Object.entries(titleCounts).sort((a, b) => b[1] - a[1])[0];
  const topArtist = snapshot.topArtists[0]?.name ?? 'one artist';
  const topArtistCount = snapshot.recentTracks.filter((track) => track.artist === topArtist).length;
  const topArtistPercentage = Math.round((topArtistCount / snapshot.recentTracks.length) * 100);

  return [
    {
      id: 'exhibit-a',
      label: 'EXHIBIT A',
      text: `You played "${topRepeatedTitle}" ${topRepeatedCount} times recently.`,
      severity: topRepeatedCount >= 3 ? 'critical' : 'medium',
    },
    {
      id: 'exhibit-b',
      label: 'EXHIBIT B',
      text: `${topArtist} appeared in ${topArtistPercentage}% of recent listens.`,
      severity: topArtistPercentage > 30 ? 'high' : 'medium',
    },
    {
      id: 'exhibit-c',
      label: 'EXHIBIT C',
      text: 'Your genre shift from gym mode to sad evidence was legally concerning.',
      severity: 'high',
    },
  ];
};

export const verdictService = {
  async generateVerdict(snapshot: MusicSnapshot): Promise<Verdict> {
    const date = todayKey();
    const scores = calculateScores(snapshot);
    const verdictLabel = chooseVerdictLabel(scores);
    const rarity = chooseRarity(scores);
    const seed = `${snapshot.userId}-${date}-${verdictLabel}`;
    const charge = pickBySeed(chargeTemplates, `${seed}-charge`);
    const sentence = pickBySeed(sentenceTemplates, `${seed}-sentence`);
    const shareCaption = pickBySeed(shareCaptions, `${seed}-caption`);

    return {
      id: `verdict-${date}`,
      userId: snapshot.userId || DEMO_USER_ID,
      date,
      verdictLabel,
      title: verdictLabel === 'GUILTY' ? 'Highly Illegal' : 'The Court Has Concerns',
      primaryCharge: charge,
      sentence,
      rarity,
      raritySubtitle: rarityConfig[rarity].subtitle,
      scores,
      evidence: buildEvidence(snapshot),
      shareCaption,
      createdAt: new Date().toISOString(),
    };
  },
};
