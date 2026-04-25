
# SongCourt — Frontend/UI/UX Design Brief for Codex Agent

## Product concept

**SongCourt** is a dopamine-heavy music personality app.

The user connects Spotify. The app analyzes their listening history and puts them “on trial” with funny scores, charges, evidence, and shareable verdict cards.

Core feeling:

> “My music taste just got exposed, and I need to share this.”

The app should feel like a mix of:

* **neon nightclub**
* **courtroom drama**
* **Spotify Wrapped**
* **meme generator**
* **arcade reward machine**

No AI branding. No chatbot feeling. No productivity feeling.

---

# 1. Design identity

## Visual theme

**Neon Courtroom / Underground Music Tribunal**

The app should not look like a clean SaaS dashboard. It should feel dramatic, guilty, addictive, funny, and slightly chaotic.

Think:

* black glass background
* neon green / purple / red accents
* glowing court stamps
* fake legal documents
* audio waveform elements
* verdict cards
* “guilty” stamps
* scoreboard UI
* ticket / receipt textures
* animated gavel hits
* music equalizer bars
* court evidence folders

The vibe should be:

> “Spotify Wrapped got arrested.”

---

# 2. Color system

Use a dark-first design.

## Main colors

| Purpose            | Color     |
| ------------------ | --------- |
| Background         | `#07070F` |
| Deep card          | `#11111D` |
| Raised card        | `#181827` |
| Border             | `#2A2A3D` |
| Primary neon green | `#B6FF3B` |
| Electric purple    | `#8B5CF6` |
| Hot pink           | `#FF3EA5` |
| Danger red         | `#FF355E` |
| Warning yellow     | `#FFB000` |
| Court paper cream  | `#FFF4D6` |
| Main text          | `#F8F7FF` |
| Muted text         | `#9B9BAE` |

## Feeling

The home screen should be dark and glossy.

The verdict/share cards can switch between dark neon and cream paper styles.

Use color emotionally:

* green = score / reward / premium glow
* red = guilty / charge / danger
* yellow = evidence / warning
* purple = mystery / rarity
* pink = chaos / meme energy

---

# 3. Typography

Use bold typography. The app should feel loud.

## Suggested font roles

| Role            | Font style                  |
| --------------- | --------------------------- |
| Big headlines   | condensed bold display font |
| Scores          | big rounded numeric font    |
| Body            | clean sans-serif            |
| Court labels    | mono / stamped style        |
| Receipt details | mono font                   |

## Typography rules

* Scores should be huge.
* Verdict words should be massive.
* Labels should be uppercase.
* Avoid long paragraphs.
* Use short, punchy, memeable text.

Example hierarchy:

```text
AUX RISK
87
HIGHLY ILLEGAL
```

The number should dominate the screen.

---

# 4. Core emotional loop

Every session should follow this dopamine pattern:

## 1. Anticipation

The user taps:

> **Put Me On Trial**

Then they see a dramatic loading sequence.

Example loading lines:

* “Summoning the music jury…”
* “Checking replay crimes…”
* “Measuring aux instability…”
* “Inspecting emotional damage…”
* “Preparing the verdict…”

## 2. Reveal

The app reveals the verdict with a strong visual moment:

* screen shake
* gavel slam
* bright red “GUILTY” stamp
* haptic feedback
* confetti or neon particles
* dramatic soundless courtroom energy

## 3. Reward

The user sees:

* big score
* verdict
* charge
* evidence
* sentence
* rarity badge

## 4. Share

The share card should look so funny and premium that the user wants to post it.

## 5. Return

Daily verdict, streak, history calendar, friend compatibility.

---

# 5. Navigation structure

Use a bottom tab bar with 4 tabs.

## Tabs

### 1. **Trial**

Main daily verdict generation.

### 2. **History**

Past verdicts, streaks, calendar.

### 3. **Friends**

Aux compatibility and invites.

