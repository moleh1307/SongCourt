import { router } from 'expo-router';
import { CheckCircle2, Gavel, Music2, ShieldCheck } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { DopamineStrip } from '../../src/components/common/DopamineStrip';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SecondaryButton } from '../../src/components/common/SecondaryButton';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import { useHistoryStore } from '../../src/store/historyStore';
import { useTrialStore } from '../../src/store/trialStore';
import { formatDisplayDate } from '../../src/utils/date';

export default function TrialTab() {
  const spotifyConnected = useAuthStore((state) => state.spotifyConnected);
  const todayVerdict = useHistoryStore((state) => state.getTodayVerdict());
  const setCurrentVerdict = useTrialStore((state) => state.setCurrentVerdict);
  const todayAux = todayVerdict?.scores.find((score) => score.key === 'auxRisk')?.value ?? 0;

  const startTrial = () => {
    router.push('/trial/loading');
  };

  const viewToday = () => {
    if (todayVerdict) {
      setCurrentVerdict(todayVerdict);
      router.push('/trial/result');
    }
  };

  return (
    <Screen>
      <SectionHeader eyebrow="SONGCOURT" title="Open today's music case." />

      {!spotifyConnected ? (
        <CourtCard accent={colors.neonGreen}>
          <View style={styles.heroTop}>
            <View style={styles.caseSeal}>
              <Music2 color={colors.neonGreen} size={28} />
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>NO EVIDENCE</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Connect Spotify to unlock the courtroom.</Text>
          <Text style={styles.heroCopy}>SongCourt needs listening history before it can file charges.</Text>
          <NeonButton onPress={() => router.push('/connect')}>Connect Spotify</NeonButton>
          <SecondaryButton onPress={startTrial}>Preview Demo Trial</SecondaryButton>
        </CourtCard>
      ) : todayVerdict ? (
        <>
          <CourtCard accent={colors.dangerRed}>
            <View style={styles.heroTop}>
              <View style={[styles.caseSeal, styles.caseSealDanger]}>
                <ShieldCheck color={colors.dangerRed} size={28} />
              </View>
              <View style={[styles.statusPill, styles.statusPillDanger]}>
                <Text style={[styles.statusText, styles.statusTextDanger]}>SEALED</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>Today's verdict is already in evidence.</Text>
            <Text style={styles.heroCopy}>Open it, share it, or re-run the court if you want a fresh scan.</Text>
          </CourtCard>
          <CourtCard quiet>
            <Text style={styles.compactDate}>{formatDisplayDate(todayVerdict.date)}</Text>
            <View style={styles.compactRow}>
              <View style={styles.compactRisk}>
                <Text style={styles.compactRiskValue}>{todayAux}</Text>
                <Text style={styles.compactRiskLabel}>aux risk</Text>
              </View>
              <View style={styles.compactBody}>
                <Text style={styles.compactTitle} numberOfLines={2}>{todayVerdict.verdictLabel}</Text>
                <Text style={styles.compactCopy} numberOfLines={1}>{todayVerdict.primaryCharge}</Text>
              </View>
            </View>
          </CourtCard>
          <NeonButton onPress={viewToday}>View Verdict</NeonButton>
          <SecondaryButton onPress={startTrial}>Regenerate</SecondaryButton>
        </>
      ) : (
        <CourtCard accent={colors.neonGreen}>
          <View style={styles.heroTop}>
            <View style={styles.caseSeal}>
              <Gavel color={colors.neonGreen} size={30} />
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>READY</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>One tap. One brutal verdict.</Text>
          <Text style={styles.heroCopy}>Your recent listens are ready for a daily music trial.</Text>
          <NeonButton onPress={startTrial} accessibilityLabel="Put me on trial">Put Me On Trial</NeonButton>
        </CourtCard>
      )}

      <DopamineStrip
        items={[
          { value: todayVerdict ? 'sealed' : 'live', label: 'daily case', color: colors.neonGreen },
          { value: spotifyConnected ? 'linked' : 'locked', label: 'spotify', color: spotifyConnected ? colors.hotPink : colors.muted },
          { value: '9:16', label: 'share card', color: colors.warningYellow },
        ]}
      />

      <CourtCard quiet>
        <Text style={styles.docketTitle}>Court docket</Text>
        {['Recent tracks', 'Top artists', 'Replay behavior'].map((label) => (
          <View key={label} style={styles.docketRow}>
            <CheckCircle2 color={spotifyConnected ? colors.neonGreen : colors.muted} size={17} />
            <Text style={styles.docketText}>{label}</Text>
          </View>
        ))}
      </CourtCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  caseSeal: {
    width: 54,
    height: 54,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neonGreen,
    backgroundColor: 'rgba(182, 255, 59, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caseSealDanger: { borderColor: colors.dangerRed, backgroundColor: 'rgba(255, 53, 94, 0.08)' },
  statusPill: {
    borderWidth: 1,
    borderColor: colors.neonGreen,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(182, 255, 59, 0.08)',
  },
  statusPillDanger: { borderColor: colors.dangerRed, backgroundColor: 'rgba(255, 53, 94, 0.08)' },
  statusText: { color: colors.neonGreen, fontSize: 11, fontWeight: '900' },
  statusTextDanger: { color: colors.dangerRed },
  heroTitle: { color: colors.text, fontSize: 27, lineHeight: 32, fontWeight: '900', textTransform: 'uppercase', marginBottom: 8 },
  heroCopy: { color: colors.muted, fontSize: 15, lineHeight: 21, fontWeight: '700', marginBottom: 18 },
  docketTitle: { color: colors.text, fontSize: 13, fontWeight: '900', textTransform: 'uppercase', marginBottom: 10 },
  docketRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 9, borderTopWidth: 1, borderTopColor: colors.softBorder },
  docketText: { color: colors.text, fontSize: 15, fontWeight: '800' },
  compactDate: { color: colors.warningYellow, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', marginBottom: 12 },
  compactRow: { flexDirection: 'row', gap: 13, alignItems: 'center' },
  compactRisk: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neonGreen,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(182, 255, 59, 0.08)',
  },
  compactRiskValue: { color: colors.neonGreen, fontSize: 28, fontWeight: '900' },
  compactRiskLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  compactBody: { flex: 1 },
  compactTitle: { color: colors.text, fontSize: 22, lineHeight: 26, fontWeight: '900' },
  compactCopy: { color: colors.muted, fontSize: 13, fontWeight: '800', marginTop: 4 },
});
