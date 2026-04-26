# Share Card Concepts

These are imagegen / ChatGPT Images v2 concept references for the selected SongCourt hybrid direction:

- **Editorial Court** for the calm app shell.
- **Pop Verdict** for the dopamine/reward/share layer.

They are not production export assets. The final app should recreate the layouts as real React Native / captured card surfaces at exact export sizes.

## Saved Concepts

| Template | File | Intended Size | Generated Size | Role |
| --- | --- | --- | --- | --- |
| Verdict Poster | `verdict-poster-concept.png` | `1080x1920` | `941x1672` | Primary dramatic story card |
| Court Receipt | `court-receipt-concept.png` | `1080x1350` | `1122x1402` | Feed/group-chat evidence card |
| Music DNA | `music-dna-concept.png` | `1080x1920` | `941x1672` | Wrapped-style data story |
| Tag A Friend | `tag-a-friend-concept.png` | `1080x1920` | `941x1672` | Viral challenge card |

## Design Read

### Verdict Poster

Keep:

- huge verdict stamp,
- large Aux Risk number,
- off-white paper base,
- restrained red/black identity,
- small high-energy accent sticker,
- evidence strip at bottom.

Change before production:

- remove any fake barcode/social filler that does not map to real app data,
- make dynamic text zones stricter,
- keep the footer simpler.

### Court Receipt

Keep:

- receipt metaphor,
- score block plus evidence rows,
- red stamp,
- readable data hierarchy,
- group-chat-friendly compactness.

Change before production:

- replace generated phrases with app-owned caption/evidence copy,
- avoid too many receipt micro-details,
- make footer/watermark controlled by the share watermark setting.

### Music DNA

Keep:

- central vinyl/data visualization,
- genre/stat modules,
- court persona area,
- stronger data-story format.

Change before production:

- reduce giant title dominance,
- make the data modules more minimal,
- avoid looking like an overpacked poster,
- reserve colorful modules for the share card only, not app shell.

### Tag A Friend

Keep:

- large social hook,
- friend tag slots,
- clear challenge CTA,
- evidence strip,
- high dopamine color accents.

Change before production:

- simplify typography,
- avoid fake profile silhouettes if they feel cheap,
- make tag slots neutral placeholders,
- reduce sticker clutter,
- remove app-button-looking elements from the exported card.

## Production Layout Rules

- Production story cards must render at exactly `1080x1920`.
- Production feed portrait cards must render at exactly `1080x1350`.
- Each card should have one dominant message and one dominant number.
- Use 2-4 evidence details maximum.
- No phone frames or app chrome in exported cards.
- No fake global percentiles or fake social notifications.
- Generated text should not be trusted; final text must come from app data and owned copy.

## Prompt Set Summary

All prompts used the same constraints:

- professional, premium, clean, dopamine-rewarding,
- Editorial Court cleanliness plus Pop Verdict share energy,
- high legibility after social compression,
- dynamic text zones for real app data,
- no old dark neon UI,
- no casino effects,
- no fake social claims,
- no fake notifications,
- no phone frame,
- no distorted AI typography.

### Verdict Poster Prompt Anchor

Create a `1080x1920` SongCourt Verdict Poster with top brand/case number, huge central verdict stamp, large Aux Risk score, funny charge line, compact evidence stats, warm ivory/black/red base, controlled lime/cobalt/gold accents, paper grain, stamped ink, vinyl/data motif, and no app chrome.

### Court Receipt Prompt Anchor

Create a `1080x1350` SongCourt Court Receipt with receipt header, case number/date, verdict summary strip, Aux Risk score block, itemized evidence rows, badge/rank row, funny footer, warm receipt paper, black ink, courtroom red, one lime reward highlight, and no dense fine print.

### Music DNA Prompt Anchor

Create a `1080x1920` SongCourt Music DNA card with brand/case number, large title, central vinyl/DNA/data visualization, Aux Risk score, court persona, 3-4 stat modules, badge/rank footer, Wrapped-like data-story energy, and controlled accent colors.

### Tag A Friend Prompt Anchor

Create a `1080x1920` SongCourt Tag A Friend card with top brand/case number, huge challenge question, verdict and Aux Risk score, three neutral friend-tag placeholder slots, compact evidence strip, challenge CTA/watermark, bold pop color accents, and no fake social notification UI.
