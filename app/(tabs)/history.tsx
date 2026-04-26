import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { Screen } from '../../src/components/common/Screen';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { colors } from '../../src/constants/colors';
import { useHistoryStore } from '../../src/store/historyStore';
import { useTrialStore } from '../../src/store/trialStore';
import { formatDisplayDate } from '../../src/utils/date';

export default function HistoryTab() {
  const verdicts = useHistoryStore((state) => state.verdicts);
  const streak = useHistoryStore((state) => state.getStreak());
  const setCurrentVerdict = useTrialStore((state) => state.setCurrentVerdict);
  const highestAux = Math.max(0, ...verdicts.map((verdict) => verdict.scores.find((score) => score.key === 'auxRisk')?.value ?? 0));

  return (
    <Screen>
      <SectionHeader eyebrow="RECORD ROOM" title="Your sealed cases." />
      <CourtCard accent={colors.electricPurple}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryValue}>{streak}</Text>
            <Text style={styles.summaryLabel}>Streak</Text>
          </View>
          <View>
            <Text style={styles.summaryValue}>{highestAux}</Text>
            <Text style={styles.summaryLabel}>Peak Risk</Text>
          </View>
          <View>
            <Text style={styles.summaryValue}>{verdicts.length}</Text>
            <Text style={styles.summaryLabel}>Files</Text>
          </View>
        </View>
      </CourtCard>

      {verdicts.length === 0 ? (
        <CourtCard quiet>
          <Text style={styles.empty}>No case files yet.</Text>
          <Text style={styles.muted}>Run today's trial and the record room will open.</Text>
        </CourtCard>
      ) : (
        <View style={styles.list}>
          {verdicts.map((verdict) => {
            const aux = verdict.scores.find((score) => score.key === 'auxRisk')?.value ?? 0;
            return (
              <Pressable
                key={verdict.id}
                accessibilityRole="button"
                onPress={() => {
                  setCurrentVerdict(verdict);
                  router.push(`/history/${verdict.id}`);
                }}
                style={({ pressed }) => [styles.caseRow, pressed && styles.pressed]}
              >
                <View style={styles.caseScore}>
                  <Text style={styles.caseScoreValue}>{aux}</Text>
                  <Text style={styles.caseScoreLabel}>risk</Text>
                </View>
                <View style={styles.caseBody}>
                  <Text style={styles.date}>{formatDisplayDate(verdict.date)}</Text>
                  <Text style={styles.rowTitle} numberOfLines={2}>{verdict.verdictLabel}</Text>
                  <Text style={styles.muted} numberOfLines={1}>{verdict.primaryCharge}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  summaryValue: { color: colors.neonGreen, fontSize: 34, lineHeight: 38, fontWeight: '900' },
  summaryLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  list: { gap: 10 },
  caseRow: {
    flexDirection: 'row',
    gap: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.softBorder,
    borderRadius: 8,
    backgroundColor: colors.deepCard,
    padding: 13,
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  caseScore: {
    width: 62,
    height: 62,
    borderRadius: 8,
    backgroundColor: 'rgba(182, 255, 59, 0.09)',
    borderWidth: 1,
    borderColor: colors.neonGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caseScoreValue: { color: colors.neonGreen, fontSize: 26, fontWeight: '900' },
  caseScoreLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  caseBody: { flex: 1 },
  empty: { color: colors.text, fontSize: 22, fontWeight: '900' },
  muted: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  date: { color: colors.warningYellow, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  rowTitle: { color: colors.text, fontSize: 20, lineHeight: 24, fontWeight: '900', marginTop: 4 },
});
