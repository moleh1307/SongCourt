import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

type DopamineItem = {
  label: string;
  value: string;
  color?: string;
};

export function DopamineStrip({ items }: { items: DopamineItem[] }) {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={`${item.label}-${item.value}`} style={[styles.tile, { borderColor: item.color ?? colors.border }]}>
          <Text style={[styles.value, { color: item.color ?? colors.neonGreen }]} numberOfLines={1} adjustsFontSizeToFit>
            {item.value}
          </Text>
          <Text style={styles.label} numberOfLines={2}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  tile: {
    flex: 1,
    minHeight: 62,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(17, 17, 29, 0.78)',
    padding: 10,
    justifyContent: 'space-between',
  },
  value: { fontSize: 20, fontWeight: '900' },
  label: { color: colors.muted, fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
});
