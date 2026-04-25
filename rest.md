Below is the **remaining Codex Agent brief** excluding the frontend/UI design already written.

You can paste this after the previous design brief.

---

# SongCourt — Product, Frontend Logic, App Behavior, and Agent Implementation Brief

## 0. Mission

Build **SongCourt**, a mobile-first entertainment app that connects to a user’s Spotify account and turns their listening history into a funny daily “music trial.”

The app should feel viral, polished, fast, and dopamine-heavy.

The first MVP does **not** need a full backend yet. It should be architected so backend/API integration can be plugged in later without rewriting the app.

The app should support:

```text
Connect Spotify → generate daily trial → reveal verdict → view evidence → create share card → save/share result
```

---

# 1. Product rules

## Core product promise

```text
SongCourt puts your Spotify history on trial.
```

## Main user reward

The user gets a funny verdict card based on their music behavior.

## What the app is not

Do **not** build this as:

* an AI app
* a chatbot
* a serious music analytics dashboard
* a productivity tool
* a generic Spotify stats clone

It should be:

* funny
* social
* fast
* repeatable
* highly shareable

---

# 2. MVP scope

## Must-have MVP

Implement these:

1. Splash screen
2. Onboarding flow
3. Spotify connection placeholder/demo flow
4. Trial home screen
5. Demo trial generation
6. Loading/reveal sequence
7. Verdict result screen
8. Evidence section
9. Share card preview screen
10. History screen with saved verdicts
11. Profile/settings screen
12. Local storage for demo verdicts/history
13. Clean state management
14. Typed data models
15. Mock service layer ready to be replaced by real backend/API calls

## Do not build yet

Do **not** implement these in MVP unless explicitly requested later:

* full backend
* real Spotify OAuth
* real Apple Music integration
* paid subscriptions
* social feed
* comments
* leaderboard
* push notifications
* complex friend system
* real analytics SDK
* server-side image rendering

Design placeholders for some of them are okay.

---

# 3. Recommended tech stack

Use:

```text
React Native + Expo + TypeScript
```

Recommended libraries:

```text
expo-router
react-native-reanimated
react-native-gesture-handler
zustand
expo-secure-store
expo-haptics
expo-sharing
expo-file-system
react-native-view-shot
lucide-react-native
```

Optional:

```text
react-native-svg
moti
@shopify/react-native-skia
```

Use TypeScript strictly.

Avoid overengineering.

---

# 4. App architecture

Recommended folder structure:

```text
src/
  app/
    _layout.tsx
    index.tsx
    onboarding/
      index.tsx
    connect/
      index.tsx
    trial/
      index.tsx
      loading.tsx
      result.tsx
      share.tsx
    history/
      index.tsx
      [verdictId].tsx
    friends/
      index.tsx
    profile/
      index.tsx

  components/
    common/
      NeonButton.tsx
      SecondaryButton.tsx
      Screen.tsx
      CourtCard.tsx
      SectionHeader.tsx
      GlowText.tsx

    trial/
      VerdictStamp.tsx
      ScoreGauge.tsx
      EvidenceCard.tsx
      RarityBadge.tsx
      ChargeCard.tsx
      SentenceCard.tsx
      VerdictSummaryCard.tsx
      TrialLoadingSequence.tsx

    share/
      ShareCardPreview.tsx
      ShareCardCarousel.tsx

    navigation/
      BottomCourtTabs.tsx

  data/
    demoTracks.ts
    demoVerdicts.ts
    copyTemplates.ts
    rarityConfig.ts

  services/
    spotifyService.ts
    verdictService.ts
    storageService.ts
    shareService.ts

  store/
    authStore.ts
    trialStore.ts
    historyStore.ts
    settingsStore.ts

  types/
    user.ts
    music.ts
    verdict.ts
    navigation.ts

  utils/
    scoring.ts
    date.ts
    formatting.ts
    random.ts

  constants/
    colors.ts
    typography.ts
    spacing.ts
    app.ts
```

The app must be modular. Backend integration should later happen mainly inside:

