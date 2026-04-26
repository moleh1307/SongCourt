# SongCourt Share Card Layout System

This document turns the first approved share-card concepts into buildable production layouts.

Related references:

- `docs/ui-design-direction.md`
- `docs/design-concepts/share-cards/README.md`
- `docs/design-concepts/share-cards/verdict-poster-concept.png`
- `docs/design-concepts/share-cards/court-receipt-concept.png`
- `docs/design-concepts/share-cards/music-dna-concept.png`
- `docs/design-concepts/share-cards/tag-a-friend-concept.png`

## Product Rule

The app shell can be calm. Share cards must be desirable.

Production cards should not be screenshots. They are custom generated social artifacts with:

- one dominant message,
- one dominant number,
- 2-4 evidence details,
- clear SongCourt identity,
- exact export dimensions,
- dynamic text that cannot break the layout.

## Production Sizes

| Format | Size | Primary Use |
| --- | --- | --- |
| Story | `1080x1920` | Instagram Stories, TikTok, Snapchat |
| Feed portrait | `1080x1350` | Instagram feed, X, group chats |
| Square fallback | `1080x1080` | Generic fallback, thumbnails |

The first implementation should support:

- `Verdict Poster`: `1080x1920`
- `Court Receipt`: `1080x1350`
- `Music DNA`: `1080x1920`
- `Tag A Friend`: `1080x1920`

Square fallback can come later.

## Shared Card Data

All templates should render from the same normalized card payload.

```ts
type ShareCardPayload = {
  appName: "SongCourt";
  caseNumber: string;
  verdictTitle: string;
  auxRisk: number;
  charge: string;
  courtPersona: string;
  courtRank: string;
  badgeName?: string;
  evidence: ShareEvidenceItem[];
  musicDna?: MusicDnaSlice[];
  challengePrompt?: string;
  createdAt: string;
  watermarkEnabled: boolean;
};

type ShareEvidenceItem = {
  key:
    | "replayCrime"
    | "artistDependency"
    | "genreWhiplash"
    | "moodSwing"
    | "nightCourt"
    | "mainstreamLiability";
  label: string;
  value: string;
  caption: string;
};

type MusicDnaSlice = {
  label: string;
  value: number;
  color: string;
};
```

## Global Layout Rules

- Cards render with fixed pixel dimensions, then are captured/exported.
- Do not rely on screen-size layout for the exported card.
- Use a fixed internal spacing scale: `8`, `16`, `24`, `32`, `48`, `64`.
- Keep all important content inside a `64px` safe margin.
- Use decorative elements only outside or behind dynamic text zones.
- Dynamic text zones must have max lines and shrink rules.
- If text still does not fit, use fallback shorter copy from the caption generator.
- Watermark is optional and must respect the Profile `Share Watermark` setting.

## Typography Rules

Recommended production font roles:

- Brand/logotype: custom later, temporary text logo allowed for MVP.
- UI labels: clean sans-serif, uppercase tracking only for small labels.
- Verdict headline: bold condensed display style.
- Numbers: heavy sans-serif, tabular if available.
- Receipt rows: monospaced or mono-inspired, but readable.

Minimum export font sizes:

- Tiny labels: `24px`
- Evidence captions: `30px`
- Body/charge text: `42px`
- Important labels: `52px`
- Dominant verdict: `120px+`
- Dominant score: `180px+`

Do not use decorative/gothic type for body text.

## Color System

Base:

- Ink: `#111111`
- Warm ivory: `#F6F1E8`
- Receipt white: `#FFF9EF`
- Court red: `#E32246`
- Paper tan: `#C9B89A`
- Charcoal: `#2A2724`

Pop accents:

- Lime: `#A7FF3D`
- Cobalt: `#355CFF`
- Violet: `#9B5CFF`
- Gold: `#F7C948`
- Hot pink: `#F72585`

Rule: use red/black/ivory as the identity base. Use one or two pop accents per card, not all of them equally.

## Dynamic Text Limits

| Field | Target Max | Fallback Behavior |
| --- | ---: | --- |
| `verdictTitle` | 18 chars | Use shorter verdict alias |
| `charge` | 58 chars | Use 2-line shorter charge |
| `courtPersona` | 28 chars | Reduce to persona alias |
| `courtRank` | 22 chars | Use rank only |
| evidence label | 22 chars | Use canonical label |
| evidence value | 12 chars | Round or abbreviate |
| evidence caption | 34 chars | Omit on compact templates |
| challenge prompt | 42 chars | Use canonical prompt |

Never let generated copy create a third text line in the hero zone.

## Template 1: Verdict Poster

Reference: `docs/design-concepts/share-cards/verdict-poster-concept.png`

Size: `1080x1920`

Purpose: the most dramatic, viral story card.

### Region Map

| Region | Position | Content |
| --- | --- | --- |
| Outer safe area | `x=48 y=48 w=984 h=1824` | All visible content |
| Header | `x=72 y=72 w=936 h=150` | SongCourt, case number |
| Verdict label | `x=72 y=230 w=936 h=80` | Small `VERDICT` label |
| Verdict stamp | `x=72 y=320 w=936 h=430` | Huge `verdictTitle` |
| Accent badge | `x=650 y=650 w=330 h=130` | One evidence callout |
| Score block | `x=120 y=820 w=840 h=360` | `AUX RISK` + score |
| Charge block | `x=120 y=1210 w=840 h=250` | funny charge |
| Evidence strip | `x=72 y=1500 w=936 h=250` | 3 evidence items |
| Footer | `x=72 y=1770 w=936 h=90` | watermark/date/tiny mark |

