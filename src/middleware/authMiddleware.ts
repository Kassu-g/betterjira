import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: any; // Decoded JWT user data
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header('x-auth-token');

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;  // Attach decoded user to the request
    next(); // Proceed to the next route or middleware
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

export default authMiddleware;