```text
services/spotifyService.ts
services/verdictService.ts
services/storageService.ts
```

---

# 5. Core data types

Use typed models from the beginning.

## User

```ts
type User = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  spotifyConnected: boolean;
  createdAt: string;
};
```

## Track

```ts
type Track = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumImageUrl?: string;
  playedAt?: string;
  durationMs?: number;
  popularity?: number;
  genres?: string[];
};
```

## Artist

```ts
type Artist = {
  id: string;
  name: string;
  genres: string[];
  imageUrl?: string;
  popularity?: number;
};
```

## MusicSnapshot

```ts
type MusicSnapshot = {
  id: string;
  userId: string;
  createdAt: string;
  recentTracks: Track[];
  topTracks: Track[];
  topArtists: Artist[];
};
```

## VerdictScore

```ts
type VerdictScore = {
  key:
    | "auxRisk"
    | "sadnessIndex"
    | "repeatOffender"
    | "genreChaos"
    | "mainCharacterEnergy"
    | "npcScore";

  label: string;
  value: number;
  roast: string;
};
```

## Evidence

```ts
type Evidence = {
  id: string;
  label: string;
  text: string;
  severity: "low" | "medium" | "high" | "critical";
};
```

## Verdict

```ts
type Verdict = {
  id: string;
  userId: string;
  date: string;

  verdictLabel:
    | "GUILTY"
    | "SUSPICIOUS"
    | "AUX PROBATION"
    | "NOT GUILTY BUT WEIRD"
    | "REPEAT OFFENDER"
    | "GENRE CHAOS"
    | "MAIN CHARACTER FELONY";

  title: string;
  primaryCharge: string;
  sentence: string;

  rarity:
    | "Common"
    | "Uncommon"
    | "Rare"
    | "Epic"
    | "Legendary"
    | "Cursed"
    | "Divine"
    | "Illegal";

  raritySubtitle: string;

  scores: VerdictScore[];
  evidence: Evidence[];

  shareCaption: string;
  createdAt: string;
};
```

---

# 6. Frontend state model

Use Zustand or a similarly simple store.

## Auth state

```text
authStore
- user
- hasCompletedOnboarding
- spotifyConnected
- isDemoMode
- setUser()
- completeOnboarding()
- connectSpotifyDemo()
- disconnectSpotify()
```

## Trial state

```text
trialStore
- currentVerdict
- isGenerating
- generationStage
- error
- generateDemoVerdict()
- clearCurrentVerdict()
```

## History state

```text
historyStore
- verdicts
- addVerdict()
- getVerdictById()
- getTodayVerdict()
- getStreak()
- clearHistory()
```

## Settings state

```text
settingsStore
- hapticsEnabled
- soundEnabled
- theme
- watermarkEnabled
```

Persist simple app state locally.

Use secure storage only for future auth tokens. For MVP, local storage is enough for demo data.

---

# 7. App routing rules

## First launch

```text
Splash → Onboarding → Connect Spotify / Demo Trial
```

## Returning user with onboarding complete

```text
Splash → Trial tab
```

## User not connected to Spotify

Trial tab should show:

```text
Connect Spotify
Preview Demo Trial
```

## User in demo mode

Allow full trial generation using fake data.

Make demo mode feel real enough to test the product.

---

# 8. Demo mode requirements

Demo mode is essential.

The agent should implement a fully working app experience without backend/API.

## Demo data should include

Create realistic fake music data with:

* repeated sad songs
* gym songs
* mainstream songs
* chaotic genre variety
* top artists
* recent tracks
* suspicious replay behavior

## Demo verdict behavior

When user taps:

```text
Preview Demo Trial
```

or

```text
Put Me On Trial
```

the app should:

1. start loading sequence
2. run deterministic fake scoring
3. reveal a verdict
4. save it to local history
5. allow share card preview

Do not require network for demo mode.

---

# 9. Deterministic verdict logic for MVP

Until backend exists, verdicts should be generated locally from mock data.

Use a simple deterministic scoring engine.

