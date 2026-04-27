import { StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '../BrandMark';
import { cardSizes, colors, fonts } from '../../design/tokens';
import { ShareCardPayload, MusicDnaSlice } from './types';

type MusicDnaCardProps = {
  payload: ShareCardPayload;
};

const fallbackDna: MusicDnaSlice[] = [
  { label: 'Replay', value: 34, color: colors.courtRed },
  { label: 'Mood', value: 26, color: colors.ink },
  { label: 'Night', value: 22, color: colors.gold },
  { label: 'Genre', value: 18, color: colors.courtRedDark },
];

export function MusicDnaCard({ payload }: MusicDnaCardProps) {
  const slices = normalizeSlices(payload.musicDna?.length ? payload.musicDna : fallbackDna);
  const topEvidence = payload.evidence.slice(0, 4);

  return (
    <View style={styles.card}>
      <View style={styles.backgroundRule} />
      <View style={styles.header}>
        <BrandMark />
        <View style={styles.caseBlock}>
          <Text style={styles.caseLabel}>Music DNA</Text>
          <Text style={styles.caseNumber}>{payload.caseNumber}</Text>
        </View>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.kicker}>Court profile</Text>
        <Text style={styles.title}>Your listening DNA</Text>
        <Text numberOfLines={2} style={styles.subtitle}>
          Built from the evidence behind today's verdict.
        </Text>
      </View>

      <View style={styles.dnaStage}>
        <View style={styles.orbitOuter} />
        <View style={styles.orbitMiddle} />
        <View style={styles.orbitInner}>
          <Text style={styles.score}>{payload.auxRisk}</Text>
          <Text style={styles.scoreLabel}>Aux risk</Text>
        </View>

        <View style={styles.dnaBars}>
          {slices.map((slice, index) => (
            <View key={slice.label} style={styles.dnaRow}>
              <View style={styles.dnaRowHeader}>
                <Text style={styles.dnaLabel}>{slice.label}</Text>
                <Text style={styles.dnaValue}>{slice.value}%</Text>
              </View>
              <View style={styles.dnaTrack}>
                <View
                  style={[
                    styles.dnaFill,
                    {
                      backgroundColor: accentForIndex(index, slice.color),
                      width: `${Math.max(10, Math.min(100, slice.value))}%`,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.personaPanel}>
        <Text style={styles.panelLabel}>Persona</Text>
        <Text adjustsFontSizeToFit minimumFontScale={0.74} numberOfLines={2} style={styles.persona}>
          {payload.courtPersona}
        </Text>
        <Text numberOfLines={2} style={styles.charge}>
          {payload.charge}
        </Text>
      </View>

      <View style={styles.statGrid}>
        {topEvidence.map((item) => (
          <View key={item.key} style={styles.statCell}>
            <Text numberOfLines={1} style={styles.statValue}>
              {item.value}
            </Text>
            <Text numberOfLines={1} style={styles.statLabel}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{payload.createdAt}</Text>
        <Text style={styles.footerText}>{payload.watermarkEnabled ? 'SONGCOURT.APP' : payload.courtRank}</Text>
      </View>
    </View>
  );
}

function normalizeSlices(slices: MusicDnaSlice[]) {
  const total = slices.reduce((sum, slice) => sum + Math.max(0, slice.value), 0) || 1;

  return slices.slice(0, 5).map((slice) => ({
    ...slice,
    value: Math.round((Math.max(0, slice.value) / total) * 100),
  }));
}

function accentForIndex(index: number, color: string) {
  const restrained = [colors.courtRed, colors.ink, colors.gold, colors.courtRedDark, colors.paperTan];
  return restrained[index] ?? color;
}

const styles = StyleSheet.create({
  card: {
    width: cardSizes.story.width,
    height: cardSizes.story.height,
    backgroundColor: colors.warmIvory,
    overflow: 'hidden',
  },
  backgroundRule: {
    position: 'absolute',
    left: 72,
    right: 72,
    top: 1032,
    borderColor: colors.ink,
    borderTopWidth: 3,
    opacity: 0.12,
  },
  header: {
    position: 'absolute',
    left: 72,
    top: 72,
    width: 936,
    height: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caseBlock: {
    alignItems: 'flex-end',
    paddingTop: 8,
  },
  caseLabel: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  caseNumber: {
    color: colors.ink,
    fontFamily: fonts.mono,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 14,
  },
  titleBlock: {
    position: 'absolute',
    left: 72,
    top: 250,
    width: 936,
  },
  kicker: {
    color: colors.courtRed,
    fontFamily: fonts.body,
    fontSize: 32,
    fontWeight: '900',
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 112,
    fontWeight: '900',
    letterSpacing: -4,
    lineHeight: 120,
    marginTop: 22,
  },
  subtitle: {
    color: colors.mutedInk,
    fontFamily: fonts.body,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 46,
    marginTop: 22,
    width: 720,
  },
  dnaStage: {
    position: 'absolute',
    left: 72,
    top: 610,
    width: 936,
    height: 500,
  },
  orbitOuter: {
    position: 'absolute',
    left: 20,
    top: 0,
    width: 440,
    height: 440,
    borderColor: colors.ink,
    borderRadius: 220,
    borderWidth: 16,
    opacity: 0.08,
  },
  orbitMiddle: {
    position: 'absolute',
    left: 70,
    top: 50,
    width: 340,
    height: 340,
    borderColor: colors.courtRed,
    borderRadius: 170,
    borderWidth: 18,
  },
  orbitInner: {
    position: 'absolute',
    left: 132,
    top: 112,
    width: 216,
    height: 216,
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 108,
    justifyContent: 'center',
  },
  score: {
    color: colors.warmIvory,
    fontFamily: fonts.mono,
    fontSize: 86,
    fontWeight: '900',
    lineHeight: 96,
  },
  scoreLabel: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  dnaBars: {
    position: 'absolute',
    right: 0,
    top: 20,
    width: 430,
    gap: 28,
  },
  dnaRow: {
    gap: 12,
  },
  dnaRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dnaLabel: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 30,
    fontWeight: '900',
  },
  dnaValue: {
    color: colors.mutedInk,
    fontFamily: fonts.mono,
    fontSize: 28,
    fontWeight: '900',
  },
  dnaTrack: {
    height: 26,
    backgroundColor: '#E1D6C4',
    borderRadius: 13,
    overflow: 'hidden',
  },
  dnaFill: {
    height: 26,
    borderRadius: 13,
  },
  personaPanel: {
    position: 'absolute',
    left: 72,
    top: 1126,
    width: 936,
    minHeight: 260,
    backgroundColor: colors.ink,
    borderRadius: 20,
    padding: 42,
  },
  panelLabel: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 26,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  persona: {
    color: colors.warmIvory,
    fontFamily: fonts.body,
    fontSize: 72,
    fontWeight: '900',
    lineHeight: 78,
    marginTop: 18,
  },
  charge: {
    color: colors.paperTan,
    fontFamily: fonts.body,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 42,
    marginTop: 16,
  },
  statGrid: {
    position: 'absolute',
    left: 72,
    top: 1438,
    width: 936,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  statCell: {
    width: 458,
    height: 142,
    borderColor: colors.hairline,
    borderRadius: 16,
    borderWidth: 3,
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  statValue: {
    color: colors.courtRed,
    fontFamily: fonts.mono,
    fontSize: 48,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    left: 72,
    top: 1792,
    width: 936,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: colors.ink,
    fontFamily: fonts.mono,
    fontSize: 25,
    fontWeight: '900',
  },
});
