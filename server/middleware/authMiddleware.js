const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header (format: "Bearer <token>")
  const token = req.header('x-auth-token');
  
  // If no token is provided, respond with a 401 Unauthorized status
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key from the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user data to the request object
    req.user = decoded;
    
    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails (invalid or expired), respond with a 400 Bad Request status
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
