import { router } from 'expo-router';
import { CheckCircle2, Gavel } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SecondaryButton } from '../../src/components/common/SecondaryButton';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { VerdictSummaryCard } from '../../src/components/trial/VerdictSummaryCard';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import { useHistoryStore } from '../../src/store/historyStore';
import { useTrialStore } from '../../src/store/trialStore';

export default function TrialTab() {
  const spotifyConnected = useAuthStore((state) => state.spotifyConnected);
  const todayVerdict = useHistoryStore((state) => state.getTodayVerdict());
  const setCurrentVerdict = useTrialStore((state) => state.setCurrentVerdict);

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
      <SectionHeader eyebrow="TODAY'S CASE" title={todayVerdict ? "Today's verdict is ready." : 'Are you guilty today?'} />
      <Text style={styles.subtext}>
        {spotifyConnected ? 'Your recent listening history is ready for trial.' : 'No evidence yet. Connect Spotify so the court can begin.'}
      </Text>

      {!spotifyConnected ? (
        <CourtCard accent={colors.neonGreen}>
          <Text style={styles.title}>CASE FILE REQUIRED</Text>
          <Text style={styles.subtext}>Preview the demo trial before real Spotify OAuth arrives.</Text>
          <NeonButton onPress={() => router.push('/connect')}>Connect Spotify</NeonButton>
          <SecondaryButton onPress={startTrial}>Preview Demo Trial</SecondaryButton>
        </CourtCard>
      ) : todayVerdict ? (
        <>
          <VerdictSummaryCard verdict={todayVerdict} />
          <NeonButton onPress={viewToday}>View Verdict</NeonButton>
          <SecondaryButton onPress={startTrial}>Regenerate</SecondaryButton>
        </>
      ) : (
        <CourtCard accent={colors.neonGreen}>
          <View style={styles.gavelWrap}>
            <Gavel color={colors.neonGreen} size={56} />
          </View>
          <NeonButton onPress={startTrial} accessibilityLabel="Put me on trial">PUT ME ON TRIAL</NeonButton>
          <View style={styles.chips}>
            {['Recent tracks loaded', 'Top artists ready', 'Replay behavior detected'].map((label) => (
              <View key={label} style={styles.chip}>
                <CheckCircle2 color={colors.neonGreen} size={16} />
                <Text style={styles.chipText}>{label}</Text>
              </View>
            ))}
          </View>
        </CourtCard>
      )}

      <CourtCard accent={colors.electricPurple}>
        <Text style={styles.yesterday}>YESTERDAY'S VERDICT</Text>
        <Text style={styles.preview}>AUX RISK 73 — Emotionally Suspicious</Text>
      </CourtCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtext: { color: colors.muted, fontSize: 16, fontWeight: '700' },
  title: { color: colors.text, fontSize: 24, fontWeight: '900', textTransform: 'uppercase' },
  gavelWrap: { alignItems: 'center', marginBottom: 18 },
  chips: { gap: 10, marginTop: 18 },
  chip: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.deepCard, padding: 12, borderRadius: 8 },
  chipText: { color: colors.text, fontSize: 13, fontWeight: '800' },
  yesterday: { color: colors.electricPurple, fontWeight: '900', fontSize: 12 },
  preview: { color: colors.text, fontWeight: '900', fontSize: 17, marginTop: 6 },
});
