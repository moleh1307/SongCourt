import { StyleSheet, Text } from 'react-native';
import { CourtCard } from '../common/CourtCard';
import { colors } from '../../constants/colors';

export function SentenceCard({ sentence }: { sentence: string }) {
  return (
    <CourtCard accent={colors.warningYellow}>
      <Text style={styles.kicker}>SENTENCE</Text>
      <Text style={styles.sentence}>{sentence}</Text>
    </CourtCard>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.warningYellow, fontWeight: '900', fontSize: 12 },
  sentence: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 8 },
});
