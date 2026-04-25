import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = true }: ScreenProps) {
  const content = <View style={[styles.content, !scroll && styles.fixedContent]}>{children}</View>;
  return (
    <LinearGradient colors={[colors.background, '#10101F', colors.background]} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: { padding: 20, paddingBottom: 150, gap: 18 },
  fixedContent: { flex: 1 },
});
