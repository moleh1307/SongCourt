import type { ReactNode } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

const screenTexture = require('../../../assets/premium/verdict-poster-bg.png');

export function Screen({ children, scroll = true }: ScreenProps) {
  const content = <View style={[styles.content, !scroll && styles.fixedContent]}>{children}</View>;
  return (
    <ImageBackground source={screenTexture} resizeMode="cover" style={styles.root}>
      <LinearGradient colors={['rgba(5, 4, 7, 0.9)', 'rgba(5, 4, 7, 0.96)', colors.background]} style={styles.scrim}>
        <SafeAreaView style={styles.safe}>
          {scroll ? <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrim: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: { padding: 20, paddingTop: 18, paddingBottom: 240, gap: 16 },
  fixedContent: { flex: 1 },
});
