import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/authUtils';

interface AuthenticatedRequest extends Request {
  user?: any;
}

const AuthorizationMiddleware = () => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const decodedToken = verifyToken(token);
      req.user = decodedToken;

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });

      return;
    }
  };
};

export default AuthorizationMiddleware
