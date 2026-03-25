import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models';
import { generateToken, generateRefreshToken } from '../middleware/auth';
import { success } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

// ── Validation rules ──

export const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

export const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
];

// ── Controllers ──

export async function register(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return;
  }

  const { name, email, password } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  success(res, {
    user: user.toSafeJSON(),
    token,
    refreshToken,
  }, 201);
}

export async function login(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return;
  }

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.authProvider === 'google' && !user.password) {
    throw new AppError('This account uses Google Sign-In. Please sign in with Google.', 401);
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  success(res, {
    user: user.toSafeJSON(),
    token,
    refreshToken,
  });
}

export async function googleAuth(req: Request, res: Response): Promise<void> {
  const { googleId, email, name, avatarUrl } = req.body;

  if (!googleId || !email) {
    throw new AppError('Google ID and email required', 400);
  }

  // Find by googleId or email
  let user = await User.findOne({
    where: { googleId },
  });

  if (!user) {
    user = await User.findOne({ where: { email } });

    if (user) {
      // Link Google to existing email account
      user.googleId = googleId;
      user.authProvider = 'google';
      if (avatarUrl) user.avatarUrl = avatarUrl;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatarUrl,
        authProvider: 'google',
      });
    }
  }

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  success(res, {
    user: user.toSafeJSON(),
    token,
    refreshToken,
  });
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return;
  }

  // Always return success to prevent email enumeration
  success(res, {
    message: 'If an account exists with this email, a reset link has been sent.',
  });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = await User.findByPk(req.user!.id, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  success(res, user);
}
