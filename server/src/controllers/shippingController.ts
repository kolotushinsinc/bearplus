import { Request, Response } from 'express';
import { AuthRequest } from '../types';

interface ShippingCalculationRequest {
  transportType: 'freight' | 'auto' | 'railway';
  departure: string;
  arrival: string;
  containerType: string;
  cargoType: 'dangerous' | 'normal';
  weight: string;
  departureDate?: string;
  arrivalDate?: string;
  msdsFiles?: any[];
}

interface RouteRates {
  [key: string]: {
    baseRate: number;
    transitDays: number;
  };
}

interface MockRatesData {
  freight: RouteRates;
  auto: RouteRates;
  railway: RouteRates;
}

interface RateCalculationResult {
  route: string;
  transitTime: number;
  totalCost: number;
  currency: string;
  breakdown: {
    freightRate: number;
    freightMargin: number;
    currencyConversion: number;
    containerRental: number;
    containerMargin: number;
    autoDelivery: number;
    autoMargin: number;
    railwayDelivery: number;
    railwayMargin: number;
  };
  isDangerous: boolean;
  needsReview: boolean;
}

// Mock rates - in production these would come from database or external APIs
const mockRates: MockRatesData = {
  freight: {
    'Москва-Шанхай': { baseRate: 2500, transitDays: 35 },
    'СПб-Гамбург': { baseRate: 1800, transitDays: 25 },
    'Владивосток-Лос-Анджелес': { baseRate: 3200, transitDays: 20 },
  },
  auto: {
    'Москва-Минск': { baseRate: 500, transitDays: 2 },
    'СПб-Хельсинки': { baseRate: 300, transitDays: 1 },
    'Екатеринбург-Астана': { baseRate: 800, transitDays: 3 },
  },
  railway: {
    'Москва-Пекин': { baseRate: 1200, transitDays: 14 },
    'СПб-Берлин': { baseRate: 900, transitDays: 10 },
    'Новосибирск-Алматы': { baseRate: 600, transitDays: 5 },
  }
};

const currencyRates = {
  USD: 1.0,
  EUR: 0.85,
  RUB: 75.0
};

const systemSettings = {
  currencyVolatilityMultiplier: 1.05, // Configurable from admin panel
  margins: {
    freight: 0.15, // 15%
    container: 500, // Fixed amount in RUB
    auto: 0.20, // 20%
    railway: 0.18 // 18%
  }
};

