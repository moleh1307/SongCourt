import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../constants/colors';

type CourtCardProps = {
  children: ReactNode;
  paper?: boolean;
  accent?: string;
  quiet?: boolean;
};

export function CourtCard({ children, paper, accent = colors.softBorder, quiet }: CourtCardProps) {
  return <View style={[styles.card, quiet && styles.quiet, paper && styles.paper, { borderColor: accent }]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.glassCard,
    borderRadius: 10,
    padding: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.42,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
  },
  quiet: {
    shadowOpacity: 0.12,
    backgroundColor: 'rgba(16, 17, 22, 0.84)',
  },
  paper: {
    backgroundColor: colors.courtPaper,
    borderColor: colors.dangerRed,
    shadowColor: colors.warningYellow,
  },
});
