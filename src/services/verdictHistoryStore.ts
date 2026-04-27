import AsyncStorage from '@react-native-async-storage/async-storage';

import { ShareCardPayload } from '../components/share-cards/types';

export type VerdictHistoryRecord = {
  id: string;
  payload: ShareCardPayload;
  savedAt: string;
  sourceLabel: string;
};

const historyKey = 'songcourt:verdict-history';
const maxHistoryItems = 30;

export async function getVerdictHistory(): Promise<VerdictHistoryRecord[]> {
  try {
    const rawHistory = await AsyncStorage.getItem(historyKey);
    if (!rawHistory) return [];

    const parsed = JSON.parse(rawHistory);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isVerdictHistoryRecord).slice(0, maxHistoryItems);
  } catch {
    return [];
  }
}

export async function addVerdictToHistory(
  payload: ShareCardPayload,
  sourceLabel: string,
): Promise<VerdictHistoryRecord> {
  const record: VerdictHistoryRecord = {
    id: createVerdictRecordId(payload),
    payload,
    savedAt: new Date().toISOString(),
    sourceLabel,
  };

  const currentHistory = await getVerdictHistory();
  const nextHistory = [record, ...currentHistory].slice(0, maxHistoryItems);
  await AsyncStorage.setItem(historyKey, JSON.stringify(nextHistory));

  return record;
}

export async function clearVerdictHistory() {
  await AsyncStorage.removeItem(historyKey);
}

function createVerdictRecordId(payload: ShareCardPayload) {
  const caseSlug = payload.caseNumber.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
  const entropy = Math.random().toString(36).slice(2, 8);
  return `${caseSlug || 'case'}-${Date.now()}-${entropy}`;
}

function isVerdictHistoryRecord(value: unknown): value is VerdictHistoryRecord {
  if (!value || typeof value !== 'object') return false;

  const record = value as Partial<VerdictHistoryRecord>;
  const payload = record.payload as Partial<ShareCardPayload> | undefined;

  return (
    typeof record.id === 'string' &&
    typeof record.savedAt === 'string' &&
    typeof record.sourceLabel === 'string' &&
    Boolean(payload) &&
    payload?.appName === 'SongCourt' &&
    typeof payload?.caseNumber === 'string' &&
    typeof payload?.verdictTitle === 'string' &&
    typeof payload?.auxRisk === 'number'
  );
}
