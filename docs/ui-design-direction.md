# SongCourt UI Design Direction

SongCourt is being rebuilt from a backend-only reset. This document is the first frontend design source of truth.

## North Star

SongCourt should feel like a premium music judgment product:

- clean enough to trust with Spotify data,
- dramatic enough to make a verdict feel earned,
- funny enough to share,
- minimal enough to avoid looking like a novelty app.

The app UI should be calm and professional. The result reveal and share cards should carry the dopamine.

## Design Thesis

The old direction made too many screens feel like posters. The new direction should separate the product layers:

1. **App Shell**: restrained, readable, iOS-native, low-noise.
2. **Verdict Moment**: theatrical, animated, rewarding.
3. **Share Artifact**: bold, collectible, social-first.

The share card is the viral object. The app exists to create, explain, and remix that object.

## Visual Positioning

Use this blend:

- Spotify Wrapped-style personal data story.
- Premium editorial iOS app.
- Playful courtroom parody.
- Music personality test.
- Collectible social poster.

Do not default back to dark neon. Dark can be used, but only if the whole system still feels premium, minimal, and controlled.

## Selected Direction

The chosen direction is a deliberate hybrid:

1. **Editorial Court for the app shell**
   - Use for Splash, Onboarding, Connect Spotify, Trial Home, History, Profile, and most navigational UI.
   - The shell should feel calm, premium, readable, trustworthy, and iOS-native.
   - Lean on warm off-white, ink black, courtroom red, subtle paper texture, clean hierarchy, and restrained controls.

2. **Pop Verdict for the reward/share layer**
   - Use for Verdict Result, Reveal Sequence, Share Creator, and all exported share cards.
   - The reward layer should feel colorful, dopamine-heavy, social-first, and instantly postable.
   - Use bold accent fields, large numbers, playful verdict typography, crisp data graphics, and template-specific color systems.

This hybrid is the product rule: **calm app, loud artifact**.

Luxury Evidence can remain a reference for restraint, spacing, and premium finish, but it is not the primary direction.

## Core Principles

### 1. Share-Card-First

Design the share cards before building app screens.

Every share card must communicate within two seconds:

- verdict,
- score,
- funniest charge,
- proof/evidence,
- SongCourt identity.

If the card is not desirable to post, the app is not done.

### 2. Calm App, Loud Artifact

Most screens should be visually quiet:

- clear hierarchy,
- generous spacing,
- readable typography,
- few competing accents,
- native-feeling controls.

The share cards and reveal sequence can be louder because they are the reward.

### 3. Personal Data Must Feel Designed

Stats cannot look like a dashboard dump. Each stat should feel like part of a story:

- "Replay Crime"
- "Artist Dependency"
- "Genre Whiplash"
- "Night Court"
- "Mainstream Liability"
- "Mood Swing"

Use court-language framing, but keep the data clear.

### 4. Funny, Not Cruel

Tone should be savage but not mean.

Good:

- "Repeat Offender"
- "Aux Menace"
- "Sad Hours Witness"
- "Guilty of skipping bangers"

Avoid:

- body-shaming,
- personal insults,
- fake social humiliation,
- claims that imply real global ranking without data.

### 5. Minimal Does Not Mean Empty

Minimal means every element earns its place.

The UI can still have:

- tactile paper/vinyl texture,
- stamps,
- badges,
- score meters,
- animated reveals,
- collectible cards.

But those elements should be composed with restraint.

## Product Surfaces

### Splash / Intro

Goal: premium first impression.

- Strong SongCourt brand.
- One short line of value.
- No long explanation.
- Should feel like entering a product, not seeing a poster ad.

### Onboarding

Goal: fast trust and motivation.

- 2-3 screens maximum.
- Explain what Spotify data is used for.
- Show the emotional payoff: verdict + share card.
- Keep copy short.

### Connect Spotify

Goal: trust.

- Clear Spotify connection CTA.
- Plain privacy copy.
- Show what is read and what is not done.
- Avoid looking sketchy or over-designed.

### Trial Home

Goal: make daily return obvious.

- Today's trial status.
- Streak and rank progress.
- Yesterday verdict teaser.
- One primary CTA.
- Minimal secondary actions.

### Loading Scanner

Goal: suspense.

- The scan should feel like evidence processing.
- Use staged progress labels.
- Add haptics sparingly.
- Keep it under control; no chaotic effects.

### Verdict Result

Goal: dopamine.

Reveal sequence:

1. gavel hit,
2. verdict stamp,
3. Aux Risk count-up,
4. badge unlock,
5. daily challenge,
6. primary Share Verdict CTA.

The result screen should not become a stats wall. It should show a strong verdict first, then evidence below.

### Share Creator

Goal: the main product moment.

- Preview should dominate the screen.
- Template controls should be simple and tactile.
- Export size should be obvious internally, not necessarily exposed to users.
- Share CTA must always be reachable.
- Watermark toggle can exist, but should not distract.

### Case Archive

Goal: proof of progression.

- Past verdicts.
- Streak strip.
- Best/worst case highlights.
- Badge archive.
- Re-share action for old verdicts.

