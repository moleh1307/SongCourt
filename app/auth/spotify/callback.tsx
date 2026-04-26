import { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert, StyleSheet, Text } from 'react-native';
import { NeonButton } from '../../../src/components/common/NeonButton';
import { Screen } from '../../../src/components/common/Screen';
import { SectionHeader } from '../../../src/components/common/SectionHeader';
import { colors } from '../../../src/constants/colors';
import { useAuthStore } from '../../../src/store/authStore';

export default function SpotifyCallbackScreen() {
  const params = useLocalSearchParams<{ ticket?: string; state?: string; error?: string }>();
  const completeSpotifyLogin = useAuthStore((store) => store.completeSpotifyLogin);

  useEffect(() => {
    const complete = async () => {
      if (params.error) {
        Alert.alert('Spotify declined.', 'The court could not receive evidence from Spotify.');
        router.replace('/connect');
        return;
      }

      if (!params.ticket) {
        return;
      }

      try {
        await completeSpotifyLogin(params.ticket, params.state);
        router.replace('/trial/loading');
      } catch {
        Alert.alert('Spotify login failed.', 'The evidence code could not be verified.');
        router.replace('/connect');
      }
    };

    void complete();
  }, [completeSpotifyLogin, params.error, params.state, params.ticket]);

  return (
    <Screen scroll={false}>
      <SectionHeader eyebrow="SPOTIFY EVIDENCE" title="Sealing your case file." />
      <ActivityIndicator color={colors.neonGreen} size="large" />
      <Text style={styles.copy}>Keep SongCourt open while the court verifies your Spotify evidence.</Text>
      <NeonButton onPress={() => router.replace('/connect')}>Back to Connect</NeonButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { color: colors.muted, fontSize: 15, fontWeight: '800', textAlign: 'center' },
});
