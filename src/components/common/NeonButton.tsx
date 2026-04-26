import type { ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { useSettingsStore } from '../../store/settingsStore';

type NeonButtonProps = {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'purple';
  accessibilityLabel?: string;
};

export function NeonButton({ children, onPress, variant = 'primary', accessibilityLabel }: NeonButtonProps) {
  const hapticsEnabled = useSettingsStore((state) => state.hapticsEnabled);
  const color = variant === 'danger' ? colors.dangerRed : variant === 'purple' ? colors.electricPurple : colors.neonGreen;
  const press = () => {
    if (hapticsEnabled) {
      void Haptics.impactAsync(variant === 'primary' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={press}
      style={({ pressed }) => [styles.button, { backgroundColor: color, shadowColor: color }, pressed && styles.pressed]}
    >
      <View style={styles.innerRule} />
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    shadowOpacity: 0.42,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    overflow: 'hidden',
  },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  innerRule: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 8,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  label: { color: colors.black, fontSize: 15, fontWeight: '900', letterSpacing: 0, textTransform: 'uppercase' },
});
