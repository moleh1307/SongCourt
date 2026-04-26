import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '../components/BrandMark';
import { ScaledCardPreview } from '../components/share-cards/ScaledCardPreview';
import {
  getShareCardSize,
  ShareCardSurface,
  type ShareTemplateId,
} from '../components/share-cards/ShareCardSurface';
import { colors, spacing } from '../design/tokens';
import { sampleShareCard } from '../data/sampleShareCard';
import { captureShareCard } from '../utils/shareCardExport';

const templateOptions: Array<{
  id: ShareTemplateId;
  label: string;
  detail: string;
}> = [
  {
    detail: 'Story',
    id: 'poster',
    label: 'Poster',
  },
  {
    detail: 'Feed',
    id: 'receipt',
    label: 'Receipt',
  },
];

const captions = [
  'The court reviewed my Spotify history and the evidence is loud.',
  'I asked for a music personality test. I got sentenced.',
  'Aux privileges officially under investigation.',
  'My listening history just entered the courtroom.',
];

export function VerdictShareFlowScreen() {
  const { width } = useWindowDimensions();
  const exportRef = useRef<View>(null);
  const [activeTemplate, setActiveTemplate] = useState<ShareTemplateId>('poster');
  const [activeCaption, setActiveCaption] = useState(captions[0]);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);

  const cardSize = getShareCardSize(activeTemplate);

  const topEvidence = useMemo(() => sampleShareCard.evidence.slice(0, 4), []);

  async function shareVerdict() {
    if (isSharing) {
      return;
    }

    try {
      setIsSharing(true);

      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        Alert.alert('Sharing unavailable', 'This device cannot open the native share sheet right now.');
        return;
      }

      const exported = await captureShareCard(exportRef, activeTemplate);
      setLastExport(`${exported.width} x ${exported.height} PNG`);
      console.info('SongCourt share export', {
        caption: activeCaption,
        height: exported.height,
        template: activeTemplate,
        width: exported.width,
      });

      await Sharing.shareAsync(exported.uri, {
        dialogTitle: 'Share your SongCourt verdict',
        mimeType: 'image/png',
        UTI: 'public.png',
      });
    } catch (error) {
      Alert.alert('Share failed', error instanceof Error ? error.message : 'Unable to export this verdict.');
    } finally {
      setIsSharing(false);
    }
  }

  async function copyCaption() {
    await Clipboard.setStringAsync(activeCaption);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 1400);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents="none" style={styles.exportHost}>
        <ShareCardSurface ref={exportRef} payload={sampleShareCard} template={activeTemplate} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <BrandMark size="small" />
          <View style={styles.casePill}>
            <Text style={styles.casePillText}>{sampleShareCard.caseNumber}</Text>
          </View>
        </View>

        <View style={styles.heroPanel}>
          <View style={styles.verdictLabelRow}>
            <Text style={styles.kicker}>Verdict is in</Text>
            <Text style={styles.dateText}>{sampleShareCard.createdAt}</Text>
          </View>

          <View style={styles.verdictStamp}>
            <Text adjustsFontSizeToFit minimumFontScale={0.78} numberOfLines={1} style={styles.verdictTitle}>
              {sampleShareCard.verdictTitle}
            </Text>
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Aux Risk</Text>
              <Text style={styles.scoreValue}>{sampleShareCard.auxRisk}</Text>
              <Text style={styles.scoreTotal}>/100</Text>
            </View>
            <View style={styles.chargeCard}>
              <Text style={styles.chargeLabel}>Charge</Text>
              <Text adjustsFontSizeToFit minimumFontScale={0.7} numberOfLines={4} style={styles.chargeText}>
                {sampleShareCard.charge}
              </Text>
            </View>
          </View>

          <View style={styles.rewardRow}>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>Badge</Text>
              <Text numberOfLines={2} style={styles.rewardValue}>
                {sampleShareCard.badgeName ?? sampleShareCard.verdictTitle}
              </Text>
            </View>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>Persona</Text>
              <Text numberOfLines={2} style={styles.rewardValue}>
                {sampleShareCard.courtPersona}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.primaryActions}>
          <Pressable
            accessibilityRole="button"
            disabled={isSharing}
            onPress={shareVerdict}
            style={({ pressed }) => [
              styles.shareButton,
              pressed && !isSharing && styles.pressed,
              isSharing && styles.disabled,
            ]}
          >
            <Text style={styles.shareButtonText}>{isSharing ? 'Preparing Verdict' : 'Share Verdict'}</Text>
          </Pressable>
          <Text style={styles.shareMeta}>
            {lastExport ? `Last export: ${lastExport}` : `${cardSize.width} x ${cardSize.height} export ready`}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Evidence</Text>
          <Text style={styles.sectionCaption}>Four reasons the court ruled this way.</Text>
        </View>

        <View style={styles.evidenceGrid}>
          {topEvidence.map((item) => (
            <View key={item.key} style={styles.evidenceCard}>
              <Text style={styles.evidenceValue}>{item.value}</Text>
              <Text numberOfLines={2} style={styles.evidenceLabel}>
                {item.label}
              </Text>
              <Text numberOfLines={2} style={styles.evidenceCaption}>
                {item.caption}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.shareStudio}>
          <View style={styles.sectionHeaderCompact}>
            <View>
              <Text style={styles.sectionTitle}>Share Card</Text>
              <Text style={styles.sectionCaption}>Pick the social artifact.</Text>
            </View>
            <View style={styles.templateSwitch}>
              {templateOptions.map((template) => {
                const selected = template.id === activeTemplate;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={template.id}
                    onPress={() => setActiveTemplate(template.id)}
                    style={[styles.templateButton, selected && styles.templateButtonSelected]}
                  >
                    <Text style={[styles.templateLabel, selected && styles.templateLabelSelected]}>
                      {template.label}
                    </Text>
                    <Text style={[styles.templateDetail, selected && styles.templateDetailSelected]}>
                      {template.detail}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <ScaledCardPreview width={cardSize.width} height={cardSize.height} maxWidth={width - spacing.lg * 2}>
            <ShareCardSurface payload={sampleShareCard} template={activeTemplate} />
          </ScaledCardPreview>
        </View>

        <View style={styles.captionPanel}>
          <Text style={styles.captionTitle}>Caption</Text>
          <Text style={styles.captionText}>{activeCaption}</Text>
          <View style={styles.captionFooter}>
            <View style={styles.captionOptions}>
              {captions.map((caption, index) => {
                const selected = caption === activeCaption;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={caption}
                    onPress={() => {
                      setActiveCaption(caption);
                      setCaptionCopied(false);
                    }}
                    style={[styles.captionDot, selected && styles.captionDotSelected]}
                  >
                    <Text style={[styles.captionDotText, selected && styles.captionDotTextSelected]}>
                      {index + 1}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable accessibilityRole="button" onPress={copyCaption} style={styles.copyCaptionButton}>
              <Text style={styles.copyCaptionText}>{captionCopied ? 'Copied' : 'Copy'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    paddingBottom: 56,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  casePill: {
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  casePillText: {
    color: colors.warmIvory,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  heroPanel: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  verdictLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  kicker: {
    color: colors.courtRed,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  dateText: {
    color: colors.mutedInk,
    fontSize: 12,
    fontWeight: '800',
  },
  verdictStamp: {
    alignItems: 'center',
    borderColor: colors.courtRed,
    borderRadius: 22,
    borderWidth: 5,
    justifyContent: 'center',
    minHeight: 112,
    paddingHorizontal: 18,
    transform: [{ rotate: '-1.5deg' }],
  },
  verdictTitle: {
    color: colors.courtRed,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 55,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  scoreCard: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 20,
    justifyContent: 'center',
    minHeight: 150,
    padding: spacing.sm,
    width: 126,
  },
  scoreLabel: {
    color: colors.paperTan,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  scoreValue: {
    color: colors.lime,
    fontSize: 66,
    fontWeight: '900',
    letterSpacing: -3,
    lineHeight: 70,
  },
  scoreTotal: {
    color: colors.warmIvory,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  chargeCard: {
    backgroundColor: colors.receiptWhite,
    borderColor: '#D8CCB8',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 150,
    padding: spacing.sm,
  },
  chargeLabel: {
    color: colors.courtRed,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  chargeText: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
    marginTop: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  rewardChip: {
    backgroundColor: colors.receiptWhite,
    borderColor: '#D8CCB8',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  rewardLabel: {
    color: colors.mutedInk,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  rewardValue: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 19,
    marginTop: 4,
  },
  primaryActions: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  shareButton: {
    alignItems: 'center',
    backgroundColor: colors.courtRed,
    borderRadius: 18,
    paddingVertical: 18,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.62,
  },
  shareButtonText: {
    color: colors.receiptWhite,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  shareMeta: {
    color: colors.mutedInk,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionHeaderCompact: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
  },
  sectionCaption: {
    color: colors.mutedInk,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  evidenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  evidenceCard: {
    backgroundColor: colors.receiptWhite,
    borderColor: '#D8CCB8',
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 136,
    padding: spacing.sm,
    width: '47.5%',
  },
  evidenceValue: {
    color: colors.courtRed,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 38,
  },
  evidenceLabel: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
    marginTop: 8,
  },
  evidenceCaption: {
    color: colors.mutedInk,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginTop: 4,
  },
  shareStudio: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  templateSwitch: {
    backgroundColor: colors.receiptWhite,
    borderColor: '#D8CCB8',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    padding: 5,
  },
  templateButton: {
    borderRadius: 13,
    minWidth: 72,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  templateButtonSelected: {
    backgroundColor: colors.ink,
  },
  templateLabel: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  templateLabelSelected: {
    color: colors.warmIvory,
  },
  templateDetail: {
    color: colors.mutedInk,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  templateDetailSelected: {
    color: colors.paperTan,
  },
  captionPanel: {
    backgroundColor: colors.ink,
    borderRadius: 22,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  captionTitle: {
    color: colors.lime,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  captionText: {
    color: colors.warmIvory,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 27,
    marginTop: 10,
  },
  captionOptions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  captionFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  captionDot: {
    alignItems: 'center',
    borderColor: colors.charcoal,
    borderRadius: 15,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  captionDotSelected: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  captionDotText: {
    color: colors.paperTan,
    fontSize: 12,
    fontWeight: '900',
  },
  captionDotTextSelected: {
    color: colors.ink,
  },
  copyCaptionButton: {
    backgroundColor: colors.receiptWhite,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  copyCaptionText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
