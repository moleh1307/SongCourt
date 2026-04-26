const {
  artistGenresForTracks,
  decryptSecret,
  json,
  mapArtist,
  mapTrack,
  refreshAccessToken,
  spotifyFetch,
  verifyToken,
} = require('../_lib/songcourt');

const emptyCollection = { items: [] };

const optionalSpotifyFetch = async (path, accessToken) => {
  try {
    const data = await spotifyFetch(path, accessToken);
    return { data: data?.items ? data : emptyCollection };
  } catch (error) {
    return { data: emptyCollection, warning: error.message };
  }
};

module.exports = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const session = verifyToken(token, 'session');
    const refreshed = await refreshAccessToken(decryptSecret(session.refreshTokenEnc));
    const accessToken = refreshed.access_token;
    const [recentResult, topTracksResult, topArtistsResult] = await Promise.all([
      optionalSpotifyFetch('/me/player/recently-played?limit=30', accessToken),
      optionalSpotifyFetch('/me/top/tracks?limit=20&time_range=short_term', accessToken),
      optionalSpotifyFetch('/me/top/artists?limit=20&time_range=short_term', accessToken),
    ]);
    const recent = recentResult.data;
    const topTracks = topTracksResult.data;
    const topArtists = topArtistsResult.data;
    const recentTracksRaw = recent.items.map((item) => item.track).filter(Boolean);
    const topTracksRaw = topTracks.items.filter(Boolean);
    const genreMap = await artistGenresForTracks([...recentTracksRaw, ...topTracksRaw], accessToken).catch(() => ({}));
    const warnings = [recentResult.warning, topTracksResult.warning, topArtistsResult.warning].filter(Boolean);

    json(res, 200, {
      id: `spotify-${session.user.id}-${new Date().toISOString().slice(0, 10)}`,
      userId: session.user.id,
      createdAt: new Date().toISOString(),
      recentTracks: recent.items
        .filter((item) => item.track)
        .map((item) => mapTrack(item.track, genreMap, item.played_at))
        .filter(Boolean),
      topTracks: topTracksRaw.map((track) => mapTrack(track, genreMap)).filter(Boolean),
      topArtists: topArtists.items.map(mapArtist).filter(Boolean),
      warnings,
    });
  } catch (error) {
    json(res, 401, { error: error.message });
  }
};