### Profile

Goal: trust and ownership.

- Spotify connection state.
- Data/privacy controls.
- Rank/badge shelf.
- Settings only where useful.

## Share Card System

### Required Formats

1. **Verdict Poster**
   - Most dramatic.
   - Huge verdict stamp.
   - Big Aux Risk score.
   - One hilarious charge.
   - Best for Instagram/TikTok stories.

2. **Court Receipt**
   - Compact and clever.
   - Evidence list.
   - Score and rank.
   - Feels like something users can send in group chats.

3. **Music DNA**
   - Clean data story.
   - More Spotify Wrapped-adjacent.
   - Uses charts, labels, and personality traits.

4. **Tag A Friend**
   - Challenge format.
   - Built around "who gave me the aux?"
   - Should encourage direct sharing.

### Export Sizes

- Story: `1080x1920`
- Feed portrait: `1080x1350`
- Square fallback: `1080x1080`

### Share Card Composition Rules

- One dominant message.
- One dominant number.
- 2-4 evidence details maximum.
- Strong brand presence, but not logo spam.
- Text must remain legible after social compression.
- No tiny UI chrome.
- No screenshot-looking cards.

## Design System Direction

### Direction Split

The base product UI and exported social cards should not use exactly the same intensity.

- App shell: Editorial Court.
- Result reveal: Editorial Court structure with Pop Verdict reward effects.
- Share cards: Pop Verdict as primary, with Editorial Court cleanliness.
- Profile/settings/privacy: Editorial Court only.

### Palette

Start from a neutral premium base:

- near-black ink,
- warm off-white,
- courtroom red,
- paper beige,
- metallic charcoal.

Use one accent per verdict or card:

- acid green,
- electric blue,
- royal purple,
- gold,
- hot pink.

Avoid making the whole app one hue family.

### Typography

- Primary UI: system font / SF Pro style.
- Data labels: compact, high-legibility sans.
- Verdict stamps: expressive display type, used sparingly.
- Body copy must stay clean and readable.

Do not use decorative/gothic type for normal UI text.

### Shape And Layout

- Cards: 8-12px radius.
- Buttons: solid, high-contrast, native-feeling.
- Controls: segmented controls, toggles, chips, icon buttons.
- App spacing: consistent 8px grid.
- Share cards may use poster composition and custom shapes.

### Texture

Texture should be mostly asset-level, not everywhere.

Good texture use:

- share card background,
- verdict stamp,
- evidence paper,
- receipt template,
- badge art.

Bad texture use:

- every screen background,
- every card,
- body text areas,
- all navigation surfaces.

## Motion Direction

Use motion for reward and clarity:

- count-up score,
- stamp impact,
- badge unlock,
- subtle card lift,
- progress scanner,
- haptic confirmation.

Avoid:

- constant glow loops,
- excessive confetti,
- moving backgrounds on every screen,
- blocking animations that delay sharing.

## Imagegen Workflow

Use imagegen / ChatGPT Images v2 heavily for art direction, but not as final UI code.

Imagegen should produce:

- premium moodboards,
- share card concepts,
- texture packs,
- badge/stamp art,
- selected marketing/app-store visuals,
- visual references for screens.

Actual app UI should be implemented manually in React Native so it supports real layout, accessibility, dynamic text, safe areas, and export logic.

## Prompt Quality Bar

Important prompts must include:

- use case,
- target asset,
- exact size,
- visual goal,
- layout hierarchy,
- typography direction,
- color palette,
- texture/material notes,
- exact text if required,
- what must be left blank for dynamic text,
- constraints,
- avoid list.

Do not use vague prompts such as "make a premium app design."

## First Imagegen Batch

The first imagegen batch should create 3 distinct art directions, not final assets:

1. **Editorial Court**
   - clean, warm, paper, legal-document inspired,
   - premium magazine/data-story feel,
   - best for trust and App Store polish.

2. **Pop Verdict**
   - colorful, high dopamine, social-card-first,
   - closer to Spotify Wrapped energy,
   - best for virality.

3. **Luxury Evidence**
   - black/off-white/red/gold,
   - minimal, cinematic, sharp,
   - best for premium brand feel.

Each direction should include:

- one splash reference,
- one result reference,
- one `1080x1920` verdict poster reference,
- one `1080x1350` receipt/DNA card reference,
- palette and component hints.

## Anti-Goals

- Do not rebuild the old UI.
- Do not let generated images dictate unusable app layouts.
- Do not make the app look like a casino.
- Do not make every screen dark neon.
- Do not create fake social claims or fake global percentile claims.
- Do not bury the share action.
- Do not build a complex social system before the share loop is excellent.

## Next Step

Create focused share-card concepts for the selected hybrid direction:

1. `Verdict Poster` at `1080x1920`.
2. `Court Receipt` at `1080x1350`.
3. `Music DNA` at `1080x1920`.
4. `Tag A Friend` at `1080x1920`.

After reviewing those concepts, define the share-card layout system before frontend scaffolding.
