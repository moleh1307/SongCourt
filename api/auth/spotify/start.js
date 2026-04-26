const { json, requireEnv, scopes, signToken } = require('../../_lib/songcourt');

module.exports = async (req, res) => {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const returnUri = url.searchParams.get('returnUri');
    const appState = url.searchParams.get('state');
    const allowedReturnUris = (
      process.env.SONGCOURT_ALLOWED_RETURN_URIS ??
      process.env.SONGCOURT_ALLOWED_RETURN_URI ??
      'songcourt://auth/spotify/callback'
    )
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (!returnUri || !allowedReturnUris.includes(returnUri) || !appState) {
      json(res, 400, { error: 'Invalid Spotify login request.' });
      return;
    }

    const state = signToken({ kind: 'oauth', returnUri, appState }, 60 * 30);
    const query = new URLSearchParams({
      client_id: requireEnv('SPOTIFY_CLIENT_ID'),
      response_type: 'code',
      redirect_uri: requireEnv('SPOTIFY_REDIRECT_URI'),
      scope: scopes.join(' '),
      state,
      show_dialog: 'false',
    });

    res.statusCode = 302;
    res.setHeader('Location', `https://accounts.spotify.com/authorize?${query.toString()}`);
    res.end();
  } catch (error) {
    json(res, 500, { error: error.message });
  }
};
