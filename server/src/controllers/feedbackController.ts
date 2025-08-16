import { Request, Response } from 'express';
import { AuthRequest } from '../types';

interface FeedbackRequestBody {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, message }: FeedbackRequestBody = req.body;

    // Validate required fields
    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Все поля обязательны для заполнения'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный формат email'
      });
    }

    // In production, save to database
    const feedbackRequest = {
      id: 'FB-' + Date.now(),
      name,
      phone,
      email,
      message,
      status: 'new',
      priority: 'normal',
      createdAt: new Date(),
      processedAt: null,
      processedBy: null,
      response: null
    };

    // Log feedback for now (in production would save to database)
    console.log('New feedback received:', feedbackRequest);

    // In production, send notification to support team
    // await sendNotificationToSupport(feedbackRequest);

    // Send auto-reply email to customer
    // await sendAutoReplyEmail(email, name);

    return res.status(201).json({
      success: true,
      message: 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.',
      feedbackId: feedbackRequest.id
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при отправке сообщения'
    });
  }
};

export const getFeedbackList = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is agent (has access to view feedback)
    if (req.user?.userType !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Недостаточно прав доступа'
      });
    }

    // In production, fetch from database with pagination
    const mockFeedbackList = [
      {
        id: 'FB-1704089400000',
        name: 'Иван Петров',
        phone: '+7 (999) 123-45-67',
        email: 'ivan@example.com',
        message: 'Интересует стоимость доставки груза из Москвы в Шанхай',
        status: 'new',
        priority: 'normal',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        processedAt: null,
        processedBy: null,
        response: null
      },
      {
        id: 'FB-1704003000000',
        name: 'Мария Сидорова',
        phone: '+7 (888) 987-65-43',
        email: 'maria@company.ru',
        message: 'Нужна помощь с оформлением документов для опасного груза',
        status: 'in_progress',
        priority: 'high',
        createdAt: new Date('2023-12-31T10:00:00Z'),
        processedAt: new Date('2023-12-31T11:00:00Z'),
        processedBy: req.user?.id,
        response: 'Обрабатывается специалистом по опасным грузам'
      }
    ];

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    let filteredFeedback = mockFeedbackList;
    if (status) {
      filteredFeedback = mockFeedbackList.filter(item => item.status === status);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: paginatedFeedback,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredFeedback.length / limit),
        totalItems: filteredFeedback.length,
        hasNextPage: endIndex < filteredFeedback.length,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get feedback list error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка обращений'
    });
  }
};

export const updateFeedbackStatus = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is agent
    if (req.user?.userType !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Недостаточно прав доступа'
      });
    }

    const { feedbackId } = req.params;
    const { status, response, priority } = req.body;

    // Validate status
    const validStatuses = ['new', 'in_progress', 'resolved', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный статус'
      });
    }

    // In production, update in database
    const updatedFeedback = {
      id: feedbackId,
      status: status || 'in_progress',
      response: response || null,
      priority: priority || 'normal',
      processedAt: new Date(),
      processedBy: req.user?.id
    };

    console.log('Feedback updated:', updatedFeedback);

    return res.status(200).json({
      success: true,
      message: 'Статус обращения обновлен',
      data: updatedFeedback
    });

  } catch (error) {
    console.error('Update feedback status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении статуса обращения'
    });
  }
};

export const respondToFeedback = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is agent
    if (req.user?.userType !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Недостаточно прав доступа'
      });
    }

    const { feedbackId } = req.params;
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({
        success: false,
        message: 'Текст ответа обязателен'
      });
    }

    // In production, update in database and send email to customer
    const feedbackResponse = {
      feedbackId,
      response,
      respondedBy: req.user?.id,
      respondedAt: new Date(),
      status: 'resolved'
    };

    console.log('Feedback response sent:', feedbackResponse);

    // Send email to customer with response
    // await sendResponseEmail(feedbackId, response);

    return res.status(200).json({
      success: true,
      message: 'Ответ отправлен клиенту',
      data: feedbackResponse
    });

  } catch (error) {
    console.error('Respond to feedback error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при отправке ответа'
    });
  }
};