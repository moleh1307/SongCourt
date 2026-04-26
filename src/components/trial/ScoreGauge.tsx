import { StyleSheet, Text, View } from 'react-native';
import { colors, severityColors } from '../../constants/colors';
import { severityLabel, severityTone } from '../../utils/formatting';

export function ScoreGauge({ score, label = 'AUX RISK' }: { score: number; label?: string }) {
  const tone = severityTone(score);
  const color = severityColors[tone];
  return (
    <View style={[styles.wrap, { borderColor: color, shadowColor: color }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.score, { color }]}>{score}</Text>
      <Text style={styles.caption}>{severityLabel(score)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
    backgroundColor: colors.deepCard,
    shadowOpacity: 0.22,
    shadowRadius: 20,
  },
  label: { color: colors.muted, fontSize: 12, fontWeight: '900' },
  score: { fontSize: 78, fontWeight: '900', lineHeight: 84 },
  caption: { color: colors.text, fontSize: 15, fontWeight: '800', textTransform: 'uppercase' },
});
