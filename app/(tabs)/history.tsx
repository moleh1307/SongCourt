import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { Screen } from '../../src/components/common/Screen';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { colors } from '../../src/constants/colors';
import { useHistoryStore } from '../../src/store/historyStore';
import { useRewardStore } from '../../src/store/rewardStore';
import { useTrialStore } from '../../src/store/trialStore';
import { formatDisplayDate } from '../../src/utils/date';
import { badgeCatalog, getAuxRisk, getVerdictBadge, getVerdictCaseNumber } from '../../src/utils/verdictRewards';

export default function HistoryTab() {
  const verdicts = useHistoryStore((state) => state.verdicts);
  const historyStreak = useHistoryStore((state) => state.getStreak());
  const rewardStreak = useRewardStore((state) => state.getStreak());
  const rewardBadges = useRewardStore((state) => state.unlockedBadges);
  const setCurrentVerdict = useTrialStore((state) => state.setCurrentVerdict);
  const auxValues = verdicts.map(getAuxRisk);
  const highestAux = Math.max(0, ...auxValues);
  const lowestAux = auxValues.length ? Math.min(...auxValues) : 0;
  const streak = Math.max(historyStreak, rewardStreak);
  const verdictDates = new Set(verdicts.map((verdict) => verdict.date));
  const calendarDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return { key, day: date.getDate(), active: verdictDates.has(key) };
  });
  const badgeArchive = [
    ...rewardBadges,
    ...verdicts.map(getVerdictBadge),
  ].reduce<typeof rewardBadges>((badges, badge) => {
    if (badges.some((item) => item.id === badge.id)) return badges;
    return [...badges, badge];
  }, []);

  return (
    <Screen>
      <SectionHeader eyebrow="CASE ARCHIVE" title="Your sealed cases." />
      <CourtCard accent={colors.electricPurple}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryValue}>{streak}</Text>
            <Text style={styles.summaryLabel}>Streak</Text>
          </View>
          <View>
            <Text style={styles.summaryValue}>{highestAux}</Text>
            <Text style={styles.summaryLabel}>Worst Risk</Text>
          </View>
          <View>
            <Text style={styles.summaryValue}>{lowestAux}</Text>
            <Text style={styles.summaryLabel}>Best Risk</Text>
          </View>
        </View>
      </CourtCard>

      <CourtCard quiet>
        <Text style={styles.archiveTitle}>Streak strip</Text>
        <View style={styles.calendarRow}>
          {calendarDays.map((day) => (
            <View key={day.key} style={[styles.calendarDay, day.active && styles.calendarDayActive]}>
              <Text style={[styles.calendarText, day.active && styles.calendarTextActive]}>{day.day}</Text>
            </View>
          ))}
        </View>
      </CourtCard>

      <CourtCard quiet>
        <Text style={styles.archiveTitle}>Badge archive</Text>
        <View style={styles.badgeGrid}>
          {(badgeArchive.length ? badgeArchive : Object.values(badgeCatalog).slice(0, 3)).map((badge) => (
            <View key={badge.id} style={[styles.badgeChip, !badgeArchive.length && styles.badgeChipLocked]}>
              <Text style={styles.badgeTitle}>{badge.title}</Text>
            </View>
          ))}
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
            const aux = getAuxRisk(verdict);
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
                  <Text style={styles.date}>{getVerdictCaseNumber(verdict)} - {formatDisplayDate(verdict.date)}</Text>
                  <Text style={styles.rowTitle} numberOfLines={2}>{verdict.verdictLabel}</Text>
                  <Text style={styles.muted} numberOfLines={1}>{verdict.primaryCharge}</Text>
                  <Text style={styles.reshare}>Tap to open and re-share</Text>
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
  archiveTitle: { color: colors.text, fontSize: 13, fontWeight: '900', textTransform: 'uppercase', marginBottom: 12 },
  calendarRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 7 },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.softBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.deepCard,
  },
  calendarDayActive: { borderColor: colors.neonGreen, backgroundColor: 'rgba(114, 255, 56, 0.11)' },
  calendarText: { color: colors.muted, fontSize: 12, fontWeight: '900' },
  calendarTextActive: { color: colors.neonGreen },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.hotPink,
    backgroundColor: 'rgba(255, 31, 104, 0.09)',
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  badgeChipLocked: { opacity: 0.46, borderColor: colors.border },
  badgeTitle: { color: colors.text, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
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
  reshare: { color: colors.hotPink, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', marginTop: 6 },
});
