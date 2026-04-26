const {
  artistGenresForTracks,
  json,
  mapArtist,
  mapTrack,
  refreshAccessToken,
  spotifyFetch,
  verifyToken,
} = require('../_lib/songcourt');

module.exports = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const session = verifyToken(token, 'session');
    const refreshed = await refreshAccessToken(session.refreshToken);
    const accessToken = refreshed.access_token;
    const [recent, topTracks, topArtists] = await Promise.all([
      spotifyFetch('/me/player/recently-played?limit=30', accessToken),
      spotifyFetch('/me/top/tracks?limit=20&time_range=short_term', accessToken),
      spotifyFetch('/me/top/artists?limit=20&time_range=short_term', accessToken),
    ]);
    const genreMap = await artistGenresForTracks(
      [...recent.items.map((item) => item.track), ...topTracks.items],
      accessToken,
    );

    json(res, 200, {
      id: `spotify-${session.user.id}-${new Date().toISOString().slice(0, 10)}`,
      userId: session.user.id,
      createdAt: new Date().toISOString(),
      recentTracks: recent.items.map((item) => mapTrack(item.track, genreMap, item.played_at)),
      topTracks: topTracks.items.map((track) => mapTrack(track, genreMap)),
      topArtists: topArtists.items.map(mapArtist),
    });
  } catch (error) {
    json(res, 401, { error: error.message });
  }
};
