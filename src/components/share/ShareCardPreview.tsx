import { forwardRef } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { ShareCardStyle, Verdict } from '../../types/verdict';
import { formatDisplayDate } from '../../utils/date';

type ShareCardPreviewProps = {
  verdict: Verdict;
  styleName: ShareCardStyle;
  showWatermark?: boolean;
};

const shareBackgrounds: Partial<Record<ShareCardStyle, number>> = {
  neon: require('../../../assets/premium/verdict-poster-bg.png'),
  receipt: require('../../../assets/premium/case-file-paper.png'),
  mugshot: require('../../../assets/premium/verdict-poster-bg.png'),
};

export const ShareCardPreview = forwardRef<View, ShareCardPreviewProps>(
  ({ verdict, styleName, showWatermark = true }, ref) => {
    const aux = verdict.scores.find((score) => score.key === 'auxRisk')?.value ?? 0;
    const background = shareBackgrounds[styleName];
    const hasBackground = background !== undefined;
    const cardStyle = [
      styles.card,
      styleName === 'receipt' && styles.receipt,
      styleName === 'mugshot' && styles.mugshot,
      styleName === 'minimal' && styles.minimal,
    ];
    const darkText = styleName === 'receipt';
    const content = (
      <View
        style={[
          styles.content,
          hasBackground && styles.imageContent,
          styleName === 'receipt' && styles.receiptContent,
          styleName === 'minimal' && styles.minimalContent,
        ]}
      >
        <View style={styles.topRow}>
          <Text style={[styles.logo, darkText && styles.darkText]}>SongCourt</Text>
          <Text style={[styles.date, darkText && styles.darkMuted]}>{formatDisplayDate(verdict.date)}</Text>
        </View>
        <View style={[styles.stamp, darkText && styles.stampPaper]}>
          <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.stampText, darkText && styles.redText]}>
            {styleName === 'mugshot' ? 'AUX OFFENDER' : verdict.verdictLabel}
          </Text>
        </View>
        <View style={styles.headlineBlock}>
          <Text style={[styles.kicker, darkText && styles.redText]}>{styleName === 'mugshot' ? 'GUILTY OF' : 'THE COURT HAS SPOKEN'}</Text>
          <Text adjustsFontSizeToFit numberOfLines={3} style={[styles.verdict, darkText && styles.darkText]}>
            {verdict.primaryCharge}
          </Text>
        </View>
        <View style={styles.riskPanel}>
          <View>
            <Text style={[styles.label, darkText && styles.darkMuted]}>AUX RISK</Text>
            <Text style={[styles.score, darkText && styles.redText]}>{aux}</Text>
          </View>
          <View style={[styles.caseBadge, darkText && styles.caseBadgeDark]}>
            <Text style={[styles.caseBadgeText, darkText && styles.darkText]}>CASE</Text>
            <Text style={[styles.caseBadgeCode, darkText && styles.redText]}>#{verdict.id.slice(-4).toUpperCase()}</Text>
          </View>
        </View>
        <View style={[styles.rule, darkText && styles.darkRule]} />
        <Text style={[styles.label, darkText && styles.darkMuted]}>CHARGE</Text>
        <Text numberOfLines={2} style={[styles.body, darkText && styles.darkText]}>{verdict.primaryCharge}</Text>
        <Text style={[styles.rarity, darkText && styles.redText]}>{verdict.rarity} - {verdict.raritySubtitle}</Text>
        {showWatermark ? <Text style={[styles.watermark, darkText && styles.darkMuted]}>in music we trust</Text> : null}
      </View>
    );

    return (
      <View ref={ref} collapsable={false} style={cardStyle}>
        {hasBackground ? (
          <ImageBackground source={background} resizeMode="cover" style={styles.backgroundImage}>
            {content}
          </ImageBackground>
        ) : (
          content
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    width: 258,
    aspectRatio: 9 / 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.dangerRed,
    overflow: 'hidden',
  },
  receipt: { backgroundColor: colors.courtPaper, borderColor: colors.dangerRed },
  mugshot: { backgroundColor: '#15070D', borderColor: colors.hotPink },
  minimal: { backgroundColor: '#050507', borderColor: colors.text },
  backgroundImage: { flex: 1 },
  content: { flex: 1, padding: 16, gap: 7 },
  imageContent: { backgroundColor: 'rgba(5, 5, 7, 0.34)' },
  receiptContent: { backgroundColor: 'rgba(244, 227, 189, 0.72)' },
  minimalContent: { backgroundColor: '#050507' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  logo: { color: colors.text, fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
  date: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  stamp: {
    borderWidth: 2,
    borderColor: colors.dangerRed,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    transform: [{ rotate: '-3deg' }],
    backgroundColor: 'rgba(255, 23, 79, 0.1)',
    marginTop: 14,
  },
  stampPaper: { backgroundColor: 'rgba(255, 23, 79, 0.04)' },
  stampText: { color: colors.dangerRed, fontSize: 31, lineHeight: 35, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' },
  kicker: { color: colors.hotPink, fontSize: 10, fontWeight: '900', textAlign: 'center' },
  headlineBlock: { minHeight: 104, justifyContent: 'center', gap: 8 },
  score: { color: colors.hotPink, fontSize: 64, lineHeight: 68, fontWeight: '900' },
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
  caseBadge: {
    borderWidth: 1,
    borderColor: colors.neonGreen,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 7,
    backgroundColor: 'rgba(215, 255, 31, 0.1)',
  },
  caseBadgeDark: { borderColor: 'rgba(22, 17, 12, 0.3)', backgroundColor: 'rgba(255,255,255,0.18)' },
  caseBadgeText: { color: colors.muted, fontSize: 8, fontWeight: '900' },
  caseBadgeCode: { color: colors.neonGreen, fontSize: 10, fontWeight: '900', marginTop: 2 },
  rule: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  label: { color: colors.muted, fontSize: 10, fontWeight: '900' },
  body: { color: colors.text, fontSize: 13, lineHeight: 17, fontWeight: '800' },
  rarity: { color: colors.hotPink, fontSize: 12, fontWeight: '900', marginTop: 2 },
  watermark: { color: colors.muted, fontSize: 10, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  darkText: { color: colors.ink },
  darkMuted: { color: '#4A3E30' },
  darkRule: { backgroundColor: 'rgba(74, 62, 48, 0.4)' },
  redText: { color: colors.dangerRed },
});
