import { Request, Response } from 'express';
import { AuthRequest } from '../types';

interface Client {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  userType: 'client' | 'agent';
  currentDiscount: number;
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate: string;
  isActive: boolean;
  agentId?: string; // Агент, который управляет этим клиентом
}

interface LoyaltyRule {
  id: string;
  agentId: string;
  name: string;
  condition: 'orders_count' | 'revenue_amount' | 'manual';
  threshold: number;
  discountPercent: number;
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface DiscountHistory {
  id: string;
  clientId: string;
  agentId: string;
  oldDiscount: number;
  newDiscount: number;
  reason: string;
  appliedAt: string;
}

// Временное хранилище
let loyaltyRules: LoyaltyRule[] = [];
let discountHistory: DiscountHistory[] = [];

// Mock клиенты (в production будет из базы данных)
const mockClients: Client[] = [
  {
    id: 'client1',
    name: 'Иван Петров',
    email: 'ivan@example.com',
    companyName: 'ООО "Логистика Плюс"',
    userType: 'client',
    currentDiscount: 5,
    totalOrders: 12,
    totalRevenue: 145000,
    lastOrderDate: '2024-01-10',
    isActive: true
  },
  {
    id: 'client2',
    name: 'Анна Сидорова',
    email: 'anna@company.ru',
    companyName: 'ИП Сидорова А.В.',
    userType: 'client',
    currentDiscount: 10,
    totalOrders: 8,
    totalRevenue: 98000,
    lastOrderDate: '2024-01-15',
    isActive: true
  },
  {
    id: 'client3',
    name: 'Михаил Козлов',
    email: 'kozlov@trade.com',
    companyName: 'ТД "Импорт-Экспорт"',
    userType: 'client',
    currentDiscount: 0,
    totalOrders: 3,
    totalRevenue: 35000,
    lastOrderDate: '2024-01-12',
    isActive: true
  }
];

export const getClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    let filteredClients = [...mockClients];
    
    // Поиск
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredClients = filteredClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        (client.companyName && client.companyName.toLowerCase().includes(searchTerm))
      );
    }
    
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedClients = filteredClients.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedClients,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(filteredClients.length / Number(limit)),
        totalItems: filteredClients.length,
        hasNextPage: endIndex < filteredClients.length,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении клиентов'
    });
  }
};

export const getLoyaltyRules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Фильтруем правила по агенту
    const agentRules = loyaltyRules.filter(rule => rule.agentId === req.user?.id);
    
    // Если у агента нет правил, создаем дефолтные
    if (agentRules.length === 0) {
      const defaultRules: LoyaltyRule[] = [
        {
          id: Date.now().toString() + '1',
          agentId: req.user?.id || '',
          name: 'Постоянный клиент',
          condition: 'orders_count',
          threshold: 10,
          discountPercent: 5,
          isActive: true,
          description: 'Скидка для клиентов с 10+ заказами',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now().toString() + '2',
          agentId: req.user?.id || '',
          name: 'VIP клиент',
          condition: 'revenue_amount',
          threshold: 100000,
          discountPercent: 10,
          isActive: true,
          description: 'Скидка для клиентов с оборотом 100k+',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now().toString() + '3',
          agentId: req.user?.id || '',
          name: 'Премиум партнер',
          condition: 'revenue_amount',
          threshold: 500000,
          discountPercent: 15,
          isActive: true,
          description: 'Максимальная скидка для крупных партнеров',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      loyaltyRules.push(...defaultRules);
      
      res.status(200).json({
        success: true,
        data: defaultRules
      });
    } else {
      res.status(200).json({
        success: true,
        data: agentRules
      });
    }
  } catch (error) {
    console.error('Get loyalty rules error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении правил лояльности'
    });
  }
};

export const updateClientDiscount = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { clientId } = req.params;
    const { discount, reason } = req.body;

    if (discount === undefined || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Размер скидки и причина изменения обязательны'
      });
    }

    if (discount < 0 || discount > 50) {
      return res.status(400).json({
        success: false,
        message: 'Скидка должна быть от 0 до 50%'
      });
    }

    const clientIndex = mockClients.findIndex(client => client.id === clientId);
    
    if (clientIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Клиент не найден'
      });
    }

    const oldDiscount = mockClients[clientIndex].currentDiscount;
    mockClients[clientIndex].currentDiscount = discount;

    // Записываем в историю изменений
    const historyEntry: DiscountHistory = {
      id: Date.now().toString(),
      clientId: clientId,
      agentId: req.user?.id || '',
      oldDiscount: oldDiscount,
      newDiscount: discount,
      reason: reason,
      appliedAt: new Date().toISOString()
    };

    discountHistory.push(historyEntry);

    res.status(200).json({
      success: true,
      message: 'Скидка клиента обновлена',
      data: {
        client: mockClients[clientIndex],
        history: historyEntry
      }
    });
  } catch (error) {
    console.error('Update client discount error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении скидки клиента'
    });
  }
};

export const updateLoyaltyRule = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const ruleIndex = loyaltyRules.findIndex(rule => 
      rule.id === id && rule.agentId === req.user?.id
    );

    if (ruleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Правило лояльности не найдено'
      });
    }

    loyaltyRules[ruleIndex] = {
      ...loyaltyRules[ruleIndex],
      isActive: isActive !== undefined ? isActive : loyaltyRules[ruleIndex].isActive,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'Правило лояльности обновлено',
      data: loyaltyRules[ruleIndex]
    });
  } catch (error) {
    console.error('Update loyalty rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении правила лояльности'
    });
  }
};

export const calculateSuggestedDiscount = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { clientId } = req.params;
    
    const client = mockClients.find(c => c.id === clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Клиент не найден'
      });
    }

    const agentRules = loyaltyRules.filter(rule => 
      rule.agentId === req.user?.id && rule.isActive
    );

    let maxDiscount = 0;
    const appliedRules: LoyaltyRule[] = [];

    agentRules.forEach(rule => {
      let qualifies = false;
      
      if (rule.condition === 'orders_count' && client.totalOrders >= rule.threshold) {
        qualifies = true;
      } else if (rule.condition === 'revenue_amount' && client.totalRevenue >= rule.threshold) {
        qualifies = true;
      }
      
      if (qualifies) {
        appliedRules.push(rule);
        if (rule.discountPercent > maxDiscount) {
          maxDiscount = rule.discountPercent;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        clientId: clientId,
        currentDiscount: client.currentDiscount,
        suggestedDiscount: maxDiscount,
        appliedRules: appliedRules,
        canIncrease: maxDiscount > client.currentDiscount
      }
    });
  } catch (error) {
    console.error('Calculate suggested discount error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при расчете рекомендуемой скидки'
    });
  }
};

export const getDiscountHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId } = req.query;
    
    let history = discountHistory.filter(h => h.agentId === req.user?.id);
    
    if (clientId) {
      history = history.filter(h => h.clientId === clientId);
    }
    
    // Сортируем по дате (новые сначала)
    history.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Get discount history error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении истории скидок'
    });
  }
};