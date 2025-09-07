import { Request, Response } from 'express';
import { AuthRequest } from '../types';

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderType: 'client' | 'agent' | 'admin' | 'system';
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  isRead: boolean;
  orderId?: string;
}

interface Chat {
  id: string;
  title: string;
  participants: Array<{
    id: string;
    name: string;
    type: 'client' | 'agent' | 'admin';
    avatar?: string;
    isOnline: boolean;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  orderId?: string;
  status: 'active' | 'closed';
  createdAt: string;
}

export const getChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // Mock chats data - replace with database query
    const mockChats: Chat[] = [
      {
        id: '1',
        title: 'Заявка ORD-2024-001',
        participants: [
          {
            id: req.user?.id || 'client1',
            name: req.user?.firstName + ' ' + req.user?.lastName || 'Клиент',
            type: 'client',
            isOnline: true
          },
          {
            id: 'agent1',
            name: 'Анна Петрова',
            type: 'agent',
            avatar: '/avatars/agent1.jpg',
            isOnline: true
          }
        ],
        lastMessage: {
          id: 'msg1',
          chatId: '1',
          senderId: 'agent1',
          senderName: 'Анна Петрова',
          senderType: 'agent',
          content: 'Документы получены, начинаем обработку заявки',
          type: 'text',
          timestamp: '2024-01-16T14:30:00Z',
          isRead: false
        },
        unreadCount: 2,
        orderId: 'ORD-2024-001',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Общие вопросы',
        participants: [
          {
            id: req.user?.id || 'client1',
            name: req.user?.firstName + ' ' + req.user?.lastName || 'Клиент',
            type: 'client',
            isOnline: true
          },
          {
            id: 'agent2',
            name: 'Михаил Сидоров',
            type: 'agent',
            avatar: '/avatars/agent2.jpg',
            isOnline: false
          }
        ],
        lastMessage: {
          id: 'msg2',
          chatId: '2',
          senderId: req.user?.id || 'client1',
          senderName: req.user?.firstName + ' ' + req.user?.lastName || 'Клиент',
          senderType: 'client',
          content: 'Спасибо за помощь!',
          type: 'text',
          timestamp: '2024-01-15T16:45:00Z',
          isRead: true
        },
        unreadCount: 0,
        status: 'active',
        createdAt: '2024-01-14T09:00:00Z'
      }
    ];

    // Filter chats where user is participant
    const userChats = mockChats.filter(chat => 
      chat.participants.some(p => p.id === req.user?.id)
    );

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedChats = userChats.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedChats,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(userChats.length / Number(limit)),
        totalItems: userChats.length,
        hasNextPage: endIndex < userChats.length,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении чатов'
    });
  }
};

