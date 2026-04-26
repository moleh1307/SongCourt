import { useEffect } from 'react';
import { router } from 'expo-router';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gavel } from 'lucide-react-native';
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
            <View style={styles.brand}>
              <Text style={styles.song}>Song</Text>
              <Text style={styles.court}>Court</Text>
            </View>
            <View style={styles.paperStrip}>
              <Text style={styles.paperText}>Your music taste is now evidence.</Text>
            </View>
            <Text style={styles.subtitle}>Music on trial.</Text>
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
  scrim: { flex: 1, backgroundColor: 'rgba(5, 4, 7, 0.42)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 28 },
  seal: { width: 116, height: 116, marginBottom: -6, borderRadius: 24 },
  brand: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  song: {
    color: colors.text,
    fontSize: 58,
    lineHeight: 64,
    fontWeight: '900',
    textShadowColor: colors.redGlow,
    textShadowRadius: 18,
  },
  court: {
    color: colors.hotPink,
    fontSize: 50,
    lineHeight: 56,
    fontWeight: '900',
    fontStyle: 'italic',
    marginLeft: -2,
    textShadowColor: colors.hotPink,
    textShadowRadius: 18,
  },
  paperStrip: {
    backgroundColor: colors.courtPaper,
    paddingHorizontal: 16,
    paddingVertical: 8,
    transform: [{ rotate: '-2deg' }],
    shadowColor: colors.black,
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  paperText: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  subtitle: { color: colors.warningYellow, fontSize: 12, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
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
  bar: { width: 12, backgroundColor: colors.hotPink, borderRadius: 6 },
});
