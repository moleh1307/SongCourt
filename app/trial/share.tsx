import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { View as RNView } from 'react-native';
import { ShareCardCarousel } from '../../src/components/share/ShareCardCarousel';
import { CourtCard } from '../../src/components/common/CourtCard';
import { DopamineStrip } from '../../src/components/common/DopamineStrip';
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
      <SectionHeader eyebrow="CREATE SHARE CARD" title="Make it screenshot-worthy." />
      <DopamineStrip
        items={[
          { value: styleName, label: 'card flavor', color: colors.neonGreen },
          { value: watermarkEnabled ? 'branded' : 'clean', label: 'watermark', color: colors.hotPink },
          { value: '9:16', label: 'story ready', color: colors.warningYellow },
        ]}
      />
      <NeonButton onPress={share}>Share This Verdict</NeonButton>
      <ShareCardCarousel
        verdict={verdict}
        activeStyle={styleName}
        onStyleChange={setStyleName}
        cardRef={cardRef}
        showWatermark={watermarkEnabled}
      />
      <CourtCard accent={colors.hotPink}>
        <Text style={styles.kicker}>Caption bait</Text>
        <Text style={styles.caption}>{verdict.shareCaption}</Text>
      </CourtCard>
      <SecondaryButton onPress={save}>Save Image</SecondaryButton>
      <SecondaryButton onPress={copy}>Copy Caption</SecondaryButton>
      <SecondaryButton onPress={() => router.replace('/trial/result')}>Back to Verdict</SecondaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.hotPink, fontSize: 11, fontWeight: '900', textTransform: 'uppercase', marginBottom: 8 },
  caption: { color: colors.text, fontSize: 16, fontWeight: '800' },
});
