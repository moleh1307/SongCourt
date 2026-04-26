const { json, signToken, verifyToken } = require('../../_lib/songcourt');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      json(res, 405, { error: 'Method not allowed.' });
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const ticket = verifyToken(body?.ticket, 'ticket');
    const token = signToken({ kind: 'session', refreshTokenEnc: ticket.refreshTokenEnc, user: ticket.user }, 60 * 60 * 24 * 30);
    json(res, 200, { token, user: ticket.user });
  } catch (error) {
    json(res, 401, { error: error.message });
  }
};
