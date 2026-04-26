# Spotify Production Setup

SongCourt is wired for real Spotify login and includes a minimal Vercel-style backend in `/api`. It still needs Spotify dashboard values and deployed backend env vars before real user data can flow.

## Spotify Dashboard

Create a Spotify Developer app and configure:

- App name: `SongCourt`
- Bundle identifier: `com.melihkarakose.songcourt`
- Redirect URI: `https://<songcourt-api-domain>/auth/spotify/callback`

Spotify requires the OAuth redirect URI to be HTTPS for production. Do not use `songcourt://...` as the Spotify dashboard redirect. The backend receives the Spotify callback, exchanges the authorization code, creates a one-time login ticket, then redirects back into the app with:

```text
songcourt://auth/spotify/callback?ticket=<one-time-ticket>&state=<state>
```

The backend should request these Spotify scopes:

- `user-read-email`
- `user-read-private`
- `user-top-read`
- `user-read-recently-played`

Set local Expo env:

```bash
EXPO_PUBLIC_API_BASE_URL=https://<songcourt-api-domain>
EXPO_PUBLIC_SPOTIFY_RETURN_URI=songcourt://auth/spotify/callback
```

For Expo Go simulator QA, use the Expo development URL instead of the production custom scheme:

```bash
EXPO_PUBLIC_SPOTIFY_RETURN_URI=exp://<local-ip>:8081/--/auth/spotify/callback
```

Also add that exact Expo URI to `SONGCOURT_ALLOWED_RETURN_URIS` on the backend while testing.

## Backend Env

Set these on the deployed backend:

```bash
SPOTIFY_CLIENT_ID=<spotify-client-id>
SPOTIFY_CLIENT_SECRET=<spotify-client-secret>
SPOTIFY_REDIRECT_URI=https://<songcourt-api-domain>/auth/spotify/callback
SONGCOURT_TOKEN_SECRET=<long-random-secret>
SONGCOURT_ALLOWED_RETURN_URI=songcourt://auth/spotify/callback
```

For multiple app return URIs, prefer:

```bash
SONGCOURT_ALLOWED_RETURN_URIS=songcourt://auth/spotify/callback,exp://<local-ip>:8081/--/auth/spotify/callback
```

The included backend is stateless: it encrypts the Spotify refresh token inside signed SongCourt API tokens using `SONGCOURT_TOKEN_SECRET`. That is acceptable for a fast MVP if `SONGCOURT_TOKEN_SECRET` is strong and private; for production at scale, move refresh tokens into a database and keep only opaque session ids in app tokens.

## Backend Contract

The app never stores a Spotify client secret. The backend must own:

- Spotify client id
- Spotify client secret
- Spotify refresh token storage
- SongCourt API token/session creation

### `GET /auth/spotify/start`

Query:

```text
returnUri=songcourt://auth/spotify/callback
state=<app-generated-state>
```

Behavior:

- Validate that `returnUri` is an allowed SongCourt deep link.
- Store or sign `state` so it can be returned later.
- Redirect to Spotify Accounts with the backend HTTPS callback URI.

### `GET /auth/spotify/callback`

This is the redirect URI registered in Spotify Dashboard.

Behavior:

- Validate Spotify `state`.
- Exchange Spotify authorization code server-side.
- Store the Spotify refresh token server-side.
- Create a short-lived one-time login ticket.
- Redirect to:

```text
songcourt://auth/spotify/callback?ticket=<one-time-ticket>&state=<original-app-state>
```

### `POST /auth/spotify/session`

Input:

```json
{
  "ticket": "one-time-login-ticket"
}
```

Behavior:

- Consume the one-time ticket.
- Return a SongCourt API token and user profile.

Response:

```json
{
  "token": "songcourt-api-token",
  "user": {
    "id": "spotify-user-id",
    "displayName": "Melih",
    "avatarUrl": "https://...",
    "spotifyConnected": true,
    "createdAt": "2026-04-26T00:00:00.000Z"
  }
}
```

### `GET /spotify/snapshot`

Auth:

```http
Authorization: Bearer <songcourt-api-token>
```

Behavior:

- Refresh Spotify access token if needed.
- Fetch:
  - top tracks
  - top artists
  - recently played tracks
- Normalize into SongCourt `MusicSnapshot`.

Response shape:

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

### `GET /me`

Returns the current SongCourt user for the API token.

### `POST /auth/spotify/disconnect`

Deletes the user's stored Spotify refresh token/session server-side.

## Current App Behavior

- If `EXPO_PUBLIC_API_BASE_URL` is missing, the Connect button explains what setup is missing and the demo trial remains available.
- If the backend redirects back with a valid `ticket` and `state`, the app calls `/auth/spotify/session`, stores the returned SongCourt API token in SecureStore-backed Zustand persistence, and opens verdict generation.
- Real verdict generation calls `/spotify/snapshot`; demo mode still uses local demo tracks.
