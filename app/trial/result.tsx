import { useEffect } from 'react';
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
import { useSettingsStore } from '../../src/store/settingsStore';
import { useTrialStore } from '../../src/store/trialStore';
import { formatDisplayDate } from '../../src/utils/date';

const verdictPoster = require('../../assets/premium/verdict-poster-bg.png');

export default function TrialResultScreen() {
  const currentVerdict = useTrialStore((state) => state.currentVerdict);
  const todayVerdict = useHistoryStore((state) => state.getTodayVerdict());
  const hapticsEnabled = useSettingsStore((state) => state.hapticsEnabled);
  const verdict = currentVerdict ?? todayVerdict;

  useEffect(() => {
    if (verdict && hapticsEnabled) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [hapticsEnabled, verdict]);

  if (!verdict) {
    return (
      <Screen>
        <SectionHeader title="No verdict sealed." />
        <Text style={styles.muted}>The court needs evidence before it can judge you.</Text>
        <NeonButton onPress={() => router.replace('/trial/loading')}>Open Today's Case</NeonButton>
      </Screen>
    );
  }

  const aux = verdict.scores.find((score) => score.key === 'auxRisk')?.value ?? 0;
  const supportingScores = verdict.scores.filter((score) => score.key !== 'auxRisk').slice(0, 4);

  return (
    <Screen>
      <SectionHeader eyebrow="DAILY VERDICT" title={formatDisplayDate(verdict.date)} />

      <View style={styles.posterHero}>
        <ImageBackground source={verdictPoster} resizeMode="cover" style={styles.posterImage}>
          <View style={styles.posterScrim}>
            <Text style={styles.posterKicker}>THE COURT HAS SPOKEN</Text>
            <VerdictStamp label={verdict.verdictLabel} />
            <View style={styles.heroMeta}>
              <View>
                <Text style={styles.metaLabel}>AUX RISK</Text>
                <Text style={styles.auxValue}>{aux}</Text>
              </View>
              <View style={styles.rarityPill}>
                <Text style={styles.rarityLabel}>RARITY</Text>
                <Text style={styles.rarityValue}>{verdict.rarity}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <CourtCard quiet>
        <Text style={styles.shareHook}>{verdict.shareCaption}</Text>
        <Text style={styles.hint}>This is the line people should want to repost.</Text>
      </CourtCard>

      <NeonButton onPress={() => router.push('/trial/share')}>Create Share Card</NeonButton>

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

      <SectionHeader eyebrow="EVIDENCE" title="Exhibits filed." />
      {verdict.evidence.map((evidence) => (
        <EvidenceCard key={evidence.id} evidence={evidence} />
      ))}
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
});
