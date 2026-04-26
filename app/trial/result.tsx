import { useEffect, useMemo, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { ChargeCard } from '../../src/components/trial/ChargeCard';
import { EvidenceCard } from '../../src/components/trial/EvidenceCard';
import { RarityBadge } from '../../src/components/trial/RarityBadge';
import { SentenceCard } from '../../src/components/trial/SentenceCard';
import { VerdictStamp } from '../../src/components/trial/VerdictStamp';
import { CourtCard } from '../../src/components/common/CourtCard';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SecondaryButton } from '../../src/components/common/SecondaryButton';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { colors } from '../../src/constants/colors';
import { useHistoryStore } from '../../src/store/historyStore';
import { useRewardStore } from '../../src/store/rewardStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useTrialStore } from '../../src/store/trialStore';
import { formatDisplayDate } from '../../src/utils/date';
import {
  getAuxRisk,
  getVerdictBadge,
  getVerdictCaseNumber,
  getVerdictChallenge,
  getVerdictStats,
} from '../../src/utils/verdictRewards';

const verdictPoster = require('../../assets/premium/verdict-poster-bg.png');

export default function TrialResultScreen() {
  const currentVerdict = useTrialStore((state) => state.currentVerdict);
  const todayVerdict = useHistoryStore((state) => state.getTodayVerdict());
  const completedChallengeIds = useRewardStore((state) => state.completedDailyChallenges);
  const completeDailyChallenge = useRewardStore((state) => state.completeDailyChallenge);
  const hapticsEnabled = useSettingsStore((state) => state.hapticsEnabled);
  const verdict = currentVerdict ?? todayVerdict;
  const [revealStep, setRevealStep] = useState(0);
  const [displayAux, setDisplayAux] = useState(0);
  const [showEvidence, setShowEvidence] = useState(false);
  const aux = verdict ? getAuxRisk(verdict) : 0;

  useEffect(() => {
    if (!verdict) return undefined;
    setRevealStep(0);
    setDisplayAux(0);
    setShowEvidence(false);

    const timers = [120, 520, 960, 1340, 1700].map((delay, index) =>
      setTimeout(() => {
        setRevealStep(index + 1);
        if (hapticsEnabled) {
          const feedback =
            index === 0
              ? Haptics.ImpactFeedbackStyle.Heavy
              : index === 2
                ? Haptics.ImpactFeedbackStyle.Medium
                : Haptics.ImpactFeedbackStyle.Light;
          void Haptics.impactAsync(feedback);
        }
      }, delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [hapticsEnabled, verdict]);

  useEffect(() => {
    if (!verdict || revealStep < 3) return undefined;
    let frame = 0;
    const totalFrames = 24;
    const ticker = setInterval(() => {
      frame += 1;
      setDisplayAux(Math.min(aux, Math.round((aux * frame) / totalFrames)));
      if (frame >= totalFrames) clearInterval(ticker);
    }, 28);
    return () => clearInterval(ticker);
  }, [aux, revealStep, verdict]);

  const casePacket = useMemo(() => {
    if (!verdict) return undefined;
    return {
      badge: getVerdictBadge(verdict),
      challenge: getVerdictChallenge(verdict),
      stats: getVerdictStats(verdict),
      caseNumber: getVerdictCaseNumber(verdict),
    };
  }, [verdict]);

  useEffect(() => {
    if (verdict && hapticsEnabled && revealStep === 5) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [hapticsEnabled, revealStep, verdict]);

  if (!verdict) {
    return (
      <Screen>
        <SectionHeader title="No verdict sealed." />
        <Text style={styles.muted}>The court needs evidence before it can judge you.</Text>
        <NeonButton onPress={() => router.replace('/trial/loading')}>Open Today's Case</NeonButton>
      </Screen>
    );
  }

  const supportingScores = verdict.scores.filter((score) => score.key !== 'auxRisk').slice(0, 4);
  const challengeCompleted = casePacket ? completedChallengeIds.includes(casePacket.challenge.id) : false;

  return (
    <Screen>
      <SectionHeader eyebrow={casePacket?.caseNumber ?? 'DAILY VERDICT'} title={formatDisplayDate(verdict.date)} />

      <View style={styles.posterHero}>
        <ImageBackground source={verdictPoster} resizeMode="cover" style={styles.posterImage}>
          <View style={styles.posterScrim}>
            <Text style={styles.posterKicker}>{revealStep < 2 ? 'GAVEL SLAM INCOMING' : 'THE COURT HAS SPOKEN'}</Text>
            {revealStep >= 2 ? <VerdictStamp label={verdict.verdictLabel} /> : <Text style={styles.gavel}>ORDER</Text>}
            <View style={styles.heroMeta}>
              <View>
                <Text style={styles.metaLabel}>AUX RISK</Text>
                <Text style={styles.auxValue}>{revealStep >= 3 ? displayAux : '--'}</Text>
              </View>
              <View style={styles.rarityPill}>
                <Text style={styles.rarityLabel}>CASE RANK</Text>
                <Text style={styles.rarityValue}>{verdict.courtRank ?? 'Defendant'}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {revealStep >= 4 && casePacket ? (
        <CourtCard accent={colors.neonGreen}>
          <Text style={styles.kicker}>Badge unlocked</Text>
          <Text style={styles.shareHook}>{casePacket.badge.title}</Text>
          <Text style={styles.hint}>{casePacket.badge.subtitle}</Text>
          <View style={styles.rewardRow}>
            <Text style={styles.rewardText}>+{verdict.xpAwarded ?? 0} XP</Text>
            <Text style={styles.rewardText}>{verdict.courtPersona ?? casePacket.badge.title}</Text>
          </View>
        </CourtCard>
      ) : null}

      {revealStep >= 5 && casePacket ? (
        <CourtCard accent={colors.warningYellow}>
          <Text style={styles.kicker}>Today's challenge</Text>
          <Text style={styles.challengeTitle}>{casePacket.challenge.title}</Text>
          <Text style={styles.challengeCopy}>{casePacket.challenge.description}</Text>
          <Text style={styles.challengeXp}>Reward: +{casePacket.challenge.rewardXp} XP</Text>
          <SecondaryButton
            onPress={() => {
              if (!challengeCompleted) {
                completeDailyChallenge(casePacket.challenge.id, casePacket.challenge.rewardXp);
              }
            }}
          >
            {challengeCompleted ? 'Challenge Logged' : 'Mark Complete'}
          </SecondaryButton>
        </CourtCard>
      ) : null}

      <NeonButton onPress={() => router.push('/trial/share')}>Share Verdict</NeonButton>
      <SecondaryButton onPress={() => setShowEvidence((value) => !value)}>
        {showEvidence ? 'Hide Evidence' : 'View Evidence'}
      </SecondaryButton>

      <View style={styles.scoreGrid}>
        {supportingScores.map((score) => (
          <View key={score.key} style={styles.scoreTile}>
            <Text style={styles.scoreValue}>{score.value}</Text>
            <Text style={styles.scoreLabel} numberOfLines={2}>{score.label}</Text>
          </View>
        ))}
      </View>

      <ChargeCard charge={verdict.primaryCharge} />
      <SentenceCard sentence={verdict.sentence} />
      <RarityBadge rarity={verdict.rarity} subtitle={verdict.raritySubtitle} />

      {showEvidence && casePacket ? (
        <>
          <SectionHeader eyebrow="CASE PACKET" title="Stats from your evidence." />
          <View style={styles.statList}>
            {casePacket.stats.map((stat, index) => (
              <View key={`${stat.key}-${index}`} style={styles.statRow}>
                <View style={styles.statScore}>
                  <Text style={styles.statValue}>{stat.value}{stat.unit ?? ''}</Text>
                </View>
                <View style={styles.statBody}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={styles.statDetail}>{stat.detail}</Text>
                </View>
              </View>
            ))}
          </View>
          <SectionHeader eyebrow="EVIDENCE" title="Exhibits filed." />
          {verdict.evidence.map((evidence) => (
            <EvidenceCard key={evidence.id} evidence={evidence} />
          ))}
        </>
      ) : null}
      <SecondaryButton onPress={() => router.replace('/(tabs)/trial')}>Return to Trial</SecondaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  muted: { color: colors.muted, fontSize: 16, fontWeight: '700' },
  posterHero: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 53, 94, 0.52)',
    backgroundColor: colors.deepCard,
    shadowColor: colors.hotPink,
    shadowOpacity: 0.2,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 16 },
  },
  posterImage: { minHeight: 560 },
  posterScrim: {
    flex: 1,
    minHeight: 560,
    padding: 18,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(5, 5, 7, 0.42)',
  },
  posterKicker: { color: colors.hotPink, fontSize: 12, fontWeight: '900', textAlign: 'center' },
  gavel: {
    color: colors.text,
    fontSize: 54,
    lineHeight: 58,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
    transform: [{ rotate: '-3deg' }],
  },
  heroMeta: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 14,
  },
  metaLabel: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  auxValue: { color: colors.neonGreen, fontSize: 58, lineHeight: 62, fontWeight: '900' },
  rarityPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.hotPink,
    borderRadius: 8,
    padding: 13,
    backgroundColor: 'rgba(255, 62, 165, 0.08)',
  },
  rarityLabel: { color: colors.muted, fontSize: 10, fontWeight: '900' },
  rarityValue: { color: colors.hotPink, fontSize: 24, fontWeight: '900' },
  shareHook: { color: colors.text, fontSize: 22, lineHeight: 28, fontWeight: '900' },
  hint: { color: colors.muted, fontSize: 13, fontWeight: '800', marginTop: 8 },
  kicker: { color: colors.hotPink, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', marginBottom: 8 },
  rewardRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 14 },
  rewardText: { color: colors.neonGreen, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  challengeTitle: { color: colors.text, fontSize: 21, lineHeight: 25, fontWeight: '900', textTransform: 'uppercase' },
  challengeCopy: { color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: '800', marginTop: 8 },
  challengeXp: { color: colors.warningYellow, fontSize: 12, fontWeight: '900', textTransform: 'uppercase', marginTop: 10 },
  scoreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  scoreTile: {
    width: '48%',
    minHeight: 86,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.deepCard,
    padding: 13,
    justifyContent: 'space-between',
  },
  scoreValue: { color: colors.neonGreen, fontSize: 30, fontWeight: '900' },
  scoreLabel: { color: colors.muted, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  statList: { gap: 10 },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.deepCard,
    padding: 12,
  },
  statScore: {
    width: 58,
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.hotPink,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 31, 104, 0.08)',
  },
  statValue: { color: colors.hotPink, fontSize: 18, fontWeight: '900' },
  statBody: { flex: 1, justifyContent: 'center' },
  statLabel: { color: colors.text, fontSize: 15, fontWeight: '900', textTransform: 'uppercase' },
  statDetail: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: '700', marginTop: 3 },
});
