# SongCourt Generated Image Prompts

Use these with ChatGPT v2 Images or another high-quality image model. Keep outputs as PNG. Avoid text inside generated images unless the prompt explicitly asks for a logo lockup; app text is easier to control in React Native.

## 1. App Icon

- Size: `1024 x 1024`
- Format: PNG, no transparency required
- Safe area: keep primary symbol inside the central `760 x 760`
- Output path after creation: `assets/icon.png`, then also derive `assets/adaptive-icon.png`

Prompt:

```text
Create a premium iOS app icon for "SongCourt", a viral music personality app where Spotify Wrapped meets a neon courtroom. Dark black-glass background (#07070F), glowing neon green and electric purple edge lighting, a stylized gavel crossed with an aux cable, subtle vinyl record circle behind it, tiny red guilty stamp shape as a secondary detail. No readable small text. Bold, simple, recognizable at small size. Centered composition, high contrast, glossy 3D-but-clean app icon style, no mockup, no phone, no people, no watermark.
```

## 2. Splash Background

- Size: `1290 x 2796` for iPhone portrait
- Format: PNG
- Output path suggestion: `assets/generated/splash-bg.png`

Prompt:

```text
Create a vertical mobile splash background for SongCourt. Scene: underground neon courtroom fused with a nightclub and music equalizer. Black glass room, subtle judge bench silhouette, glowing green and purple equalizer bars behind a central empty space for app logo, faint red "guilty" stamp shapes, vinyl-disc shadows, polished floor reflections. Cinematic, high contrast, premium, dramatic, slightly chaotic but not cluttered. Leave the center mostly clean for overlaid text. No readable text, no people, no logos, no watermark.
```

## 3. Trial Loading Scanner Background

- Size: `1290 x 2796`
- Format: PNG
- Output path suggestion: `assets/generated/trial-scanner-bg.png`

Prompt:

```text
Create a vertical mobile background for a dramatic "music trial loading scanner". Dark neon courtroom, rotating evidence folders implied through motion blur, glowing vinyl fingerprint scanner in the center, equalizer bars, waveform lines, red warning highlights, purple haze, green scanning beam. Futuristic arcade reward-machine energy. Leave room for overlaid loading text in the middle and progress steps near the bottom. No readable text, no humans, no watermark.
```

## 4. Share Card Background: Dark Neon Court

- Size: `1080 x 1920`
- Format: PNG
- Output path suggestion: `assets/generated/share-neon-court.png`

Prompt:

```text
Create a vertical story-format background for a SongCourt share card. Dark neon courtroom aesthetic, black background, electric purple frame glow, neon green waveform lines, red guilty stamp texture, subtle vinyl record rings, evidence-folder corners, premium social-share card look. Leave large clear zones for overlaid text: top brand area, center score/verdict area, lower charge/sentence area. No readable text, no people, no watermark.
```

## 5. Share Card Background: Court Receipt

- Size: `1080 x 1920`
- Format: PNG
- Output path suggestion: `assets/generated/share-court-receipt.png`

Prompt:

```text
Create a vertical story-format receipt paper background for a funny music courtroom verdict card. Warm court-paper cream (#FFF4D6), subtle receipt paper fibers, faint perforated edges, red stamp texture, fake barcode-like decorative lines at bottom but no readable text, slight shadow and scanned-paper imperfection. Leave clear space for overlaid mono text. Premium meme receipt style, not messy, no watermark.
```

## 6. Share Card Background: Mugshot Poster

- Size: `1080 x 1920`
- Format: PNG
- Output path suggestion: `assets/generated/share-mugshot-poster.png`

Prompt:

```text
Create a vertical story-format mugshot poster background for SongCourt. Dark music-crime poster, subtle height chart lines, neon red and hot pink rim lighting, black glass texture, aux cable and vinyl record details, dramatic courtroom poster energy. Leave empty areas for overlaid "wanted" style text and score. No readable text, no face, no people, no watermark.
```

## 7. Court Paper Texture

- Size: `2048 x 2048`
- Format: PNG
- Output path suggestion: `assets/generated/court-paper-texture.png`

Prompt:

```text
Create a seamless square court-paper texture for UI cards. Cream paper color (#FFF4D6), very subtle fibers, tiny red stamp residue, faint fold marks, low contrast, clean enough for readable black text on top. No readable words, no strong stains, no watermark.
```

## 8. Neon Court Seal

- Size: `2048 x 2048`
- Format: PNG with transparent background if possible
- Output path suggestion: `assets/generated/neon-court-seal.png`

Prompt:

```text
Create a transparent-background neon court seal emblem for SongCourt. Circular seal with stylized gavel, vinyl record, waveform, aux cable, and small star details. Neon green, electric purple, hot pink, and red accents. Premium vector-like emblem, crisp edges, centered, no readable text, no watermark.
```

## Integration Notes

- Prefer using generated images as backgrounds or symbols, with React Native text overlaid in the app.
- Do not bake small app copy into images; it will not scale well.
- Keep all generated files in `assets/generated/` first, then wire them into components after visual review.
