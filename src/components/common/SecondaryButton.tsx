import type { ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';
import { useSettingsStore } from '../../store/settingsStore';

type SecondaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function SecondaryButton({ children, onPress, accessibilityLabel }: SecondaryButtonProps) {
  const hapticsEnabled = useSettingsStore((state) => state.hapticsEnabled);
  const press = () => {
    if (hapticsEnabled) {
      void Haptics.selectionAsync();
    }
    onPress();
  };

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={press} style={styles.button}>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.softBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.deepCard,
  },
  label: { color: colors.text, fontSize: 13, fontWeight: '800', textTransform: 'uppercase' },
});
