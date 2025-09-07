import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { apiService } from '../../services/apiService';

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

const DocumentsManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.documents.getDocuments({
        type: filter === 'all' ? undefined : filter,
        page: 1,
        limit: 50
      });
      
      if (response.success) {
        setDocuments(response.data || []);
      } else {
        console.error('Failed to fetch documents:', response);
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'uploaded': return 'Загружен';
      case 'processing': return 'Обрабатывается';
      case 'approved': return 'Одобрен';
      case 'rejected': return 'Отклонен';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'invoice': return 'Инвойс';
      case 'packing_list': return 'Упаковочный лист';
      case 'certificate': return 'Сертификат';
      case 'msds': return 'MSDS';
      case 'contract': return 'Контракт';
      default: return 'Другое';
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      const response = await apiService.documents.uploadDocuments(files, 'other');
      
      if (response.success) {
        // Refresh documents list
        await fetchDocuments();
        alert(`${files.length} документ(ов) успешно загружено`);
      } else {
        alert('Ошибка при загрузке файлов: ' + response.message);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Ошибка при загрузке файлов');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.type === filter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка документов...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Modern Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-tech-primary/10 rounded-xl border border-tech-primary/20">
            <span className="text-2xl">📄</span>
          </div>
          <div>
            <h2 className="text-tech-title">Управление документами</h2>
            <p className="text-tech-caption">Загружайте и управляйте документами</p>
          </div>
        </div>
        <button
          onClick={() => setUploadModal(true)}
          className="btn-primary btn-sm"
        >
          ⬆️ Загрузить
        </button>
      </div>

      {/* Modern Filters */}
      <div className="filter-bar flex-wrap">
        {[
          { key: 'all', label: 'Все документы', icon: '📊' },
          { key: 'invoice', label: 'Инвойсы', icon: '🧾' },
          { key: 'packing_list', label: 'Упаковочные листы', icon: '📋' },
          { key: 'certificate', label: 'Сертификаты', icon: '🏆' },
          { key: 'msds', label: 'MSDS', icon: '⚠️' },
          { key: 'contract', label: 'Контракты', icon: '📄' }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`filter-btn flex items-center gap-2 ${
              filter === filterOption.key ? 'active' : ''
            }`}
          >
            <span className="text-xs">{filterOption.icon}</span>
            <span className="hidden sm:inline">{filterOption.label}</span>
          </button>
        ))}
      </div>

      {/* Modern Drag and Drop Area */}
      <div
        className={`card-interactive border-2 border-dashed p-8 text-center transition-all duration-300 relative overflow-hidden ${
          dragOver
            ? 'border-tech-primary bg-tech-primary/5 glow-tech-sm'
            : 'border-tech-border hover:border-tech-border-light'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="relative z-10">
          <div className="text-4xl mb-4 animate-pulse-glow">📤</div>
          <h3 className="text-tech-subtitle mb-3">
            Перетащите файлы сюда или нажмите для выбора
          </h3>
          <p className="text-tech-caption mb-6">
            Поддерживаются: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (макс. 10MB)
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="btn-secondary btn-sm cursor-pointer inline-flex items-center gap-2">
            📁 Выбрать файлы
          </label>
        </div>
        {dragOver && (
          <div className="absolute inset-0 bg-gradient-to-br from-tech-primary/10 via-transparent to-tech-secondary/10"></div>
        )}
      </div>

      {/* Modern Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((doc, index) => (
          <div key={doc.id} className="card-interactive group relative overflow-hidden animate-slide-in-left"
               style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-tech-primary/2 via-transparent to-tech-secondary/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-tech-surface-elevated rounded-lg border border-tech-border-light group-hover:border-tech-primary/50 transition-colors">
                    <span className="text-xl">
                      {doc.type === 'invoice' ? '🧾' :
                       doc.type === 'packing_list' ? '📋' :
                       doc.type === 'certificate' ? '🏆' :
                       doc.type === 'msds' ? '⚠️' : '📄'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-tech-body font-medium group-hover:text-gradient transition-colors">{doc.name}</h3>
                    <div className="flex items-center gap-4 text-tech-caption">
                      <span className="status-badge status-info">{getTypeLabel(doc.type)}</span>
                      <span className="text-tech-mono">{formatFileSize(doc.size)}</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString('ru-RU')}</span>
                      {doc.orderId && <span className="text-tech-primary">Заявка: {doc.orderId}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`status-badge ${
                    doc.status === 'approved' ? 'status-success' :
                    doc.status === 'processing' ? 'status-warning' :
                    doc.status === 'rejected' ? 'status-error' :
                    'status-info'
                  }`}>
                    {getStatusLabel(doc.status)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const response = await apiService.documents.getDocumentById(doc.id);
                          if (response.success && response.data) {
                            // For viewing, try to open the document URL
                            const fullUrl = response.data.url.startsWith('http')
                              ? response.data.url
                              : `${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api'}${response.data.url}`;
                            window.open(fullUrl, '_blank');
                          } else {
                            alert('Ошибка при открытии документа: ' + (response.message || 'Документ не найден'));
                          }
                        } catch (error) {
                          console.error('Error viewing document:', error);
                          alert('Ошибка при открытии документа');
                        }
                      }}
                      className="btn-secondary btn-xs"
                    >
                      👁️ Просмотр
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await apiService.documents.downloadDocument(doc.id);
                        } catch (error) {
                          console.error('Error downloading document:', error);
                          alert('Ошибка при скачивании документа');
                        }
                      }}
                      className="btn-secondary btn-xs"
                    >
                      ⬇️ Скачать
                    </button>
                  </div>
                </div>
              </div>
              
              {doc.comments && (
                <div className="mt-4 p-3 bg-tech-surface rounded-lg border border-tech-border">
                  <p className="text-tech-caption">{doc.comments}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredDocuments.length === 0 && (
          <div className="text-center py-16">
            <div className="p-6 bg-tech-primary/5 rounded-2xl border border-tech-primary/10 inline-block mb-6">
              <div className="text-4xl mb-2 animate-pulse-glow">📄</div>
            </div>
            <h3 className="text-tech-subtitle mb-3 text-gradient">
              Документы не найдены
            </h3>
            <p className="text-tech-caption mb-6">
              Загрузите первый документ для начала работы
            </p>
            <button
              onClick={() => setUploadModal(true)}
              className="btn-primary btn-sm"
            >
              ⬆️ Загрузить документы
            </button>
          </div>
        )}
      </div>

      {/* Modern Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4" onClick={() => setUploadModal(false)}>
          <div className="modal-content p-8 w-full max-w-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-tech-primary/10 rounded-xl border border-tech-primary/20">
                <span className="text-2xl">📤</span>
              </div>
              <div>
                <h3 className="text-tech-title">Загрузка документов</h3>
                <p className="text-tech-caption">Перетащите файлы или выберите с компьютера</p>
              </div>
            </div>
            
            <div
              className={`card-interactive border-2 border-dashed p-12 text-center transition-all duration-300 relative overflow-hidden ${
                dragOver
                  ? 'border-tech-primary bg-tech-primary/5 glow-tech-sm'
                  : 'border-tech-border hover:border-tech-border-light'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-5xl mb-6 animate-pulse-glow">📤</div>
              <h4 className="text-tech-subtitle mb-3">Перетащите файлы сюда</h4>
              <p className="text-tech-caption mb-6">или</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="modal-file-upload"
              />
              <label htmlFor="modal-file-upload" className="btn-primary btn-sm cursor-pointer inline-flex items-center gap-2">
                📁 Выбрать файлы
              </label>
              <div className="mt-4 text-tech-caption">
                PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (макс. 10MB)
              </div>
              {dragOver && (
                <div className="absolute inset-0 bg-gradient-to-br from-tech-primary/10 via-transparent to-tech-secondary/10"></div>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setUploadModal(false)}
                className="btn-secondary btn-sm"
              >
                ✕ Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsManagement;