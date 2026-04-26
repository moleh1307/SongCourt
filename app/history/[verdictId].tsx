import { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { NeonButton } from '../../src/components/common/NeonButton';
import { Screen } from '../../src/components/common/Screen';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { colors } from '../../src/constants/colors';
import { useHistoryStore } from '../../src/store/historyStore';
import { useTrialStore } from '../../src/store/trialStore';
import TrialResultScreen from '../trial/result';

export default function HistoryVerdictScreen() {
  const { verdictId } = useLocalSearchParams<{ verdictId: string }>();
  const verdict = useHistoryStore((state) => state.getVerdictById(verdictId ?? ''));
  const setCurrentVerdict = useTrialStore((state) => state.setCurrentVerdict);

  useEffect(() => {
    setCurrentVerdict(verdict);
  }, [setCurrentVerdict, verdict]);

  if (!verdict) {
    return (
      <Screen>
        <SectionHeader eyebrow="MISSING CASE FILE" title="Verdict not found." />
        <Text style={{ color: colors.muted, fontSize: 16, fontWeight: '700' }}>
          This record is no longer in your local history.
        </Text>
        <NeonButton onPress={() => router.replace('/(tabs)/history')}>Return to History</NeonButton>
      </Screen>
    );
  }

  return <TrialResultScreen />;
}
