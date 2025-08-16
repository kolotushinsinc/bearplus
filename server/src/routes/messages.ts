import express from 'express';
import {
  getChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  createChat,
  closeChat
} from '../controllers/messagesController';

import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/messages/chats
// @desc    Получение списка чатов пользователя
// @access  Private
router.get('/chats', authenticateToken, getChats);

// @route   POST /api/messages/chats
// @desc    Создание нового чата
// @access  Private
router.post('/chats', authenticateToken, createChat);

// @route   GET /api/messages/chats/:chatId/messages
// @desc    Получение сообщений в чате
// @access  Private
router.get('/chats/:chatId/messages', authenticateToken, getChatMessages);

// @route   POST /api/messages/chats/:chatId/messages
// @desc    Отправка сообщения в чат
// @access  Private
router.post('/chats/:chatId/messages', authenticateToken, sendMessage);

// @route   PUT /api/messages/chats/:chatId/read
// @desc    Отметка сообщений как прочитанных
// @access  Private
router.put('/chats/:chatId/read', authenticateToken, markMessagesAsRead);

// @route   PUT /api/messages/chats/:chatId/close
// @desc    Закрытие чата
// @access  Private
router.put('/chats/:chatId/close', authenticateToken, closeChat);

export default router;