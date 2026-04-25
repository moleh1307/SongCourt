import { useEffect } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Gavel } from 'lucide-react-native';
import { Screen } from '../src/components/common/Screen';
import { GlowText } from '../src/components/common/GlowText';
import { colors } from '../src/constants/colors';
import { useAuthStore } from '../src/store/authStore';

export default function SplashScreen() {
  const hasCompletedOnboarding = useAuthStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (!isMounted) return;
      const hydrated = useAuthStore.persist.hasHydrated();
      if (!hydrated) {
        useAuthStore.persist.onFinishHydration((state) => {
          router.replace(state.hasCompletedOnboarding ? '/(tabs)/trial' : '/onboarding');
        });
        return;
      }
      router.replace(hasCompletedOnboarding ? '/(tabs)/trial' : '/onboarding');
    }, 1700);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [hasCompletedOnboarding]);

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <View style={styles.equalizer}>
          {[36, 74, 48, 96, 58, 82, 40].map((height, index) => (
            <View key={index} style={[styles.bar, { height }]} />
          ))}
        </View>
        <Gavel color={colors.neonGreen} size={52} />
        <GlowText size={48}>SongCourt</GlowText>
        <Text style={styles.subtitle}>Your music taste is under investigation.</Text>
        <Text style={styles.loading}>CASE FILE LOADING</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  subtitle: { color: colors.text, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  loading: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  equalizer: { position: 'absolute', flexDirection: 'row', gap: 8, opacity: 0.22, alignItems: 'flex-end' },
  bar: { width: 12, backgroundColor: colors.electricPurple, borderRadius: 6 },
});
