import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { FileWarning, Gauge, Stamp } from 'lucide-react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';

const pages = [
  {
    title: 'Your music taste has been reported.',
    text: 'SongCourt checks your listening history and delivers a daily verdict.',
    Icon: FileWarning,
  },
  {
    title: 'Get your Aux Risk score.',
    text: 'Sad repeats, genre chaos, guilty artists, and suspicious behavior.',
    Icon: Gauge,
  },
  {
    title: 'Share the verdict.',
    text: 'Post your daily trial card and compare with friends.',
    Icon: Stamp,
  },
];

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const current = pages[page];
  const Icon = current.Icon;

  const next = () => {
    if (page < pages.length - 1) {
      setPage((value) => value + 1);
      return;
    }
    completeOnboarding();
    router.replace('/connect');
  };

  return (
    <Screen>
      <Text style={styles.logo}>SONGCOURT</Text>
      <CourtCard accent={page === 1 ? colors.neonGreen : colors.hotPink}>
        <View style={styles.visual}>
          <Icon color={colors.neonGreen} size={74} />
          <Text style={styles.file}>AUX CRIMES</Text>
        </View>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.text}>{current.text}</Text>
      </CourtCard>
      <View style={styles.dots}>
        {pages.map((item, index) => (
          <View key={item.title} style={[styles.dot, index === page && styles.dotActive]} />
        ))}
      </View>
      <NeonButton onPress={next}>{page === pages.length - 1 ? 'Connect Spotify' : 'Next'}</NeonButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { color: colors.neonGreen, fontSize: 16, fontWeight: '900' },
  visual: { height: 190, alignItems: 'center', justifyContent: 'center', gap: 12 },
  file: { color: colors.dangerRed, fontSize: 18, fontWeight: '900', transform: [{ rotate: '-4deg' }] },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', textTransform: 'uppercase' },
  text: { color: colors.muted, fontSize: 16, fontWeight: '700', marginTop: 10 },
  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.neonGreen, width: 24 },
});
