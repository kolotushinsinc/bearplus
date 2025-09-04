import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';

import connectDB from './config/database';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import shippingRoutes from './routes/shipping';
import feedbackRoutes from './routes/feedback';
import ordersRoutes from './routes/orders';
import documentsRoutes from './routes/documents';
import messagesRoutes from './routes/messages';
import ratesRoutes from './routes/rates';
import marginsRoutes from './routes/margins';
import loyaltyRoutes from './routes/loyalty';
import currencyRoutes from './routes/currency';
import errorHandler from './middleware/errorHandler';

// Загрузка переменных окружения
dotenv.config();

const app: Application = express();

// Подключение к MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [process.env.CLIENT_URL!, process.env.CRM_URL!],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW!) * 60 * 1000, // minutes
  max: parseInt(process.env.RATE_LIMIT_MAX!), // limit each IP to requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parsing middleware
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/rates', ratesRoutes);
app.use('/api/margins', marginsRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/currency', currencyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT: number = parseInt(process.env.PORT!) || 5005;

app.listen(PORT, () => {
  console.log(`🚀 BearPlus server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`🏢 CRM URL: ${process.env.CRM_URL}`);
});

export default app;