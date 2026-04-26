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
      <SectionHeader eyebrow="CASE #10247" title="Today's trial." />

      {!spotifyConnected ? (
        <CourtCard accent={colors.dangerRed}>
          <TrialDial status="Evidence missing" Icon={Music2} />
          <Text style={styles.heroTitle}>Connect Spotify to unlock the courtroom.</Text>
          <Text style={styles.heroCopy}>We need the goods before the court can build your case.</Text>
          <NeonButton onPress={() => router.push('/connect')} variant="green">Connect Spotify</NeonButton>
          <SecondaryButton onPress={startTrial}>Preview Demo Trial</SecondaryButton>
        </CourtCard>
      ) : todayVerdict ? (
        <>
          <CourtCard accent={colors.dangerRed}>
            <TrialDial status="Not tried today" Icon={ShieldCheck} sealed />
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
        <CourtCard accent={colors.dangerRed}>
          <TrialDial status="The court is ready" Icon={Gavel} />
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

function TrialDial({ status, Icon, sealed }: { status: string; Icon: typeof Gavel; sealed?: boolean }) {
  return (
    <View style={styles.trialBoard}>
      <View style={styles.heroTop}>
        <View style={styles.caseSeal}>
          <Icon color={sealed ? colors.dangerRed : colors.warningYellow} size={28} />
        </View>
        <Text style={styles.caseNumber}>CASE #10247</Text>
      </View>
      <View style={styles.dialOuter}>
        <View style={styles.dialMid}>
          <View style={styles.dialInner}>
            <Text style={styles.dialStatus}>{sealed ? 'VERDICT' : 'TODAY'}</Text>
            <Text style={styles.dialTitle}>{status}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.boardCopy}>The court is ready. Put yourself on trial.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  trialBoard: {
    minHeight: 214,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 23, 79, 0.44)',
    backgroundColor: 'rgba(8, 5, 9, 0.74)',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  heroTop: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  caseSeal: {
    width: 54,
    height: 54,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.warningYellow,
    backgroundColor: 'rgba(245, 182, 66, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caseNumber: { color: colors.hotPink, fontSize: 11, fontWeight: '900' },
  dialOuter: {
    width: 136,
    height: 136,
    borderRadius: 68,
    borderWidth: 1,
    borderColor: colors.dangerRed,
    backgroundColor: 'rgba(255, 23, 79, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.dangerRed,
    shadowOpacity: 0.52,
    shadowRadius: 24,
  },
  dialMid: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 9,
    borderColor: 'rgba(255, 31, 104, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.vinyl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  dialStatus: { color: colors.warningYellow, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  dialTitle: { color: colors.text, fontSize: 11, lineHeight: 13, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase', marginTop: 3 },
  boardCopy: { color: colors.muted, fontSize: 13, fontWeight: '800', textAlign: 'center' },
  heroTitle: { color: colors.text, fontSize: 27, lineHeight: 31, fontWeight: '900', textTransform: 'uppercase', marginBottom: 8 },
  heroCopy: { color: colors.muted, fontSize: 15, lineHeight: 21, fontWeight: '700', marginBottom: 18 },
  docketTitle: { color: colors.text, fontSize: 13, fontWeight: '900', textTransform: 'uppercase', marginBottom: 10 },
  docketRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 9, borderTopWidth: 1, borderTopColor: colors.softBorder },
  docketText: { color: colors.text, fontSize: 15, fontWeight: '800' },
  compactDate: { color: colors.warningYellow, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', marginBottom: 12 },
  compactRow: { flexDirection: 'row', gap: 13, alignItems: 'center' },
  compactRisk: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.dangerRed,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 23, 79, 0.1)',
  },
  compactRiskValue: { color: colors.dangerRed, fontSize: 28, fontWeight: '900' },
  compactRiskLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  compactBody: { flex: 1 },
  compactTitle: { color: colors.text, fontSize: 22, lineHeight: 26, fontWeight: '900' },
  compactCopy: { color: colors.muted, fontSize: 13, fontWeight: '800', marginTop: 4 },
});
