import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

export function VerdictStamp({ label }: { label: string }) {
  return (
    <View style={styles.stamp}>
      <Text style={styles.kicker}>VERDICT</Text>
      <Text adjustsFontSizeToFit numberOfLines={2} style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stamp: {
    borderWidth: 3,
    borderColor: colors.dangerRed,
    borderRadius: 8,
    padding: 16,
    transform: [{ rotate: '-2deg' }],
    backgroundColor: 'rgba(255,53,94,0.08)',
  },
  kicker: { color: colors.dangerRed, fontSize: 12, fontWeight: '900', textAlign: 'center' },
  label: { color: colors.dangerRed, fontSize: 40, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
});
