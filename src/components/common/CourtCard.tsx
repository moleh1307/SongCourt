import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../constants/colors';

type CourtCardProps = {
  children: ReactNode;
  paper?: boolean;
  accent?: string;
};

export function CourtCard({ children, paper, accent = colors.electricPurple }: CourtCardProps) {
  return <View style={[styles.card, paper && styles.paper, { borderColor: accent }]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.raisedCard,
    borderRadius: 8,
    padding: 18,
    shadowColor: colors.electricPurple,
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  paper: {
    backgroundColor: colors.courtPaper,
    borderColor: colors.dangerRed,
    shadowColor: colors.warningYellow,
  },
});
