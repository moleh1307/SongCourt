import { router } from 'expo-router';
import { Lock, Music2 } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SecondaryButton } from '../../src/components/common/SecondaryButton';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';

export default function ConnectScreen() {
  const connectSpotifyDemo = useAuthStore((state) => state.connectSpotifyDemo);

  const connect = async () => {
    await connectSpotifyDemo();
    router.replace('/(tabs)/trial');
  };

  const preview = async () => {
    await connectSpotifyDemo();
    router.push('/trial/loading');
  };

  return (
    <Screen>
      <Text style={styles.kicker}>CASE FILE REQUIRED</Text>
      <CourtCard accent={colors.neonGreen}>
        <View style={styles.iconWrap}>
          <Music2 color={colors.neonGreen} size={56} />
        </View>
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
  iconWrap: { alignItems: 'center', marginVertical: 20 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
  trust: { flexDirection: 'row', gap: 10, marginVertical: 18, alignItems: 'flex-start' },
  trustText: { flex: 1, color: colors.muted, fontSize: 13, fontWeight: '700' },
});
