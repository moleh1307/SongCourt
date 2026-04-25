import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';

type SecondaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function SecondaryButton({ children, onPress, accessibilityLabel }: SecondaryButtonProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={styles.button}>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.deepCard,
  },
  label: { color: colors.text, fontSize: 14, fontWeight: '800', textTransform: 'uppercase' },
});