### 4. **Profile**

Account, Spotify connection, settings, premium.

Bottom tab should be custom, not default-looking.

It should look like a dark floating dock with glowing active tab.

---

# 6. App screens

## Screen 1 — Splash screen

### Purpose

Immediate brand impact.

### Layout

Dark background.

Center:

```text
SONGCOURT
```

Under it:

```text
Your music taste is under investigation.
```

Visuals:

* subtle equalizer bars behind logo
* neon gavel icon
* pulsing green/purple glow
* tiny “case file loading” text

Animation:

* logo fades in
* gavel icon drops slightly
* background equalizer pulses

Duration:

* 1.5–2 seconds max

---

## Screen 2 — Onboarding

### Goal

Explain the app in 3 fast screens.

Do not over-explain. Make it memeable.

---

### Onboarding page 1

Headline:

```text
Your music taste has been reported.
```

Subtext:

```text
SongCourt checks your listening history and delivers a daily verdict.
```

Visual:

* court file labeled “AUX CRIMES”
* glowing music notes as evidence

CTA:

```text
Next
```

---

### Onboarding page 2

Headline:

```text
Get your Aux Risk score.
```

Subtext:

```text
Sad repeats, genre chaos, guilty artists, and suspicious behavior.
```

Visual:

* big gauge from 0 to 100
* needle pointing to “Illegal”

CTA:

```text
Next
```

---

### Onboarding page 3

Headline:

```text
Share the verdict.
```

Subtext:

```text
Post your daily trial card and compare with friends.
```

Visual:

* vertical share card mockup
* “GUILTY” stamp

CTA:

```text
Connect Spotify
```

---

## Screen 3 — Spotify connection screen

### Goal

Make Spotify login feel like joining the trial.

### Layout

Top:

```text
CASE FILE REQUIRED
```

Main card:

```text
Connect Spotify to begin your trial.
```

Small trust text:

```text
We use your listening data to calculate verdicts, scores, and compatibility.
We never post without permission.
```

CTA:

```text
Connect Spotify
```

Secondary:

```text
Preview Demo Trial
```

The demo trial is very important. It lets users experience the dopamine before connecting.

### Visuals

* dark courtroom background
* Spotify green button
* fake court document behind the card
* small lock icon for trust

---

# 7. Main screen — Trial tab

This is the most important screen.

## Default state: user has not generated today’s verdict

### Top area

Small header:

```text
TODAY’S CASE
```

Big headline:

```text
Are you guilty today?
```

Subtext:

```text
Your recent listening history is ready for trial.
```

### Main CTA

Huge button:

```text
PUT ME ON TRIAL
```

Button style:

* full width
* neon green
* thick black text
* glowing shadow
* slight pulsing effect
* small gavel icon

### Below CTA

Three mini stat teasers:

```text
Recent tracks loaded
Top artists ready
Replay behavior detected
```

These should have checkmarks and small glowing chips.

### Bottom teaser card

```text
Yesterday’s verdict:
AUX RISK 73 — Emotionally Suspicious
```

Tapping it opens yesterday’s verdict.

---

## Loading state — Trial generation

This should be very dopamine-rich.

### Visual

Full-screen animated “court scanner.”

Elements:

* rotating evidence cards
* equalizer bars
* loading progress
* fake legal text scrolling
* glowing fingerprint / vinyl disc
* gavel silhouette

### Loading copy sequence

Cycle through lines:

```text
Summoning the jury...
Scanning replay crimes...
Checking emotional damage...
Measuring genre chaos...
Calculating aux risk...
Preparing final verdict...
```

### Progress states

Use staged progress:

1. `Case opened`
2. `Evidence collected`
3. `Jury suspicious`
4. `Verdict sealed`

### Final moment

Before result:

Screen goes dark.

Then:

```text
THE COURT HAS DECIDED
```

Then gavel slam.

Then reveal.

---

# 8. Verdict result screen

