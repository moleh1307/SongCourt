import { StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '../BrandMark';
import { cardSizes, colors, fonts } from '../../design/tokens';
import { ShareCardPayload, ShareEvidenceItem } from './types';

type CourtReceiptCardProps = {
  payload: ShareCardPayload;
};

export function CourtReceiptCard({ payload }: CourtReceiptCardProps) {
  const evidence = payload.evidence.slice(0, 4);

  return (
    <View style={styles.card}>
      <View style={styles.receipt}>
        <View style={styles.header}>
          <BrandMark />
          <View style={styles.meta}>
            <Text style={styles.metaText}>COURT RECEIPT</Text>
            <Text style={styles.metaText}>{payload.caseNumber}</Text>
            <Text style={styles.metaDate}>{payload.createdAt}</Text>
          </View>
        </View>

        <View style={styles.dashedRule} />

        <View style={styles.verdictStrip}>
          <View style={styles.iconBox}>
            <Text style={styles.iconBoxText}>SC</Text>
          </View>
          <View style={styles.verdictCopy}>
            <Text style={styles.redLabel}>VERDICT</Text>
            <Text adjustsFontSizeToFit minimumFontScale={0.78} numberOfLines={1} style={styles.verdictTitle}>
              {payload.badgeName ?? payload.verdictTitle}
            </Text>
          </View>
          <View style={styles.stamp}>
            <Text style={styles.stampText}>GUILTY OF</Text>
            <Text style={styles.stampText}>GREAT TASTE</Text>
          </View>
        </View>

        <View style={styles.scoreRow}>
          <View style={styles.scoreSide}>
            <Text style={styles.sectionLabel}>AUX RISK</Text>
            <View style={styles.scoreInline}>
              <Text style={styles.score}>{payload.auxRisk}</Text>
              <Text style={styles.scoreTotal}>/100</Text>
            </View>
          </View>

          <View style={styles.riskSide}>
            <View style={styles.soundWave}>
              {Array.from({ length: 23 }).map((_, index) => (
                <View key={index} style={[styles.waveBar, { height: 18 + ((index * 13) % 58) }]} />
              ))}
            </View>
            <View style={styles.riskMeter}>
              <View style={[styles.riskFill, { width: `${payload.auxRisk}%` }]} />
            </View>
            <View style={styles.riskLabels}>
              <Text style={styles.meterLabel}>LOW RISK</Text>
              <Text style={styles.meterLabel}>HIGH RISK</Text>
            </View>
          </View>
        </View>

        <View style={styles.evidenceHeader}>
          <Text style={styles.redLabel}>EVIDENCE</Text>
          <Text style={styles.damageLabel}>DAMAGE</Text>
        </View>

        <View style={styles.evidenceRows}>
          {evidence.map((item) => (
            <ReceiptEvidenceRow key={item.key} item={item} />
          ))}
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.badgeIcon}>
            <Text style={styles.badgeIconText}>R</Text>
          </View>
          <View style={styles.badgeCopy}>
            <Text style={styles.sectionLabel}>BADGE EARNED</Text>
            <Text adjustsFontSizeToFit minimumFontScale={0.74} numberOfLines={1} style={styles.badgeTitle}>
              {payload.badgeName ?? payload.verdictTitle}
            </Text>
            <Text numberOfLines={1} style={styles.badgeCaption}>
              Loops do not lie.
            </Text>
          </View>
          <View style={styles.rankBlock}>
            <Text style={styles.sectionLabel}>RANK</Text>
            <Text style={styles.rank}>{payload.courtRank}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerChip}>
            <Text style={styles.footerChipText}>REPLAY CRIME</Text>
          </View>
          <View style={styles.barcode}>
            {Array.from({ length: 34 }).map((_, index) => (
              <View key={index} style={[styles.barcodeLine, { width: index % 5 === 0 ? 6 : 3 }]} />
            ))}
          </View>
          <View style={styles.approvedStamp}>
            <Text style={styles.approvedText}>SONGCOURT</Text>
            <Text style={styles.approvedText}>APPROVED</Text>
          </View>
        </View>

        <Text style={styles.bottomLine}>{payload.watermarkEnabled ? 'YOU LISTEN. WE JUDGE.' : payload.createdAt}</Text>
      </View>
    </View>
  );
}