export const calculateShippingRate = async (req: Request, res: Response) => {
  try {
    const data: ShippingCalculationRequest = req.body;

    // Validate required fields
    if (!data.departure || !data.arrival || !data.containerType || !data.weight) {
      return res.status(400).json({
        success: false,
        message: 'Отсутствуют обязательные поля'
      });
    }

    // Check if cargo is dangerous and needs review
    if (data.cargoType === 'dangerous') {
      // Create a review request for logistics team
      const reviewRequest = {
        clientData: {
          departure: data.departure,
          arrival: data.arrival,
          containerType: data.containerType,
          weight: data.weight,
          transportType: data.transportType,
          msdsFiles: data.msdsFiles || []
        },
        status: 'pending_review',
        createdAt: new Date(),
        reviewedAt: null,
        reviewedBy: null
      };

      // In production, save to database
      // await DangerousCargoReview.create(reviewRequest);

      return res.status(200).json({
        success: true,
        message: 'Запрос с опасным грузом отправлен на рассмотрение логистам',
        needsReview: true,
        reviewId: 'DCR-' + Date.now()
      });
    }

    // Find route in mock data
    const route = `${data.departure}-${data.arrival}`;
    const rateData = mockRates[data.transportType]?.[route];

    if (!rateData) {
      return res.status(404).json({
        success: false,
        message: 'Маршрут не найден. Обратитесь к менеджеру для индивидуального расчета.'
      });
    }

    // Calculate shipping cost using the formula
    const weight = parseFloat(data.weight);
    const baseFreightRate = rateData.baseRate;
    
    // Step 1: Add freight margin
    const freightWithMargin = baseFreightRate * (1 + systemSettings.margins.freight);
    
    // Step 2: Apply currency conversion volatility
    const currencyAdjustedRate = freightWithMargin * systemSettings.currencyVolatilityMultiplier;
    
    // Step 3: Add container rental and margin
    const containerRental = 200; // Base container rental
    const containerWithMargin = containerRental + systemSettings.margins.container;
    
    // Step 4: Add auto delivery costs
    const autoDeliveryBase = data.transportType === 'auto' ? 300 : 150; // Higher if primary transport
    const autoDeliveryWithMargin = autoDeliveryBase * (1 + systemSettings.margins.auto);
    
    // Step 5: Add railway delivery costs
    const railwayDeliveryBase = data.transportType === 'railway' ? 400 : 100; // Higher if primary transport
    const railwayDeliveryWithMargin = railwayDeliveryBase * (1 + systemSettings.margins.railway);
    
    // Final calculation
    const totalCost = Math.round(
      currencyAdjustedRate +
      containerWithMargin +
      autoDeliveryWithMargin +
      railwayDeliveryWithMargin
    );

    const result: RateCalculationResult = {
      route: route,
      transitTime: rateData.transitDays,
      totalCost: totalCost,
      currency: 'RUB',
      breakdown: {
        freightRate: baseFreightRate,
        freightMargin: freightWithMargin - baseFreightRate,
        currencyConversion: currencyAdjustedRate - freightWithMargin,
        containerRental: containerRental,
        containerMargin: systemSettings.margins.container,
        autoDelivery: autoDeliveryBase,
        autoMargin: autoDeliveryWithMargin - autoDeliveryBase,
        railwayDelivery: railwayDeliveryBase,
        railwayMargin: railwayDeliveryWithMargin - railwayDeliveryBase
      },
      isDangerous: false,
      needsReview: false
    };

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Shipping calculation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при расчете стоимости доставки'
    });
  }
};

export const submitDangerousCargoRequest = async (req: AuthRequest, res: Response) => {
  try {
    const requestData = req.body;
    
    // In production, save to database
    const reviewRequest = {
      id: 'DCR-' + Date.now(),
      clientId: req.user?.id || null,
      clientEmail: req.user?.email || requestData.email,
      cargoDetails: requestData,
      status: 'pending_review',
      priority: requestData.priority || 'normal',
      createdAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      comments: [],
      documents: requestData.msdsFiles || []
    };

    // Send notification to logistics team
    // await sendNotificationToLogistics(reviewRequest);

    res.status(201).json({
      success: true,
      message: 'Запрос успешно отправлен на рассмотрение',
      reviewId: reviewRequest.id,
      estimatedReviewTime: '2-4 часа'
    });

  } catch (error) {
    console.error('Dangerous cargo request error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при отправке запроса'
    });
  }
};

export const getSystemSettings = async (req: AuthRequest, res: Response) => {
  try {
    // In production, fetch from database with admin permissions check
    if (req.user?.userType !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Недостаточно прав доступа'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        currencyVolatilityMultiplier: systemSettings.currencyVolatilityMultiplier,
        margins: systemSettings.margins,
        currencyRates: currencyRates
      }
    });

  } catch (error) {
    console.error('Get system settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при получении настроек'
    });
  }
};

export const updateSystemSettings = async (req: AuthRequest, res: Response) => {
  try {
    // In production, check admin permissions and save to database
    if (req.user?.userType !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Недостаточно прав доступа'
      });
    }

    const { currencyVolatilityMultiplier, margins } = req.body;

    if (currencyVolatilityMultiplier) {
      systemSettings.currencyVolatilityMultiplier = currencyVolatilityMultiplier;
    }

    if (margins) {
      systemSettings.margins = { ...systemSettings.margins, ...margins };
    }

    return res.status(200).json({
      success: true,
      message: 'Настройки успешно обновлены',
      data: systemSettings
    });

  } catch (error) {
    console.error('Update system settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении настроек'
    });
  }
};