### Production Rules

- `verdictTitle` is the hero, not the score.
- Score must still be visible from a phone thumbnail.
- Evidence strip uses exactly 3 items.
- Accent badge uses the strongest evidence category.
- Keep background mostly warm ivory.
- Avoid extra barcodes unless they map to real case metadata.

## Template 2: Court Receipt

Reference: `docs/design-concepts/share-cards/court-receipt-concept.png`

Size: `1080x1350`

Purpose: compact, funny, proof-oriented card for feeds and group chats.

### Region Map

| Region | Position | Content |
| --- | --- | --- |
| Receipt sheet | `x=64 y=48 w=952 h=1254` | paper base |
| Header | `x=112 y=90 w=856 h=145` | SongCourt, case, date |
| Verdict strip | `x=112 y=260 w=856 h=160` | verdict + stamp |
| Score row | `x=112 y=450 w=856 h=230` | score + compact risk meter |
| Evidence rows | `x=112 y=705 w=856 h=300` | 4 itemized rows |
| Badge/rank row | `x=112 y=1030 w=856 h=150` | badge + rank |
| Footer | `x=112 y=1210 w=856 h=65` | watermark or tagline |

### Production Rules

- Evidence rows use 4 items max.
- Each row has icon, label, one-line caption, value.
- The sheet should feel like a receipt, but not contain tiny unreadable legal copy.
- If watermark is disabled, footer becomes a small generated caption or date.

## Template 3: Music DNA

Reference: `docs/design-concepts/share-cards/music-dna-concept.png`

Size: `1080x1920`

Purpose: the cleanest Wrapped-like data story.

### Region Map

| Region | Position | Content |
| --- | --- | --- |
| Header | `x=64 y=64 w=952 h=140` | SongCourt + case |
| Title | `x=64 y=230 w=952 h=170` | `MUSIC DNA` |
| DNA visual | `x=120 y=430 w=840 h=520` | vinyl/ring chart |
| Score/persona | `x=80 y=1010 w=920 h=300` | score + persona |
| Stat modules | `x=64 y=1360 w=952 h=300` | 4 small modules |
| Rank footer | `x=64 y=1700 w=952 h=150` | court rank + watermark |

### Production Rules

- Reduce title size compared with the concept so data has breathing room.
- DNA visual must be generated from real `musicDna` slices when available.
- If genre data is unavailable, use evidence-category slices instead.
- Stat modules are colorful, but each module needs enough negative space.

## Template 4: Tag A Friend

Reference: `docs/design-concepts/share-cards/tag-a-friend-concept.png`

Size: `1080x1920`

Purpose: viral challenge card.

### Region Map

| Region | Position | Content |
| --- | --- | --- |
| Header | `x=64 y=64 w=952 h=130` | SongCourt + case |
| Hook | `x=64 y=230 w=952 h=360` | `WHO GAVE ME THE AUX?` |
| Verdict module | `x=80 y=630 w=920 h=300` | verdict + score |
| Tag slots | `x=64 y=980 w=952 h=290` | 3 neutral placeholders |
| Evidence strip | `x=64 y=1320 w=952 h=210` | 3 evidence items |
| Challenge footer | `x=64 y=1600 w=952 h=220` | challenge CTA + watermark |

### Production Rules

- Friend slots are placeholders, not fake accounts.
- Do not render profile silhouettes if they feel cheap in implementation.
- Avoid fake notifications, likes, DMs, or social proof.
- CTA text is part of the card design, not an app button.
- Keep sticker elements to 1-2 accents.

## Evidence Priority

If there are more evidence items than a template supports, choose by this priority:

1. Highest severity/value.
2. Most funny caption.
3. Most visually distinct category.
4. Avoid repeating similar metrics on the same card.

Default template evidence counts:

- Verdict Poster: 3
- Court Receipt: 4
- Music DNA: 4
- Tag A Friend: 3

## Caption Tone

Captions should be funny and shareable, not cruel.

Good:

- "Guilty of replaying the same 4 songs."
- "One artist has custody of your headphones."
- "Pop to metal in 3 songs."
- "Certified night-court listener."

Avoid:

- direct insults,
- fake public ranking,
- shame-based copy,
- anything about body, income, identity, or real-world status.

## Build Order

1. Rebuild the mobile app shell only after this layout system is accepted.
2. Implement share-card rendering as fixed-size components, not responsive screens.
3. Start with `Verdict Poster` and `Court Receipt`.
4. Add `Music DNA` after real chart/data utilities exist.
5. Add `Tag A Friend` after share flow and caption generator are stable.

## QA Requirements

For every production card:

- capture/export at exact intended size,
- screenshot card preview in-app,
- verify text fit with long verdict and long charge,
- verify watermark on/off,
- verify no app chrome appears in export,
- verify social compression readability,
- verify demo and real Spotify payloads both render.
