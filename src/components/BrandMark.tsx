import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../design/tokens';

type BrandMarkProps = {
  size?: 'small' | 'large';
  light?: boolean;
};

export function BrandMark({ size = 'large', light = false }: BrandMarkProps) {
  const isLarge = size === 'large';
  const ink = light ? colors.warmIvory : colors.ink;

  return (
    <View>
      <Text style={[styles.wordmark, { color: ink, fontSize: isLarge ? 72 : 34 }]}>
        Song
        <Text style={[styles.court, { color: colors.courtRed }]}>Court</Text>
      </Text>
      <Text style={[styles.tagline, { color: light ? colors.paperTan : colors.mutedInk, fontSize: isLarge ? 18 : 10 }]}>
        MUSIC ON TRIAL
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    fontWeight: '900',
    letterSpacing: -1,
  },
  court: {
    fontStyle: 'italic',
    fontWeight: '900',
  },
  tagline: {
    fontWeight: '800',
    letterSpacing: 8,
    marginTop: -2,
  },
});
