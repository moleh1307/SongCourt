import { useEffect } from 'react';
import { router } from 'expo-router';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gavel } from 'lucide-react-native';
import { GlowText } from '../src/components/common/GlowText';
import { colors } from '../src/constants/colors';
import { useAuthStore } from '../src/store/authStore';

const splashBackground = require('../assets/premium/courtroom-stage-bg.png');
const courtSeal = require('../assets/premium/app-icon-seal.png');

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
    <ImageBackground source={splashBackground} resizeMode="cover" style={styles.root}>
      <View style={styles.scrim}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.center}>
            <View style={styles.equalizer}>
              {[36, 74, 48, 96, 58, 82, 40].map((height, index) => (
                <View key={index} style={[styles.bar, { height }]} />
              ))}
            </View>
            <Image source={courtSeal} resizeMode="contain" style={styles.seal} />
            <Gavel color={colors.neonGreen} size={38} />
            <GlowText size={48}>SongCourt</GlowText>
            <Text style={styles.subtitle}>Your listening history. On trial.</Text>
            <View style={styles.loadingPill}>
              <Text style={styles.loading}>CASE FILE LOADING</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  scrim: { flex: 1, backgroundColor: 'rgba(5, 5, 7, 0.34)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 28 },
  seal: { width: 116, height: 116, marginBottom: -6, borderRadius: 24 },
  subtitle: { color: colors.text, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  loadingPill: {
    borderWidth: 1,
    borderColor: 'rgba(215, 255, 31, 0.42)',
    backgroundColor: 'rgba(5, 5, 7, 0.54)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 6,
  },
  loading: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  equalizer: { position: 'absolute', bottom: 92, flexDirection: 'row', gap: 8, opacity: 0.34, alignItems: 'flex-end' },
  bar: { width: 12, backgroundColor: colors.neonGreen, borderRadius: 6 },
});
