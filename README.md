# SongCourt Backend

This repository has been stripped back to the backend only.

The remaining code is a Vercel-style Node API that owns Spotify OAuth, creates SongCourt session tokens, and returns normalized Spotify listening snapshots.

## What Remains

- `api/auth/spotify/start.js`
- `api/auth/spotify/callback.js`
- `api/auth/spotify/session.js`
- `api/auth/spotify/disconnect.js`
- `api/spotify/snapshot.js`
- `api/me.js`
- `api/_lib/songcourt.js`

## What Was Removed

All Expo/React Native frontend code, screens, stores, UI components, design assets, generated image prompts, EAS config, and mobile app config were removed.

## Environment

Set these on Vercel or your backend host:

```bash
SPOTIFY_CLIENT_ID=<spotify-client-id>
SPOTIFY_CLIENT_SECRET=<spotify-client-secret>
SPOTIFY_REDIRECT_URI=https://<songcourt-api-domain>/auth/spotify/callback
SONGCOURT_TOKEN_SECRET=<long-random-secret>
SONGCOURT_ALLOWED_RETURN_URIS=songcourt://auth/spotify/callback
```

For multiple allowed app return URIs:

```bash
SONGCOURT_ALLOWED_RETURN_URIS=songcourt://auth/spotify/callback,exp://<local-ip>:8081/--/auth/spotify/callback
```

## Check

```bash
npm run check
```

## API Contract

See [docs/spotify-production-setup.md](docs/spotify-production-setup.md).

## Frontend Rebuild

The frontend was intentionally removed and should be rebuilt from a clean design source of truth.

Start with [docs/ui-design-direction.md](docs/ui-design-direction.md) before scaffolding any new app UI.

Share-card production layout rules live in [docs/share-card-layout-system.md](docs/share-card-layout-system.md).
