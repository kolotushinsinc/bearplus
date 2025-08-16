import { Request, Response } from 'express';
import { AuthRequest } from '../types';

interface MarginSetting {
  id: string;
  agentId: string;
  type: 'container_rental' | 'railway' | 'freight' | 'auto_delivery';
  marginPercent: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

// Временное хранилище настроек маржи
let marginSettings: MarginSetting[] = [];

// Временное хранилище курсов валют
let currencyRates: CurrencyRate[] = [
  { from: 'USD', to: 'RUB', rate: 92.5, lastUpdated: new Date().toISOString() },
  { from: 'EUR', to: 'RUB', rate: 100.2, lastUpdated: new Date().toISOString() },
  { from: 'CNY', to: 'RUB', rate: 12.8, lastUpdated: new Date().toISOString() }
];

export const getMarginSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Фильтруем настройки по агенту
    const agentMargins = marginSettings.filter(margin => margin.agentId === req.user?.id);
    
    // Если у агента нет настроек, создаем дефолтные
    if (agentMargins.length === 0) {
      const defaultMargins: MarginSetting[] = [
        {
          id: Date.now().toString() + '1',
          agentId: req.user?.id || '',
          type: 'container_rental',
          marginPercent: 15,
          isActive: true,
          description: 'Маржа на аренду чужих контейнеров',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now().toString() + '2',
          agentId: req.user?.id || '',
          type: 'railway',
          marginPercent: 12,
          isActive: true,
          description: 'Маржа на ЖД доставку',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now().toString() + '3',
          agentId: req.user?.id || '',
          type: 'freight',
          marginPercent: 18,
          isActive: true,
          description: 'Маржа на морской фрахт',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: Date.now().toString() + '4',
          agentId: req.user?.id || '',
          type: 'auto_delivery',
          marginPercent: 20,
          isActive: true,
          description: 'Маржа на автодоставку',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      marginSettings.push(...defaultMargins);
      
      res.status(200).json({
        success: true,
        data: {
          margins: defaultMargins,
          currencies: currencyRates
        }
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          margins: agentMargins,
          currencies: currencyRates
        }
      });
    }
  } catch (error) {
    console.error('Get margin settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении настроек маржи'
    });
  }
};

export const updateMarginSetting = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const { marginPercent, isActive, description } = req.body;

    const marginIndex = marginSettings.findIndex(margin => 
      margin.id === id && margin.agentId === req.user?.id
    );

    if (marginIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Настройка маржи не найдена'
      });
    }

    // Валидация маржи
    if (marginPercent !== undefined) {
      if (marginPercent < 0 || marginPercent > 100) {
        return res.status(400).json({
          success: false,
          message: 'Маржа должна быть от 0 до 100%'
        });
      }
    }

    const updatedMargin: MarginSetting = {
      ...marginSettings[marginIndex],
      marginPercent: marginPercent !== undefined ? parseFloat(marginPercent) : marginSettings[marginIndex].marginPercent,
      isActive: isActive !== undefined ? isActive : marginSettings[marginIndex].isActive,
      description: description !== undefined ? description : marginSettings[marginIndex].description,
      updatedAt: new Date().toISOString()
    };

    marginSettings[marginIndex] = updatedMargin;

    res.status(200).json({
      success: true,
      message: 'Настройка маржи обновлена',
      data: updatedMargin
    });
  } catch (error) {
    console.error('Update margin setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении настройки маржи'
    });
  }
};

export const updateCurrencyRates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // В реальном приложении здесь будет запрос к API ЦБ РФ
    // Пример URL: https://www.cbr-xml-daily.ru/daily_json.js
    
    // Симуляция обновления курсов
    const updatedRates = currencyRates.map(rate => ({
      ...rate,
      rate: rate.rate + (Math.random() - 0.5) * 2, // Случайное изменение ±1
      lastUpdated: new Date().toISOString()
    }));

    currencyRates = updatedRates;

    res.status(200).json({
      success: true,
      message: 'Курсы валют обновлены',
      data: updatedRates
    });
  } catch (error) {
    console.error('Update currency rates error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении курсов валют'
    });
  }
};

export const calculateMargin = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { baseAmount, serviceType, currency = 'USD' } = req.body;

    if (!baseAmount || !serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Базовая сумма и тип услуги обязательны'
      });
    }

    // Находим настройку маржи для данного типа услуги
    const marginSetting = marginSettings.find(margin => 
      margin.agentId === req.user?.id && 
      margin.type === serviceType && 
      margin.isActive
    );

    if (!marginSetting) {
      return res.status(404).json({
        success: false,
        message: 'Настройка маржи для данного типа услуги не найдена'
      });
    }

    const baseAmountNum = parseFloat(baseAmount);
    const marginAmount = (baseAmountNum * marginSetting.marginPercent) / 100;
    const totalAmount = baseAmountNum + marginAmount;

    // Конвертация валют если нужно
    let convertedAmount = totalAmount;
    let conversionRate = 1;
    
    if (currency !== 'USD') {
      const rate = currencyRates.find(r => r.from === 'USD' && r.to === currency);
      if (rate) {
        conversionRate = rate.rate;
        convertedAmount = totalAmount * rate.rate;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        baseAmount: baseAmountNum,
        marginPercent: marginSetting.marginPercent,
        marginAmount: marginAmount,
        totalAmount: totalAmount,
        currency: currency,
        convertedAmount: currency !== 'USD' ? convertedAmount : undefined,
        conversionRate: currency !== 'USD' ? conversionRate : undefined,
        calculation: {
          service: serviceType,
          marginSetting: marginSetting.description
        }
      }
    });
  } catch (error) {
    console.error('Calculate margin error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при расчете маржи'
    });
  }
};