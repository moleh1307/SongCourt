const crypto = require('node:crypto');

const scopes = ['user-read-email', 'user-read-private', 'user-top-read', 'user-read-recently-played'];

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
};

const base64url = (input) => Buffer.from(input).toString('base64url');
const unbase64url = (input) => Buffer.from(input, 'base64url').toString('utf8');

const signingSecret = () => requireEnv('SONGCOURT_TOKEN_SECRET');

const signToken = (payload, ttlSeconds) => {
  const body = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const encoded = base64url(JSON.stringify(body));
  const sig = crypto.createHmac('sha256', signingSecret()).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
};

const verifyToken = (token, kind) => {
  const [encoded, sig] = String(token ?? '').split('.');
  if (!encoded || !sig) throw new Error('Invalid token');
  const expected = crypto.createHmac('sha256', signingSecret()).update(encoded).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) throw new Error('Invalid token signature');
  const payload = JSON.parse(unbase64url(encoded));
  if (payload.kind !== kind) throw new Error('Invalid token kind');
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Expired token');
  return payload;
};

const spotifyFetch = async (path, accessToken) => {
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`Spotify API failed: ${response.status}`);
  return response.json();
};

const exchangeCode = async (code) => {
  const redirectUri = requireEnv('SPOTIFY_REDIRECT_URI');
  const auth = Buffer.from(`${requireEnv('SPOTIFY_CLIENT_ID')}:${requireEnv('SPOTIFY_CLIENT_SECRET')}`).toString('base64');
  const body = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri });
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) throw new Error(`Spotify token exchange failed: ${response.status}`);
  return response.json();
};

const refreshAccessToken = async (refreshToken) => {
  const auth = Buffer.from(`${requireEnv('SPOTIFY_CLIENT_ID')}:${requireEnv('SPOTIFY_CLIENT_SECRET')}`).toString('base64');
  const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken });
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) throw new Error(`Spotify token refresh failed: ${response.status}`);
  return response.json();
};

const imageUrl = (images = []) => images[0]?.url;

const moodTagsFromGenres = (genres = []) => {
  const joined = genres.join(' ').toLowerCase();
  return [
    joined.match(/sad|emo|melanch|heartbreak/) ? 'sad' : undefined,
    joined.match(/gym|workout|metal|hard|phonk/) ? 'gym' : undefined,
    joined.match(/dance|party|club|house|edm/) ? 'party' : undefined,
    joined.match(/chill|lo-fi|ambient|acoustic/) ? 'chill' : undefined,
    joined.match(/pop|viral|mainstream/) ? 'mainstream' : undefined,
    joined.match(/experimental|hyperpop|breakcore|glitch/) ? 'chaotic' : undefined,
    joined.match(/cinematic|score|soundtrack/) ? 'cinematic' : undefined,
  ].filter(Boolean);
};

const mapTrack = (track, artistGenreMap = {}, playedAt) => {
  const genres = track.artists.flatMap((artist) => artistGenreMap[artist.id] ?? []);
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    album: track.album?.name,
    albumImageUrl: imageUrl(track.album?.images),
    playedAt,
    durationMs: track.duration_ms,
    popularity: track.popularity,
    genres,
    moodTags: moodTagsFromGenres(genres),
  };
};

const mapArtist = (artist) => ({
  id: artist.id,
  name: artist.name,
  genres: artist.genres ?? [],
  imageUrl: imageUrl(artist.images),
  popularity: artist.popularity,
  moodTags: moodTagsFromGenres(artist.genres ?? []),
});

const artistGenresForTracks = async (tracks, accessToken) => {
  const ids = [...new Set(tracks.flatMap((track) => track.artists.map((artist) => artist.id)).filter(Boolean))].slice(0, 50);
  if (ids.length === 0) return {};
  const data = await spotifyFetch(`/artists?ids=${ids.join(',')}`, accessToken);
  return Object.fromEntries(data.artists.map((artist) => [artist.id, artist.genres ?? []]));
};

module.exports = {
  exchangeCode,
  json,
  mapArtist,
  mapTrack,
  artistGenresForTracks,
  refreshAccessToken,
  requireEnv,
  scopes,
  signToken,
  spotifyFetch,
  verifyToken,
};
