const jwt = require('jsonwebtoken');
const MSG = require('../constants/messages');

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    if (process.env.NODE_ENV === 'development') {
      console.error('authenticateUser error: No token provided');
    }
    return res.status(401).json({ message: MSG.NO_TOKEN });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('authenticateUser error:', error);
    }
    return res.status(403).json({ message: MSG.INVALID_TOKEN });
  }
};

module.exports = authenticateUser;
