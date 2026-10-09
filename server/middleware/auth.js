import jwt from 'jsonwebtoken';
export const protect = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized, login required' });
  try { req.userId = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET).id; next(); }
  catch { res.status(401).json({ message: 'Invalid or expired token' }); }
};
