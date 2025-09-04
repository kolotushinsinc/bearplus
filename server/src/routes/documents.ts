import express from 'express';
import {
  getDocuments,
  uploadDocument as uploadDocumentController,
  getDocumentById,
  updateDocumentStatus,
  deleteDocument,
  downloadDocument
} from '../controllers/documentsController';

import { authenticateToken, authorize } from '../middleware/auth';
import { uploadDocument as uploadDocumentMiddleware, handleUploadError } from '../middleware/upload';

const router = express.Router();

// @route   GET /api/documents
// @desc    Получение списка документов пользователя
// @access  Private
router.get('/', authenticateToken, getDocuments);

// @route   POST /api/documents/upload
// @desc    Загрузка документов
// @access  Private
router.post('/upload',
  authenticateToken,
  uploadDocumentMiddleware.array('documents', 5),
  handleUploadError,
  uploadDocumentController
);

// @route   GET /api/documents/:documentId
// @desc    Получение документа по ID
// @access  Private
router.get('/:documentId', authenticateToken, getDocumentById);

// @route   PUT /api/documents/:documentId/status
// @desc    Обновление статуса документа (только для агентов)
// @access  Private (agents only)
router.put('/:documentId/status', authenticateToken, authorize('agent'), updateDocumentStatus);

// @route   GET /api/documents/:documentId/download
// @desc    Скачивание документа
// @access  Private
router.get('/:documentId/download', authenticateToken, downloadDocument);

// @route   DELETE /api/documents/:documentId
// @desc    Удаление документа
// @access  Private
router.delete('/:documentId', authenticateToken, deleteDocument);

export default router;