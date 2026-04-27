import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '../components/BrandMark';
import { colors, fonts, spacing } from '../design/tokens';

type OnboardingScreenProps = {
  onFinish: () => void;
};

type OnboardingSlide = {
  eyebrow: string;
  title: string;
  body: string;
  proof: string;
  visual: 'verdict' | 'evidence' | 'share';
};

const slides: OnboardingSlide[] = [
  {
    body: 'SongCourt turns your listening history into a daily verdict: funny, personal, and made to send.',
    eyebrow: 'Step 1',
    proof: 'One scan. One verdict. One card.',
    title: 'Your music taste goes on trial.',
    visual: 'verdict',
  },
  {
    body: 'The court looks at replay behavior, artist dependency, genre jumps, late-night listens, and mood swings.',
    eyebrow: 'Step 2',
    proof: 'Evidence first. Roast second.',
    title: 'The jokes come from real signals.',
    visual: 'evidence',
  },
  {
    body: 'Export a poster, receipt, Music DNA card, or friend challenge. The verdict is only half the product.',
    eyebrow: 'Step 3',
    proof: 'Built for Stories and group chats.',
    title: 'Share the case, not a screenshot.',
    visual: 'share',
  },
];

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const progress = useMemo(() => `${index + 1}/${slides.length}`, [index]);

  function next() {
    if (isLast) {
      onFinish();
      return;
    }

    setIndex((value) => value + 1);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.topBar}>
          <BrandMark size="small" />
          <Pressable accessibilityRole="button" onPress={onFinish} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.visualShell}>
          <OnboardingVisual type={slide.visual} />
        </View>

        <View style={styles.copyBlock}>
          <View style={styles.metaRow}>
            <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
            <Text style={styles.progress}>{progress}</Text>
          </View>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.body}>{slide.body}</Text>
        </View>

        <View style={styles.proofPanel}>
          <Text style={styles.proofLabel}>Court note</Text>
          <Text style={styles.proofText}>{slide.proof}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {slides.map((item, dotIndex) => (
              <Pressable
                accessibilityLabel={`Go to onboarding step ${dotIndex + 1}`}
                accessibilityRole="button"
                key={item.title}
                onPress={() => setIndex(dotIndex)}
                style={[styles.dot, dotIndex === index && styles.dotActive]}
              />
            ))}
          </View>

          <Pressable accessibilityRole="button" onPress={next} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{isLast ? 'Enter SongCourt' : 'Continue'}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function OnboardingVisual({ type }: { type: OnboardingSlide['visual'] }) {
  if (type === 'evidence') {
    return (
      <View style={styles.evidenceVisual}>
        <VisualStat label="Replay crime" value="28" />
        <VisualStat label="Artist dependency" value="73%" />
        <VisualStat label="Night court" value="14" />
      </View>
    );
  }

  if (type === 'share') {
    return (
      <View style={styles.shareVisual}>
        <View style={styles.shareCardPrimary}>
          <Text style={styles.shareStamp}>AUX MENACE</Text>
          <Text style={styles.shareScore}>91</Text>
        </View>
        <View style={styles.shareCardSecondary}>
          <Text style={styles.shareSecondaryLabel}>Receipt</Text>
          <View style={styles.receiptLineWide} />
          <View style={styles.receiptLine} />
          <View style={styles.receiptLineShort} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.verdictVisual}>
      <Text style={styles.verdictLabel}>Verdict</Text>
      <Text style={styles.verdictTitle}>AUX MENACE</Text>
      <View style={styles.verdictScoreRow}>
        <Text style={styles.verdictScore}>91</Text>
        <Text style={styles.verdictScoreLabel}>Aux risk</Text>
      </View>
    </View>
  );
}

function VisualStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.visualStat}>
      <Text style={styles.visualStatValue}>{value}</Text>
      <Text style={styles.visualStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.warmIvory,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  skipText: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
  },
  visualShell: {
    backgroundColor: colors.receiptWhite,
    borderColor: colors.hairline,
    borderRadius: 12,
    borderWidth: 1,
    height: 310,
    justifyContent: 'center',
    marginTop: spacing.lg,
    overflow: 'hidden',
    padding: spacing.sm,
  },
  copyBlock: {
    marginTop: spacing.lg,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
  },
  progress: {
    color: colors.mutedInk,
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 39,
    marginTop: spacing.sm,
  },
  body: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginTop: 12,
  },
  proofPanel: {
    backgroundColor: colors.ink,
    borderRadius: 10,
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  proofLabel: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '700',
  },
  proofText: {
    color: colors.warmIvory,
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginTop: 6,
  },
  footer: {
    marginTop: 'auto',
  },
  dots: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },
  dot: {
    backgroundColor: colors.hairline,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  dotActive: {
    backgroundColor: colors.courtRed,
    width: 28,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.courtRed,
    borderRadius: 8,
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: colors.receiptWhite,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '900',
  },
  verdictVisual: {
    alignItems: 'center',
    borderColor: colors.courtRed,
    borderRadius: 10,
    borderWidth: 3,
    flex: 1,
    justifyContent: 'center',
  },
  verdictLabel: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '800',
  },
  verdictTitle: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 44,
    marginTop: 10,
  },
  verdictScoreRow: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.sm,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  verdictScore: {
    color: colors.warmIvory,
    fontFamily: fonts.mono,
    fontSize: 34,
    fontWeight: '900',
  },
  verdictScoreLabel: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
  },
  evidenceVisual: {
    gap: 12,
  },
  visualStat: {
    backgroundColor: colors.warmIvory,
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.sm,
  },
  visualStatValue: {
    color: colors.courtRed,
    fontFamily: fonts.mono,
    fontSize: 34,
    fontWeight: '900',
  },
  visualStatLabel: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
  },
  shareVisual: {
    flex: 1,
  },
  shareCardPrimary: {
    backgroundColor: colors.ink,
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    padding: spacing.sm,
  },
  shareStamp: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 31,
    fontWeight: '900',
  },
  shareScore: {
    color: colors.warmIvory,
    fontFamily: fonts.mono,
    fontSize: 70,
    fontWeight: '900',
    lineHeight: 78,
    marginTop: 8,
  },
  shareCardSecondary: {
    backgroundColor: colors.warmIvory,
    borderColor: colors.hairline,
    borderRadius: 10,
    borderWidth: 1,
    bottom: 0,
    padding: 14,
    position: 'absolute',
    right: 0,
    width: 170,
  },
  shareSecondaryLabel: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 12,
  },
  receiptLineWide: {
    backgroundColor: colors.ink,
    borderRadius: 2,
    height: 4,
    opacity: 0.22,
    width: 128,
  },
  receiptLine: {
    backgroundColor: colors.ink,
    borderRadius: 2,
    height: 4,
    marginTop: 9,
    opacity: 0.18,
    width: 96,
  },
  receiptLineShort: {
    backgroundColor: colors.courtRed,
    borderRadius: 2,
    height: 4,
    marginTop: 9,
    width: 58,
  },
});