This is the heart of the app.

The result screen should feel like a **reward machine**.

## Layout

### Top

Small label:

```text
SONGCOURT DAILY VERDICT
```

Date:

```text
April 25, 2026
```

### Main verdict card

Large card with:

```text
VERDICT
GUILTY
```

or:

```text
VERDICT
SUSPICIOUS
```

or:

```text
VERDICT
AUX PROBATION
```

The verdict word should be huge.

Use a stamped effect.

Possible verdicts:

* `GUILTY`
* `NOT GUILTY BUT WEIRD`
* `AUX PROBATION`
* `EMOTIONALLY SUSPICIOUS`
* `REPEAT OFFENDER`
* `GENRE CHAOS`
* `MAIN CHARACTER FELONY`
* `NPC PLAYLIST DEPENDENCY`
* `GYM ARC VIOLATION`

---

## Score section

Display 3–5 scores.

### Primary score

```text
AUX RISK
87 / 100
```

Show as:

* huge number
* circular gauge or vertical meter
* glowing color based on severity

Severity labels:

|  Score | Label                |
| -----: | -------------------- |
|   0–20 | Safe                 |
|  21–40 | Mildly Suspicious    |
|  41–60 | Questionable         |
|  61–80 | Dangerous            |
| 81–100 | Illegal Aux Behavior |

---

## Secondary scores

Cards in a 2x2 grid:

```text
Sadness Index
72

Repeat Offender
91

Genre Chaos
43

Main Character Energy
88
```

Each score card should have:

* icon
* number
* short label
* tiny one-line roast

Example:

```text
Repeat Offender
91
“One song is fighting for its life.”
```

---

# 9. Evidence section

After the score reveal, show evidence.

## Title

```text
EVIDENCE SUBMITTED
```

Use stacked evidence cards.

Each evidence card should look like a court exhibit.

Example:

```text
EXHIBIT A
You played the same track 9 times in 48 hours.
```

```text
EXHIBIT B
Your top artist appeared in 38% of recent listens.
```

```text
EXHIBIT C
Your genre shift from gym music to sad music was legally concerning.
```

### Design

* cream paper or dark cards
* red exhibit labels
* subtle paper texture
* small torn-ticket shape
* stamp icons

---

# 10. Charge section

This should be funny and shareable.

## Title

```text
PRIMARY CHARGE
```

Examples:

```text
Emotionally harassing the replay button.
```

```text
Using music as a coping mechanism.
```

```text
Being legally unfit to touch the aux.
```

```text
Committing playlist identity fraud.
```

```text
Turning one artist into a personality trait.
```

Design:

* large quote-style card
* red border
* “CHARGE FILED” stamp

---

# 11. Sentence section

## Title

```text
SENTENCE
```

Examples:

```text
You are banned from the aux for 24 hours.
```

```text
Touch grass before your next replay.
```

```text
Make one normal playlist by tomorrow.
```

```text
You must explain your top artist to the group chat.
```

```text
Listen to one happy song under supervision.
```

Design:

* judge-style card
* gavel icon
* yellow warning highlight

---

# 12. Rarity system

This is important for dopamine.

Every verdict should have a rarity.

## Rarity levels

| Rarity    | Style       |
| --------- | ----------- |
| Common    | gray/white  |
| Uncommon  | green       |
| Rare      | blue/purple |
| Epic      | purple/pink |
| Legendary | gold        |
| Cursed    | red/black   |
| Divine    | white/gold  |
| Illegal   | red neon    |

Examples:

```text
RARITY
Epic — 3 AM Main Character Build
```

```text
RARITY
Cursed — Replay Button Abuser
```

```text
RARITY
Legendary — Aux Villain Arc
```

### Visual

* rarity badge should animate
* shimmer effect for Epic/Legendary
* red glitch for Cursed
* gold glow for Legendary

---

# 13. Share card screen

This is the most important growth mechanism.

