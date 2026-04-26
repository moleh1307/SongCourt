# Spotify Backend Setup

SongCourt is currently backend-only. The remaining `/api` routes implement Spotify login, SongCourt session token creation, and Spotify listening snapshot normalization.

## Spotify Dashboard

Create a Spotify Developer app and configure:

- App name: `SongCourt`
- Redirect URI: `https://<songcourt-api-domain>/auth/spotify/callback`

Spotify requires the OAuth redirect URI to be HTTPS for production. Do not use `songcourt://...` as the Spotify dashboard redirect. The backend receives the Spotify callback, exchanges the authorization code, creates a one-time login ticket, then redirects back to an allowed client URI with:

```text
songcourt://auth/spotify/callback?ticket=<one-time-ticket>&state=<state>
```

The backend should request these Spotify scopes:

- `user-read-email`
- `user-read-private`
- `user-top-read`
- `user-read-recently-played`

The client app no longer exists in this repo. Any future frontend must call this backend and provide an allowed `returnUri` when starting Spotify login.

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

## Current Repository State

- Frontend/UI/mobile code has been removed.
- The backend is stateless: it encrypts Spotify refresh tokens inside signed SongCourt API tokens using `SONGCOURT_TOKEN_SECRET`.
- A future frontend should start login through `/auth/spotify/start`, exchange callback tickets through `/auth/spotify/session`, then call `/spotify/snapshot` with the returned bearer token.
