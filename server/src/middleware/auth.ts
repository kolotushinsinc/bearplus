import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest, JwtPayload } from '../types';

// Middleware для проверки JWT токена
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Сначала пробуем получить токен из cookies
    let token = req.cookies?.token;
    
    // Если нет в cookies, пробуем Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }

    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Получение пользователя из базы данных
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid token - user not found' 
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated' 
      });
      return;
    }

    if (user.isLocked()) {
      res.status(401).json({ 
        success: false, 
        message: 'Account is temporarily locked' 
      });
      return;
    }

    // Добавляем пользователя в объект запроса
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
      return;
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
};

// Middleware для проверки роли пользователя
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Access denied. No user found' 
      });
      return;
    }

    if (!roles.includes(req.user.userType)) {
      res.status(403).json({ 
        success: false, 
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
      return;
    }

    next();
  };
};

// Middleware для проверки подтверждения email
export const requireEmailVerification = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user?.isEmailVerified) {
    res.status(403).json({ 
      success: false, 
      message: 'Email verification required' 
    });
    return;
  }
  next();
};

// Middleware для проверки собственных данных (пользователь может редактировать только свои данные)
export const checkOwnership = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const resourceUserId = req.params.userId || req.params.id;
  
  if (req.user?.id !== resourceUserId) {
    res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own data'
    });
    return;
  }
  
  next();
};