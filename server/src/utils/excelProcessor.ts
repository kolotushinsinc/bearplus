import fs from 'fs';
import path from 'path';

// Интерфейсы для данных Excel
export interface ExcelRateData {
  origin: string;
  destination: string;
  serviceType: 'freight' | 'railway' | 'auto' | 'container';
  containerType?: string;
  weight?: number;
  volume?: number;
  rate: number;
  currency: string;
  validFrom: string;
  validTo: string;
  transitTime?: number;
  notes?: string;
}

export interface ExcelProcessResult {
  success: boolean;
  data?: ExcelRateData[];
  error?: string;
  totalRows?: number;
  validRows?: number;
  errors?: string[];
}

// Основная функция для обработки Excel файлов
export const processExcelFile = async (filePath: string): Promise<ExcelProcessResult> => {
  try {
    // Проверяем существование файла
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: 'Файл не найден'
      };
    }

    // Получаем расширение файла
    const fileExtension = path.extname(filePath).toLowerCase();
    
    if (!['.xlsx', '.xls'].includes(fileExtension)) {
      return {
        success: false,
        error: 'Неподдерживаемый формат файла. Поддерживаются только .xlsx и .xls'
      };
    }

    // TODO: Установить и использовать библиотеку xlsx
    // const XLSX = require('xlsx');
    // const workbook = XLSX.readFile(filePath);
    
    // Временная mock-реализация
    const mockData: ExcelRateData[] = [
      {
        origin: 'Москва',
        destination: 'Пекин',
        serviceType: 'freight',
        containerType: '20GP',
        weight: 1000,
        volume: 33,
        rate: 2500,
        currency: 'USD',
        validFrom: '2024-01-01',
        validTo: '2024-12-31',
        transitTime: 14,
        notes: 'Стандартная ставка'
      },
      {
        origin: 'Санкт-Петербург',
        destination: 'Шанхай',
        serviceType: 'freight',
        containerType: '40GP',
        weight: 2000,
        volume: 67,
        rate: 4500,
        currency: 'USD',
        validFrom: '2024-01-01',
        validTo: '2024-12-31',
        transitTime: 16,
        notes: 'Экспресс доставка'
      }
    ];

    return {
      success: true,
      data: mockData,
      totalRows: mockData.length,
      validRows: mockData.length,
      errors: []
    };

  } catch (error) {
    console.error('Excel processing error:', error);
    return {
      success: false,
      error: `Ошибка при обработке файла: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
    };
  }
};

// Функция для генерации Excel шаблона
export const generateExcelTemplate = (): Buffer => {
  try {
    // TODO: Установить и использовать библиотеку xlsx
    // const XLSX = require('xlsx');
    
    // Структура шаблона
    const templateData = [
      {
        'Откуда': 'Москва',
        'Куда': 'Пекин', 
        'Тип услуги': 'freight',
        'Тип контейнера': '20GP',
        'Вес (кг)': 1000,
        'Объем (м³)': 33,
        'Ставка': 2500,
        'Валюта': 'USD',
        'Действует с': '2024-01-01',
        'Действует до': '2024-12-31',
        'Время доставки (дни)': 14,
        'Примечания': 'Пример ставки'
      }
    ];

    // Временная реализация - возвращаем пустой буфер
    // В реальной реализации здесь будет создание Excel файла
    const csvContent = Object.keys(templateData[0]).join(',') + '\n' + 
      Object.values(templateData[0]).join(',');
    
    return Buffer.from(csvContent, 'utf-8');

  } catch (error) {
    console.error('Template generation error:', error);
    throw new Error('Ошибка при создании шаблона');
  }
};

// Функция для экспорта данных в Excel
export const exportToExcel = (data: ExcelRateData[]): Buffer => {
  try {
    // TODO: Установить и использовать библиотеку xlsx
    // const XLSX = require('xlsx');
    
    // Временная реализация - возвращаем CSV
    if (!data.length) {
      throw new Error('Нет данных для экспорта');
    }

    const headers = [
      'Откуда', 'Куда', 'Тип услуги', 'Тип контейнера', 
      'Вес (кг)', 'Объем (м³)', 'Ставка', 'Валюта',
      'Действует с', 'Действует до', 'Время доставки (дни)', 'Примечания'
    ];

    const csvRows = [
      headers.join(','),
      ...data.map(row => [
        row.origin,
        row.destination,
        row.serviceType,
        row.containerType || '',
        row.weight || '',
        row.volume || '',
        row.rate,
        row.currency,
        row.validFrom,
        row.validTo,
        row.transitTime || '',
        row.notes || ''
      ].join(','))
    ];

    return Buffer.from(csvRows.join('\n'), 'utf-8');

  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Ошибка при экспорте данных');
  }
};

// Функция валидации данных из Excel
export const validateExcelData = (data: any[]): { valid: ExcelRateData[], errors: string[] } => {
  const valid: ExcelRateData[] = [];
  const errors: string[] = [];

  data.forEach((row, index) => {
    const rowNum = index + 1;
    
    // Проверяем обязательные поля
    if (!row.origin || typeof row.origin !== 'string') {
      errors.push(`Строка ${rowNum}: не указан пункт отправления`);
      return;
    }

    if (!row.destination || typeof row.destination !== 'string') {
      errors.push(`Строка ${rowNum}: не указан пункт назначения`);
      return;
    }

    if (!row.serviceType || !['freight', 'railway', 'auto', 'container'].includes(row.serviceType)) {
      errors.push(`Строка ${rowNum}: некорректный тип услуги`);
      return;
    }

    if (!row.rate || isNaN(Number(row.rate)) || Number(row.rate) <= 0) {
      errors.push(`Строка ${rowNum}: некорректная ставка`);
      return;
    }

    if (!row.currency || typeof row.currency !== 'string') {
      errors.push(`Строка ${rowNum}: не указана валюта`);
      return;
    }

    // Проверяем даты
    const validFrom = new Date(row.validFrom);
    const validTo = new Date(row.validTo);
    
    if (isNaN(validFrom.getTime())) {
      errors.push(`Строка ${rowNum}: некорректная дата начала действия`);
      return;
    }

    if (isNaN(validTo.getTime())) {
      errors.push(`Строка ${rowNum}: некорректная дата окончания действия`);
      return;
    }

    if (validFrom >= validTo) {
      errors.push(`Строка ${rowNum}: дата начала должна быть меньше даты окончания`);
      return;
    }

    // Если все проверки прошли, добавляем в валидные данные
    valid.push({
      origin: row.origin.trim(),
      destination: row.destination.trim(),
      serviceType: row.serviceType,
      containerType: row.containerType?.trim(),
      weight: row.weight ? Number(row.weight) : undefined,
      volume: row.volume ? Number(row.volume) : undefined,
      rate: Number(row.rate),
      currency: row.currency.trim().toUpperCase(),
      validFrom: validFrom.toISOString().split('T')[0],
      validTo: validTo.toISOString().split('T')[0],
      transitTime: row.transitTime ? Number(row.transitTime) : undefined,
      notes: row.notes?.trim()
    });
  });

  return { valid, errors };
};

// Функция для очистки временных файлов
export const cleanupTempFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};