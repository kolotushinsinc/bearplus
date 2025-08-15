const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Логирование ошибки
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = 'Duplicate field value entered';
    
    // Более детальное сообщение для конкретных полей
    if (err.keyPattern.email) {
      message = 'Email already exists';
    } else if (err.keyPattern.username) {
      message = 'Username already exists';
    }
    
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = { 
      message: messages.join(', '), 
      statusCode: 400 
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = { 
      message: 'Invalid token', 
      statusCode: 401 
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = { 
      message: 'Token expired', 
      statusCode: 401 
    };
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = { 
      message: 'File too large', 
      statusCode: 400 
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = { 
      message: 'Unexpected file field', 
      statusCode: 400 
    };
  }

  // Rate limiting errors
  if (err.type === 'entity.too.large') {
    error = { 
      message: 'Request entity too large', 
      statusCode: 413 
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      originalError: err
    })
  });
};

module.exports = errorHandler;