After verdict, show:

```text
Create Share Card
```

The user can choose between multiple card styles.

## Share card formats

### Format 1 — Dark Neon Court

Best default.

Contains:

```text
SONGCOURT
AUX RISK: 87
VERDICT: GUILTY
CHARGE: Emotionally harassing the replay button
SENTENCE: Touch grass for 30 minutes
RARITY: Epic
```

Visual:

* black background
* green/purple neon
* red guilty stamp
* waveform lines

---

### Format 2 — Court Receipt

Looks like a printed receipt.

Contains:

```text
SONGCOURT RECEIPT

Defendant: Melih
Aux Risk: 87
Sadness Index: 72
Repeat Offender: 91

Charge:
Replay button abuse

Verdict:
GUILTY
```

Visual:

* cream receipt paper
* mono font
* barcode
* fake case number
* red stamp

---

### Format 3 — Mugshot Poster

Looks like a music criminal poster.

Contains:

```text
WANTED FOR AUX CRIMES
Melih
Repeat Offender Score: 91
Last seen playing the same song again.
```

Visual:

* dark poster
* fake height lines
* bold warning typography
* red/pink glow

---

### Format 4 — Minimal flex card

Clean, stylish, less meme-heavy.

Contains:

```text
AUX RISK 87
Emotionally Suspicious
```

Visual:

* minimal black background
* single huge number
* small SongCourt logo

---

## Share card UX

After verdict, show a horizontal carousel of card styles.

Buttons:

```text
Share
Save Image
Copy Caption
```

Default generated caption:

```text
SongCourt put my Spotify on trial and I fear the court was right.
```

Other captions:

```text
I am no longer allowed near the aux.
```

```text
My Spotify history has been used against me.
```

```text
This app exposed me legally.
```

---

# 14. History tab

## Purpose

Retention. Users should want to build a criminal record.

## Header

```text
YOUR MUSIC CRIMINAL RECORD
```

Subtext:

```text
Every verdict you survived.
```

## Main elements

### Streak card

```text
Trial Streak
7 days
```

Mini copy:

```text
The court appreciates consistency.
```

### Calendar grid

Each day has a colored dot:

* green = safe
* yellow = suspicious
* red = guilty
* purple = cursed/legendary

Tapping a day opens that verdict.

### Monthly summary card

```text
April Summary
Highest Aux Risk: 92
Most Common Charge: Repeat Offender
Worst Day: April 19
Best Rarity: Legendary
```

### Criminal record timeline

Vertical list:

```text
April 25
GUILTY — Aux Risk 87

April 24
SUSPICIOUS — Sadness Index 74

April 23
AUX PROBATION — Genre Chaos 66
```

Each item should be tappable.

---

# 15. Friends tab

This should be in V1.5 if too much for initial MVP, but design it now.

## Main feature: Aux Compatibility

Header:

```text
AUX COMPATIBILITY COURT
```

Subtext:

```text
See if your music taste can survive a car ride together.
```

CTA:

```text
Invite a Friend
```

## Empty state

```text
No friends on trial yet.
Send an invite and test your aux chemistry.
```

Visual:

* two profile silhouettes
* crossed aux cables
* courtroom seal

---

## Compatibility result screen

When two users connect:

```text
Melih × Eren
AUX COMPATIBILITY
34%
```

Verdict:

```text
You can survive a 12-minute Uber, but not a road trip.
```

Conflict cards:

```text
Melih: emotional damage
Eren: gym PR mode
```

```text
Shared artist overlap: 12%
Genre conflict: severe
Replay behavior: both guilty
```

CTA:

```text
Share Compatibility
```

Possible compatibility labels:

|  Score | Label              |
| -----: | ------------------ |
|   0–20 | Aux Disaster       |
|  21–40 | Short Ride Only    |
|  41–60 | Negotiable         |
|  61–80 | Road Trip Safe     |
| 81–100 | Playlist Soulmates |

