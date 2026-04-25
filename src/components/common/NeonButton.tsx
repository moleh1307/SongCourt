import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';

type NeonButtonProps = {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'purple';
  accessibilityLabel?: string;
};

export function NeonButton({ children, onPress, variant = 'primary', accessibilityLabel }: NeonButtonProps) {
  const color = variant === 'danger' ? colors.dangerRed : variant === 'purple' ? colors.electricPurple : colors.neonGreen;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: color, shadowColor: color }, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  label: { color: colors.black, fontSize: 16, fontWeight: '900', letterSpacing: 0, textTransform: 'uppercase' },
});
