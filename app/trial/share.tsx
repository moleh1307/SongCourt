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
import { useTrialStore } from '../../src/store/trialStore';
import type { ShareCardStyle } from '../../src/types/verdict';

export default function ShareScreen() {
  const cardRef = useRef<RNView>(null);
  const [styleName] = useState<ShareCardStyle>('neon');
  const currentVerdict = useTrialStore((state) => state.currentVerdict);
  const todayVerdict = useHistoryStore((state) => state.getTodayVerdict());
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

  const copy = async () => {
    await shareService.copyCaption(verdict.shareCaption);
    Alert.alert('Caption copied.', 'The group chat has been warned.');
  };

  return (
    <Screen>
      <SectionHeader eyebrow="CREATE SHARE CARD" title="Choose your evidence." />
      <ShareCardCarousel verdict={verdict} activeStyle={styleName} cardRef={cardRef} />
      <CourtCard accent={colors.hotPink}>
        <Text style={styles.caption}>{verdict.shareCaption}</Text>
      </CourtCard>
      <NeonButton onPress={share}>Share</NeonButton>
      <SecondaryButton onPress={copy}>Copy Caption</SecondaryButton>
      <SecondaryButton onPress={() => router.back()}>Back to Verdict</SecondaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  caption: { color: colors.text, fontSize: 16, fontWeight: '800' },
});
