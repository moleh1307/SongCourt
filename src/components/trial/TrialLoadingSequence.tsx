import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { DimensionValue } from 'react-native';
import { colors } from '../../constants/colors';
import { loadingLines, stageLabels } from '../../data/copyTemplates';

export function TrialLoadingSequence({ stage }: { stage: number }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const line = loadingLines[Math.min(stage * 2, loadingLines.length - 1)];
  const progressValue = Math.min(100, (stage + 1) * 25);
  const progress = `${progressValue}%` as DimensionValue;

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.disc, { transform: [{ rotate }] }]}>
        <View style={styles.innerDisc} />
      </Animated.View>
      <Text style={styles.line}>{line}</Text>
      <View style={styles.progressShell}>
        <View style={[styles.progressFill, { width: progress }]} />
      </View>
      <Text style={styles.progressLabel}>{stage >= 3 ? 'Verdict locked' : `${progressValue}% evidence scanned`}</Text>
      <View style={styles.stages}>
        {stageLabels.map((label, index) => (
          <View key={label} style={[styles.stage, index <= stage && styles.stageActive]}>
            <Text style={[styles.stageText, index <= stage && styles.stageTextActive]}>{label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.final}>{stage >= 3 ? 'THE COURT HAS DECIDED' : 'EVIDENCE SCANNER ACTIVE'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', gap: 28 },
  disc: {
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 12,
    borderColor: colors.electricPurple,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.electricPurple,
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  innerDisc: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.dangerRed },
  line: { color: colors.text, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  progressShell: { height: 10, borderRadius: 8, backgroundColor: colors.deepCard, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.electricPurple },
  progressLabel: { color: colors.warningYellow, fontSize: 12, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
  stages: { gap: 10 },
  stage: { borderWidth: 1, borderColor: colors.border, padding: 12, borderRadius: 8, backgroundColor: colors.deepCard },
  stageActive: { borderColor: colors.electricPurple },
  stageText: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  stageTextActive: { color: colors.electricPurple },
  final: { color: colors.dangerRed, fontSize: 18, fontWeight: '900', textAlign: 'center' },
});