## Inputs

```text
recentTracks
topTracks
topArtists
current date
random seed
```

## Scores

Generate these:

```text
auxRisk
sadnessIndex
repeatOffender
genreChaos
mainCharacterEnergy
npcScore
```

## Score range

Every score is:

```text
0–100
```

Clamp all scores.

## Aux Risk formula example

```text
auxRisk =
  0.30 * repeatOffender
+ 0.25 * genreChaos
+ 0.20 * sadnessIndex
+ 0.15 * npcScore
+ 0.10 * mainCharacterEnergy
```

## Repeat offender

Based on repeated track/artist counts.

High if same track appears many times.

## Genre chaos

High if many different genres appear.

## Sadness index

For demo mode, use predefined artist/track mood tags.

Example mood tags:

```text
sad
gym
party
chill
romantic
mainstream
chaotic
```

## NPC score

High if tracks/artists are marked mainstream/popular.

## Main character energy

High if music profile has dramatic, cinematic, emotional, or intense mood tags.

---

# 10. Verdict selection rules

Choose verdict label based on dominant score.

## Example mapping

```text
repeatOffender > 80
→ REPEAT OFFENDER

sadnessIndex > 75
→ EMOTIONALLY SUSPICIOUS

genreChaos > 75
→ GENRE CHAOS

auxRisk > 85
→ GUILTY

mainCharacterEnergy > 80
→ MAIN CHARACTER FELONY

npcScore > 80
→ NPC PLAYLIST DEPENDENCY

otherwise
→ NOT GUILTY BUT WEIRD
```

Since `NPC PLAYLIST DEPENDENCY` is not in the original verdict type list, either add it to the type or keep it as a charge instead of verdict label.

---

# 11. Rarity selection rules

Rarity should feel exciting but not random nonsense.

## Suggested distribution

```text
Common: 35%
Uncommon: 25%
Rare: 18%
Epic: 12%
Legendary: 5%
Cursed: 3%
Divine: 1%
Illegal: 1%
```

## But rarity should be influenced by scores

Examples:

```text
auxRisk > 90 and repeatOffender > 85
→ possible Illegal

sadnessIndex > 90
→ possible Cursed

mainCharacterEnergy > 92
→ possible Legendary

balanced high scores
→ possible Epic

low scores
→ Common or Uncommon
```

Rarity should reveal last.

It is a dopamine mechanic.

---

# 12. Copy generation without AI

All copy must come from templates.

Create copy banks.

## Charge templates

```text
Emotionally harassing the replay button.
Using music as a coping mechanism.
Being legally unfit to touch the aux.
Turning one artist into a personality trait.
Committing playlist identity fraud.
Playing the same song like it owes you money.
Creating unsafe conditions for the group chat.
Maintaining suspicious levels of main character energy.
```

## Sentence templates

```text
You are banned from the aux for 24 hours.
Touch grass before your next replay.
Make one normal playlist by tomorrow.
Explain your top artist to the group chat.
Listen to one happy song under supervision.
You must create a playlist that does not involve emotional damage.
The court recommends supervised shuffle mode.
```

## Evidence templates

```text
You played the same track {count} times recently.
Your top artist appeared in {percentage}% of recent listens.
Your genres changed direction {count} times.
Your listening history suggests a severe vibe swing.
Your replay behavior has exceeded legal limits.
Your aux behavior shows signs of emotional volatility.
```

## Share caption templates

```text
SongCourt put my Spotify on trial and I fear the court was right.
My Spotify history has been used against me.
I am no longer allowed near the aux.
This app exposed me legally.
The court has ruled. I am guilty.
```

---

# 13. Share feature requirements

The share feature should work in demo mode.

## MVP behavior

The app should allow the user to:

```text
View share card
Save image
Open native share sheet
Copy caption
```

Use `react-native-view-shot` or equivalent to capture the share card component.

## Share card requirements

Every share card should include:

* SongCourt logo/name
* user display name or “Defendant”
* verdict label
* Aux Risk score
* primary charge
* sentence
* rarity
* date
* small watermark

