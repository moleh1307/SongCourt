import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '../components/BrandMark';
import { colors, fonts, spacing } from '../design/tokens';

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
            <View style={styles.recordGrooveOuter} />
            <View style={styles.recordGrooveInner} />
            <View style={styles.recordCore}>
              <Text style={styles.recordCoreText}>SC</Text>
            </View>
          </View>
          <View style={[styles.scannerArc, { transform: [{ rotate: `${tick * 22}deg` }] }]} />
        </View>

        <Text style={styles.title}>Building the case</Text>
        <Text style={styles.subtitle}>Listening signals are being organized into a verdict and share card.</Text>

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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caseType: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  scanner: {
    alignItems: 'center',
    height: 250,
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  record: {
    alignItems: 'center',
    backgroundColor: '#050505',
    borderColor: '#3B3530',
    borderRadius: 96,
    borderWidth: 2,
    height: 192,
    justifyContent: 'center',
    width: 192,
  },
  recordGrooveOuter: {
    borderColor: '#2F2924',
    borderRadius: 74,
    borderWidth: 12,
    height: 148,
    opacity: 0.72,
    position: 'absolute',
    width: 148,
  },
  recordGrooveInner: {
    borderColor: colors.courtRed,
    borderRadius: 50,
    borderWidth: 4,
    height: 100,
    opacity: 0.76,
    position: 'absolute',
    width: 100,
  },
  recordCore: {
    alignItems: 'center',
    backgroundColor: colors.warmIvory,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  recordCoreText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '900',
  },
  scannerArc: {
    borderColor: colors.courtRed,
    borderLeftColor: 'transparent',
    borderRadius: 110,
    borderWidth: 3,
    height: 220,
    position: 'absolute',
    width: 220,
  },
  title: {
    color: colors.warmIvory,
    fontFamily: fonts.display,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 34,
  },
  subtitle: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 8,
  },
  progressTrack: {
    backgroundColor: colors.charcoal,
    borderRadius: 999,
    height: 10,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.courtRed,
    borderRadius: 999,
    height: 10,
  },
  steps: {
    gap: 10,
    marginTop: spacing.md,
  },
  stepRow: {
    alignItems: 'center',
    backgroundColor: '#191715',
    borderColor: colors.charcoal,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 13,
  },
  stepRowSelected: {
    backgroundColor: '#211D1A',
    borderColor: '#5F413A',
  },
  stepIndex: {
    color: colors.mutedInk,
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '900',
  },
  stepIndexSelected: {
    color: colors.courtRed,
  },
  stepText: {
    color: colors.paperTan,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '700',
  },
  stepTextSelected: {
    color: colors.warmIvory,
  },
});
