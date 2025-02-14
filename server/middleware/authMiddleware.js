// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

exports.verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(403).json({ message: 'No token provided.' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: 'Invalid or expired token.' });
    req.user = { id: decoded.id, role: decoded.role };
    next();
  });
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  next();
};
