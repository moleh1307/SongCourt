const { json } = require('../../../_lib/songcourt');

module.exports = async (_req, res) => {
  json(res, 200, { ok: true });
};
