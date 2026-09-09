import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { validateRegisterInput, validateLoginInput } from '../utils/validators.js';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_genericmed_2026_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Helper to generate JWT Token
 */
function generateToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: (JWT_EXPIRES_IN || '7d') as any }
  );
}


/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validation = validateRegisterInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Validation failed.',
        details: validation.errors,
      });
    }

    const {
      name,
      email,
      password,
      role = 'patient',
      phone,
      avatar,
      patientId,
      dob,
      npiNumber,
      licenseState,
      facilityName,
    } = req.body;

    const existingUser = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'An account with this email address already exists.',
      });
    }

    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'GM';

    const newUser = new UserModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone: phone || '',
      avatar: avatar || initials,
      patientId: patientId || (role === 'patient' ? `PT-${Math.floor(1000 + Math.random() * 9000)}-TX` : undefined),
      dob: dob || (role === 'patient' ? 'Jan 1, 1990' : undefined),
      npiNumber,
      licenseState,
      facilityName: facilityName || (role === 'pharmacist' ? 'MediQuick Pharmacy Hub #042' : undefined),
      twoFactorEnabled: true,
    });

    await newUser.save();

    const userObj = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      avatar: newUser.avatar,
      patientId: newUser.patientId,
      dob: newUser.dob,
      npiNumber: newUser.npiNumber,
      licenseState: newUser.licenseState,
      facilityName: newUser.facilityName,
      twoFactorEnabled: newUser.twoFactorEnabled,
      createdAt: newUser.createdAt.toISOString().split('T')[0],
    };

    const token = generateToken(userObj);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: userObj,
      token,
    });
  } catch (err: any) {
    console.error('Error during registration:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'Registration failed.',
    });
  }
});

/**
 * POST /api/auth/login
 * User login with credentials
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validation = validateLoginInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Validation failed.',
        details: validation.errors,
      });
    }

    const identifier = (req.body.email || req.body.identifier || '').toLowerCase().trim();
    const password = req.body.password;

    const user = await UserModel.findOne({ email: identifier }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    const userObj = {
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
      createdAt: user.createdAt ? user.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    };

    const token = generateToken(userObj);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: `Welcome back, ${userObj.name}!`,
      user: userObj,
      token,
    });
  } catch (err: any) {
    console.error('Error during login:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'Login failed.',
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout current user
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('access_token');
  return res.json({
    success: true,
    message: 'Signed out successfully.',
  });
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Not logged in.',
    });
  }

  return res.json({
    success: true,
    user: req.user,
  });
});

export default router;
