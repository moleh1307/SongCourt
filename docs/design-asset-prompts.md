# SongCourt Premium Image Prompts

Use these with ChatGPT Images v2 or another high-quality image model. Keep outputs as PNG. Avoid text inside generated images; app text is controlled in React Native for readability.

The current premium asset home is `assets/premium/`. The older `assets/generated/` set was removed because it looked too prototype-like.

## 1. App Icon

- Size: `1024 x 1024`
- Format: PNG, no transparency required
- Safe area: keep primary symbol inside the central `760 x 760`
- Output path after creation: `assets/premium/app-icon-seal.png`, then also copy to `assets/icon.png`, `assets/adaptive-icon.png`, `assets/splash-icon.png`, and `assets/favicon.png`

Prompt:

```text
Create a premium square app icon for SongCourt with no text, combining courtroom scales and music/audio energy. Deep black glossy square icon background with subtle marble texture. Central neon court scales symbol integrated with a circular vinyl-record groove and tiny waveform arcs. Polished iOS app icon, high-end consumer music app, simple strong silhouette, vector-friendly 3D glow but not cluttered. Square 1:1, centered symbol, generous padding, readable at small size. Black, charcoal, magenta, acid lime, small cream glint. No words, no letters, no logos, no watermark, no official brand marks, no phone frame, no clip-art gavel.
```

## 2. Splash Background

- Size: vertical iPhone portrait, 9:16
- Format: PNG
- Output path: `assets/premium/courtroom-stage-bg.png`

Prompt:

```text
Create a premium dark courtroom fused with underground music club stage, no people in foreground, designed as an iPhone portrait app background. Black marble courtroom wall, judge bench silhouette, subtle speaker stacks integrated into shadows, faint audio waveform lines near the lower edge, neon court seal glow in the distance but no readable text. Cinematic premium 3D/editorial render. Central negative space for native app title and buttons, strong depth, safe darker margins for text. Controlled black gloss, restrained hot-magenta and acidic-lime reflections. No words, no letters, no logos, no watermark, no humans, no brand marks, no UI elements.
```

## 3. Trial Loading Scanner Background

- Size: vertical iPhone portrait, 9:16
- Format: PNG
- Output path: `assets/premium/trial-scanner-bg.png`

Prompt:

```text
Create a dark premium evidence scanner background for a music trial loading screen. Black glass scanner bed, legal case-file edges, waveform traces, faint grid, subtle scanning light beam, small abstract evidence markers without letters. Vertical 9:16 portrait, central area dark and readable for native loading text, diagonal scanner light crossing the lower half, subtle legal/music details at edges. Suspenseful, premium, controlled neon scan light. No words, no letters, no logos, no watermark, no phone frame, no buttons, no real brand marks, no humans.
```

## 4. Share Poster Background

- Size: vertical 4:5 or 9:16
- Format: PNG
- Output path: `assets/premium/verdict-poster-bg.png`

Prompt:

```text
Create a premium blank concert-courtroom poster background for a shareable verdict card. No readable text; the app will overlay native text. Black distressed poster paper, neon court seal symbol made of scales inside a chain ring, speaker silhouettes, subtle crowd silhouettes at the bottom, thin waveform accents, legal stamp energy without words. Premium music festival poster meets underground courtroom graphic design, high-end editorial. Center seal lower-middle, top and middle have clean dark negative space for large native typography, bottom has subtle energy/crowd/speaker details. No words, no letters, no logos, no watermark, no UI buttons, no phone frame, no people faces.
```

## 5. Case File Paper

- Size: vertical 3:4
- Format: PNG
- Output path: `assets/premium/case-file-paper.png`

Prompt:

```text
Create a blank premium legal case-file paper texture, no readable text, for use behind native React Native UI elements. Aged court docket folder, layered tabs, faint stamped circles without legible words, subtle creases, barcode-like abstract lines, evidence folder corners. Photorealistic editorial product texture, premium music-culture zine meets legal archive. Vertical portrait 3:4, mostly flat front-facing surface, center area clear enough for app text overlays, slight layered-folder depth at edges. Warm cream paper against smoky dark edge vignette, premium tactile texture. No readable words, no letters, no logos, no watermark, no UI, no phone frame, no hands.
```

## Integration Notes

- Prefer using generated images as backgrounds or symbols, with React Native text overlaid in the app.
- Do not bake small app copy into images; it will not scale well.
- Keep final project-bound assets in `assets/premium/`.