function ReceiptEvidenceRow({ item }: { item: ShareEvidenceItem }) {
  return (
    <View style={styles.evidenceRow}>
      <View style={styles.rowIcon}>
        <Text style={styles.rowIconText}>{item.label.slice(0, 2).toUpperCase()}</Text>
      </View>
      <View style={styles.rowCopy}>
        <Text numberOfLines={1} style={styles.rowLabel}>
          {item.label}
        </Text>
        <Text numberOfLines={1} style={styles.rowCaption}>
          {item.caption}
        </Text>
      </View>
      <Text numberOfLines={1} style={styles.rowValue}>
        {item.value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardSizes.feedPortrait.width,
    height: cardSizes.feedPortrait.height,
    alignItems: 'center',
    backgroundColor: colors.ink,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  receipt: {
    width: 952,
    height: 1254,
    backgroundColor: colors.receiptWhite,
    borderRadius: 18,
    paddingHorizontal: 48,
    paddingTop: 42,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
  },
  header: {
    height: 145,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    alignItems: 'flex-end',
    paddingTop: 8,
  },
  metaText: {
    color: colors.ink,
    fontFamily: fonts.mono,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 6,
    lineHeight: 39,
  },
  metaDate: {
    color: colors.mutedInk,
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 5,
    lineHeight: 38,
  },
  dashedRule: {
    borderColor: colors.ink,
    borderStyle: 'dashed',
    borderTopWidth: 2,
    height: 1,
    marginBottom: 28,
  },
  verdictStrip: {
    height: 160,
    borderColor: colors.ink,
    borderWidth: 3,
    flexDirection: 'row',
  },
  iconBox: {
    width: 110,
    alignItems: 'center',
    borderColor: colors.ink,
    borderRightWidth: 3,
    justifyContent: 'center',
  },
  iconBoxText: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 34,
    fontWeight: '900',
  },
  verdictCopy: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 32,
  },
  redLabel: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 6,
  },
  verdictTitle: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 54,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 66,
    textTransform: 'uppercase',
  },
  stamp: {
    width: 170,
    height: 170,
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: colors.courtRed,
    borderRadius: 85,
    borderWidth: 6,
    justifyContent: 'center',
    marginRight: 20,
    transform: [{ rotate: '9deg' }],
  },
  stampText: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
  },
  scoreRow: {
    height: 230,
    borderBottomWidth: 3,
    borderColor: colors.ink,
    flexDirection: 'row',
    paddingVertical: 30,
  },
  scoreSide: {
    width: 330,
    justifyContent: 'center',
  },
  sectionLabel: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 5,
  },
  scoreInline: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  score: {
    color: colors.courtRed,
    fontFamily: fonts.mono,
    fontSize: 132,
    fontWeight: '900',
    letterSpacing: -5,
    lineHeight: 142,
  },
  scoreTotal: {
    color: colors.ink,
    fontFamily: fonts.mono,
    fontSize: 38,
    fontWeight: '900',
    marginBottom: 20,
  },
  riskSide: {
    flex: 1,
    borderColor: colors.ink,
    borderLeftWidth: 2,
    justifyContent: 'center',
    paddingLeft: 42,
  },
  soundWave: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    height: 80,
  },
  waveBar: {
    backgroundColor: colors.ink,
    borderRadius: 4,
    width: 7,
  },
  riskMeter: {
    height: 20,
    backgroundColor: '#D8CDBA',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  riskFill: {
    backgroundColor: colors.courtRed,
    height: 20,
  },
  riskLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  meterLabel: {
    color: colors.mutedInk,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 4,
  },
  evidenceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 62,
    justifyContent: 'space-between',
  },
  damageLabel: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 5,
  },
  evidenceRows: {
    height: 300,
    borderColor: colors.ink,
    borderTopWidth: 2,
  },
  evidenceRow: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#B9AB95',
    flexDirection: 'row',
    height: 75,
  },
  rowIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    borderColor: colors.ink,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    marginRight: 20,
  },
  rowIconText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '900',
  },
  rowCopy: {
    flex: 1,
  },
  rowLabel: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 27,
    fontWeight: '800',
  },
  rowCaption: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 20,
    fontWeight: '700',
  },
  rowValue: {
    color: colors.ink,
    fontFamily: fonts.mono,
    fontSize: 42,
    fontWeight: '900',
    minWidth: 90,
    textAlign: 'right',
  },
  badgeRow: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: colors.ink,
    flexDirection: 'row',
    height: 150,
  },
  badgeIcon: {
    width: 96,
    height: 96,
    alignItems: 'center',
    backgroundColor: colors.paleRed,
    borderColor: colors.courtRed,
    borderWidth: 3,
    borderRadius: 48,
    justifyContent: 'center',
    marginRight: 28,
  },
  badgeIconText: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 48,
    fontWeight: '900',
  },
  badgeCopy: {
    flex: 1,
  },
  badgeTitle: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 56,
    textTransform: 'uppercase',
  },
  badgeCaption: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 20,
    fontWeight: '700',
  },
  rankBlock: {
    width: 190,
    borderColor: colors.ink,
    borderLeftWidth: 2,
    paddingLeft: 32,
  },
  rank: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 54,
    fontWeight: '900',
    lineHeight: 62,
    textTransform: 'uppercase',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 96,
    justifyContent: 'space-between',
  },
  footerChip: {
    borderColor: colors.ink,
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footerChipText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 4,
  },
  barcode: {
    flexDirection: 'row',
    gap: 3,
    height: 62,
  },
  barcodeLine: {
    backgroundColor: colors.ink,
    height: 62,
  },
  approvedStamp: {
    borderColor: colors.courtRed,
    borderRadius: 8,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  approvedText: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
  },
  bottomLine: {
    color: colors.ink,
    fontFamily: fonts.mono,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 8,
    marginTop: 6,
  },
});
