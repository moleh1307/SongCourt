import { router } from 'expo-router';
import { Lock, Music2 } from 'lucide-react-native';
import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SecondaryButton } from '../../src/components/common/SecondaryButton';
import { colors } from '../../src/constants/colors';
import { spotifyService } from '../../src/services/spotifyService';
import { useAuthStore } from '../../src/store/authStore';

const caseFilePaper = require('../../assets/premium/case-file-paper.png');

export default function ConnectScreen() {
  const startSpotifyLogin = useAuthStore((state) => state.startSpotifyLogin);
  const connectSpotifyDemo = useAuthStore((state) => state.connectSpotifyDemo);

  const connect = async () => {
    if (!spotifyService.isConfigured()) {
      Alert.alert(
        'Spotify setup needed.',
        `Add EXPO_PUBLIC_API_BASE_URL. The backend will use ${spotifyService.getReturnUri()} to return to the app. Demo trial still works.`,
      );
      return;
    }
    try {
      await startSpotifyLogin();
    } catch {
      Alert.alert('Spotify login failed.', 'The courtroom could not open Spotify login.');
    }
  };

  const preview = async () => {
    await connectSpotifyDemo();
    router.push('/trial/loading');
  };

  return (
    <Screen>
      <Text style={styles.kicker}>CASE FILE REQUIRED</Text>
      <CourtCard accent={colors.neonGreen}>
        <ImageBackground source={caseFilePaper} resizeMode="cover" style={styles.paperHero}>
          <View style={styles.paperOverlay}>
            <Text style={styles.paperLabel}>SONGCOURT DOCKET</Text>
            <View style={styles.iconWrap}>
              <Music2 color={colors.neonGreen} size={54} />
            </View>
            <Text style={styles.paperTitle}>YOUR TASTE ON TRIAL</Text>
          </View>
        </ImageBackground>
        <Text style={styles.title}>Connect Spotify to begin your trial.</Text>
        <View style={styles.trust}>
          <Lock color={colors.muted} size={17} />
          <Text style={styles.trustText}>We use listening data to calculate verdicts and compatibility. We never post without permission.</Text>
        </View>
        <NeonButton onPress={connect}>Connect Spotify</NeonButton>
        <SecondaryButton onPress={preview}>Preview Demo Trial</SecondaryButton>
      </CourtCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.warningYellow, fontWeight: '900', fontSize: 12 },
  paperHero: { height: 260, overflow: 'hidden', borderRadius: 10, marginBottom: 18 },
  paperOverlay: {
    flex: 1,
    padding: 22,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(244, 227, 189, 0.2)',
  },
  paperLabel: { color: colors.ink, fontSize: 11, fontWeight: '900', letterSpacing: 0 },
  paperTitle: { color: colors.ink, fontSize: 38, lineHeight: 40, fontWeight: '900', maxWidth: 240 },
  iconWrap: { alignItems: 'flex-start', marginVertical: 12 },
  title: { color: colors.text, fontSize: 26, lineHeight: 31, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
  trust: { flexDirection: 'row', gap: 10, marginVertical: 18, alignItems: 'flex-start' },
  trustText: { flex: 1, color: colors.muted, fontSize: 13, fontWeight: '700' },
});
