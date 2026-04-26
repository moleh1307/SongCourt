import { useState } from 'react';
import { router } from 'expo-router';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { FileWarning, Gauge, Stamp } from 'lucide-react-native';
import { CourtCard } from '../../src/components/common/CourtCard';
import { DopamineStrip } from '../../src/components/common/DopamineStrip';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';

const pages = [
  {
    title: 'Your music taste is evidence.',
    text: 'Every replay, skip, and guilty artist becomes a court file.',
    reward: 'Daily trial',
    trigger: 'New verdict',
    Icon: FileWarning,
  },
  {
    title: 'Get the score your group chat deserves.',
    text: 'Aux Risk turns your listening chaos into one brutal number.',
    reward: 'Aux Risk',
    trigger: 'Top 1%',
    Icon: Gauge,
  },
  {
    title: 'Post the receipt before they do.',
    text: 'Make the verdict feel like a collectible, not a screenshot.',
    reward: 'Story card',
    trigger: 'Share bait',
    Icon: Stamp,
  },
];

const courtroomStage = require('../../assets/premium/courtroom-stage-bg.png');

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
      <View style={styles.hero}>
        <ImageBackground source={courtroomStage} resizeMode="cover" style={styles.heroImage}>
          <View style={styles.heroScrim}>
            <View style={styles.casePill}>
              <Text style={styles.casePillText}>CASE 001</Text>
            </View>
            <Icon color={colors.neonGreen} size={68} />
            <Text style={styles.file}>AUX CRIMES</Text>
          </View>
        </ImageBackground>
      </View>
      <CourtCard accent={page === 1 ? colors.neonGreen : colors.hotPink}>
        <Text adjustsFontSizeToFit numberOfLines={3} style={styles.title}>{current.title}</Text>
        <Text style={styles.text}>{current.text}</Text>
        <DopamineStrip
          items={[
            { value: current.reward, label: 'reward loop', color: colors.neonGreen },
            { value: current.trigger, label: 'viral hook', color: colors.hotPink },
          ]}
        />
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
  hero: {
    height: 260,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(215, 255, 31, 0.28)',
    backgroundColor: colors.deepCard,
  },
  heroImage: { flex: 1 },
  heroScrim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(5, 5, 7, 0.18)',
  },
  casePill: {
    borderWidth: 1,
    borderColor: 'rgba(244, 227, 189, 0.4)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(5, 5, 7, 0.5)',
  },
  casePillText: { color: colors.courtPaper, fontSize: 10, fontWeight: '900' },
  file: { color: colors.dangerRed, fontSize: 18, fontWeight: '900', transform: [{ rotate: '-4deg' }] },
  title: { color: colors.text, fontSize: 28, lineHeight: 32, fontWeight: '900', textTransform: 'uppercase' },
  text: { color: colors.muted, fontSize: 16, fontWeight: '700', marginTop: 10 },
  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.neonGreen, width: 24 },
});
