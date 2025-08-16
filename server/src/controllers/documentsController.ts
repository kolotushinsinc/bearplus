import { Request, Response } from 'express';
import { AuthRequest } from '../types';

interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'packing_list' | 'certificate' | 'msds' | 'contract' | 'other';
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  orderId?: string;
  status: 'uploaded' | 'processing' | 'approved' | 'rejected';
  comments?: string;
}

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, orderId, status, page = 1, limit = 20 } = req.query;
    
    // Mock documents data - replace with database query
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Commercial_Invoice_ORD001.pdf',
        type: 'invoice',
        size: 2048000,
        uploadedAt: '2024-01-15T10:30:00Z',
        uploadedBy: req.user?.id || 'user1',
        url: '/documents/Commercial_Invoice_ORD001.pdf',
        orderId: 'ORD-2024-001',
        status: 'approved'
      },
      {
        id: '2',
        name: 'Packing_List_ORD001.xlsx',
        type: 'packing_list',
        size: 1536000,
        uploadedAt: '2024-01-15T10:35:00Z',
        uploadedBy: req.user?.id || 'user1',
        url: '/documents/Packing_List_ORD001.xlsx',
        orderId: 'ORD-2024-001',
        status: 'approved'
      },
      {
        id: '3',
        name: 'Quality_Certificate.pdf',
        type: 'certificate',
        size: 3072000,
        uploadedAt: '2024-01-16T14:20:00Z',
        uploadedBy: req.user?.id || 'user1',
        url: '/documents/Quality_Certificate.pdf',
        status: 'processing'
      }
    ];

    let filteredDocuments = mockDocuments.filter(doc => doc.uploadedBy === req.user?.id);
    
    if (type) {
      filteredDocuments = filteredDocuments.filter(doc => doc.type === type);
    }
    
    if (orderId) {
      filteredDocuments = filteredDocuments.filter(doc => doc.orderId === orderId);
    }
    
    if (status) {
      filteredDocuments = filteredDocuments.filter(doc => doc.status === status);
    }

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedDocuments,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(filteredDocuments.length / Number(limit)),
        totalItems: filteredDocuments.length,
        hasNextPage: endIndex < filteredDocuments.length,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении документов'
    });
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, orderId } = req.body;
    
    // In production, handle actual file upload using multer or similar
    const file = req.file; // This would come from multer middleware
    
    if (!file) {
      res.status(400).json({
        success: false,
        message: 'Файл не найден'
      });
      return;
    }

    const newDocument: Document = {
      id: Date.now().toString(),
      name: file.originalname || 'document.pdf',
      type: type || 'other',
      size: file.size || 0,
      uploadedAt: new Date().toISOString(),
      uploadedBy: req.user?.id || 'user1',
      url: `/documents/${file.filename || file.originalname}`,
      orderId: orderId,
      status: 'uploaded'
    };

    // In production, save document metadata to database
    console.log('Document uploaded:', newDocument);

    res.status(201).json({
      success: true,
      message: 'Документ успешно загружен',
      data: newDocument
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке документа'
    });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    
    // Mock document data - replace with database query
    const mockDocument: Document = {
      id: documentId,
      name: 'Commercial_Invoice_ORD001.pdf',
      type: 'invoice',
      size: 2048000,
      uploadedAt: '2024-01-15T10:30:00Z',
      uploadedBy: req.user?.id || 'user1',
      url: '/documents/Commercial_Invoice_ORD001.pdf',
      orderId: 'ORD-2024-001',
      status: 'approved'
    };

    // Check if user owns this document
    if (mockDocument.uploadedBy !== req.user?.id && req.user?.userType !== 'agent') {
      res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: mockDocument
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении документа'
    });
  }
};

export const updateDocumentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Only agents can update document status
    if (req.user?.userType !== 'agent') {
      res.status(403).json({
        success: false,
        message: 'Недостаточно прав доступа'
      });
      return;
    }

    const { documentId } = req.params;
    const { status, comments } = req.body;
    
    const validStatuses = ['uploaded', 'processing', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Некорректный статус'
      });
      return;
    }

    // In production, update document in database
    console.log(`Updating document ${documentId} status to ${status} by agent ${req.user?.id}`);

    res.status(200).json({
      success: true,
      message: 'Статус документа обновлен'
    });
  } catch (error) {
    console.error('Update document status error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении статуса документа'
    });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    
    // Check if user owns this document
    // In production, check ownership in database
    
    console.log(`Deleting document ${documentId} by user ${req.user?.id}`);

    res.status(200).json({
      success: true,
      message: 'Документ удален'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении документа'
    });
  }
};

export const downloadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    
    // Check if user has access to this document
    // In production, check ownership/permissions in database
    
    // Mock file path - in production, get from database
    const filePath = `/documents/Commercial_Invoice_ORD001.pdf`;
    
    // In production, stream file from storage
    res.status(200).json({
      success: true,
      downloadUrl: filePath,
      message: 'Ссылка для скачивания готова'
    });
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при скачивании документа'
    });
  }
};