const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get Bearer token
  const token = req.header('x-auth-token');
  
  // If token is not provided, respond to user with a 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    // secret key from the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    
    next();
  } catch (err) {
    // token validation fails - return 400 status
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
