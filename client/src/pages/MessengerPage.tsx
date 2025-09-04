import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../hooks/redux';

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  timestamp: string;
  isRead: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  replyTo?: string;
}

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  type: 'direct' | 'group' | 'support';
  participants: Array<{
    id: string;
    name: string;
    role: 'client' | 'agent' | 'admin';
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  isArchived: boolean;
  isPinned: boolean;
  tags?: string[];
  createdAt: string;
  orderId?: string;
}

interface FileUpload {
  file: File;
  progress: number;
  url?: string;
}

const MessengerPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<FileUpload[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchChats();
    // WebSocket connection would be initialized here
    // initializeWebSocket();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
      markChatAsRead(activeChat.id);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      
      // Mock chats data
      const mockChats: Chat[] = [
        {
          id: 'chat1',
          name: 'Поддержка BearPlus',
          type: 'support',
          participants: [
            {
              id: 'support1',
              name: 'Анна Петрова',
              role: 'agent',
              isOnline: true,
              avatar: '/avatars/support1.jpg'
            }
          ],
          lastMessage: {
            id: 'msg1',
            chatId: 'chat1',
            senderId: 'support1',
            senderName: 'Анна Петрова',
            content: 'Добро пожаловать! Как дела с вашим заказом ORD-2024-001?',
            type: 'text',
            timestamp: '2024-01-15T10:30:00Z',
            isRead: false
          },
          unreadCount: 2,
          isArchived: false,
          isPinned: true,
          tags: ['support', 'urgent'],
          createdAt: '2024-01-15T09:00:00Z',
          orderId: 'ORD-2024-001'
        },
        {
          id: 'chat2',
          name: 'ООО "Логистика+"',
          type: 'direct',
          participants: [
            {
              id: 'client1',
              name: 'Михаил Иванов',
              role: 'client',
              isOnline: false,
              lastSeen: '2024-01-15T08:45:00Z',
              avatar: '/avatars/client1.jpg'
            }
          ],
          lastMessage: {
            id: 'msg2',
            chatId: 'chat2',
            senderId: 'client1',
            senderName: 'Михаил Иванов',
            content: 'Отправил документы по контейнеру',
            type: 'file',
            timestamp: '2024-01-14T16:20:00Z',
            isRead: true,
            attachments: [
              {
                id: 'file1',
                name: 'container_docs.pdf',
                url: '/files/container_docs.pdf',
                size: 2048000,
                type: 'application/pdf'
              }
            ]
          },
          unreadCount: 0,
          isArchived: false,
          isPinned: false,
          createdAt: '2024-01-10T10:00:00Z',
          orderId: 'ORD-2024-002'
        }
      ];

      setTimeout(() => {
        setChats(mockChats);
        if (mockChats.length > 0) {
          setActiveChat(mockChats[0]);
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setIsLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      // Mock messages data
      const mockMessages: Message[] = [
        {
          id: 'msg1',
          chatId: chatId,
          senderId: 'support1',
          senderName: 'Анна Петрова',
          content: 'Здравствуйте! Я буду сопровождать ваш заказ ORD-2024-001.',
          type: 'text',
          timestamp: '2024-01-15T09:00:00Z',
          isRead: true
        },
        {
          id: 'msg2',
          chatId: chatId,
          senderId: user?.id || 'user1',
          senderName: user?.firstName + ' ' + user?.lastName || 'Пользователь',
          content: 'Спасибо! Когда ожидать отправку?',
          type: 'text',
          timestamp: '2024-01-15T09:15:00Z',
          isRead: true
        },
        {
          id: 'msg3',
          chatId: chatId,
          senderId: 'support1',
          senderName: 'Анна Петрова',
          content: 'Отправка планируется на завтра. Прикладываю актуальные документы:',
          type: 'text',
          timestamp: '2024-01-15T09:30:00Z',
          isRead: true
        },
        {
          id: 'msg4',
          chatId: chatId,
          senderId: 'support1',
          senderName: 'Анна Петрова',
          content: 'Документы по заказу',
          type: 'file',
          timestamp: '2024-01-15T09:31:00Z',
          isRead: true,
          attachments: [
            {
              id: 'file1',
              name: 'shipping_documents.pdf',
              url: '/files/shipping_documents.pdf',
              size: 1524000,
              type: 'application/pdf'
            },
            {
              id: 'file2',
              name: 'tracking_info.xlsx',
              url: '/files/tracking_info.xlsx',
              size: 45000,
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
          ]
        },
        {
          id: 'msg5',
          chatId: chatId,
          senderId: 'support1',
          senderName: 'Анна Петрова',
          content: 'Добро пожаловать! Как дела с вашим заказом ORD-2024-001?',
          type: 'text',
          timestamp: '2024-01-15T10:30:00Z',
          isRead: false
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() && uploadingFiles.length === 0) return;
    if (!activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: activeChat.id,
      senderId: user?.id || 'user1',
      senderName: user?.firstName + ' ' + user?.lastName || 'Пользователь',
      content: messageText.trim(),
      type: uploadingFiles.length > 0 ? 'file' : 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
      attachments: uploadingFiles.map(f => ({
        id: Date.now().toString() + Math.random(),
        name: f.file.name,
        url: f.url || URL.createObjectURL(f.file),
        size: f.file.size,
        type: f.file.type
      })),
      replyTo: replyTo?.id
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    setUploadingFiles([]);
    setReplyTo(null);

    // Update last message in chat
    setChats(prev => prev.map(chat => 
      chat.id === activeChat.id 
        ? { ...chat, lastMessage: newMessage }
        : chat
    ));

    // Here you would send the message via WebSocket or API
    console.log('Sending message:', newMessage);
  };

  const handleFileUpload = (files: FileList) => {
    const newUploads: FileUpload[] = Array.from(files).map(file => ({
      file,
      progress: 0
    }));

    setUploadingFiles(prev => [...prev, ...newUploads]);

    // Simulate file upload progress
    newUploads.forEach((upload, index) => {
      const interval = setInterval(() => {
        setUploadingFiles(prev => prev.map(f => 
          f.file === upload.file 
            ? { ...f, progress: Math.min(f.progress + 20, 100) }
            : f
        ));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadingFiles(prev => prev.map(f => 
          f.file === upload.file 
            ? { ...f, progress: 100, url: URL.createObjectURL(f.file) }
            : f
        ));
      }, 1000);
    });
  };

  const markChatAsRead = (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, unreadCount: 0 }
        : chat
    ));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Вчера ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📄';
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка мессенджера...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bearplus-dark text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex h-[calc(100vh-8rem)] bg-bearplus-card rounded-lg overflow-hidden">
          {/* Sidebar with chats */}
          <div className="w-1/3 border-r border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Сообщения</h2>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск чатов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-bearplus-card-dark border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-bearplus-green focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Chats list */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-bearplus-card-dark transition-colors ${
                    activeChat?.id === chat.id ? 'bg-bearplus-card-dark border-l-4 border-l-bearplus-green' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-bearplus-green to-green-600 rounded-full flex items-center justify-center font-bold text-black">
                        {chat.name.charAt(0)}
                      </div>
                      {chat.participants[0]?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-bearplus-card"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate">{chat.name}</h3>
                        <div className="flex items-center space-x-1">
                          {chat.isPinned && <span className="text-yellow-400">📌</span>}
                          {chat.unreadCount > 0 && (
                            <span className="bg-bearplus-green text-black text-xs px-2 py-1 rounded-full font-bold">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-400 truncate">
                        {chat.lastMessage?.type === 'file' 
                          ? `${getFileIcon(chat.lastMessage.attachments?.[0]?.type || '')} ${chat.lastMessage.content || 'Файл'}`
                          : chat.lastMessage?.content}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ''}
                        </span>
                        {chat.orderId && (
                          <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                            {chat.orderId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main chat area */}
          {activeChat ? (
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="p-4 border-b border-gray-700 bg-bearplus-card-dark">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-bearplus-green to-green-600 rounded-full flex items-center justify-center font-bold text-black">
                      {activeChat.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{activeChat.name}</h3>
                      <p className="text-sm text-gray-400">
                        {activeChat.participants[0]?.isOnline 
                          ? 'В сети' 
                          : `Был(а) в сети ${formatTime(activeChat.participants[0]?.lastSeen || '')}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {activeChat.orderId && (
                      <span className="bg-bearplus-green text-black px-3 py-1 rounded text-sm font-semibold">
                        {activeChat.orderId}
                      </span>
                    )}
                    <button className="text-gray-400 hover:text-white p-2">📞</button>
                    <button className="text-gray-400 hover:text-white p-2">📹</button>
                    <button className="text-gray-400 hover:text-white p-2">⚙️</button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === user?.id
                        ? 'bg-bearplus-green text-black'
                        : 'bg-bearplus-card-dark text-white'
                    }`}>
                      {message.replyTo && (
                        <div className="mb-2 p-2 bg-black/20 rounded text-xs">
                          Ответ на сообщение
                        </div>
                      )}
                      
                      {message.content && <p className="text-sm">{message.content}</p>}
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-black/20 rounded">
                              <span className="text-lg">{getFileIcon(attachment.type)}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{attachment.name}</p>
                                <p className="text-xs opacity-75">{formatFileSize(attachment.size)}</p>
                              </div>
                              <button 
                                onClick={() => window.open(attachment.url, '_blank')}
                                className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30"
                              >
                                📥
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs mt-2 opacity-75">
                        {formatTime(message.timestamp)}
                        {message.senderId === user?.id && (
                          <span className="ml-2">{message.isRead ? '✓✓' : '✓'}</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-bearplus-card-dark text-white px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Reply banner */}
              {replyTo && (
                <div className="px-4 py-2 bg-bearplus-card-dark border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Ответ на сообщение от {replyTo.senderName}</p>
                      <p className="text-sm text-white truncate">{replyTo.content}</p>
                    </div>
                    <button 
                      onClick={() => setReplyTo(null)}
                      className="text-gray-400 hover:text-white ml-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* File upload progress */}
              {uploadingFiles.length > 0 && (
                <div className="px-4 py-2 bg-bearplus-card-dark border-t border-gray-700">
                  <div className="space-y-2">
                    {uploadingFiles.map((upload, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-lg">{getFileIcon(upload.file.type)}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-white truncate">{upload.file.name}</span>
                            <span className="text-gray-400">{upload.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                            <div 
                              className="bg-bearplus-green h-1 rounded-full transition-all duration-300"
                              style={{ width: `${upload.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setUploadingFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-end space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-shrink-0 w-10 h-10 bg-bearplus-card-dark border border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    📎
                  </button>
                  
                  <div className="flex-1 relative">
                    <textarea
                      ref={messageInputRef}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Введите сообщение..."
                      className="w-full bg-bearplus-card-dark border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-bearplus-green focus:outline-none resize-none"
                      rows={1}
                      style={{
                        minHeight: '40px',
                        maxHeight: '120px'
                      }}
                    />
                  </div>
                  
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex-shrink-0 w-10 h-10 bg-bearplus-card-dark border border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    😊
                  </button>
                  
                  <button
                    onClick={sendMessage}
                    disabled={!messageText.trim() && uploadingFiles.length === 0}
                    className="flex-shrink-0 w-10 h-10 bg-bearplus-green text-black rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📤
                  </button>
                </div>
                
                {/* Emoji picker placeholder */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 right-4 bg-bearplus-card-dark border border-gray-600 rounded-lg p-4 shadow-lg z-10">
                    <div className="grid grid-cols-8 gap-2">
                      {['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setMessageText(prev => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="text-lg hover:bg-gray-600 rounded p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-bearplus-card-dark">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Выберите чат для начала общения
                </h3>
                <p className="text-gray-500">
                  Начните новый разговор или выберите существующий чат из списка
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessengerPage;