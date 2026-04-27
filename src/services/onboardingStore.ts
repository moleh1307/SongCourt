import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const onboardingKey = 'songcourt:onboarding-complete';

export async function hasCompletedOnboarding() {
  const fallbackValue = await AsyncStorage.getItem(onboardingKey).catch(() => null);
  if (fallbackValue === 'true') return true;

  try {
    return (await SecureStore.getItemAsync(onboardingKey)) === 'true';
  } catch {
    return false;
  }
}

export async function markOnboardingComplete() {
  await AsyncStorage.setItem(onboardingKey, 'true');

  try {
    await SecureStore.setItemAsync(onboardingKey, 'true');
  } catch {
    // AsyncStorage is enough for non-sensitive first-run state.
  }
}
