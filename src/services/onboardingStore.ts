import * as SecureStore from 'expo-secure-store';

const onboardingKey = 'songcourt:onboarding-complete';

export async function hasCompletedOnboarding() {
  try {
    return (await SecureStore.getItemAsync(onboardingKey)) === 'true';
  } catch {
    return false;
  }
}

export async function markOnboardingComplete() {
  await SecureStore.setItemAsync(onboardingKey, 'true');
}
