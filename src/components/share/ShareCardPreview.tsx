import { forwardRef } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { ShareCardStyle, Verdict } from '../../types/verdict';
import { formatDisplayDate } from '../../utils/date';

type ShareCardPreviewProps = {
  verdict: Verdict;
  styleName: ShareCardStyle;
  defendant?: string;
};

const shareBackgrounds: Partial<Record<ShareCardStyle, number>> = {
  neon: require('../../../assets/generated/share-neon-court.png'),
  receipt: require('../../../assets/generated/share-court-receipt.png'),
  mugshot: require('../../../assets/generated/share-mugshot-poster.png'),
};

export const ShareCardPreview = forwardRef<View, ShareCardPreviewProps>(
  ({ verdict, styleName, defendant = 'Defendant' }, ref) => {
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
      <View style={[styles.content, hasBackground && styles.imageContent, styleName === 'receipt' && styles.receiptContent]}>
        <Text style={[styles.logo, darkText && styles.darkText]}>SONGCOURT</Text>
        <Text style={[styles.date, darkText && styles.darkMuted]}>{formatDisplayDate(verdict.date)}</Text>
        <View style={styles.spacer} />
        <Text style={[styles.defendant, darkText && styles.darkMuted]}>{styleName === 'mugshot' ? 'WANTED FOR AUX CRIMES' : defendant}</Text>
        <Text style={[styles.score, darkText && styles.darkText]}>AUX RISK {aux}</Text>
        <Text style={[styles.verdict, darkText && styles.redText]}>{verdict.verdictLabel}</Text>
        <View style={[styles.rule, darkText && styles.darkRule]} />
        <Text style={[styles.label, darkText && styles.darkMuted]}>CHARGE</Text>
        <Text style={[styles.body, darkText && styles.darkText]}>{verdict.primaryCharge}</Text>
        <Text style={[styles.label, darkText && styles.darkMuted]}>SENTENCE</Text>
        <Text style={[styles.body, darkText && styles.darkText]}>{verdict.sentence}</Text>
        <Text style={[styles.rarity, darkText && styles.redText]}>{verdict.rarity} - {verdict.raritySubtitle}</Text>
        <Text style={[styles.watermark, darkText && styles.darkMuted]}>spotify wrapped got arrested</Text>
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
    width: 300,
    aspectRatio: 9 / 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.neonGreen,
    overflow: 'hidden',
  },
  receipt: { backgroundColor: colors.courtPaper, borderColor: colors.dangerRed },
  mugshot: { backgroundColor: '#15070D', borderColor: colors.hotPink },
  minimal: { backgroundColor: '#050507', borderColor: colors.text },
  backgroundImage: { flex: 1 },
  content: { flex: 1, padding: 18, gap: 9 },
  imageContent: { backgroundColor: 'rgba(5, 5, 7, 0.44)' },
  receiptContent: { backgroundColor: 'rgba(255, 244, 214, 0.58)' },
  logo: { color: colors.neonGreen, fontSize: 22, fontWeight: '900' },
  date: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  spacer: { flex: 1 },
  defendant: { color: colors.warningYellow, fontSize: 13, fontWeight: '900' },
  score: { color: colors.text, fontSize: 34, fontWeight: '900' },
  verdict: { color: colors.dangerRed, fontSize: 30, fontWeight: '900' },
  rule: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  label: { color: colors.muted, fontSize: 10, fontWeight: '900' },
  body: { color: colors.text, fontSize: 15, fontWeight: '800' },
  rarity: { color: colors.hotPink, fontSize: 13, fontWeight: '900', marginTop: 4 },
  watermark: { color: colors.muted, fontSize: 10, fontWeight: '800', marginTop: 'auto' },
  darkText: { color: colors.black },
  darkMuted: { color: '#4A3E30' },
  darkRule: { backgroundColor: 'rgba(74, 62, 48, 0.4)' },
  redText: { color: colors.dangerRed },
});
