// roleMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './AuthMiddleware';

export const authorizeRoles = (...roles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.auth || !req.auth.user) {
      res.status(401).json({ message: 'Unauthorized: No user data' });
      return;
    }

    const userRole = req.auth.user.role;

    if (!roles.includes(userRole)) {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};
