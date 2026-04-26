import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { ShareCardStyle, Verdict } from '../../types/verdict';
import { formatDisplayDate } from '../../utils/date';
import { getAuxRisk, getVerdictBadge, getVerdictCaseNumber, getVerdictStats } from '../../utils/verdictRewards';

type ShareCardPreviewProps = {
  verdict: Verdict;
  styleName: ShareCardStyle;
  showWatermark?: boolean;
};

export const ShareCardPreview = forwardRef<View, ShareCardPreviewProps>(
  ({ verdict, styleName, showWatermark = true }, ref) => {
    const aux = getAuxRisk(verdict);
    const caseNumber = getVerdictCaseNumber(verdict);
    const badge = getVerdictBadge(verdict);
    const stats = getVerdictStats(verdict).slice(0, 4);
    const darkText = styleName === 'receipt';

    return (
      <View ref={ref} collapsable={false} style={[styles.card, styles[styleName]]}>
        <View style={[styles.topRow, styleName === 'receipt' && styles.receiptTop]}>
          <Text style={[styles.logo, darkText && styles.darkText]}>SongCourt</Text>
          <Text style={[styles.date, darkText && styles.darkMuted]}>{caseNumber}</Text>
        </View>

        {styleName === 'challenge' ? (
          <>
            <View style={styles.challengeHero}>
              <Text style={styles.challengeKicker}>TAG A FRIEND</Text>
              <Text adjustsFontSizeToFit numberOfLines={2} style={styles.challengeTitle}>WHO GAVE ME THE AUX?</Text>
              <Text style={styles.challengeSub}>Beat my {aux}/100 Aux Risk or take the passenger seat.</Text>
            </View>
            <View style={styles.duelPanel}>
              <View>
                <Text style={styles.label}>MY CASE</Text>
                <Text style={styles.body}>{badge.title}</Text>
              </View>
              <Text style={styles.duelScore}>{aux}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.stamp, darkText && styles.stampPaper]}>
              <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.stampText, darkText && styles.redText]}>
                {styleName === 'receipt' ? 'COURT RECEIPT' : verdict.verdictLabel}
              </Text>
            </View>
            <View style={styles.headlineBlock}>
              <Text style={[styles.kicker, darkText && styles.redText]}>{styleName === 'receipt' ? formatDisplayDate(verdict.date) : 'GUILTY OF'}</Text>
              <Text adjustsFontSizeToFit numberOfLines={3} style={[styles.verdict, darkText && styles.darkText]}>
                {verdict.primaryCharge}
              </Text>
            </View>
          </>
        )}

        <View style={[styles.riskPanel, styleName === 'receipt' && styles.receiptPanel]}>
          <View>
            <Text style={[styles.label, darkText && styles.darkMuted]}>AUX RISK</Text>
            <Text style={[styles.score, darkText && styles.redText]}>{aux}</Text>
          </View>
          <View style={[styles.caseBadge, darkText && styles.caseBadgeDark]}>
            <Text style={[styles.caseBadgeText, darkText && styles.darkMuted]}>BADGE</Text>
            <Text numberOfLines={2} style={[styles.caseBadgeCode, darkText && styles.darkText]}>{badge.title}</Text>
          </View>
        </View>

        <View style={[styles.rule, darkText && styles.darkRule]} />
        {stats.slice(0, styleName === 'poster' ? 2 : styleName === 'receipt' ? 3 : 4).map((stat) => (
          <View key={stat.key} style={styles.statLine}>
            <Text style={[styles.statLabel, darkText && styles.darkMuted]}>{stat.label}</Text>
            <Text style={[styles.statValue, darkText && styles.redText]}>{stat.value}{stat.unit ?? ''}</Text>
          </View>
        ))}
        {styleName === 'poster' ? (
          <Text numberOfLines={2} style={styles.posterHook}>{verdict.shareCaption}</Text>
        ) : null}
        {showWatermark ? <Text style={[styles.watermark, darkText && styles.darkMuted]}>songcourt.app - music on trial</Text> : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    width: 258,
    aspectRatio: 9 / 16,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    padding: 16,
    gap: 8,
  },
  poster: {
    backgroundColor: '#070408',
    borderColor: colors.dangerRed,
  },
  receipt: {
    backgroundColor: colors.courtPaper,
    borderColor: colors.dangerRed,
  },
  challenge: {
    backgroundColor: '#08050F',
    borderColor: colors.electricPurple,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  receiptTop: { borderBottomWidth: 1, borderBottomColor: 'rgba(22, 17, 12, 0.22)', paddingBottom: 7 },
  logo: { color: colors.text, fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
  date: { color: colors.muted, fontSize: 9, fontWeight: '900' },
  stamp: {
    borderWidth: 2,
    borderColor: colors.dangerRed,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    transform: [{ rotate: '-3deg' }],
    backgroundColor: 'rgba(255, 23, 79, 0.1)',
    marginTop: 12,
  },
  stampPaper: { backgroundColor: 'rgba(255, 23, 79, 0.04)' },
  stampText: { color: colors.dangerRed, fontSize: 28, lineHeight: 32, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
  kicker: { color: colors.hotPink, fontSize: 10, fontWeight: '900', textAlign: 'center' },
  headlineBlock: { minHeight: 108, justifyContent: 'center', gap: 8 },
  verdict: { color: colors.text, fontSize: 25, lineHeight: 29, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
  riskPanel: {
    marginTop: 'auto',
    borderWidth: 1,
    borderColor: 'rgba(255, 23, 79, 0.56)',
    borderRadius: 10,
    padding: 12,
    backgroundColor: 'rgba(5, 5, 7, 0.58)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  receiptPanel: { backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255, 23, 79, 0.4)' },
  score: { color: colors.hotPink, fontSize: 58, lineHeight: 62, fontWeight: '900' },
  caseBadge: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: colors.neonGreen,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 7,
    backgroundColor: 'rgba(215, 255, 31, 0.1)',
  },
  caseBadgeDark: { borderColor: 'rgba(22, 17, 12, 0.3)', backgroundColor: 'rgba(255,255,255,0.18)' },
  caseBadgeText: { color: colors.muted, fontSize: 8, fontWeight: '900' },
  caseBadgeCode: { color: colors.neonGreen, fontSize: 12, lineHeight: 14, fontWeight: '900', marginTop: 2 },
  rule: { height: 1, backgroundColor: colors.border, marginVertical: 3 },
  label: { color: colors.muted, fontSize: 10, fontWeight: '900' },
  body: { color: colors.text, fontSize: 16, lineHeight: 20, fontWeight: '900', marginTop: 4 },
  statLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  statLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', flex: 1 },
  statValue: { color: colors.neonGreen, fontSize: 15, fontWeight: '900' },
  posterHook: { color: colors.text, fontSize: 12, lineHeight: 16, fontWeight: '800', marginTop: 2 },
  watermark: { color: colors.muted, fontSize: 9, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  darkText: { color: colors.ink },
  darkMuted: { color: '#4A3E30' },
  darkRule: { backgroundColor: 'rgba(74, 62, 48, 0.4)' },
  redText: { color: colors.dangerRed },
  challengeHero: {
    minHeight: 174,
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(146, 45, 255, 0.58)',
    backgroundColor: 'rgba(146, 45, 255, 0.13)',
    padding: 12,
    marginTop: 14,
  },
  challengeKicker: { color: colors.neonGreen, fontSize: 11, fontWeight: '900', textAlign: 'center' },
  challengeTitle: { color: colors.text, fontSize: 31, lineHeight: 35, fontWeight: '900', textAlign: 'center', marginTop: 8 },
  challengeSub: { color: colors.muted, fontSize: 13, lineHeight: 18, fontWeight: '800', textAlign: 'center', marginTop: 10 },
  duelPanel: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.hotPink,
    padding: 12,
    backgroundColor: 'rgba(255, 31, 104, 0.1)',
  },
  duelScore: { color: colors.hotPink, fontSize: 54, lineHeight: 58, fontWeight: '900' },
});
