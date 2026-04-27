import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '../components/BrandMark';
import { colors, fonts, spacing } from '../design/tokens';
import { VerdictHistoryRecord } from '../services/verdictHistoryStore';

type CaseArchiveScreenProps = {
  onBack: () => void;
  onOpenRecord: (record: VerdictHistoryRecord) => void;
  onRunTrial: () => void;
  records: VerdictHistoryRecord[];
};

export function CaseArchiveScreen({
  onBack,
  onOpenRecord,
  onRunTrial,
  records,
}: CaseArchiveScreenProps) {
  const stats = useMemo(() => createArchiveStats(records), [records]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <BrandMark size="small" />
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Trial</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.kicker}>Case archive</Text>
          <Text style={styles.title}>Every verdict becomes evidence.</Text>
          <Text style={styles.copy}>
            Reopen saved cases, compare the best and worst scores, and share the ones worth sending.
          </Text>
        </View>

        <View style={styles.statRow}>
          <ArchiveStat label="Saved" value={String(records.length)} />
          <ArchiveStat label="Best risk" value={stats.bestRisk} />
          <ArchiveStat label="Latest" value={stats.latestLabel} />
        </View>

        {records.length === 0 ? (
          <View style={styles.emptyPanel}>
            <Text style={styles.emptyTitle}>No cases yet.</Text>
            <Text style={styles.emptyCopy}>
              Run a demo or Spotify trial first. The archive will keep your latest verdict cards here.
            </Text>
            <Pressable accessibilityRole="button" onPress={onRunTrial} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Start First Case</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.caseList}>
            {records.map((record) => (
              <Pressable
                accessibilityRole="button"
                key={record.id}
                onPress={() => onOpenRecord(record)}
                style={({ pressed }) => [styles.caseRow, pressed && styles.caseRowPressed]}
              >
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreValue}>{record.payload.auxRisk}</Text>
                  <Text style={styles.scoreLabel}>risk</Text>
                </View>

                <View style={styles.caseCopy}>
                  <View style={styles.caseMetaRow}>
                    <Text numberOfLines={1} style={styles.caseNumber}>
                      {record.payload.caseNumber}
                    </Text>
                    <Text numberOfLines={1} style={styles.caseDate}>
                      {record.payload.createdAt}
                    </Text>
                  </View>
                  <Text numberOfLines={1} style={styles.caseTitle}>
                    {record.payload.verdictTitle}
                  </Text>
                  <Text numberOfLines={2} style={styles.caseCharge}>
                    {record.payload.charge}
                  </Text>
                  <View style={styles.caseFooter}>
                    <Text numberOfLines={1} style={styles.caseSource}>
                      {record.sourceLabel}
                    </Text>
                    <Text style={styles.reopenText}>Re-share</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ArchiveStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.archiveStat}>
      <Text numberOfLines={1} style={styles.archiveStatLabel}>
        {label}
      </Text>
      <Text adjustsFontSizeToFit minimumFontScale={0.75} numberOfLines={1} style={styles.archiveStatValue}>
        {value}
      </Text>
    </View>
  );
}

function createArchiveStats(records: VerdictHistoryRecord[]) {
  if (records.length === 0) {
    return {
      bestRisk: '--',
      latestLabel: '--',
    };
  }

  const bestRisk = records.reduce((best, record) => Math.max(best, record.payload.auxRisk), 0);

  return {
    bestRisk: String(bestRisk),
    latestLabel: records[0]?.payload.verdictTitle.split(' ')[0] ?? 'Case',
  };
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.warmIvory,
    flex: 1,
  },
  content: {
    paddingBottom: 44,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  backButton: {
    borderColor: colors.hairline,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
  },
  hero: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  kicker: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 34,
    maxWidth: 340,
  },
  copy: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 345,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  archiveStat: {
    backgroundColor: colors.receiptWhite,
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 78,
    padding: 12,
  },
  archiveStatLabel: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: '800',
  },
  archiveStatValue: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
  },
  emptyPanel: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  emptyTitle: {
    color: colors.warmIvory,
    fontFamily: fonts.body,
    fontSize: 22,
    fontWeight: '900',
  },
  emptyCopy: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 8,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.courtRed,
    borderRadius: 8,
    marginTop: spacing.sm,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: colors.receiptWhite,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '900',
  },
  caseList: {
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  caseRow: {
    backgroundColor: colors.receiptWhite,
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  caseRowPressed: {
    opacity: 0.72,
  },
  scoreBadge: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    height: 78,
    justifyContent: 'center',
    width: 66,
  },
  scoreValue: {
    color: colors.warmIvory,
    fontFamily: fonts.mono,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  scoreLabel: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: '800',
  },
  caseCopy: {
    flex: 1,
    minWidth: 0,
  },
  caseMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  caseNumber: {
    color: colors.courtRed,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '900',
  },
  caseDate: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '700',
  },
  caseTitle: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
    marginTop: 4,
  },
  caseCharge: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 4,
  },
  caseFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  caseSource: {
    color: colors.mutedInk,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '800',
  },
  reopenText: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: '900',
  },
});
