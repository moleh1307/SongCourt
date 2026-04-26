import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';
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

export default function ShareScreen() {
  const cardRef = useRef<RNView>(null);
  const [styleName, setStyleName] = useState<ShareCardStyle>('neon');
  const currentVerdict = useTrialStore((state) => state.currentVerdict);
  const todayVerdict = useHistoryStore((state) => state.getTodayVerdict());
  const watermarkEnabled = useSettingsStore((state) => state.watermarkEnabled);
  const verdict = currentVerdict ?? todayVerdict;

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
    await shareService.copyCaption(verdict.shareCaption);
    Alert.alert('Caption copied.', 'The group chat has been warned.');
  };

  return (
    <Screen>
      <SectionHeader eyebrow="SHARE CARD" title="Make the verdict travel." />
      <View style={styles.metaRow}>
        <View style={styles.metaTile}>
          <Text style={styles.metaValue}>{styleName}</Text>
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
        <Text style={styles.kicker}>Caption</Text>
        <Text style={styles.caption}>{verdict.shareCaption}</Text>
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
  metaValue: { color: colors.neonGreen, fontSize: 22, fontWeight: '900', textTransform: 'uppercase' },
  metaLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', marginTop: 3 },
  actions: { flexDirection: 'row', gap: 10 },
  kicker: { color: colors.hotPink, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', marginBottom: 8 },
  caption: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: '800' },
});