---

# 16. Profile tab

## Header

Show user avatar/name from Spotify.

```text
Melih
Spotify connected
```

## Stats

```text
Total Trials: 18
Highest Aux Risk: 94
Most Common Verdict: Guilty
Best Rarity: Legendary
```

## Sections

### Account

* Spotify connection
* Privacy
* Notifications

### Premium

* Upgrade
* Restore purchases

### App

* Theme
* Share watermark toggle for premium
* Contact
* Terms
* Delete account

---

# 17. Premium/paywall design

The paywall should feel like unlocking “illegal court powers,” not boring SaaS.

## Paywall headline

```text
UNLOCK FULL COURT ACCESS
```

Subtext:

```text
More verdicts, better share cards, deeper stats, and no watermark.
```

## Premium features

```text
Unlimited trials
Premium share card styles
No watermark
Monthly criminal record
Friend compatibility boosts
Rare verdict themes
```

CTA:

```text
Unlock SongCourt+
```

Secondary:

```text
Maybe later
```

Design:

* gold/purple glow
* premium court seal
* animated rarity badge
* “Legendary” shimmer

---

# 18. Notification design

Notifications should feel like the app is summoning the user to court.

Examples:

```text
The court is in session. Your daily verdict is ready.
```

```text
Your Spotify history has new evidence.
```

```text
You played that song again. The court noticed.
```

```text
Your aux risk may have changed overnight.
```

```text
You are one trial away from a 7-day criminal record.
```

Do not make notifications generic.

---

# 19. Microcopy style

The writing must be the product.

Use short, funny, dramatic phrases.

## Voice

* theatrical
* internet-native
* slightly accusatory
* never cruel
* never too long
* never corporate

## Good examples

```text
The court has concerns.
```

```text
Your replay button needs legal protection.
```

```text
This playlist has emotional evidence.
```

```text
You are not beating the allegations.
```

```text
The aux cable has requested distance.
```

## Avoid

* boring analytics copy
* “Here are your insights”
* “Your data has been processed”
* long explanations
* therapy/medical language
* offensive personal judgments

---

# 20. Motion design

Motion is critical for dopamine.

## Required animations

### Button press

The main CTA should compress slightly and glow.

### Loading scanner

Evidence cards flip / rotate.

### Gavel slam reveal

Before showing verdict:

* screen darkens
* gavel shadow drops
* shake
* “GUILTY” stamp slams onto card

### Score count-up

Scores animate from 0 to final number.

### Rarity reveal

Rarity badge appears last.

For high rarity:

* shimmer
* particles
* slight haptic feedback

### Share card carousel

Cards should slide smoothly with depth/parallax.

---

# 21. Haptics

Use haptics carefully.

## Haptic moments

| Moment              | Haptic          |
| ------------------- | --------------- |
| Tap main CTA        | light           |
| Evidence loaded     | light           |
| Verdict reveal      | heavy           |
| Score reaches final | medium          |
| Legendary rarity    | heavy + success |
| Share completed     | success         |

Do not overuse.

---

# 22. Sound

V1 can be silent, but design should support optional sound later.

Potential sound moments:

* gavel hit
* paper receipt print
* stamp slam
* rarity sparkle

Default sound should be off or very subtle.

---

# 23. Main component system

Codex should design reusable UI components.

## Components

### `CourtCard`

Used for major sections.

Style:

* dark background
* border
* inner glow
* rounded corners
* optional paper mode

### `ScoreGauge`

Used for Aux Risk.

Features:

* animated score
* severity color
* label
* short roast

### `EvidenceCard`

Used for exhibits.

Contains:

* exhibit label
* evidence text
* optional icon

### `VerdictStamp`

Large stamped text.

States:

* Guilty
* Suspicious
* Probation
* Not Guilty But Weird

### `RarityBadge`

Rarity chip with animation.

