import { router } from 'expo-router';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SecondaryButton } from '../../src/components/common/SecondaryButton';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import { useHistoryStore } from '../../src/store/historyStore';
import { useSettingsStore } from '../../src/store/settingsStore';

export default function ProfileTab() {
  const user = useAuthStore((state) => state.user);
  const isDemoMode = useAuthStore((state) => state.isDemoMode);
  const disconnectSpotify = useAuthStore((state) => state.disconnectSpotify);
  const verdicts = useHistoryStore((state) => state.verdicts);
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  const settings = useSettingsStore();
  const highestAux = Math.max(0, ...verdicts.map((verdict) => verdict.scores.find((score) => score.key === 'auxRisk')?.value ?? 0));

  const reset = () => {
    clearHistory();
    Alert.alert('Record cleared.', 'Your criminal record is clean. Suspiciously clean.');
  };

  return (
    <Screen>
      <SectionHeader eyebrow="DEFENDANT PROFILE" title={user?.displayName ?? 'Melih'} />
      <CourtCard accent={colors.neonGreen}>
        <Text style={styles.status}>{isDemoMode ? 'Demo Spotify connected' : 'Spotify not connected'}</Text>
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.value}>{verdicts.length}</Text>
            <Text style={styles.label}>Total Trials</Text>
          </View>
          <View>
            <Text style={styles.value}>{highestAux}</Text>
            <Text style={styles.label}>Highest Aux Risk</Text>
          </View>
        </View>
      </CourtCard>

      <CourtCard accent={colors.electricPurple}>
        <SettingRow label="Haptics" value={settings.hapticsEnabled} onValueChange={settings.toggleHaptics} />
        <SettingRow label="Sound Placeholder" value={settings.soundEnabled} onValueChange={settings.toggleSound} />
        <SettingRow label="Share Watermark" value={settings.watermarkEnabled} onValueChange={settings.toggleWatermark} />
      </CourtCard>

      <CourtCard accent={colors.warningYellow}>
        <Text style={styles.premium}>UNLOCK FULL COURT ACCESS</Text>
        <Text style={styles.muted}>More verdicts, better share cards, deeper stats, and no watermark.</Text>
        <NeonButton
          onPress={() => Alert.alert('SongCourt+ is sealed.', 'Premium court powers are designed, but not active in this MVP.')}
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
      <Text style={styles.legal}>Privacy Policy · Terms of Service · Delete Account</Text>
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
  legal: { color: colors.muted, textAlign: 'center', fontSize: 12, fontWeight: '700', paddingBottom: 90 },
});
