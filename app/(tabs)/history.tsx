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
  const mostCommon = verdicts[0]?.verdictLabel ?? 'No allegations';

  return (
    <Screen>
      <SectionHeader eyebrow="YOUR MUSIC CRIMINAL RECORD" title="Every verdict you survived." />
      <View style={styles.stats}>
        <CourtCard accent={colors.neonGreen}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Trial Streak</Text>
          <Text style={styles.muted}>The court appreciates consistency.</Text>
        </CourtCard>
        <CourtCard accent={colors.hotPink}>
          <Text style={styles.statValue}>{highestAux}</Text>
          <Text style={styles.statLabel}>Highest Aux Risk</Text>
          <Text style={styles.muted}>{mostCommon}</Text>
        </CourtCard>
      </View>

      {verdicts.length === 0 ? (
        <CourtCard accent={colors.warningYellow}>
          <Text style={styles.empty}>Your criminal record is clean.</Text>
          <Text style={styles.muted}>Suspiciously clean.</Text>
        </CourtCard>
      ) : (
        verdicts.map((verdict) => {
          const aux = verdict.scores.find((score) => score.key === 'auxRisk')?.value ?? 0;
          return (
            <Pressable
              key={verdict.id}
              accessibilityRole="button"
              onPress={() => {
                setCurrentVerdict(verdict);
                router.push(`/history/${verdict.id}`);
              }}
            >
              <CourtCard accent={aux > 80 ? colors.dangerRed : colors.electricPurple}>
                <Text style={styles.date}>{formatDisplayDate(verdict.date)}</Text>
                <Text style={styles.rowTitle}>{verdict.verdictLabel} — Aux Risk {aux}</Text>
                <Text style={styles.muted}>{verdict.primaryCharge}</Text>
              </CourtCard>
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: 12 },
  statValue: { color: colors.neonGreen, fontSize: 42, fontWeight: '900' },
  statLabel: { color: colors.text, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  muted: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  empty: { color: colors.text, fontSize: 24, fontWeight: '900' },
  date: { color: colors.warningYellow, fontSize: 12, fontWeight: '900' },
  rowTitle: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: 6 },
});