### `ShareCardPreview`

Vertical card preview.

### `NeonButton`

Primary button.

### `SecondaryButton`

Dark outlined button.

### `BottomCourtTabs`

Custom tab bar.

---

# 24. Empty states

Make empty states funny.

## No Spotify connected

```text
No evidence yet.
Connect Spotify so the court can begin.
```

## No history

```text
Your criminal record is clean.
Suspiciously clean.
```

## No friends

```text
No co-defendants yet.
Invite someone and test your aux compatibility.
```

## Failed data fetch

```text
The evidence room is locked.
Try again in a moment.
```

## Not enough listening data

```text
The court needs more evidence.
Listen to a few more tracks and come back.
```

---

# 25. Error states

Keep errors in brand voice but still clear.

## Spotify auth failed

```text
Spotify connection failed.
The court could not access the evidence.
```

CTA:

```text
Try Again
```

## Network error

```text
The courtroom Wi-Fi collapsed.
Check your connection and retry.
```

## API limit/error

```text
The evidence clerk is overloaded.
Try again soon.
```

## Permission issue

```text
The court needs listening history permission to continue.
```

---

# 26. First-run demo mode

Very important.

Before the user connects Spotify, allow:

```text
Preview Demo Trial
```

This opens a fake verdict using sample data.

Why?

Because the user should feel the reward before doing OAuth.

Demo verdict example:

```text
VERDICT
GUILTY

AUX RISK
86

CHARGE
Playing breakup music like rent was due.

SENTENCE
You are banned from the aux until you explain yourself.
```

At the bottom:

```text
Want your real verdict?
Connect Spotify
```

---

# 27. App Store screenshots concept

Design the UI so screenshots are easy.

## Screenshot 1

Headline:

```text
Put your Spotify on trial.
```

Visual:

* main verdict card
* huge “GUILTY”

## Screenshot 2

Headline:

```text
Find your Aux Risk score.
```

Visual:

* score gauge 87/100

## Screenshot 3

Headline:

```text
Collect daily verdicts.
```

Visual:

* history calendar

## Screenshot 4

Headline:

```text
Compare with friends.
```

Visual:

* compatibility report

## Screenshot 5

Headline:

```text
Share your music crimes.
```

Visual:

* share card carousel

---

# 28. MVP frontend scope

For first build, do **not** overbuild.

## Must build

* Splash screen
* Onboarding
* Spotify connection screen
* Trial home screen
* Loading animation
* Verdict result screen
* Evidence section
* Share card preview
* History empty state
* Profile/settings basic screen
* Demo trial mode

## Can wait

* full friend system
* leaderboard
* premium implementation
* Apple Music
* comments/feed
* advanced monthly reports

The MVP should already feel viral with only:

> Connect Spotify → generate verdict → share card.

---

# 29. UX flow

## First-time user

1. Opens app
2. Sees splash
3. Goes through 3 onboarding cards
4. Taps Preview Demo Trial or Connect Spotify
5. Connects Spotify
6. Returns to Trial tab
7. Taps Put Me On Trial
8. Watches loading sequence
9. Gets verdict reveal
10. Views evidence
11. Creates share card
12. Shares/saves
13. Sees history entry

## Returning user

1. Opens app
2. Lands directly on Trial tab
3. Sees today’s case
4. Taps Put Me On Trial
5. Gets new verdict
6. Shares or compares with yesterday

---

# 30. Final design instruction to Codex Agent

Build the frontend as if the app is a **viral entertainment product**, not a utility dashboard.

The UI should prioritize:

1. **fast emotional payoff**
2. **big animated reveals**
3. **funny shareable cards**
4. **scores people can compare**
5. **premium-feeling dark neon visuals**
6. **short, dramatic microcopy**
7. **clear Spotify-based data flow**

The app should make the user think:

> “This is stupid, but I need to know my score.”

And after seeing the result:

> “I have to send this to someone.”
