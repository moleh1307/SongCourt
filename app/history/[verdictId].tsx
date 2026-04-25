import { useLocalSearchParams } from 'expo-router';
import TrialResultScreen from '../trial/result';
import { useEffect } from 'react';
import { useHistoryStore } from '../../src/store/historyStore';
import { useTrialStore } from '../../src/store/trialStore';

export default function HistoryVerdictScreen() {
  const { verdictId } = useLocalSearchParams<{ verdictId: string }>();
  const verdict = useHistoryStore((state) => state.getVerdictById(verdictId ?? ''));
  const setCurrentVerdict = useTrialStore((state) => state.setCurrentVerdict);

  useEffect(() => {
    setCurrentVerdict(verdict);
  }, [setCurrentVerdict, verdict]);

  return <TrialResultScreen />;
}
