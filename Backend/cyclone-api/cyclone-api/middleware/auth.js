function authMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  req.isAuthority = apiKey === process.env.AUTHORITY_API_KEY;
  next();
}

function requireAuthority(req, res, next) {
  if (!req.isAuthority) {
    return res.status(403).json({ error: 'Authority access required' });
  }
  next();
}

module.exports = { authMiddleware, requireAuthority };