Premium/no-watermark can be added later.

## Share image format

Use vertical story format:

```text
1080 × 1920 equivalent ratio
```

Also design square preview later, but story format is priority.

---

# 14. Local persistence requirements

For MVP, save to local device storage:

```text
hasCompletedOnboarding
demoMode
user profile
verdict history
settings
```

History should survive app reload.

When user generates a verdict for today, prevent duplicate default generation unless user taps regenerate.

## Today behavior

If today’s verdict exists, Trial screen should show:

```text
Today’s verdict is ready.
View Verdict
Regenerate
```

Regenerate can create a new demo verdict and replace or append depending on implementation.

Simplest MVP:

```text
Regenerate replaces today’s verdict.
```

---

# 15. History behavior

History screen should be useful even with demo mode.

## Requirements

Show:

```text
Trial streak
Total verdicts
Highest aux risk
Most common verdict
Calendar/list of verdicts
```

If no verdicts:

```text
Your criminal record is clean.
Suspiciously clean.
```

Tapping a verdict opens detail screen.

---

# 16. Profile behavior

Profile can be simple in MVP.

## Show

```text
Display name
Spotify connection status
Demo mode status
Total trials
Highest Aux Risk
Settings
```

## Settings actions

Include:

```text
Toggle haptics
Toggle sound placeholder
Reset demo data
Clear verdict history
Disconnect Spotify/demo mode
View privacy placeholder
View terms placeholder
```

Do not build real legal pages yet, but provide screens/placeholders.

---

# 17. Spotify integration preparation

Do not implement real Spotify yet unless asked.

But prepare service boundaries.

## spotifyService should expose

```text
connect()
disconnect()
getCurrentUser()
getRecentlyPlayed()
getTopTracks()
getTopArtists()
refreshToken()
```

For MVP, these can return mock/demo data.

Later backend can replace these.

## Important architecture rule

Do not call Spotify directly from random components.

All Spotify-related logic should go through:

```text
services/spotifyService.ts
```

Components should not know whether data is real or fake.

---

# 18. Verdict service preparation

All verdict generation should go through:

```text
services/verdictService.ts
```

It should expose:

```text
generateVerdict(snapshot)
getTodayVerdict()
getVerdictHistory()
saveVerdict(verdict)
```

For MVP:

```text
generateVerdict()
```

can use local deterministic rules.

Later:

```text
generateVerdict()
```

can call backend.

---

# 19. Backend API placeholders

Do not build backend now, but design frontend as if these endpoints will exist later.

Expected future API shape:

```text
POST /auth/spotify/start
GET /auth/spotify/callback
GET /me
POST /trial/generate
GET /verdicts
GET /verdicts/:id
POST /share-card/render
```

Frontend should have an API client abstraction so this can be plugged in later.

---

# 20. Loading and async behavior

The loading sequence should last long enough to create anticipation.

Even if verdict generation is instant, fake the staged sequence.

## Suggested timing

```text
0.0s — Summoning the jury...
0.8s — Scanning replay crimes...
1.6s — Checking emotional damage...
2.4s — Measuring genre chaos...
3.2s — Preparing final verdict...
4.0s — The court has decided...
4.5s — Reveal
```

Do not make it longer than ~5 seconds.

Allow skipping only in development, not visible in production.

---

# 21. Haptics behavior

Use haptics only if enabled.

Moments:

```text
Main CTA tap → light
Loading stage change → subtle/light
Verdict reveal → heavy
Score count-up finished → medium
Rarity reveal → success/heavy
Share success → success
```

If haptics fail, silently ignore.

---

# 22. Accessibility requirements

Even though the app is visually intense, it must remain usable.

## Requirements

* All important buttons must have accessible labels.
* Text should have strong contrast.
* Do not rely only on color for severity.
* Respect reduce motion setting where possible.
* Share cards can be visually wild, but app navigation must remain readable.
* Tap targets should be large.
* Avoid tiny unreadable text except decorative fake legal text.

---

