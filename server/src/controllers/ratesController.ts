import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import multer from 'multer';
import path from 'path';
import {
  processExcelFile,
  generateExcelTemplate,
  exportToExcel,
  validateExcelData,
  cleanupTempFile,
  ExcelRateData
} from '../utils/excelProcessor';

interface Rate {
  id: string;
  agentId: string;
  type: 'freight' | 'railway' | 'auto' | 'container_rental';
  origin: string;
  destination: string;
  containerType: string;
  price: number;
  currency: string;
  validFrom: string;
  validTo: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Временное хранилище ставок (в production будет база данных)
let ratesStorage: Rate[] = [];

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/rates/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  }
});

export const getRates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, type, search } = req.query;
    
    // Фильтруем ставки по агенту
    let filteredRates = ratesStorage.filter(rate => rate.agentId === req.user?.id);
    
    // Фильтр по типу
    if (type && type !== 'all') {
      filteredRates = filteredRates.filter(rate => rate.type === type);
    }
    
    // Поиск
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredRates = filteredRates.filter(rate =>
        rate.origin.toLowerCase().includes(searchTerm) ||
        rate.destination.toLowerCase().includes(searchTerm) ||
        rate.containerType.toLowerCase().includes(searchTerm) ||
        (rate.description && rate.description.toLowerCase().includes(searchTerm))
      );
    }
    
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedRates = filteredRates
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedRates,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(filteredRates.length / Number(limit)),
        totalItems: filteredRates.length,
        hasNextPage: endIndex < filteredRates.length,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get rates error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении ставок'
    });
  }
};

export const createRate = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const {
      type,
      origin,
      destination,
      containerType,
      price,
      currency,
      validFrom,
      validTo,
      description
    } = req.body;

    // Валидация
    if (!type || !origin || !destination || !containerType || !price || !currency || !validFrom || !validTo) {
      return res.status(400).json({
        success: false,
        message: 'Все обязательные поля должны быть заполнены'
      });
    }

    const newRate: Rate = {
      id: Date.now().toString(),
      agentId: req.user?.id || '',
      type,
      origin,
      destination,
      containerType,
      price: parseFloat(price),
      currency,
      validFrom,
      validTo,
      description,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    ratesStorage.push(newRate);

    res.status(201).json({
      success: true,
      message: 'Ставка успешно создана',
      data: newRate
    });
  } catch (error) {
    console.error('Create rate error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании ставки'
    });
  }
};

export const updateRate = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const {
      type,
      origin,
      destination,
      containerType,
      price,
      currency,
      validFrom,
      validTo,
      description,
      isActive
    } = req.body;

    const rateIndex = ratesStorage.findIndex(rate => 
      rate.id === id && rate.agentId === req.user?.id
    );

    if (rateIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Ставка не найдена'
      });
    }

    const updatedRate: Rate = {
      ...ratesStorage[rateIndex],
      type: type || ratesStorage[rateIndex].type,
      origin: origin || ratesStorage[rateIndex].origin,
      destination: destination || ratesStorage[rateIndex].destination,
      containerType: containerType || ratesStorage[rateIndex].containerType,
      price: price !== undefined ? parseFloat(price) : ratesStorage[rateIndex].price,
      currency: currency || ratesStorage[rateIndex].currency,
      validFrom: validFrom || ratesStorage[rateIndex].validFrom,
      validTo: validTo || ratesStorage[rateIndex].validTo,
      description: description !== undefined ? description : ratesStorage[rateIndex].description,
      isActive: isActive !== undefined ? isActive : ratesStorage[rateIndex].isActive,
      updatedAt: new Date().toISOString()
    };

    ratesStorage[rateIndex] = updatedRate;

    res.status(200).json({
      success: true,
      message: 'Ставка успешно обновлена',
      data: updatedRate
    });
  } catch (error) {
    console.error('Update rate error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении ставки'
    });
  }
};

export const deleteRate = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const rateIndex = ratesStorage.findIndex(rate => 
      rate.id === id && rate.agentId === req.user?.id
    );

    if (rateIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Ставка не найдена'
      });
    }

    ratesStorage.splice(rateIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Ставка успешно удалена'
    });
  } catch (error) {
    console.error('Delete rate error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении ставки'
    });
  }
};

