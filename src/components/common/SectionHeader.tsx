import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

export function SectionHeader({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <View style={styles.wrap}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  eyebrow: { color: colors.neonGreen, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 25, fontWeight: '900', textTransform: 'uppercase' },
});