# 23. Performance requirements

The app should feel instant.

## Rules

* Avoid huge images.
* Avoid heavy animations on every screen.
* Use memoized components for animated cards if needed.
* Keep initial bundle reasonable.
* Do not load all history details if unnecessary.
* Do not block navigation on fake loading.
* Use skeleton/loading states.

---

# 24. Error handling rules

All errors should have branded copy but clear actions.

## Standard error object

```ts
type AppError = {
  code: string;
  title: string;
  message: string;
  actionLabel?: string;
};
```

## Error examples

### Spotify failed

```text
Title:
Spotify connection failed.

Message:
The court could not access the evidence.

Action:
Try Again
```

### No data

```text
Title:
The court needs more evidence.

Message:
Listen to a few more tracks and come back.

Action:
Refresh
```

### Share failed

```text
Title:
Share failed.

Message:
The verdict could not leave the courtroom.

Action:
Try Again
```

---

# 25. Empty state rules

Every empty state should be funny, not generic.

Use:

```text
No evidence yet.
Your criminal record is clean. Suspiciously clean.
No co-defendants yet.
The court is waiting.
```

Avoid:

```text
No data found.
Nothing here.
Error.
```

---

# 26. Analytics event plan

Do not implement full analytics unless asked, but prepare event names.

Future analytics events:

```text
app_opened
onboarding_started
onboarding_completed
spotify_connect_started
spotify_connect_completed
demo_trial_started
trial_generation_started
trial_generation_completed
verdict_revealed
share_card_opened
share_completed
history_opened
profile_opened
paywall_opened
premium_cta_clicked
```

Each event should later include:

```text
user_id
is_demo_mode
verdict_id
aux_risk_score
rarity
date
```

For now, a simple `analyticsService.track()` can log to console in development.

---

# 27. Legal/privacy placeholders

The app must not imply it posts to Spotify or social media.

Use clear trust copy:

```text
We never post without permission.
We use listening data only to generate your verdicts.
You can disconnect anytime.
```

Profile/settings should include placeholder links:

```text
Privacy Policy
Terms of Service
Delete Account
Disconnect Spotify
```

For MVP, these can open placeholder screens.

Do not collect unnecessary personal data.

---

# 28. App Store positioning

The app should be prepared for App Store screenshots and review.

## Category

Likely:

```text
Entertainment
```

or:

```text
Music
```

## App Store subtitle ideas

```text
Put your music taste on trial
```

```text
Your daily Spotify verdict
```

```text
Find your Aux Risk score
```

## App Store description style

Focus on:

* daily music verdicts
* aux risk score
* share cards
* music taste compatibility
* funny entertainment

Avoid saying:

```text
roast
insult
shame
diagnose
mental health
addiction
```

Use safer words:

```text
funny
playful
dramatic
meme-style
entertainment
```

---

# 29. Safety/content rules

The app can be funny but should not be cruel.

## Avoid

* mental health diagnoses
* body-related jokes
* sexuality assumptions
* race/religion/politics
* direct insults
* harassment language
* addiction accusations
* self-harm references
* calling user “depressed” as a factual statement

## Prefer

```text
emotionally suspicious
main character energy
aux probation
replay crime
vibe swing
playlist chaos
```

Instead of:

```text
you are mentally ill
you are depressed
you are pathetic
```

The tone is theatrical and funny, not harmful.

---

# 30. Quality bar

The first version should not feel like a generic Expo starter app.

Before considering the task done, ensure:

* app has coherent visual identity
* onboarding works
* demo mode works end-to-end
* trial generation works
* reveal animation works
* verdict screen feels rewarding
* share card preview works
* history persists locally
* no TypeScript errors
* no dead buttons
* no placeholder text visible unless intentionally marked
* navigation is smooth
* app can be demoed in under 60 seconds

---

# 31. Development sequence for Codex Agent

Build in this order.

## Phase 1 — Project foundation

1. Create Expo + TypeScript app.
2. Set up routing.
3. Add global constants.
4. Add base components.
5. Add navigation shell.
6. Add local state stores.

