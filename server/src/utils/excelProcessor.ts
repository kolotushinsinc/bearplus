import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

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

    // Читаем Excel файл
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Конвертируем в JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length <= 1) {
      return {
        success: false,
        error: 'Файл не содержит данных или содержит только заголовки'
      };
    }

    // Получаем заголовки
    const headers = jsonData[0] as string[];
    const dataRows = jsonData.slice(1);

    // Маппинг заголовков
    const headerMap: { [key: string]: string } = {
      'откуда': 'origin',
      'куда': 'destination',
      'тип услуги': 'serviceType',
      'тип контейнера': 'containerType',
      'вес (кг)': 'weight',
      'объем (м³)': 'volume',
      'ставка': 'rate',
      'валюта': 'currency',
      'действует с': 'validFrom',
      'действует до': 'validTo',
      'время доставки (дни)': 'transitTime',
      'примечания': 'notes'
    };

    const data: ExcelRateData[] = [];
    const errors: string[] = [];

    (dataRows as any[][]).forEach((row: any[], index: number) => {
      const rowNum = index + 2; // +2 because index starts from 0 and we skip header
      
      try {
        const rateData: any = {};
        
        headers.forEach((header, colIndex) => {
          const normalizedHeader = header.toLowerCase().trim();
          const fieldName = headerMap[normalizedHeader];
          
          if (fieldName && row[colIndex] !== undefined && row[colIndex] !== null) {
            let value = row[colIndex];
            
            // Обработка разных типов данных
            if (fieldName === 'weight' || fieldName === 'volume' || fieldName === 'rate' || fieldName === 'transitTime') {
              value = Number(value);
              if (isNaN(value)) {
                errors.push(`Строка ${rowNum}: некорректное числовое значение в поле "${header}"`);
                return;
              }
            } else if (fieldName === 'validFrom' || fieldName === 'validTo') {
              // Обработка дат Excel
              if (typeof value === 'number') {
                value = XLSX.SSF.parse_date_code(value);
                value = new Date(value.y, value.m - 1, value.d).toISOString().split('T')[0];
              } else if (typeof value === 'string') {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                  errors.push(`Строка ${rowNum}: некорректная дата в поле "${header}"`);
                  return;
                }
                value = date.toISOString().split('T')[0];
              }
            } else if (typeof value === 'string') {
              value = value.toString().trim();
            }
            
            rateData[fieldName] = value;
          }
        });

        // Валидация обязательных полей
        const requiredFields = ['origin', 'destination', 'serviceType', 'rate', 'currency', 'validFrom', 'validTo'];
        const missingFields = requiredFields.filter(field => !rateData[field]);
        
        if (missingFields.length > 0) {
          errors.push(`Строка ${rowNum}: отсутствуют обязательные поля: ${missingFields.join(', ')}`);
          return;
        }

        // Проверка типа услуги
        if (!['freight', 'railway', 'auto', 'container'].includes(rateData.serviceType)) {
          errors.push(`Строка ${rowNum}: некорректный тип услуги "${rateData.serviceType}"`);
          return;
        }

        // Проверка валюты
        if (!['USD', 'EUR', 'RUB', 'CNY'].includes(rateData.currency.toUpperCase())) {
          errors.push(`Строка ${rowNum}: некорректная валюта "${rateData.currency}"`);
          return;
        }

        rateData.currency = rateData.currency.toUpperCase();
        data.push(rateData as ExcelRateData);

      } catch (error) {
        errors.push(`Строка ${rowNum}: ошибка обработки - ${error instanceof Error ? error.message : 'неизвестная ошибка'}`);
      }
    });

    return {
      success: true,
      data,
      totalRows: dataRows.length,
      validRows: data.length,
      errors
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

    // Создаем новую рабочую книгу
    const workbook = XLSX.utils.book_new();
    
    // Создаем рабочий лист
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Шаблон ставок');
    
    // Конвертируем в буфер
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return excelBuffer;

  } catch (error) {
    console.error('Template generation error:', error);
    throw new Error('Ошибка при создании шаблона');
  }
};

// Функция для экспорта данных в Excel
export const exportToExcel = (data: ExcelRateData[]): Buffer => {
  try {
    if (!data.length) {
      throw new Error('Нет данных для экспорта');
    }

    // Преобразуем данные в формат для Excel
    const exportData = data.map(row => ({
      'Откуда': row.origin,
      'Куда': row.destination,
      'Тип услуги': row.serviceType,
      'Тип контейнера': row.containerType || '',
      'Вес (кг)': row.weight || '',
      'Объем (м³)': row.volume || '',
      'Ставка': row.rate,
      'Валюта': row.currency,
      'Действует с': row.validFrom,
      'Действует до': row.validTo,
      'Время доставки (дни)': row.transitTime || '',
      'Примечания': row.notes || ''
    }));

    // Создаем новую рабочую книгу
    const workbook = XLSX.utils.book_new();
    
    // Создаем рабочий лист
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Экспорт ставок');
    
    // Конвертируем в буфер
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return excelBuffer;

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