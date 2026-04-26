const { json, verifyToken } = require('./_lib/songcourt');

module.exports = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const session = verifyToken(token, 'session');
    json(res, 200, session.user);
  } catch (error) {
    json(res, 401, { error: error.message });
  }
};