## Phase 2 — Static screens

1. Splash
2. Onboarding
3. Connect screen
4. Trial home
5. History
6. Profile

Use mock data.

## Phase 3 — Demo verdict engine

1. Add demo tracks/artists.
2. Add scoring utilities.
3. Add verdict generation service.
4. Add copy template selection.
5. Save generated verdict to local history.

## Phase 4 — Dopamine flow

1. Trial loading sequence.
2. Verdict reveal screen.
3. Score animations.
4. Rarity reveal.
5. Haptics.

## Phase 5 — Share system

1. Build share card component.
2. Add share card carousel.
3. Add native share sheet.
4. Add save image if possible.
5. Add copy caption.

## Phase 6 — Polish

1. Empty states.
2. Error states.
3. Accessibility labels.
4. Smooth transitions.
5. App icon placeholder.
6. App Store screenshot-ready screens.

---

# 32. Acceptance tests

The app is acceptable when the following flows work.

## Flow 1 — First launch demo

```text
Open app
Complete onboarding
Tap Preview Demo Trial
See loading sequence
See verdict reveal
Open share card
Return to trial
Open history
See verdict saved
```

## Flow 2 — Returning user

```text
Close app
Reopen app
Skip onboarding automatically
Land on Trial tab
See today’s verdict or CTA
Open history
View previous verdict
```

## Flow 3 — Clear data

```text
Go to Profile
Clear verdict history
Return to History
See clean empty state
```

## Flow 4 — Share

```text
Generate verdict
Open share card
Tap Share
Native share sheet opens
Caption is available
```

## Flow 5 — Demo Spotify connection

```text
Go to Connect Spotify
Tap demo connection
App marks Spotify/demo as connected
Trial tab becomes available
```

---

# 33. Copy bank

Use these in the app.

## Main CTA

```text
PUT ME ON TRIAL
OPEN TODAY’S CASE
REVEAL VERDICT
CREATE SHARE CARD
SHARE MY VERDICT
VIEW CRIMINAL RECORD
```

## Loading copy

```text
Summoning the jury...
Scanning replay crimes...
Checking emotional damage...
Measuring genre chaos...
Inspecting repeat behavior...
Calculating aux risk...
Preparing final verdict...
The court has decided...
```

## Verdict labels

```text
GUILTY
SUSPICIOUS
AUX PROBATION
NOT GUILTY BUT WEIRD
REPEAT OFFENDER
GENRE CHAOS
MAIN CHARACTER FELONY
NPC PLAYLIST DEPENDENCY
```

## Score labels

```text
Aux Risk
Sadness Index
Repeat Offender
Genre Chaos
Main Character Energy
NPC Score
```

## Severity labels

```text
Safe
Mildly Suspicious
Questionable
Dangerous
Illegal Aux Behavior
```

## Empty states

```text
No evidence yet.
Connect Spotify so the court can begin.

Your criminal record is clean.
Suspiciously clean.

No co-defendants yet.
Invite someone and test your aux compatibility.

The court needs more evidence.
Listen to a few more tracks and come back.
```

---

# 34. Product expansion hooks

Do not build these yet, but structure code so they are easy later.

## Future features

```text
Real Spotify OAuth
Apple Music integration
Friend compatibility
Monthly music criminal record
Yearly wrapped-style report
Push notifications
Premium share card themes
No-watermark premium
Leaderboard
Private friend groups
Widgets
```

The current frontend should not block these later.

---

# 35. Final instruction to Codex Agent

Build the MVP as a **fully demoable entertainment app**, not a placeholder prototype.

The app should work end-to-end with local demo data.

The most important parts are:

1. The trial flow must feel exciting.
2. The verdict reveal must feel rewarding.
3. The share card must look viral.
4. The app must be modular for real backend/Spotify integration later.
5. The app must be polished enough to record a launch demo video.

The final MVP should let someone open the app and immediately understand:

```text
This app puts my Spotify history on trial.
I want to know my score.
I want to share the result.
```
