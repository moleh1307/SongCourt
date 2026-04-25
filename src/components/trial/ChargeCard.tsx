import { StyleSheet, Text } from 'react-native';
import { CourtCard } from '../common/CourtCard';
import { colors } from '../../constants/colors';

export function ChargeCard({ charge }: { charge: string }) {
  return (
    <CourtCard accent={colors.dangerRed}>
      <Text style={styles.kicker}>PRIMARY CHARGE</Text>
      <Text style={styles.charge}>{charge}</Text>
      <Text style={styles.stamp}>CHARGE FILED</Text>
    </CourtCard>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.dangerRed, fontWeight: '900', fontSize: 12 },
  charge: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 8 },
  stamp: { color: colors.dangerRed, fontSize: 12, fontWeight: '900', marginTop: 12, alignSelf: 'flex-end' },
});
