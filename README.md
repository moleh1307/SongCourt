# SongCourt

SongCourt is a demo-first iPhone entertainment app that puts a user's Spotify history on trial and produces funny, shareable verdict cards.

## Stack

- Expo SDK 54
- React Native
- TypeScript
- expo-router
- Zustand
- SecureStore persistence

## Run

```bash
cd /Users/melihkarakose/Projects/Active/SongCourt
source /Users/melihkarakose/.nvm/nvm.sh
nvm use 22.22.0
npm install
npm run ios
```

If Expo Go opens its first-run developer menu, click `Continue` once.

## Verification

```bash
npx tsc --noEmit
npx expo-doctor
npx expo export --platform ios --output-dir dist-test
rm -rf dist-test
```

## Current MVP Flow

```text
Splash -> Onboarding -> Connect / Preview Demo Trial -> Loading -> Verdict -> Share Card -> History
```

Real Spotify OAuth and backend APIs are intentionally not implemented yet. Service boundaries exist under `src/services/` so they can be replaced later without rewriting screens.
