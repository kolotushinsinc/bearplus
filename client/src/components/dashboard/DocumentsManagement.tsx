import * as React from 'react';
import { useState, useRef } from 'react';
import { useAppSelector } from '../../hooks/redux';

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

interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  allowedTypes: string[];
  maxSize: number; // in MB
}

const DocumentsManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: DocumentCategory[] = [
    {
      id: 'invoice',
      name: 'Инвойсы',
      icon: '📄',
      allowedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
      maxSize: 10
    },
    {
      id: 'packing_list',
      name: 'Упаковочные листы',
      icon: '📋',
      allowedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
      maxSize: 5
    },
    {
      id: 'certificate',
      name: 'Сертификаты',
      icon: '📜',
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      maxSize: 15
    },
    {
      id: 'msds',
      name: 'MSDS документы',
      icon: '⚠️',
      allowedTypes: ['application/pdf'],
      maxSize: 20
    },
    {
      id: 'contract',
      name: 'Договоры',
      icon: '📑',
      allowedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      maxSize: 25
    },
    {
      id: 'other',
      name: 'Прочие',
      icon: '📎',
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      maxSize: 10
    }
  ];

  // Mock documents data
  React.useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Commercial_Invoice_ORD001.pdf',
        type: 'invoice',
        size: 2048000,
        uploadedAt: '2024-01-15T10:30:00Z',
        uploadedBy: user?.id || 'user1',
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
        uploadedBy: user?.id || 'user1',
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
        uploadedBy: user?.id || 'user1',
        url: '/documents/Quality_Certificate.pdf',
        status: 'processing'
      },
      {
        id: '4',
        name: 'MSDS_Chemical_Product.pdf',
        type: 'msds',
        size: 4096000,
        uploadedAt: '2024-01-17T09:15:00Z',
        uploadedBy: user?.id || 'user1',
        url: '/documents/MSDS_Chemical_Product.pdf',
        status: 'rejected',
        comments: 'Документ устарел, требуется актуальная версия'
      }
    ];
    setDocuments(mockDocuments);
  }, [user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Validate file type and size
        const category = categories.find(cat => cat.id === selectedCategory);
        if (category && selectedCategory !== 'all') {
          if (!category.allowedTypes.includes(file.type)) {
            alert(`Недопустимый тип файла для категории "${category.name}"`);
            continue;
          }
          if (file.size > category.maxSize * 1024 * 1024) {
            alert(`Файл "${file.name}" превышает максимальный размер ${category.maxSize}MB`);
            continue;
          }
        }

        // Upload file (mock implementation)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', selectedCategory);

        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: selectedCategory as any,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          uploadedBy: user?.id || 'user1',
          url: `/documents/${file.name}`,
          status: 'processing'
        };

        setDocuments(prev => [newDocument, ...prev]);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка при загрузке файла');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (doc: Document) => {
    // Simulate file download
    const link = window.document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    link.click();
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот документ?')) return;

    try {
      // API call to delete document
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Ошибка при удалении документа');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-600';
      case 'processing': return 'bg-yellow-600';
      case 'approved': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'uploaded': return 'Загружен';
      case 'processing': return 'Обработка';
      case 'approved': return 'Одобрен';
      case 'rejected': return 'Отклонен';
      default: return status;
    }
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.type === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление документами</h2>
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select-field"
          >
            <option value="all">Все категории</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn-primary"
          >
            {isUploading ? 'Загрузка...' : 'Загрузить документы'}
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Upload Guidelines */}
      {selectedCategory !== 'all' && (
        <div className="card bg-blue-900/20 border-blue-600/30">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">
            {categories.find(cat => cat.id === selectedCategory)?.icon} 
            {' '}Требования для категории "{categories.find(cat => cat.id === selectedCategory)?.name}"
          </h3>
          <div className="text-sm text-gray-300">
            <p>Максимальный размер файла: {categories.find(cat => cat.id === selectedCategory)?.maxSize}MB</p>
            <p>Поддерживаемые форматы: PDF, Word, Excel, изображения</p>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="card hover:shadow-glow-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-2">
                  {categories.find(cat => cat.id === document.type)?.icon || '📄'}
                </span>
                <div>
                  <h3 className="text-sm font-medium text-white truncate max-w-[150px]" title={document.name}>
                    {document.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(document.size)}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(document.status)}`}>
                {getStatusLabel(document.status)}
              </span>
            </div>

            <div className="text-xs text-gray-400 mb-3">
              <div>Загружен: {new Date(document.uploadedAt).toLocaleDateString('ru-RU')}</div>
              {document.orderId && (
                <div>Заявка: {document.orderId}</div>
              )}
            </div>

            {document.comments && document.status === 'rejected' && (
              <div className="mb-3 p-2 bg-red-900/20 border border-red-600/30 rounded text-xs text-red-300">
                {document.comments}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(document)}
                className="flex-1 bg-bearplus-green hover:bg-bearplus-green/90 text-black px-3 py-2 rounded text-xs font-medium transition-colors"
              >
                Скачать
              </button>
              <button
                onClick={() => setSelectedDocument(document)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
              >
                Подробнее
              </button>
              <button
                onClick={() => handleDelete(document.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">Документы не найдены</h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory === 'all' 
              ? 'У вас пока нет загруженных документов'
              : `В категории "${categories.find(cat => cat.id === selectedCategory)?.name}" пока нет документов`
            }
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary"
          >
            Загрузить первый документ
          </button>
        </div>
      )}

      {/* Document Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDocument(null)}>
          <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Детали документа</h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Название файла</label>
                  <div className="text-white">{selectedDocument.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Категория</label>
                  <div className="text-white">
                    {categories.find(cat => cat.id === selectedDocument.type)?.icon} 
                    {' '}{categories.find(cat => cat.id === selectedDocument.type)?.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Размер файла</label>
                  <div className="text-white">{formatFileSize(selectedDocument.size)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Статус</label>
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(selectedDocument.status)}`}>
                    {getStatusLabel(selectedDocument.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Дата загрузки</label>
                  <div className="text-white">{new Date(selectedDocument.uploadedAt).toLocaleString('ru-RU')}</div>
                </div>
                {selectedDocument.orderId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Связанная заявка</label>
                    <div className="text-white">{selectedDocument.orderId}</div>
                  </div>
                )}
              </div>

              {selectedDocument.comments && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Комментарии</label>
                  <div className="p-3 bg-gray-700 rounded text-white text-sm">
                    {selectedDocument.comments}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleDownload(selectedDocument)}
                  className="btn-primary flex-1"
                >
                  Скачать документ
                </button>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="btn-secondary flex-1"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsManagement;