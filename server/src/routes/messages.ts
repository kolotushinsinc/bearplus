import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  createChat,
  closeChat
} from '../controllers/messagesController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// @route   GET /api/messages/chats
// @desc    Получение списка чатов пользователя
// @access  Private
router.get('/chats', getChats);

// @route   POST /api/messages/chats
// @desc    Создание нового чата
// @access  Private
router.post('/chats', createChat);

// @route   GET /api/messages/chats/:chatId/messages
// @desc    Получение сообщений чата
// @access  Private
router.get('/chats/:chatId/messages', getChatMessages);

// @route   POST /api/messages/chats/:chatId/messages
// @desc    Отправка сообщения в чат
// @access  Private
router.post('/chats/:chatId/messages', sendMessage);

// @route   POST /api/messages/chats/:chatId/read
// @desc    Отметить сообщения как прочитанные
// @access  Private
router.post('/chats/:chatId/read', markMessagesAsRead);

// @route   PUT /api/messages/chats/:chatId/close
// @desc    Закрыть чат
// @access  Private
router.put('/chats/:chatId/close', closeChat);

export default router;