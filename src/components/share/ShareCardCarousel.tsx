import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RefObject } from 'react';
import type { View as RNView } from 'react-native';
import { colors } from '../../constants/colors';
import type { ShareCardStyle, Verdict } from '../../types/verdict';
import { ShareCardPreview } from './ShareCardPreview';

const stylesList: ShareCardStyle[] = ['neon', 'receipt', 'mugshot', 'minimal'];

export function ShareCardCarousel({
  verdict,
  activeStyle,
  onStyleChange,
  cardRef,
}: {
  verdict: Verdict;
  activeStyle: ShareCardStyle;
  onStyleChange: (styleName: ShareCardStyle) => void;
  cardRef: RefObject<RNView | null>;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {stylesList.map((styleName) => {
        const active = styleName === activeStyle;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Select ${styleName} share card`}
            key={styleName}
            onPress={() => onStyleChange(styleName)}
            style={[styles.item, active && styles.itemActive]}
          >
            <ShareCardPreview ref={active ? cardRef : undefined} verdict={verdict} styleName={styleName} defendant="Melih" />
            <Text style={[styles.label, active && styles.labelActive]}>{active ? `${styleName} selected` : styleName}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 14, paddingRight: 20 },
  item: { gap: 10, borderRadius: 10, padding: 2 },
  itemActive: { backgroundColor: 'rgba(182, 255, 59, 0.08)' },
  label: { color: colors.muted, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', textAlign: 'center' },
  labelActive: { color: colors.neonGreen },
});
