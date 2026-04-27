# SongCourt

SongCourt is an Expo/React Native iPhone app plus a Vercel-style Spotify backend.

The frontend is being rebuilt from a clean design system. The current app slice includes:

- clean trial home with Spotify connect/demo paths,
- loading scanner flow,
- verdict/share result flow,
- fixed-size social card rendering,
- native PNG share export for `Verdict Poster` and `Court Receipt`.

The backend owns Spotify OAuth, creates SongCourt session tokens, and returns normalized Spotify listening snapshots.

## Backend Routes

- `api/auth/spotify/start.js`
- `api/auth/spotify/callback.js`
- `api/auth/spotify/session.js`
- `api/auth/spotify/disconnect.js`
- `api/spotify/snapshot.js`
- `api/me.js`
- `api/_lib/songcourt.js`

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

The old frontend was intentionally removed and the current frontend is being rebuilt from a clean design source of truth.

Start with [docs/ui-design-direction.md](docs/ui-design-direction.md) before scaffolding any new app UI.

Share-card production layout rules live in [docs/share-card-layout-system.md](docs/share-card-layout-system.md).

Current frontend status: a trial home -> loading scanner -> verdict/share flow exists. Demo trials work locally. Spotify login hooks are in place and real Spotify trials use `/spotify/snapshot` when a SongCourt session token is available.

Run the app in the existing simulator:

```bash
npm run ios
```
