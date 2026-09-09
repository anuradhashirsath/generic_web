import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.js';
import { UserRole } from '../models/User.js';

export const requireRoles = (...allowedRoles: (UserRole | string)[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required.',
      });
    }

    const userRole = req.user.role as string;
    const isAllowed = allowedRoles.some((role) => {
      if (userRole === role) return true;
      if ((role === 'doctor' || role === 'pharmacist') && (userRole === 'doctor' || userRole === 'pharmacist')) {
        return true;
      }
      return false;
    });

    if (!isAllowed) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Role '${req.user.role}' is not authorized to access this resource. Required roles: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};
