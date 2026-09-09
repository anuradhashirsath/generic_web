import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: Partial<IUser> & { id: string };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token required. Please log in.',
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_genericmed_2026_production';
    const decoded = jwt.verify(token, jwtSecret) as { id: string; role: string; email: string };

    try {
      const user = await UserModel.findById(decoded.id).lean();
      if (user) {
        req.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          patientId: user.patientId,
          dob: user.dob,
          npiNumber: user.npiNumber,
          licenseState: user.licenseState,
          facilityName: user.facilityName,
          twoFactorEnabled: user.twoFactorEnabled,
        };
        return next();
      }
    } catch {
      // Fallback if DB query fails but token is valid
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as any,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired access token.',
    });
  }
};
