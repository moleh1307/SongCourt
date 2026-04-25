import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { Verdict } from '../../types/verdict';
import { CourtCard } from '../common/CourtCard';
import { RarityBadge } from './RarityBadge';
import { ScoreGauge } from './ScoreGauge';
import { VerdictStamp } from './VerdictStamp';

export function VerdictSummaryCard({ verdict }: { verdict: Verdict }) {
  const aux = verdict.scores.find((score) => score.key === 'auxRisk')?.value ?? 0;
  return (
    <CourtCard accent={colors.neonGreen}>
      <View style={styles.stack}>
        <VerdictStamp label={verdict.verdictLabel} />
        <ScoreGauge score={aux} />
        <RarityBadge rarity={verdict.rarity} subtitle={verdict.raritySubtitle} />
        <Text style={styles.caption}>{verdict.shareCaption}</Text>
      </View>
    </CourtCard>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 14 },
  caption: { color: colors.muted, fontSize: 14, fontWeight: '700', textAlign: 'center' },
});
