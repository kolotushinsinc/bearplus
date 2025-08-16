import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import https from 'https';

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  nominal: number;
  lastUpdated: string;
}

// Временное хранилище курсов валют
let currencyStorage: CurrencyRate[] = [];

export const getCurrencyRates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: currencyStorage,
      lastUpdated: currencyStorage.length > 0 ? currencyStorage[0].lastUpdated : null
    });
  } catch (error) {
    console.error('Get currency rates error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении курсов валют'
    });
  }
};

export const updateCurrencyRates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // URL ЦБ РФ для получения курсов валют
    const cbUrl = 'https://www.cbr.ru/scripts/XML_daily.asp';
    
    // Получаем данные с сайта ЦБ РФ
    const xmlData = await fetchCBRData(cbUrl);
    
    // Парсим XML данные (простой парсинг без библиотеки)
    const rates: CurrencyRate[] = [];
    const lastUpdated = new Date().toISOString();
    
    // Простой XML парсинг для курсов валют
    const valuteMatches = xmlData.match(/<Valute[^>]*>[\s\S]*?<\/Valute>/g);
    
    if (valuteMatches) {
      valuteMatches.forEach((valute: string) => {
        const codeMatch = valute.match(/<CharCode>([^<]+)<\/CharCode>/);
        const nameMatch = valute.match(/<Name>([^<]+)<\/Name>/);
        const nominalMatch = valute.match(/<Nominal>([^<]+)<\/Nominal>/);
        const valueMatch = valute.match(/<Value>([^<]+)<\/Value>/);
        
        if (codeMatch && nameMatch && nominalMatch && valueMatch) {
          const code = codeMatch[1];
          const name = nameMatch[1];
          const nominal = parseInt(nominalMatch[1]);
          const value = parseFloat(valueMatch[1].replace(',', '.'));
          
          // Добавляем основные валюты
          if (['USD', 'EUR', 'CNY', 'GBP', 'JPY'].includes(code)) {
            rates.push({
              code,
              name,
              rate: value / nominal, // Нормализуем к 1 единице валюты
              nominal,
              lastUpdated
            });
          }
        }
      });
    }
    
    // Сохраняем в хранилище
    currencyStorage = rates;
    
    res.status(200).json({
      success: true,
      message: 'Курсы валют обновлены',
      data: rates,
      lastUpdated
    });
  } catch (error) {
    console.error('Update currency rates error:', error);
    
    // Если произошла ошибка, возвращаем mock данные
    const mockRates: CurrencyRate[] = [
      {
        code: 'USD',
        name: 'Доллар США',
        rate: 92.5,
        nominal: 1,
        lastUpdated: new Date().toISOString()
      },
      {
        code: 'EUR',
        name: 'Евро',
        rate: 100.2,
        nominal: 1,
        lastUpdated: new Date().toISOString()
      },
      {
        code: 'CNY',
        name: 'Китайский юань',
        rate: 12.8,
        nominal: 1,
        lastUpdated: new Date().toISOString()
      }
    ];
    
    currencyStorage = mockRates;
    
    res.status(200).json({
      success: true,
      message: 'Использованы резервные курсы валют (ЦБ РФ недоступен)',
      data: mockRates,
      lastUpdated: new Date().toISOString()
    });
  }
};

export const convertCurrency = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;
    
    if (!amount || !fromCurrency || !toCurrency) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать сумму и валюты для конвертации'
      });
    }

    // Если валюты одинаковые
    if (fromCurrency === toCurrency) {
      return res.status(200).json({
        success: true,
        data: {
          originalAmount: amount,
          convertedAmount: amount,
          fromCurrency,
          toCurrency,
          rate: 1,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Получаем курсы валют
    let fromRate = 1; // RUB = 1
    let toRate = 1; // RUB = 1

    if (fromCurrency !== 'RUB') {
      const fromCurrencyData = currencyStorage.find(c => c.code === fromCurrency);
      if (!fromCurrencyData) {
        return res.status(400).json({
          success: false,
          message: `Курс валюты ${fromCurrency} не найден`
        });
      }
      fromRate = fromCurrencyData.rate;
    }

    if (toCurrency !== 'RUB') {
      const toCurrencyData = currencyStorage.find(c => c.code === toCurrency);
      if (!toCurrencyData) {
        return res.status(400).json({
          success: false,
          message: `Курс валюты ${toCurrency} не найден`
        });
      }
      toRate = toCurrencyData.rate;
    }

    // Конвертация: amount -> RUB -> target currency
    const rubAmount = fromCurrency === 'RUB' ? amount : amount * fromRate;
    const convertedAmount = toCurrency === 'RUB' ? rubAmount : rubAmount / toRate;
    const conversionRate = convertedAmount / amount;

    res.status(200).json({
      success: true,
      data: {
        originalAmount: amount,
        convertedAmount: Math.round(convertedAmount * 100) / 100,
        fromCurrency,
        toCurrency,
        rate: Math.round(conversionRate * 10000) / 10000,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Currency conversion error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при конвертации валют'
    });
  }
};

// Вспомогательная функция для получения данных с ЦБ РФ
function fetchCBRData(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve(data);
      });
      
      response.on('error', (error) => {
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Автоматическое обновление курсов каждые 30 минут
setInterval(async () => {
  try {
    console.log('Автоматическое обновление курсов валют...');
    // Создаем mock request для автоматического обновления
    const mockReq = {
      user: { userType: 'system' },
      body: {},
      params: {},
      query: {}
    } as unknown as AuthRequest;
    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => console.log(`Currency update response: ${code}`, data)
      })
    } as unknown as Response;
    
    await updateCurrencyRates(mockReq, mockRes);
  } catch (error) {
    console.error('Автоматическое обновление курсов не удалось:', error);
  }
}, 30 * 60 * 1000); // 30 минут