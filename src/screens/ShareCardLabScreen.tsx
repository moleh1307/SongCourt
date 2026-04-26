import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  PixelRatio,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import { BrandMark } from '../components/BrandMark';
import { ScaledCardPreview } from '../components/share-cards/ScaledCardPreview';
import {
  getShareCardSize,
  ShareCardSurface,
  ShareTemplateId,
} from '../components/share-cards/ShareCardSurface';
import { colors, spacing } from '../design/tokens';
import { sampleShareCard } from '../data/sampleShareCard';

const templates: Array<{
  id: ShareTemplateId;
  title: string;
  subtitle: string;
}> = [
  {
    id: 'poster',
    title: 'Verdict Poster',
    subtitle: '1080 x 1920 story',
  },
  {
    id: 'receipt',
    title: 'Court Receipt',
    subtitle: '1080 x 1350 feed',
  },
];

export function ShareCardLabScreen() {
  const { width } = useWindowDimensions();
  const exportRef = useRef<View>(null);
  const [activeTemplate, setActiveTemplate] = useState<ShareTemplateId>('poster');
  const [isSharing, setIsSharing] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);

  const activeMeta = useMemo(
    () => templates.find((template) => template.id === activeTemplate) ?? templates[0],
    [activeTemplate],
  );

  const { width: cardWidth, height: cardHeight } = getShareCardSize(activeTemplate);

  async function shareActiveCard() {
    if (!exportRef.current || isSharing) {
      return;
    }

    try {
      setIsSharing(true);

      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        Alert.alert('Sharing unavailable', 'This device cannot open the native share sheet right now.');
        return;
      }

      const uri = await captureRef(exportRef.current, {
        format: 'png',
        height: Math.round(cardHeight / PixelRatio.get()),
        quality: 1,
        result: 'tmpfile',
        width: Math.round(cardWidth / PixelRatio.get()),
      });

      const dimensions = await getImageSize(uri);
      setLastExport(`${dimensions.width} x ${dimensions.height} PNG`);
      console.info('SongCourt share export', {
        height: dimensions.height,
        template: activeTemplate,
        width: dimensions.width,
      });

      await Sharing.shareAsync(uri, {
        dialogTitle: `Share ${activeMeta.title}`,
        mimeType: 'image/png',
        UTI: 'public.png',
      });
    } catch (error) {
      Alert.alert('Share failed', error instanceof Error ? error.message : 'Unable to export this card.');
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.exportHost}>
        <ShareCardSurface ref={exportRef} payload={sampleShareCard} template={activeTemplate} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BrandMark size="small" />
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>Design Lab</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Share-card-first rebuild</Text>
          <Text style={styles.title}>Calm app shell. Loud artifact.</Text>
          <Text style={styles.copy}>
            First production surfaces for the selected Editorial Court plus Pop Verdict direction.
          </Text>
        </View>

        <View style={styles.segmented}>
          {templates.map((template) => {
            const selected = template.id === activeTemplate;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={template.id}
                onPress={() => setActiveTemplate(template.id)}
                style={[styles.segment, selected && styles.segmentSelected]}
              >
                <Text style={[styles.segmentTitle, selected && styles.segmentTitleSelected]}>{template.title}</Text>
                <Text style={[styles.segmentSubtitle, selected && styles.segmentSubtitleSelected]}>
                  {template.subtitle}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.previewHeader}>
          <View>
            <Text style={styles.previewLabel}>{activeMeta.title}</Text>
            <Text style={styles.previewSize}>
              Fixed render surface: {cardWidth} x {cardHeight}
            </Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeLabel}>Aux Risk</Text>
            <Text style={styles.scoreBadgeValue}>{sampleShareCard.auxRisk}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            disabled={isSharing}
            onPress={shareActiveCard}
            style={({ pressed }) => [
              styles.primaryAction,
              pressed && !isSharing && styles.primaryActionPressed,
              isSharing && styles.primaryActionDisabled,
            ]}
          >
            <Text style={styles.primaryActionText}>{isSharing ? 'Preparing Card' : 'Share Test Export'}</Text>
            <Text style={styles.primaryActionSubtext}>
              Captures {cardWidth} x {cardHeight} PNG
            </Text>
          </Pressable>
          {lastExport ? <Text style={styles.exportStatus}>Last export: {lastExport}</Text> : null}
        </View>

        <View style={styles.previewShell}>
          <ScaledCardPreview width={cardWidth} height={cardHeight} maxWidth={width - spacing.lg * 2}>
            <ShareCardSurface payload={sampleShareCard} template={activeTemplate} />
          </ScaledCardPreview>
        </View>

        <View style={styles.notesPanel}>
          <Text style={styles.notesTitle}>Production rules locked</Text>
          <View style={styles.noteRow}>
            <Text style={styles.noteIndex}>01</Text>
            <Text style={styles.noteText}>Cards render at exact social export dimensions, then scale only for preview.</Text>
          </View>
          <View style={styles.noteRow}>
            <Text style={styles.noteIndex}>02</Text>
            <Text style={styles.noteText}>Dynamic text has fixed zones, max lines, and shrink behavior.</Text>
          </View>
          <View style={styles.noteRow}>
            <Text style={styles.noteIndex}>03</Text>
            <Text style={styles.noteText}>Verdict Poster and Court Receipt are the first production references.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getImageSize(uri: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.warmIvory,
  },
  exportHost: {
    left: -1200,
    position: 'absolute',
    top: 0,
  },
  content: {
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  statusPill: {
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  statusText: {
    color: colors.warmIvory,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  eyebrow: {
    color: colors.courtRed,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 41,
  },
  copy: {
    color: colors.mutedInk,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
    marginTop: spacing.sm,
    maxWidth: 330,
  },
  segmented: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  segment: {
    backgroundColor: colors.receiptWhite,
    borderColor: '#D8CCB8',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minHeight: 82,
    padding: 14,
  },
  segmentSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  segmentTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  segmentTitleSelected: {
    color: colors.warmIvory,
  },
  segmentSubtitle: {
    color: colors.mutedInk,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  segmentSubtitleSelected: {
    color: colors.paperTan,
  },
  previewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  previewLabel: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  previewSize: {
    color: colors.mutedInk,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  scoreBadge: {
    alignItems: 'center',
    backgroundColor: colors.lime,
    borderColor: colors.ink,
    borderRadius: 18,
    borderWidth: 1,
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 9,
    transform: [{ rotate: '-2deg' }],
  },
  scoreBadgeLabel: {
    color: colors.ink,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  scoreBadgeValue: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 29,
  },
  previewShell: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: colors.courtRed,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 17,
  },
  primaryActionPressed: {
    transform: [{ scale: 0.99 }],
  },
  primaryActionDisabled: {
    opacity: 0.62,
  },
  primaryActionText: {
    color: colors.receiptWhite,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  primaryActionSubtext: {
    color: '#FFD9DF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  exportStatus: {
    color: colors.mutedInk,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  notesPanel: {
    backgroundColor: colors.receiptWhite,
    borderColor: '#D8CCB8',
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  notesTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  noteRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: 9,
  },
  noteIndex: {
    color: colors.courtRed,
    fontSize: 13,
    fontWeight: '900',
    width: 26,
  },
  noteText: {
    color: colors.mutedInk,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
});
