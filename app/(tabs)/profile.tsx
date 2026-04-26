import { router } from 'expo-router';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { DopamineStrip } from '../../src/components/common/DopamineStrip';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SecondaryButton } from '../../src/components/common/SecondaryButton';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import { useHistoryStore } from '../../src/store/historyStore';
import { useRewardStore } from '../../src/store/rewardStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { getAuxRisk, getRankProgress } from '../../src/utils/verdictRewards';

export default function ProfileTab() {
  const user = useAuthStore((state) => state.user);
  const spotifyConnected = useAuthStore((state) => state.spotifyConnected);
  const isDemoMode = useAuthStore((state) => state.isDemoMode);
  const disconnectSpotify = useAuthStore((state) => state.disconnectSpotify);
  const verdicts = useHistoryStore((state) => state.verdicts);
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  const rewardXp = useRewardStore((state) => state.xp);
  const rewardRank = useRewardStore((state) => state.rank);
  const rewardTrials = useRewardStore((state) => state.totalTrials);
  const rewardStreak = useRewardStore((state) => state.getStreak());
  const rewardBadges = useRewardStore((state) => state.unlockedBadges);
  const resetRewards = useRewardStore((state) => state.resetRewards);
  const settings = useSettingsStore();
  const highestAux = Math.max(0, ...verdicts.map(getAuxRisk));
  const rankProgress = getRankProgress(rewardXp);
  const totalTrials = Math.max(verdicts.length, rewardTrials);

  const reset = () => {
    Alert.alert('Clear verdict history?', 'This removes local verdict records from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearHistory();
          resetRewards();
          Alert.alert('Record cleared.', 'Your criminal record is clean. Suspiciously clean.');
        },
      },
    ]);
  };

  return (
    <Screen>
      <SectionHeader eyebrow="DEFENDANT PROFILE" title={user?.displayName ?? 'Melih'} />
      <DopamineStrip
        items={[
          { value: `${totalTrials}`, label: 'trials', color: colors.neonGreen },
          { value: `${highestAux}`, label: 'peak risk', color: colors.dangerRed },
          { value: `${rewardStreak}`, label: 'streak', color: colors.hotPink },
        ]}
      />
      <CourtCard accent={colors.neonGreen}>
        <Text style={styles.status}>
          {spotifyConnected ? (isDemoMode ? 'Demo Spotify connected' : 'Spotify connected') : 'Spotify not connected'}
        </Text>
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.value}>{totalTrials}</Text>
            <Text style={styles.label}>Total Trials</Text>
          </View>
          <View>
            <Text style={styles.value}>{highestAux}</Text>
            <Text style={styles.label}>Highest Aux Risk</Text>
          </View>
        </View>
      </CourtCard>

      <CourtCard accent={colors.hotPink}>
        <Text style={styles.premium}>{rewardRank}</Text>
        <Text style={styles.muted}>
          {rankProgress.next ? `${rankProgress.xpIntoRank}/${rankProgress.xpForNext} XP to ${rankProgress.next}` : 'Maximum court status reached.'}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(rankProgress.progress * 100)}%` }]} />
        </View>
        <Text style={styles.xpLine}>{rewardXp} total XP</Text>
      </CourtCard>

      <CourtCard accent={colors.warningYellow}>
        <Text style={styles.badgeHeader}>Badge shelf</Text>
        <View style={styles.badgeGrid}>
          {rewardBadges.length ? (
            rewardBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeChip}>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.muted}>Generate a verdict to unlock your first badge.</Text>
          )}
        </View>
      </CourtCard>

      <CourtCard accent={colors.electricPurple}>
        <SettingRow label="Haptics" value={settings.hapticsEnabled} onValueChange={settings.toggleHaptics} />
        <SettingRow label="Share Watermark" value={settings.watermarkEnabled} onValueChange={settings.toggleWatermark} />
      </CourtCard>

      <CourtCard accent={colors.warningYellow}>
        <Text style={styles.premium}>UNLOCK FULL COURT ACCESS</Text>
        <Text style={styles.muted}>More verdicts, better share cards, deeper stats, and no watermark.</Text>
        <NeonButton
          onPress={() => Alert.alert('SongCourt+ preview.', 'Premium court powers are mapped for the next product pass.')}
          variant="purple"
        >
          Unlock SongCourt+
        </NeonButton>
      </CourtCard>

      <SecondaryButton onPress={reset}>Clear Verdict History</SecondaryButton>
      <SecondaryButton
        onPress={() => {
          disconnectSpotify();
          router.replace('/connect');
        }}
      >
        Disconnect Spotify
      </SecondaryButton>
      <Text style={styles.legal}>Privacy Policy - Terms of Service - Delete Account</Text>
    </Screen>
  );
}

function SettingRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: () => void }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.neonGreen, false: colors.border }} />
    </View>
  );
}

const styles = StyleSheet.create({
  status: { color: colors.neonGreen, fontSize: 14, fontWeight: '900', textTransform: 'uppercase' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  value: { color: colors.text, fontSize: 38, fontWeight: '900' },
  label: { color: colors.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLabel: { color: colors.text, fontSize: 16, fontWeight: '800' },
  premium: { color: colors.warningYellow, fontSize: 22, fontWeight: '900' },
  muted: { color: colors.muted, fontSize: 14, fontWeight: '700', marginVertical: 10 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden', marginTop: 6 },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: colors.hotPink },
  xpLine: { color: colors.neonGreen, fontSize: 12, fontWeight: '900', textTransform: 'uppercase', marginTop: 10 },
  badgeHeader: { color: colors.warningYellow, fontSize: 18, fontWeight: '900', textTransform: 'uppercase' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  badgeChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.hotPink,
    backgroundColor: 'rgba(255, 31, 104, 0.09)',
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  badgeTitle: { color: colors.text, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  legal: { color: colors.muted, textAlign: 'center', fontSize: 12, fontWeight: '700', paddingBottom: 90 },
});
