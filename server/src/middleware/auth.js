const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware для проверки JWT токена
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token is required' 
      });
    }

    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Получение пользователя из базы данных
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token - user not found' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated' 
      });
    }

    if (user.isLocked()) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is temporarily locked' 
      });
    }

    // Добавляем пользователя в объект запроса
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
};

// Middleware для проверки роли пользователя
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No user found' 
      });
    }

    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

// Middleware для проверки подтверждения email
const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({ 
      success: false, 
      message: 'Email verification required' 
    });
  }
  next();
};

// Middleware для проверки собственных данных (пользователь может редактировать только свои данные)
const checkOwnership = (req, res, next) => {
  const resourceUserId = req.params.userId || req.params.id;
  
  if (req.user.id !== resourceUserId && req.user.userType !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. You can only access your own data' 
    });
  }
  
  next();
};

module.exports = {
  authenticateToken,
  authorize,
  requireEmailVerification,
  checkOwnership
};