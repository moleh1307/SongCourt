import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { Evidence } from '../../types/verdict';

export function EvidenceCard({ evidence }: { evidence: Evidence }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{evidence.label}</Text>
      <Text style={styles.text}>{evidence.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.courtPaper, borderRadius: 8, padding: 16, gap: 8, borderWidth: 1, borderColor: colors.dangerRed },
  label: { color: colors.dangerRed, fontSize: 12, fontWeight: '900' },
  text: { color: colors.black, fontSize: 16, fontWeight: '700' },
});
