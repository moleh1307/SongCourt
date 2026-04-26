import { useEffect } from 'react';
import { router } from 'expo-router';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrialLoadingSequence } from '../../src/components/trial/TrialLoadingSequence';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import { useTrialStore } from '../../src/store/trialStore';

const scannerBackground = require('../../assets/generated/trial-scanner-bg.png');

export default function TrialLoadingScreen() {
  const connectSpotifyDemo = useAuthStore((state) => state.connectSpotifyDemo);
  const spotifyConnected = useAuthStore((state) => state.spotifyConnected);
  const generateVerdict = useTrialStore((state) => state.generateVerdict);
  const stage = useTrialStore((state) => state.generationStage);
  const setGenerationStage = useTrialStore((state) => state.setGenerationStage);

  useEffect(() => {
    const timers = [0, 1, 2, 3].map((value) => setTimeout(() => setGenerationStage(value), value * 900));
    const run = setTimeout(async () => {
      if (!spotifyConnected) {
        await connectSpotifyDemo();
      }
      await generateVerdict();
      router.replace('/trial/result');
    }, 4200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(run);
    };
  }, [connectSpotifyDemo, generateVerdict, setGenerationStage, spotifyConnected]);

  return (
    <ImageBackground source={scannerBackground} resizeMode="cover" style={styles.root}>
      <View style={styles.scrim}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.content}>
            <TrialLoadingSequence stage={stage} />
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrim: { flex: 1, backgroundColor: 'rgba(5, 5, 7, 0.52)' },
  safe: { flex: 1 },
  content: { flex: 1, padding: 20, paddingBottom: 44 },
});
