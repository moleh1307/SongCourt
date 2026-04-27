import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../design/tokens';

type BrandMarkProps = {
  size?: 'small' | 'large';
  light?: boolean;
};

export function BrandMark({ size = 'large', light = false }: BrandMarkProps) {
  const isLarge = size === 'large';
  const ink = light ? colors.warmIvory : colors.ink;

  return (
    <View>
      <Text style={[styles.wordmark, { color: ink, fontSize: isLarge ? 70 : 21, lineHeight: isLarge ? 76 : 24 }]}>
        Song
        <Text style={[styles.court, { color: colors.courtRed }]}>Court</Text>
      </Text>
      <Text style={[styles.tagline, { color: light ? colors.paperTan : colors.mutedInk, fontSize: isLarge ? 14 : 7 }]}>
        MUSIC ON TRIAL
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    fontFamily: fonts.display,
    fontWeight: '800',
    letterSpacing: 0,
  },
  court: {
    fontStyle: 'italic',
    fontWeight: '800',
  },
  tagline: {
    fontFamily: fonts.body,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: -2,
  },
});
