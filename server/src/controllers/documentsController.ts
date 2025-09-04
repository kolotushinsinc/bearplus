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

// In-memory storage for uploaded documents (in production use database)
let uploadedDocuments: Document[] = [];

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, orderId, status, page = 1, limit = 20 } = req.query;
    
    console.log('🔧 DEBUG getDocuments: req.user?.id =', req.user?.id);
    console.log('🔧 DEBUG getDocuments: filters =', { type, orderId, status, page, limit });
    
    // Current user ID for consistent mock data
    const currentUserId = req.user?.id || 'mock-user';
    
    // Mock documents data - replace with database query
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Commercial_Invoice_ORD001.pdf',
        type: 'invoice',
        size: 2048000,
        uploadedAt: '2024-01-15T10:30:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Commercial_Invoice_ORD001.pdf',
        orderId: 'ORD-2024-001',
        status: 'approved'
      },
      {
        id: '2',
        name: 'Packing_List_ORD001.xlsx',
        type: 'packing_list',
        size: 1536000,
        uploadedAt: '2024-01-15T10:35:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Packing_List_ORD001.xlsx',
        orderId: 'ORD-2024-001',
        status: 'approved'
      },
      {
        id: '3',
        name: 'Quality_Certificate.pdf',
        type: 'certificate',
        size: 3072000,
        uploadedAt: '2024-01-16T14:20:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Quality_Certificate.pdf',
        status: 'processing'
      },
      {
        id: '4',
        name: 'MSDS_Chemical_Safety.pdf',
        type: 'msds',
        size: 1024000,
        uploadedAt: '2024-01-17T09:15:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/MSDS_Chemical_Safety.pdf',
        status: 'uploaded'
      },
      {
        id: '5',
        name: 'Contract_Agreement_2024.docx',
        type: 'contract',
        size: 512000,
        uploadedAt: '2024-01-18T16:45:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Contract_Agreement_2024.docx',
        orderId: 'ORD-2024-002',
        status: 'approved'
      }
    ];

    console.log('🔧 DEBUG: Total mock documents =', mockDocuments.length);
    console.log('🔧 DEBUG: Total uploaded documents =', uploadedDocuments.length);
    console.log('🔧 DEBUG: Uploaded documents details =', uploadedDocuments.map(d => ({ id: d.id, name: d.name, uploadedBy: d.uploadedBy })));
    
    // Combine mock documents with uploaded documents
    const userUploadedDocs = uploadedDocuments.filter(doc => doc.uploadedBy === currentUserId);
    console.log('🔧 DEBUG: User uploaded documents =', userUploadedDocs.length);
    
    const allDocuments = [...mockDocuments, ...userUploadedDocs];
    console.log('🔧 DEBUG: Total combined documents =', allDocuments.length);
    
    let filteredDocuments = allDocuments;
    
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

    console.log('🔧 DEBUG: Final paginated documents =', paginatedDocuments.length);
    console.log('🔧 DEBUG: Returning documents =', paginatedDocuments.map(d => ({ id: d.id, name: d.name, type: d.type })));

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
    const files = req.files as Express.Multer.File[];
    
    console.log('🔧 DEBUG uploadDocument: files =', files?.length || 0);
    console.log('🔧 DEBUG uploadDocument: type =', type);
    console.log('🔧 DEBUG uploadDocument: user =', req.user?.id);
    
    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Файлы не найдены'
      });
      return;
    }

    const newUploadedDocuments: Document[] = [];
    const currentUserId = req.user?.id || 'mock-user';

    for (const file of files) {
      const newDocument: Document = {
        id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
        name: file.originalname, // Use original name instead of filename
        type: type || 'other',
        size: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUserId,
        url: `/uploads/documents/${file.filename}`,
        orderId: orderId,
        status: 'uploaded'
      };

      newUploadedDocuments.push(newDocument);
      
      // Add to global storage
      uploadedDocuments.push(newDocument);
      
      console.log('✅ Document uploaded and saved:', {
        id: newDocument.id,
        name: newDocument.name,
        type: newDocument.type,
        uploadedBy: newDocument.uploadedBy
      });
    }

    console.log('🔧 DEBUG: Total documents in storage now =', uploadedDocuments.length);

    res.status(201).json({
      success: true,
      message: `${newUploadedDocuments.length} документ(ов) успешно загружено`,
      data: newUploadedDocuments
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке документов'
    });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const currentUserId = req.user?.id || 'mock-user';
    
    console.log('🔧 DEBUG getDocumentById: Looking for document ID =', documentId);
    console.log('🔧 DEBUG getDocumentById: Current user =', currentUserId);
    
    // Mock documents data
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Commercial_Invoice_ORD001.pdf',
        type: 'invoice',
        size: 2048000,
        uploadedAt: '2024-01-15T10:30:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Commercial_Invoice_ORD001.pdf',
        orderId: 'ORD-2024-001',
        status: 'approved'
      },
      {
        id: '2',
        name: 'Packing_List_ORD001.xlsx',
        type: 'packing_list',
        size: 1536000,
        uploadedAt: '2024-01-15T10:35:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Packing_List_ORD001.xlsx',
        orderId: 'ORD-2024-001',
        status: 'approved'
      },
      {
        id: '3',
        name: 'Quality_Certificate.pdf',
        type: 'certificate',
        size: 3072000,
        uploadedAt: '2024-01-16T14:20:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Quality_Certificate.pdf',
        status: 'processing'
      },
      {
        id: '4',
        name: 'MSDS_Chemical_Safety.pdf',
        type: 'msds',
        size: 1024000,
        uploadedAt: '2024-01-17T09:15:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/MSDS_Chemical_Safety.pdf',
        status: 'uploaded'
      },
      {
        id: '5',
        name: 'Contract_Agreement_2024.docx',
        type: 'contract',
        size: 512000,
        uploadedAt: '2024-01-18T16:45:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Contract_Agreement_2024.docx',
        orderId: 'ORD-2024-002',
        status: 'approved'
      }
    ];

    // Search in mock documents first
    let document = mockDocuments.find(doc => doc.id === documentId);
    
    // If not found in mock, search in uploaded documents
    if (!document) {
      document = uploadedDocuments.find(doc => doc.id === documentId);
      console.log('🔧 DEBUG getDocumentById: Found in uploaded documents =', !!document);
    } else {
      console.log('🔧 DEBUG getDocumentById: Found in mock documents =', !!document);
    }

    if (!document) {
      console.log('🔧 DEBUG getDocumentById: Document not found');
      res.status(404).json({
        success: false,
        message: 'Документ не найден'
      });
      return;
    }

    // Check if user owns this document or is an agent
    if (document.uploadedBy !== currentUserId && req.user?.userType !== 'agent') {
      console.log('🔧 DEBUG getDocumentById: Access denied for user');
      res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
      return;
    }

    console.log('🔧 DEBUG getDocumentById: Returning document =', document.name);
    res.status(200).json({
      success: true,
      data: document
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
    const currentUserId = req.user?.id || 'mock-user';
    
    console.log('🔧 DEBUG downloadDocument: Looking for document ID =', documentId);
    console.log('🔧 DEBUG downloadDocument: Current user =', currentUserId);
    
    // Mock documents data
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Commercial_Invoice_ORD001.pdf',
        type: 'invoice',
        size: 2048000,
        uploadedAt: '2024-01-15T10:30:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Commercial_Invoice_ORD001.pdf',
        orderId: 'ORD-2024-001',
        status: 'approved'
      },
      {
        id: '2',
        name: 'Packing_List_ORD001.xlsx',
        type: 'packing_list',
        size: 1536000,
        uploadedAt: '2024-01-15T10:35:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Packing_List_ORD001.xlsx',
        orderId: 'ORD-2024-001',
        status: 'approved'
      },
      {
        id: '3',
        name: 'Quality_Certificate.pdf',
        type: 'certificate',
        size: 3072000,
        uploadedAt: '2024-01-16T14:20:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Quality_Certificate.pdf',
        status: 'processing'
      },
      {
        id: '4',
        name: 'MSDS_Chemical_Safety.pdf',
        type: 'msds',
        size: 1024000,
        uploadedAt: '2024-01-17T09:15:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/MSDS_Chemical_Safety.pdf',
        status: 'uploaded'
      },
      {
        id: '5',
        name: 'Contract_Agreement_2024.docx',
        type: 'contract',
        size: 512000,
        uploadedAt: '2024-01-18T16:45:00Z',
        uploadedBy: currentUserId,
        url: '/uploads/documents/Contract_Agreement_2024.docx',
        orderId: 'ORD-2024-002',
        status: 'approved'
      }
    ];

    // Search in mock documents first
    let document = mockDocuments.find(doc => doc.id === documentId);
    
    // If not found in mock, search in uploaded documents
    if (!document) {
      document = uploadedDocuments.find(doc => doc.id === documentId);
      console.log('🔧 DEBUG downloadDocument: Found in uploaded documents =', !!document);
    } else {
      console.log('🔧 DEBUG downloadDocument: Found in mock documents =', !!document);
    }

    if (!document) {
      console.log('🔧 DEBUG downloadDocument: Document not found');
      res.status(404).json({
        success: false,
        message: 'Документ не найден'
      });
      return;
    }

    // Check if user owns this document or is an agent
    if (document.uploadedBy !== currentUserId && req.user?.userType !== 'agent') {
      console.log('🔧 DEBUG downloadDocument: Access denied for user');
      res.status(403).json({
        success: false,
        message: 'Доступ запрещен'
      });
      return;
    }

    console.log('🔧 DEBUG downloadDocument: Document found =', document.name);
    console.log('🔧 DEBUG downloadDocument: Document URL =', document.url);
    
    // For uploaded documents, use actual file path
    if (uploadedDocuments.find(doc => doc.id === documentId)) {
      const path = require('path');
      const fs = require('fs');
      
      // Extract filename from URL
      const filename = document.url.split('/').pop();
      const filePath = path.join(__dirname, '../../uploads/documents', filename!);
      
      console.log('🔧 DEBUG downloadDocument: Checking file path =', filePath);
      
      // Check if file exists
      if (fs.existsSync(filePath)) {
        console.log('✅ DEBUG downloadDocument: File exists, sending file');
        
        // Set proper headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${document.name}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        
        // Send file
        res.sendFile(filePath, (err) => {
          if (err) {
            console.error('Error sending file:', err);
            res.status(500).json({
              success: false,
              message: 'Ошибка при отправке файла'
            });
          }
        });
        return;
      } else {
        console.log('❌ DEBUG downloadDocument: File not found at path =', filePath);
        res.status(404).json({
          success: false,
          message: 'Файл не найден на сервере'
        });
        return;
      }
    }

    // For mock documents, return download URL (since actual files don't exist)
    console.log('🔧 DEBUG downloadDocument: Returning mock download URL');
    res.status(200).json({
      success: true,
      downloadUrl: document.url,
      message: 'Ссылка для скачивания готова (мок документ)'
    });
    
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при скачивании документа'
    });
  }
};