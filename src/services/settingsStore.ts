import AsyncStorage from '@react-native-async-storage/async-storage';

export type SongCourtSettings = {
  shareWatermarkEnabled: boolean;
};

const settingsKey = 'songcourt:settings';
const defaultSettings: SongCourtSettings = {
  shareWatermarkEnabled: true,
};

export async function getSongCourtSettings(): Promise<SongCourtSettings> {
  try {
    const rawSettings = await AsyncStorage.getItem(settingsKey);
    if (!rawSettings) return defaultSettings;

    const parsed = JSON.parse(rawSettings) as Partial<SongCourtSettings>;

    return {
      shareWatermarkEnabled:
        typeof parsed.shareWatermarkEnabled === 'boolean'
          ? parsed.shareWatermarkEnabled
          : defaultSettings.shareWatermarkEnabled,
    };
  } catch {
    return defaultSettings;
  }
}

export async function saveShareWatermarkEnabled(shareWatermarkEnabled: boolean) {
  const nextSettings = {
    ...(await getSongCourtSettings()),
    shareWatermarkEnabled,
  };

  await AsyncStorage.setItem(settingsKey, JSON.stringify(nextSettings));
  return nextSettings;
}
