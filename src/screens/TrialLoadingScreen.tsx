import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '../components/BrandMark';
import { colors, spacing } from '../design/tokens';

type TrialLoadingScreenProps = {
  source: 'demo' | 'spotify';
};

const scannerSteps = [
  'Collecting listening evidence',
  'Checking replay behavior',
  'Measuring artist dependency',
  'Scanning mood swings',
  'Preparing verdict card',
];

export function TrialLoadingScreen({ source }: TrialLoadingScreenProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 380);
    return () => clearInterval(timer);
  }, []);

  const activeStep = tick % scannerSteps.length;
  const progress = Math.min(94, 16 + tick * 11);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.topBar}>
          <BrandMark size="small" light />
          <Text style={styles.caseType}>{source === 'spotify' ? 'Spotify Trial' : 'Demo Trial'}</Text>
        </View>

        <View style={styles.scanner}>
          <View style={styles.record}>
            <View style={styles.recordRing} />
            <View style={styles.recordCore}>
              <Text style={styles.recordCoreText}>SC</Text>
            </View>
          </View>
          <View style={[styles.scannerArc, { transform: [{ rotate: `${tick * 22}deg` }] }]} />
        </View>

        <Text style={styles.title}>Building your case...</Text>
        <Text style={styles.subtitle}>The court is turning listening behavior into shareable evidence.</Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.steps}>
          {scannerSteps.map((step, index) => {
            const selected = index === activeStep;
            return (
              <View key={step} style={[styles.stepRow, selected && styles.stepRowSelected]}>
                <Text style={[styles.stepIndex, selected && styles.stepIndexSelected]}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <Text style={[styles.stepText, selected && styles.stepTextSelected]}>{step}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.ink,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caseType: {
    color: colors.lime,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  scanner: {
    alignItems: 'center',
    height: 320,
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  record: {
    alignItems: 'center',
    backgroundColor: '#050505',
    borderColor: colors.charcoal,
    borderRadius: 132,
    borderWidth: 2,
    height: 264,
    justifyContent: 'center',
    width: 264,
  },
  recordRing: {
    borderColor: colors.courtRed,
    borderRadius: 96,
    borderWidth: 18,
    height: 192,
    opacity: 0.72,
    position: 'absolute',
    width: 192,
  },
  recordCore: {
    alignItems: 'center',
    backgroundColor: colors.lime,
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    width: 84,
  },
  recordCoreText: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
  },
  scannerArc: {
    borderColor: colors.violet,
    borderLeftColor: 'transparent',
    borderRadius: 152,
    borderWidth: 5,
    height: 304,
    position: 'absolute',
    width: 304,
  },
  title: {
    color: colors.warmIvory,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 42,
  },
  subtitle: {
    color: colors.paperTan,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  progressTrack: {
    backgroundColor: colors.charcoal,
    borderRadius: 999,
    height: 14,
    marginTop: spacing.xl,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.lime,
    borderRadius: 999,
    height: 14,
  },
  steps: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  stepRow: {
    alignItems: 'center',
    backgroundColor: '#191715',
    borderColor: colors.charcoal,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  stepRowSelected: {
    borderColor: colors.courtRed,
  },
  stepIndex: {
    color: colors.mutedInk,
    fontSize: 12,
    fontWeight: '900',
  },
  stepIndexSelected: {
    color: colors.lime,
  },
  stepText: {
    color: colors.paperTan,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  stepTextSelected: {
    color: colors.warmIvory,
  },
});
