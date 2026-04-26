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
    borderRadius: 9,
    padding: 18,
    shadowColor: colors.dangerRed,
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
  },
  quiet: {
    shadowOpacity: 0.08,
    backgroundColor: 'rgba(17, 13, 18, 0.9)',
  },
  paper: {
    backgroundColor: colors.courtPaper,
    borderColor: colors.dangerRed,
    shadowColor: colors.warningYellow,
  },
});
