import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { View as RNView } from 'react-native';
import { ShareCardCarousel } from '../../src/components/share/ShareCardCarousel';
import { CourtCard } from '../../src/components/common/CourtCard';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SecondaryButton } from '../../src/components/common/SecondaryButton';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { colors } from '../../src/constants/colors';
import { shareService } from '../../src/services/shareService';
import { useHistoryStore } from '../../src/store/historyStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useTrialStore } from '../../src/store/trialStore';
import type { ShareCardStyle } from '../../src/types/verdict';
import { getVerdictCaptions } from '../../src/utils/verdictRewards';

const templateLabels: Record<ShareCardStyle, string> = {
  poster: 'Verdict Poster',
  receipt: 'Court Receipt',
  challenge: 'Tag a Friend',
};

export default function ShareScreen() {
  const { style } = useLocalSearchParams<{ style?: string }>();
  const cardRef = useRef<RNView>(null);
  const [styleName, setStyleName] = useState<ShareCardStyle>('poster');
  const [captionIndex, setCaptionIndex] = useState(0);
  const currentVerdict = useTrialStore((state) => state.currentVerdict);
  const todayVerdict = useHistoryStore((state) => state.getTodayVerdict());
  const watermarkEnabled = useSettingsStore((state) => state.watermarkEnabled);
  const verdict = currentVerdict ?? todayVerdict;
  const captions = verdict ? getVerdictCaptions(verdict) : [];
  const selectedCaption = captions[captionIndex] ?? verdict?.shareCaption ?? '';

  useEffect(() => {
    if (style === 'poster' || style === 'receipt' || style === 'challenge') {
      setStyleName(style);
    }
  }, [style]);

  if (!verdict) {
    return (
      <Screen>
        <SectionHeader title="No share card yet." />
        <NeonButton onPress={() => router.replace('/trial/loading')}>Generate Verdict</NeonButton>
      </Screen>
    );
  }

  const share = async () => {
    try {
      const uri = await shareService.captureShareCard(cardRef);
      await shareService.shareImage(uri);
    } catch {
      Alert.alert('Share failed.', 'The verdict could not leave the courtroom.');
    }
  };

  const save = async () => {
    try {
      const uri = await shareService.captureShareCard(cardRef);
      await shareService.saveImage(uri);
      Alert.alert('Saved.', 'The verdict is now evidence in your camera roll.');
    } catch {
      Alert.alert('Save failed.', 'The verdict could not leave the courtroom.');
    }
  };

  const copy = async () => {
    await shareService.copyCaption(selectedCaption);
    Alert.alert('Caption copied.', 'The group chat has been warned.');
  };

  return (
    <Screen>
      <SectionHeader eyebrow="VIRAL EVIDENCE" title="Make the verdict travel." />
      <View style={styles.metaRow}>
        <View style={styles.metaTile}>
          <Text style={styles.metaValue}>{templateLabels[styleName]}</Text>
          <Text style={styles.metaLabel}>Template</Text>
        </View>
        <View style={styles.metaTile}>
          <Text style={styles.metaValue}>{watermarkEnabled ? 'on' : 'off'}</Text>
          <Text style={styles.metaLabel}>Watermark</Text>
        </View>
      </View>
      <ShareCardCarousel
        verdict={verdict}
        activeStyle={styleName}
        onStyleChange={setStyleName}
        cardRef={cardRef}
        showWatermark={watermarkEnabled}
      />
      <NeonButton onPress={share}>Share Verdict</NeonButton>
      <View style={styles.actions}>
        <SecondaryButton onPress={save}>Save Image</SecondaryButton>
        <SecondaryButton onPress={copy}>Copy Caption</SecondaryButton>
      </View>
      <CourtCard quiet>
        <Text style={styles.kicker}>Caption generator</Text>
        <View style={styles.captionList}>
          {captions.map((caption, index) => {
            const active = index === captionIndex;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Select caption ${index + 1}`}
                key={caption}
                onPress={() => setCaptionIndex(index)}
                style={[styles.captionChip, active && styles.captionChipActive]}
              >
                <Text style={[styles.caption, active && styles.captionActive]}>{caption}</Text>
              </Pressable>
            );
          })}
        </View>
      </CourtCard>
      <SecondaryButton onPress={() => router.replace('/trial/result')}>Back to Verdict</SecondaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metaRow: { flexDirection: 'row', gap: 10 },
  metaTile: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.deepCard,
    padding: 12,
  },
  metaValue: { color: colors.neonGreen, fontSize: 18, lineHeight: 22, fontWeight: '900', textTransform: 'uppercase' },
  metaLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', marginTop: 3 },
  actions: { flexDirection: 'row', gap: 10 },
  kicker: { color: colors.hotPink, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', marginBottom: 8 },
  captionList: { gap: 8 },
  captionChip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.deepCard,
    padding: 11,
  },
  captionChipActive: {
    borderColor: colors.neonGreen,
    backgroundColor: 'rgba(114, 255, 56, 0.09)',
  },
  caption: { color: colors.text, fontSize: 14, lineHeight: 20, fontWeight: '800' },
  captionActive: { color: colors.neonGreen },
});
