import { StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '../BrandMark';
import { cardSizes, colors } from '../../design/tokens';
import { ShareCardPayload, ShareEvidenceItem } from './types';

type VerdictPosterCardProps = {
  payload: ShareCardPayload;
};

export function VerdictPosterCard({ payload }: VerdictPosterCardProps) {
  const evidence = payload.evidence.slice(0, 3);
  const accentEvidence = evidence[2] ?? evidence[0];

  return (
    <View style={styles.card}>
      <View style={styles.paperNoise} />
      <View style={styles.border} />

      <View style={styles.header}>
        <BrandMark />
        <View style={styles.caseBlock}>
          <Text style={styles.caseNumber}>{payload.caseNumber}</Text>
          <View style={styles.caseBars}>
            {Array.from({ length: 18 }).map((_, index) => (
              <View key={index} style={[styles.caseBar, { height: index % 3 === 0 ? 48 : 32 }]} />
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.verdictLabel}>VERDICT</Text>

      <View style={styles.verdictStamp}>
        <Text adjustsFontSizeToFit minimumFontScale={0.68} numberOfLines={2} style={styles.verdictTitle}>
          {payload.verdictTitle}
        </Text>
      </View>

      {accentEvidence ? (
        <View style={styles.accentBadge}>
          <Text numberOfLines={2} style={styles.accentBadgeText}>
            {accentEvidence.label}
          </Text>
        </View>
      ) : null}

      <View style={styles.scoreBlock}>
        <Text style={styles.sectionLabel}>AUX RISK</Text>
        <View style={styles.scoreRing}>
          <View style={styles.scoreTrack} />
          <View style={styles.scoreFill} />
          <Text style={styles.score}>{payload.auxRisk}</Text>
          <Text style={styles.scoreTotal}>/100</Text>
        </View>
      </View>

      <View style={styles.chargeBlock}>
        <Text style={styles.sectionLabel}>CHARGE</Text>
        <Text adjustsFontSizeToFit minimumFontScale={0.74} numberOfLines={2} style={styles.chargeText}>
          {payload.charge}
        </Text>
      </View>

      <View style={styles.evidenceStrip}>
        {evidence.map((item) => (
          <PosterEvidenceItem key={item.key} item={item} />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerMark}>{payload.watermarkEnabled ? 'SONGCOURT.APP' : payload.createdAt}</Text>
        <View style={styles.footerSeal}>
          <Text style={styles.footerSealText}>YOU LISTEN</Text>
          <Text style={styles.footerSealText}>WE JUDGE</Text>
        </View>
        <Text style={styles.footerMark}>{payload.createdAt}</Text>
      </View>
    </View>
  );
}

function PosterEvidenceItem({ item }: { item: ShareEvidenceItem }) {
  return (
    <View style={styles.evidenceItem}>
      <View style={styles.evidenceIcon}>
        <Text style={styles.evidenceIconText}>{item.label.slice(0, 2).toUpperCase()}</Text>
      </View>
      <Text numberOfLines={1} style={styles.evidenceLabel}>
        {item.label}
      </Text>
      <Text numberOfLines={1} style={styles.evidenceValue}>
        {item.value}
      </Text>
      <Text numberOfLines={1} style={styles.evidenceCaption}>
        {item.caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardSizes.story.width,
    height: cardSizes.story.height,
    backgroundColor: colors.warmIvory,
    overflow: 'hidden',
  },
  paperNoise: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.paperTan,
    opacity: 0.08,
  },
  border: {
    position: 'absolute',
    left: 48,
    top: 48,
    width: 984,
    height: 1824,
    borderWidth: 4,
    borderColor: colors.ink,
    borderRadius: 46,
    opacity: 0.85,
  },
  header: {
    position: 'absolute',
    left: 72,
    top: 72,
    width: 936,
    height: 150,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caseBlock: {
    alignItems: 'flex-end',
    paddingTop: 8,
  },
  caseNumber: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 8,
  },
  caseBars: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 20,
  },
  caseBar: {
    width: 7,
    backgroundColor: colors.ink,
  },
  verdictLabel: {
    position: 'absolute',
    left: 72,
    top: 250,
    width: 936,
    color: colors.ink,
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: 34,
    textAlign: 'center',
  },
  verdictStamp: {
    position: 'absolute',
    left: 86,
    top: 340,
    width: 908,
    height: 390,
    alignItems: 'center',
    borderColor: colors.courtRed,
    borderRadius: 34,
    borderWidth: 16,
    justifyContent: 'center',
    paddingHorizontal: 34,
    transform: [{ rotate: '-3deg' }],
  },
  verdictTitle: {
    color: colors.courtRed,
    fontSize: 178,
    fontWeight: '900',
    letterSpacing: -4,
    lineHeight: 172,
    textAlign: 'center',
  },
  accentBadge: {
    position: 'absolute',
    right: 84,
    top: 690,
    width: 330,
    minHeight: 128,
    backgroundColor: colors.lime,
    borderRadius: 22,
    justifyContent: 'center',
    paddingHorizontal: 26,
    transform: [{ rotate: '-2deg' }],
  },
  accentBadgeText: {
    color: colors.ink,
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 46,
    textTransform: 'uppercase',
  },
  scoreBlock: {
    position: 'absolute',
    left: 120,
    top: 820,
    width: 840,
    height: 360,
    alignItems: 'center',
  },
  sectionLabel: {
    color: colors.ink,
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: 10,
    marginBottom: 18,
    textAlign: 'center',
  },
  scoreRing: {
    width: 620,
    height: 276,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreTrack: {
    position: 'absolute',
    width: 620,
    height: 620,
    borderColor: colors.ink,
    borderRadius: 310,
    borderWidth: 18,
    opacity: 0.12,
    top: 20,
  },
  scoreFill: {
    position: 'absolute',
    width: 620,
    height: 620,
    borderColor: colors.courtRed,
    borderLeftColor: colors.ink,
    borderRadius: 310,
    borderWidth: 22,
    top: 20,
    transform: [{ rotate: '18deg' }],
  },
  score: {
    color: colors.courtRed,
    fontSize: 256,
    fontWeight: '900',
    letterSpacing: -8,
    lineHeight: 270,
  },
  scoreTotal: {
    bottom: 26,
    color: colors.warmIvory,
    backgroundColor: colors.ink,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 4,
    paddingHorizontal: 18,
    paddingVertical: 6,
    position: 'absolute',
  },
  chargeBlock: {
    position: 'absolute',
    left: 120,
    top: 1210,
    width: 840,
    height: 250,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: colors.ink,
    borderTopWidth: 4,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  chargeText: {
    color: colors.ink,
    fontSize: 58,
    fontWeight: '900',
    lineHeight: 68,
    textAlign: 'center',
  },
  evidenceStrip: {
    position: 'absolute',
    left: 72,
    top: 1500,
    width: 936,
    height: 250,
    borderBottomWidth: 3,
    borderColor: colors.ink,
    borderTopWidth: 3,
    flexDirection: 'row',
  },
  evidenceItem: {
    flex: 1,
    alignItems: 'center',
    borderColor: colors.ink,
    borderRightWidth: 2,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  evidenceIcon: {
    width: 86,
    height: 86,
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 43,
    justifyContent: 'center',
    marginBottom: 16,
  },
  evidenceIconText: {
    color: colors.lime,
    fontSize: 28,
    fontWeight: '900',
  },
  evidenceLabel: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  evidenceValue: {
    color: colors.courtRed,
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 58,
  },
  evidenceCaption: {
    color: colors.mutedInk,
    fontSize: 22,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    left: 72,
    top: 1770,
    width: 936,
    height: 90,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerMark: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 7,
  },
  footerSeal: {
    width: 118,
    height: 118,
    alignItems: 'center',
    borderColor: colors.ink,
    borderRadius: 59,
    borderWidth: 3,
    justifyContent: 'center',
    opacity: 0.78,
  },
  footerSealText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
