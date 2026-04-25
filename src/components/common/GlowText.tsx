import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';

export function GlowText({ children, color = colors.neonGreen, size = 44 }: { children: ReactNode; color?: string; size?: number }) {
  return <Text style={[styles.text, { color, fontSize: size, textShadowColor: color }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '900',
    textTransform: 'uppercase',
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
  },
});
