import { Request, Response } from 'express';
import { AuthRequest } from '../types';

interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  transportType: 'freight' | 'auto' | 'railway';
  route: {
    departure: string;
    arrival: string;
  };
  cargo: {
    description: string;
    weight: number;
    containerType: string;
    isDangerous: boolean;
  };
  dates: {
    created: string;
    estimatedDeparture?: string;
    estimatedArrival?: string;
    actualDeparture?: string;
    actualArrival?: string;
  };
  tracking?: {
    currentLocation: string;
    vesselName?: string;
    vesselIMO?: string;
    lastUpdate: string;
  };
  cost: {
    total: number;
    currency: string;
    paid: boolean;
  };
  documents: string[];
  stages: Array<{
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'requires_confirmation';
    description: string;
    completedAt?: string;
    requiresClientConfirmation: boolean;
  }>;
}

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Mock orders data - replace with database query
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        clientId: req.user?.id || 'client1',
        status: 'in_transit',
        transportType: 'freight',
        route: {
          departure: 'Москва',
          arrival: 'Шанхай'
        },
        cargo: {
          description: 'Промышленное оборудование',
          weight: 15000,
          containerType: '40ft',
          isDangerous: false
        },
        dates: {
          created: '2024-01-15T10:00:00Z',
          estimatedDeparture: '2024-01-20T08:00:00Z',
          estimatedArrival: '2024-02-25T14:00:00Z',
          actualDeparture: '2024-01-20T09:30:00Z'
        },
        tracking: {
          currentLocation: 'Порт Шанхай',
          vesselName: 'MSC MAYA',
          vesselIMO: 'IMO9876543',
          lastUpdate: '2024-01-16T12:00:00Z'
        },
        cost: {
          total: 125000,
          currency: 'RUB',
          paid: true
        },
        documents: ['doc1', 'doc2'],
        stages: [
          {
            id: '1',
            name: 'Подача документов',
            status: 'completed',
            description: 'Документы поданы и проверены',
            completedAt: '2024-01-15T12:00:00Z',
            requiresClientConfirmation: false
          },
          {
            id: '2',
            name: 'Бронирование места',
            status: 'completed',
            description: 'Место на судне забронировано',
            completedAt: '2024-01-16T10:00:00Z',
            requiresClientConfirmation: false
          },
          {
            id: '3',
            name: 'Погрузка',
            status: 'completed',
            description: 'Груз погружен на судно',
            completedAt: '2024-01-20T10:00:00Z',
            requiresClientConfirmation: false
          },
          {
            id: '4',
            name: 'Отправление',
            status: 'in_progress',
            description: 'Судно в пути',
            requiresClientConfirmation: false
          },
          {
            id: '5',
            name: 'Прибытие',
            status: 'pending',
            description: 'Ожидается прибытие в порт назначения',
            requiresClientConfirmation: false
          },
          {
            id: '6',
            name: 'Выгрузка',
            status: 'pending',
            description: 'Выгрузка груза в порту',
            requiresClientConfirmation: true
          }
        ]
      }
    ];

    let filteredOrders = mockOrders;
    
    if (status) {
      filteredOrders = mockOrders.filter(order => order.status === status);
    }

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: paginatedOrders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(filteredOrders.length / Number(limit)),
        totalItems: filteredOrders.length,
        hasNextPage: endIndex < filteredOrders.length,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при получении заявок'
    });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // Mock order data - replace with database query
    const mockOrder: Order = {
      id: orderId,
      orderNumber: 'ORD-2024-001',
      clientId: req.user?.id || 'client1',
      status: 'in_transit',
      transportType: 'freight',
      route: {
        departure: 'Москва',
        arrival: 'Шанхай'
      },
      cargo: {
        description: 'Промышленное оборудование',
        weight: 15000,
        containerType: '40ft',
        isDangerous: false
      },
      dates: {
        created: '2024-01-15T10:00:00Z',
        estimatedDeparture: '2024-01-20T08:00:00Z',
        estimatedArrival: '2024-02-25T14:00:00Z',
        actualDeparture: '2024-01-20T09:30:00Z'
      },
      tracking: {
        currentLocation: 'Порт Шанхай',
        vesselName: 'MSC MAYA',
        vesselIMO: 'IMO9876543',
        lastUpdate: '2024-01-16T12:00:00Z'
      },
      cost: {
        total: 125000,
        currency: 'RUB',
        paid: true
      },
      documents: ['doc1', 'doc2'],
      stages: []
    };

    if (mockOrder.clientId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
    }

    return res.status(200).json({
      success: true,
      data: mockOrder
    });
  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при получении заявки'
    });
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    const requiredFields = ['transportType', 'departure', 'arrival', 'containerType', 'cargoDescription', 'weight'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Отсутствуют обязательные поля: ${missingFields.join(', ')}`
      });
    }

    // Create new order
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      clientId: req.user?.id || 'client1',
      status: 'pending',
      transportType: orderData.transportType,
      route: {
        departure: orderData.departure,
        arrival: orderData.arrival
      },
      cargo: {
        description: orderData.cargoDescription,
        weight: orderData.weight,
        containerType: orderData.containerType,
        isDangerous: orderData.isDangerous || false
      },
      dates: {
        created: new Date().toISOString(),
        estimatedDeparture: orderData.estimatedDeparture,
        estimatedArrival: orderData.estimatedArrival
      },
      cost: {
        total: orderData.totalCost || 0,
        currency: orderData.currency || 'RUB',
        paid: false
      },
      documents: [],
      stages: [
        {
          id: '1',
          name: 'Подтверждение заявки',
          status: 'requires_confirmation',
          description: 'Требуется подтверждение условий доставки',
          requiresClientConfirmation: true
        },
        {
          id: '2',
          name: 'Подготовка документов',
          status: 'pending',
          description: 'Подготовка документов для перевозки',
          requiresClientConfirmation: false
        },
        {
          id: '3',
          name: 'Отправка',
          status: 'pending',
          description: 'Отправка груза',
          requiresClientConfirmation: false
        },
        {
          id: '4',
          name: 'Доставка',
          status: 'pending',
          description: 'Доставка до места назначения',
          requiresClientConfirmation: false
        }
      ]
    };

    // In production, save to database
    console.log('New order created:', newOrder);

    return res.status(201).json({
      success: true,
      message: 'Заявка успешно создана',
      data: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при создании заявки'
    });
  }
};

export const confirmOrderStage = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, stageId } = req.params;
    
    // In production, update stage status in database
    console.log(`Confirming stage ${stageId} for order ${orderId} by user ${req.user?.id}`);
    
    return res.status(200).json({
      success: true,
      message: 'Этап подтвержден'
    });
  } catch (error) {
    console.error('Confirm stage error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при подтверждении этапа'
    });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    // Only agents can update order status
    if (req.user?.userType !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Недостаточно прав доступа'
      });
    }

    const { orderId } = req.params;
    const { status, notes } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный статус'
      });
    }

    // In production, update order in database
    console.log(`Updating order ${orderId} status to ${status} by agent ${req.user?.id}`);

    return res.status(200).json({
      success: true,
      message: 'Статус заявки обновлен'
    });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении статуса заявки'
    });
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // Check if user owns this order or is an agent
    // In production, check ownership in database
    
    // Only allow deletion if order is in pending status
    console.log(`Deleting order ${orderId} by user ${req.user?.id}`);

    return res.status(200).json({
      success: true,
      message: 'Заявка удалена'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при удалении заявки'
    });
  }
};