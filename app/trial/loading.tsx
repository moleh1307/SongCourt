import { useEffect } from 'react';
import { router } from 'expo-router';
import { Screen } from '../../src/components/common/Screen';
import { TrialLoadingSequence } from '../../src/components/trial/TrialLoadingSequence';
import { useAuthStore } from '../../src/store/authStore';
import { useTrialStore } from '../../src/store/trialStore';

export default function TrialLoadingScreen() {
  const connectSpotifyDemo = useAuthStore((state) => state.connectSpotifyDemo);
  const generateDemoVerdict = useTrialStore((state) => state.generateDemoVerdict);
  const stage = useTrialStore((state) => state.generationStage);
  const setGenerationStage = useTrialStore((state) => state.setGenerationStage);

  useEffect(() => {
    const timers = [0, 1, 2, 3].map((value) => setTimeout(() => setGenerationStage(value), value * 900));
    const run = setTimeout(async () => {
      await connectSpotifyDemo();
      await generateDemoVerdict();
      router.replace('/trial/result');
    }, 4200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(run);
    };
  }, [connectSpotifyDemo, generateDemoVerdict, setGenerationStage]);

  return (
    <Screen scroll={false}>
      <TrialLoadingSequence stage={stage} />
    </Screen>
  );
}
