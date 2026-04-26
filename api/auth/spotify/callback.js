const { encryptSecret, exchangeCode, json, signToken, spotifyFetch, verifyToken } = require('../../_lib/songcourt');

module.exports = async (req, res) => {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      json(res, 400, { error });
      return;
    }
    if (!code || !state) {
      json(res, 400, { error: 'Missing Spotify callback code or state.' });
      return;
    }

    const oauth = verifyToken(state, 'oauth');
    const token = await exchangeCode(code);
    const profile = await spotifyFetch('/me', token.access_token);
    const user = {
      id: profile.id,
      displayName: profile.display_name || profile.id,
      avatarUrl: profile.images?.[0]?.url,
      spotifyConnected: true,
      createdAt: new Date().toISOString(),
    };
    const ticket = signToken({ kind: 'ticket', refreshTokenEnc: encryptSecret(token.refresh_token), user }, 60 * 10);
    const returnUrl = new URL(oauth.returnUri);
    returnUrl.searchParams.set('ticket', ticket);
    returnUrl.searchParams.set('state', oauth.appState);

    res.statusCode = 302;
    res.setHeader('Location', returnUrl.toString());
    res.end();
  } catch (error) {
    json(res, 500, { error: error.message });
  }
};