export const getChatMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    // Check if user has access to this chat
    // In production, verify chat membership in database
    
    // Mock messages data - replace with database query
    const mockMessages: Message[] = [
      {
        id: '1',
        chatId: chatId,
        senderId: req.user?.id || 'client1',
        senderName: req.user?.firstName + ' ' + req.user?.lastName || 'Клиент',
        senderType: 'client',
        content: 'Здравствуйте! У меня вопрос по заявке ORD-2024-001',
        type: 'text',
        timestamp: '2024-01-15T10:30:00Z',
        isRead: true
      },
      {
        id: '2',
        chatId: chatId,
        senderId: 'agent1',
        senderName: 'Анна Петрова',
        senderType: 'agent',
        content: 'Добрый день! Я ваш персональный менеджер. Чем могу помочь?',
        type: 'text',
        timestamp: '2024-01-15T10:32:00Z',
        isRead: true
      },
      {
        id: '3',
        chatId: chatId,
        senderId: req.user?.id || 'client1',
        senderName: req.user?.firstName + ' ' + req.user?.lastName || 'Клиент',
        senderType: 'client',
        content: 'Нужно дополнить документы для груза',
        type: 'text',
        timestamp: '2024-01-15T10:35:00Z',
        isRead: true
      },
      {
        id: '4',
        chatId: chatId,
        senderId: req.user?.id || 'client1',
        senderName: req.user?.firstName + ' ' + req.user?.lastName || 'Клиент',
        senderType: 'client',
        content: 'Commercial_Invoice_Updated.pdf',
        type: 'file',
        fileUrl: '/documents/Commercial_Invoice_Updated.pdf',
        fileName: 'Commercial_Invoice_Updated.pdf',
        timestamp: '2024-01-15T10:36:00Z',
        isRead: true
      },
      {
        id: '5',
        chatId: chatId,
        senderId: 'agent1',
        senderName: 'Анна Петрова',
        senderType: 'agent',
        content: 'Документы получены, начинаем обработку заявки',
        type: 'text',
        timestamp: '2024-01-16T14:30:00Z',
        isRead: false
      },
      {
        id: '6',
        chatId: chatId,
        senderId: 'system',
        senderName: 'Система',
        senderType: 'system',
        content: 'Статус заявки изменен на "В обработке"',
        type: 'system',
        timestamp: '2024-01-16T14:31:00Z',
        isRead: false,
        orderId: 'ORD-2024-001'
      }
    ];

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedMessages = mockMessages.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedMessages,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(mockMessages.length / Number(limit)),
        totalItems: mockMessages.length,
        hasNextPage: endIndex < mockMessages.length,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении сообщений'
    });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { chatId } = req.params;
    const { content, type = 'text', fileName, fileUrl } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Содержимое сообщения обязательно'
      });
    }

    // Check if user has access to this chat
    // In production, verify chat membership in database

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: chatId,
      senderId: req.user?.id || 'user1',
      senderName: req.user?.firstName + ' ' + req.user?.lastName || 'Пользователь',
      senderType: (req.user?.userType === 'admin' ? 'system' : req.user?.userType) || 'client',
      content: content,
      type: type,
      fileUrl: fileUrl,
      fileName: fileName,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // In production, save message to database
    console.log('New message sent:', newMessage);

    // In production, send real-time notification to other participants
    // using WebSocket or similar technology

    res.status(201).json({
      success: true,
      message: 'Сообщение отправлено',
      data: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при отправке сообщения'
    });
  }
};

export const markMessagesAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    
    // Check if user has access to this chat
    // In production, verify chat membership in database
    
    // In production, mark messages as read in database
    console.log(`Marking messages as read in chat ${chatId} for user ${req.user?.id}`);

    res.status(200).json({
      success: true,
      message: 'Сообщения отмечены как прочитанные'
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при отметке сообщений как прочитанных'
    });
  }
};

export const createChat = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { title, participantIds, orderId } = req.body;
    
    if (!title || !participantIds || participantIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Название чата и участники обязательны'
      });
    }

    const newChat: Chat = {
      id: Date.now().toString(),
      title: title,
      participants: [
        {
          id: req.user?.id || 'user1',
          name: req.user?.firstName + ' ' + req.user?.lastName || 'Пользователь',
          type: (req.user?.userType === 'admin' ? 'agent' : req.user?.userType) || 'client',
          isOnline: true
        },
        // In production, fetch other participants from database
        ...participantIds.map((id: string) => ({
          id: id,
          name: 'Участник',
          type: 'agent' as const,
          isOnline: false
        }))
      ],
      unreadCount: 0,
      orderId: orderId,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // In production, save chat to database
    console.log('New chat created:', newChat);

    res.status(201).json({
      success: true,
      message: 'Чат создан',
      data: newChat
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании чата'
    });
  }
};

export const closeChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    
    // Check if user has permission to close this chat
    // In production, verify permissions in database
    
    // In production, update chat status in database
    console.log(`Closing chat ${chatId} by user ${req.user?.id}`);

    res.status(200).json({
      success: true,
      message: 'Чат закрыт'
    });
  } catch (error) {
    console.error('Close chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при закрытии чата'
    });
  }
};