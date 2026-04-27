import { useEffect, useMemo, useRef, useState } from 'react';
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
import { type ShareCardPayload } from '../components/share-cards/types';
import { colors, fonts, spacing } from '../design/tokens';
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
  {
    detail: 'Data',
    id: 'dna',
    label: 'DNA',
  },
  {
    detail: 'Tag',
    id: 'challenge',
    label: 'Friend',
  },
];

type VerdictShareFlowScreenProps = {
  archiveCount?: number;
  onOpenArchive?: () => void;
  onNewTrial?: () => void;
  payload: ShareCardPayload;
  sourceLabel?: string;
};

export function VerdictShareFlowScreen({
  archiveCount = 0,
  onOpenArchive,
  onNewTrial,
  payload,
  sourceLabel = 'Daily Trial',
}: VerdictShareFlowScreenProps) {
  const { width } = useWindowDimensions();
  const exportRef = useRef<View>(null);
  const [activeTemplate, setActiveTemplate] = useState<ShareTemplateId>('poster');
  const captions = useMemo(() => createCaptions(payload), [payload]);
  const [activeCaption, setActiveCaption] = useState(captions[0]);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);

  const cardSize = getShareCardSize(activeTemplate);

  const topEvidence = useMemo(() => payload.evidence.slice(0, 4), [payload.evidence]);

  useEffect(() => {
    setActiveCaption(captions[0]);
    setCaptionCopied(false);
    setLastExport(null);
  }, [captions, payload.caseNumber]);

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
        <ShareCardSurface ref={exportRef} payload={payload} template={activeTemplate} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <BrandMark size="small" />
          <View style={styles.casePill}>
            <Text style={styles.casePillText}>{payload.caseNumber}</Text>
          </View>
        </View>

        <View style={styles.heroPanel}>
          <View style={styles.verdictLabelRow}>
            <Text style={styles.kicker}>Verdict is in</Text>
            <Text style={styles.dateText}>{payload.createdAt}</Text>
          </View>

          <View style={styles.verdictStamp}>
            <Text adjustsFontSizeToFit minimumFontScale={0.78} numberOfLines={1} style={styles.verdictTitle}>
              {payload.verdictTitle}
            </Text>
          </View>

          <View style={styles.scoreRow}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Aux Risk</Text>
              <Text style={styles.scoreValue}>{payload.auxRisk}</Text>
              <Text style={styles.scoreTotal}>/100</Text>
            </View>
            <View style={styles.chargeCard}>
              <Text style={styles.chargeLabel}>Charge</Text>
              <Text adjustsFontSizeToFit minimumFontScale={0.7} numberOfLines={4} style={styles.chargeText}>
                {payload.charge}
              </Text>
            </View>
          </View>

          <View style={styles.rewardRow}>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>Badge</Text>
              <Text numberOfLines={2} style={styles.rewardValue}>
                {payload.badgeName ?? payload.verdictTitle}
              </Text>
            </View>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardLabel}>Persona</Text>
              <Text numberOfLines={2} style={styles.rewardValue}>
                {payload.courtPersona}
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
            {lastExport ? `Last export: ${lastExport}` : `${sourceLabel} - ${cardSize.width} x ${cardSize.height} export ready`}
          </Text>
        </View>

        {onNewTrial || onOpenArchive ? (
          <View style={styles.secondaryActions}>
            {onNewTrial ? (
              <Pressable accessibilityRole="button" onPress={onNewTrial} style={styles.newTrialButton}>
                <Text style={styles.newTrialText}>Run Another Trial</Text>
              </Pressable>
            ) : null}
            {onOpenArchive ? (
              <Pressable accessibilityRole="button" onPress={onOpenArchive} style={styles.archiveButton}>
                <Text style={styles.archiveButtonText}>
                  {archiveCount > 0 ? `Archive (${archiveCount})` : 'Archive'}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

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

          <ScaledCardPreview width={cardSize.width} height={cardSize.height} maxWidth={width - spacing.md * 2}>
            <ShareCardSurface payload={payload} template={activeTemplate} />
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

function createCaptions(payload: ShareCardPayload) {
  return [
    `The court reviewed my music history and found ${payload.verdictTitle.toLowerCase()} behavior.`,
    `${payload.charge}. Sentence: post the evidence.`,
    `Aux Risk ${payload.auxRisk}/100. I will be taking no questions.`,
    `${payload.badgeName ?? payload.verdictTitle} unlocked. Who is brave enough to compare?`,
    payload.challengePrompt ?? 'Who gave me the aux?',
  ];
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
    paddingBottom: 44,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  casePill: {
    backgroundColor: colors.ink,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  casePillText: {
    color: colors.warmIvory,
    fontFamily: fonts.body,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0,
  },
  heroPanel: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  verdictLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  kicker: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
  dateText: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
  },
  verdictStamp: {
    alignItems: 'center',
    backgroundColor: colors.receiptWhite,
    borderColor: colors.courtRed,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 86,
    paddingHorizontal: 16,
  },
  verdictTitle: {
    color: colors.courtRed,
    fontFamily: fonts.display,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 39,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.sm,
  },
  scoreCard: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 118,
    padding: 12,
    width: 102,
  },
  scoreLabel: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0,
  },
  scoreValue: {
    color: colors.warmIvory,
    fontFamily: fonts.mono,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 54,
  },
  scoreTotal: {
    color: colors.paperTan,
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
  chargeCard: {
    backgroundColor: colors.receiptWhite,
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 126,
    padding: spacing.sm,
  },
  chargeLabel: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0,
  },
  chargeText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 23,
    marginTop: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  rewardChip: {
    backgroundColor: colors.receiptWhite,
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 12,
  },
  rewardLabel: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0,
  },
  rewardValue: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 4,
  },
  primaryActions: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  shareButton: {
    alignItems: 'center',
    backgroundColor: colors.courtRed,
    borderRadius: 8,
    paddingVertical: 15,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.62,
  },
  shareButtonText: {
    color: colors.receiptWhite,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  shareMeta: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  secondaryActions: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  newTrialButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderColor: colors.ink,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  newTrialText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
  archiveButton: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  archiveButtonText: {
    color: colors.warmIvory,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionHeaderCompact: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 22,
    fontWeight: '800',
  },
  sectionCaption: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  evidenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  evidenceCard: {
    backgroundColor: colors.receiptWhite,
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 122,
    padding: 12,
    width: '47.5%',
  },
  evidenceValue: {
    color: colors.courtRed,
    fontFamily: fonts.mono,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 32,
  },
  evidenceLabel: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 8,
  },
  evidenceCaption: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginTop: 4,
  },
  shareStudio: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  templateSwitch: {
    backgroundColor: colors.receiptWhite,
    borderColor: colors.hairline,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 5,
  },
  templateButton: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    minWidth: 68,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  templateButtonSelected: {
    backgroundColor: colors.ink,
  },
  templateLabel: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
  },
  templateLabelSelected: {
    color: colors.warmIvory,
  },
  templateDetail: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  templateDetailSelected: {
    color: colors.paperTan,
  },
  captionPanel: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: 18,
  },
  captionTitle: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
  captionText: {
    color: colors.warmIvory,
    fontFamily: fonts.body,
    fontSize: 20,
    fontWeight: '800',
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
    backgroundColor: colors.warmIvory,
    borderColor: colors.warmIvory,
  },
  captionDotText: {
    color: colors.paperTan,
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '900',
  },
  captionDotTextSelected: {
    color: colors.ink,
  },
  copyCaptionButton: {
    backgroundColor: colors.receiptWhite,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  copyCaptionText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