export const uploadExcelRates = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не загружен'
      });
    }

    console.log('Processing Excel file:', file.filename);

    try {
      // Обрабатываем Excel файл
      const result = await processExcelFile(file.path);
      
      if (!result.success) {
        cleanupTempFile(file.path);
        return res.status(400).json({
          success: false,
          message: result.error || 'Ошибка при обработке Excel файла'
        });
      }

      const uploadedRates: Rate[] = [];
      const errors: string[] = result.errors || [];

      if (result.data) {
        result.data.forEach((excelRate: ExcelRateData, index: number) => {
          try {
            const rate: Rate = {
              id: Date.now().toString() + '-' + index,
              agentId: req.user?.id || '',
              type: excelRate.serviceType as 'freight' | 'railway' | 'auto' | 'container_rental',
              origin: excelRate.origin,
              destination: excelRate.destination,
              containerType: excelRate.containerType || 'Standard',
              price: excelRate.rate,
              currency: excelRate.currency,
              validFrom: excelRate.validFrom,
              validTo: excelRate.validTo,
              description: excelRate.notes || '',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            uploadedRates.push(rate);
          } catch (error) {
            errors.push(`Строка ${index + 2}: Ошибка обработки данных`);
          }
        });
      }

      // Добавляем валидные ставки
      ratesStorage.push(...uploadedRates);

      // Удаляем временный файл
      cleanupTempFile(file.path);

      res.status(200).json({
        success: true,
        message: `Загружено ${uploadedRates.length} ставок`,
        data: {
          uploaded: uploadedRates.length,
          total: result.totalRows || 0,
          errors: errors.length,
          errorDetails: errors
        }
      });
    } catch (processError) {
      console.error('Excel processing error:', processError);
      cleanupTempFile(file.path);
      
      // Fallback - create basic rate structure from file info
      const basicRate: Rate = {
        id: Date.now().toString(),
        agentId: req.user?.id || '',
        type: 'freight',
        origin: 'Excel Import',
        destination: 'Excel Import',
        containerType: 'Standard',
        price: 0,
        currency: 'USD',
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        description: `Imported from ${file.originalname}`,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      ratesStorage.push(basicRate);

      res.status(200).json({
        success: true,
        message: 'Файл загружен, но обработка не удалась. Создана базовая ставка.',
        data: {
          uploaded: 1,
          total: 1,
          errors: 1,
          errorDetails: [`Ошибка обработки Excel: ${(processError as Error).message || 'Unknown error'}`]
        }
      });
    }
  } catch (error) {
    console.error('Upload Excel rates error:', error);
    if (req.file) {
      cleanupTempFile(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке Excel файла'
    });
  }
};

export const exportRates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, format = 'excel' } = req.query;
    
    let ratesToExport = ratesStorage.filter(rate => rate.agentId === req.user?.id);
    
    if (type && type !== 'all') {
      ratesToExport = ratesToExport.filter(rate => rate.type === type);
    }

    // Преобразуем данные в формат ExcelRateData
    const exportData: ExcelRateData[] = ratesToExport.map(rate => ({
      origin: rate.origin,
      destination: rate.destination,
      serviceType: rate.type as 'freight' | 'railway' | 'auto' | 'container',
      containerType: rate.containerType,
      rate: rate.price,
      currency: rate.currency,
      validFrom: rate.validFrom,
      validTo: rate.validTo,
      notes: rate.description
    }));

    if (format === 'excel') {
      try {
        const excelBuffer = exportToExcel(exportData);
        const fileName = `rates_export_${new Date().toISOString().split('T')[0]}.csv`;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(excelBuffer);
      } catch (excelError) {
        console.error('Excel export error:', excelError);
        
        // Fallback to JSON export
        const fileName = `rates_export_${new Date().toISOString().split('T')[0]}.json`;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.json({
          success: true,
          data: exportData,
          message: 'Экспорт в формате JSON (Excel недоступен)'
        });
      }
    } else {
      // JSON export
      const fileName = `rates_export_${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.json({
        success: true,
        data: exportData
      });
    }
  } catch (error) {
    console.error('Export rates error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при экспорте ставок'
    });
  }
};

export const downloadTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const templateBuffer = generateExcelTemplate();
    const fileName = `rates_template_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(templateBuffer);
  } catch (error) {
    console.error('Template download error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании шаблона'
    });
  }
};

export const ratesUploadMiddleware = upload.single('file');