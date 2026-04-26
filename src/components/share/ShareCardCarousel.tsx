import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { RefObject } from 'react';
import type { View as RNView } from 'react-native';
import { colors } from '../../constants/colors';
import { useSettingsStore } from '../../store/settingsStore';
import type { ShareCardStyle, Verdict } from '../../types/verdict';
import { ShareCardPreview } from './ShareCardPreview';

const stylesList: ShareCardStyle[] = ['neon', 'receipt', 'mugshot', 'minimal'];

export function ShareCardCarousel({
  verdict,
  activeStyle,
  onStyleChange,
  cardRef,
  showWatermark = true,
}: {
  verdict: Verdict;
  activeStyle: ShareCardStyle;
  onStyleChange: (styleName: ShareCardStyle) => void;
  cardRef: RefObject<RNView | null>;
  showWatermark?: boolean;
}) {
  const hapticsEnabled = useSettingsStore((state) => state.hapticsEnabled);
  const selectStyle = (style: ShareCardStyle) => {
    if (hapticsEnabled) {
      void Haptics.selectionAsync();
    }
    onStyleChange(style);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.previewWrap}>
        <ShareCardPreview
          ref={cardRef}
          verdict={verdict}
          styleName={activeStyle}
          defendant="Melih"
          showWatermark={showWatermark}
        />
      </View>
      <View style={styles.selectorRow}>
        {stylesList.map((styleName) => {
          const active = styleName === activeStyle;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Select ${styleName} share card`}
              key={styleName}
              onPress={() => selectStyle(styleName)}
              style={[styles.selectorChip, active && styles.selectorChipActive]}
            >
              <Text style={[styles.selectorText, active && styles.selectorTextActive]}>{styleName}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectorChip: {
    flexGrow: 1,
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  selectorChipActive: {
    borderColor: colors.neonGreen,
    backgroundColor: 'rgba(182, 255, 59, 0.11)',
  },
  selectorText: { color: colors.muted, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  selectorTextActive: { color: colors.neonGreen },
  previewWrap: { alignItems: 'center' },
});
