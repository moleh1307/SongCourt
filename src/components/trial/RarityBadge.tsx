import { StyleSheet, Text, View } from 'react-native';
import { rarityConfig } from '../../data/rarityConfig';
import type { Rarity } from '../../types/verdict';
import { colors } from '../../constants/colors';

export function RarityBadge({ rarity, subtitle }: { rarity: Rarity; subtitle: string }) {
  const config = rarityConfig[rarity];
  return (
    <View style={[styles.badge, { borderColor: config.color, shadowColor: config.color }]}>
      <Text style={styles.kicker}>RARITY</Text>
      <Text style={[styles.rarity, { color: config.color }]}>{rarity}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderWidth: 1, borderRadius: 8, padding: 14, backgroundColor: colors.deepCard, shadowOpacity: 0.3, shadowRadius: 18 },
  kicker: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  rarity: { fontSize: 24, fontWeight: '900', textTransform: 'uppercase' },
  subtitle: { color: colors.text, fontSize: 13, fontWeight: '700' },
});
