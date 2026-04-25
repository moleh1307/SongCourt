import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ChargeCard } from '../../src/components/trial/ChargeCard';
import { EvidenceCard } from '../../src/components/trial/EvidenceCard';
import { RarityBadge } from '../../src/components/trial/RarityBadge';
import { ScoreGauge } from '../../src/components/trial/ScoreGauge';
import { SentenceCard } from '../../src/components/trial/SentenceCard';
import { VerdictStamp } from '../../src/components/trial/VerdictStamp';
import { CourtCard } from '../../src/components/common/CourtCard';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SecondaryButton } from '../../src/components/common/SecondaryButton';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { colors } from '../../src/constants/colors';
import { useHistoryStore } from '../../src/store/historyStore';
import { useTrialStore } from '../../src/store/trialStore';
import { formatDisplayDate } from '../../src/utils/date';

export default function TrialResultScreen() {
  const currentVerdict = useTrialStore((state) => state.currentVerdict);
  const todayVerdict = useHistoryStore((state) => state.getTodayVerdict());
  const verdict = currentVerdict ?? todayVerdict;

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

  return (
    <Screen>
      <SectionHeader eyebrow="SONGCOURT DAILY VERDICT" title={formatDisplayDate(verdict.date)} />
      <VerdictStamp label={verdict.verdictLabel} />
      <ScoreGauge score={aux} />
      <View style={styles.scoreGrid}>
        {verdict.scores
          .filter((score) => score.key !== 'auxRisk')
          .slice(0, 4)
          .map((score) => (
            <CourtCard key={score.key} accent={colors.border}>
              <Text style={styles.scoreLabel}>{score.label}</Text>
              <Text style={styles.scoreValue}>{score.value}</Text>
              <Text style={styles.roast}>{score.roast}</Text>
            </CourtCard>
          ))}
      </View>
      <ChargeCard charge={verdict.primaryCharge} />
      <SentenceCard sentence={verdict.sentence} />
      <RarityBadge rarity={verdict.rarity} subtitle={verdict.raritySubtitle} />
      <SectionHeader eyebrow="EVIDENCE SUBMITTED" title="Exhibits" />
      {verdict.evidence.map((evidence) => (
        <EvidenceCard key={evidence.id} evidence={evidence} />
      ))}
      <NeonButton onPress={() => router.push('/trial/share')}>Create Share Card</NeonButton>
      <SecondaryButton onPress={() => router.replace('/(tabs)/trial')}>Return to Trial</SecondaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  muted: { color: colors.muted, fontSize: 16, fontWeight: '700' },
  scoreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  scoreLabel: { color: colors.muted, fontSize: 12, fontWeight: '900' },
  scoreValue: { color: colors.neonGreen, fontSize: 34, fontWeight: '900' },
  roast: { color: colors.text, fontSize: 12, fontWeight: '700' },
});
