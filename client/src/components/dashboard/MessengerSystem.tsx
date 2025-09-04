import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { apiService } from '../../services/apiService';

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderType: 'client' | 'agent' | 'system';
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  isRead: boolean;
  orderId?: string;
}

interface Chat {
  id: string;
  title: string;
  participants: Array<{
    id: string;
    name: string;
    type: 'client' | 'agent';
    avatar?: string;
    isOnline: boolean;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  orderId?: string;
  status: 'active' | 'closed';
  createdAt: string;
}

const MessengerSystem: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.messages.getChats({
        page: 1,
        limit: 20
      });
      
      if (response.success) {
        setChats(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedChat(response.data[0]);
        }
      } else {
        console.error('Failed to fetch chats:', response);
        setChats([]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      // Mock messages data - replace with API call
      const mockMessages: Message[] = [
        {
          id: '1',
          chatId: chatId,
          senderId: user?.id || 'client1',
          senderName: user?.firstName + ' ' + user?.lastName || 'Клиент',
          senderType: 'client',
          content: 'Здравствуйте! У меня вопрос по заявке ORD-2024-001',
          type: 'text',
          timestamp: '2024-01-15T10:30:00Z',
          isRead: true
        },
        {
          id: '2',
          chatId: chatId,
          senderId: 'agent1',
          senderName: 'Анна Петрова',
          senderType: 'agent',
          content: 'Добрый день! Я ваш персональный менеджер. Чем могу помочь?',
          type: 'text',
          timestamp: '2024-01-15T10:32:00Z',
          isRead: true
        },
        {
          id: '3',
          chatId: chatId,
          senderId: user?.id || 'client1',
          senderName: user?.firstName + ' ' + user?.lastName || 'Клиент',
          senderType: 'client',
          content: 'Нужно дополнить документы для груза',
          type: 'text',
          timestamp: '2024-01-15T10:35:00Z',
          isRead: true
        },
        {
          id: '4',
          chatId: chatId,
          senderId: user?.id || 'client1',
          senderName: user?.firstName + ' ' + user?.lastName || 'Клиент',
          senderType: 'client',
          content: 'Commercial_Invoice_Updated.pdf',
          type: 'file',
          fileUrl: '/documents/Commercial_Invoice_Updated.pdf',
          fileName: 'Commercial_Invoice_Updated.pdf',
          timestamp: '2024-01-15T10:36:00Z',
          isRead: true
        },
        {
          id: '5',
          chatId: chatId,
          senderId: 'agent1',
          senderName: 'Анна Петрова',
          senderType: 'agent',
          content: 'Документы получены, начинаем обработку заявки',
          type: 'text',
          timestamp: '2024-01-16T14:30:00Z',
          isRead: false
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      chatId: selectedChat.id,
      senderId: user?.id || 'user1',
      senderName: user?.firstName + ' ' + user?.lastName || 'Пользователь',
      senderType: user?.userType || 'client',
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // In production, send message to API
    console.log('Sending message:', message);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Загрузка сообщений...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Modern Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-tech-primary/10 rounded-xl border border-tech-primary/20">
            <span className="text-2xl">💬</span>
          </div>
          <div>
            <h2 className="text-tech-title">Мессенджер</h2>
            <p className="text-tech-caption">Общайтесь с логистами в реальном времени</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/messenger')}
          className="btn-primary btn-sm"
        >
          🚀 Полный мессенджер
        </button>
      </div>

      {/* Modern Stats */}
      <div className="grid tech-grid-3 gap-6">
        <div className="card-interactive text-center group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-tech-error/10 rounded-lg border border-tech-error/20 group-hover:glow-tech-sm transition-all">
              <span className="text-2xl text-gradient font-bold">{chats.reduce((acc, chat) => acc + chat.unreadCount, 0)}</span>
            </div>
          </div>
          <div className="text-tech-caption font-medium">Непрочитанные</div>
          <div className="progress-bar mt-2">
            <div className="progress-fill" style={{width: '30%'}}></div>
          </div>
        </div>
        <div className="card-interactive text-center group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-tech-info/10 rounded-lg border border-tech-info/20 group-hover:glow-tech-sm transition-all">
              <span className="text-2xl text-gradient font-bold">{chats.length}</span>
            </div>
          </div>
          <div className="text-tech-caption font-medium">Активные чаты</div>
          <div className="progress-bar mt-2">
            <div className="progress-fill" style={{width: '75%'}}></div>
          </div>
        </div>
        <div className="card-interactive text-center group">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-tech-success/10 rounded-lg border border-tech-success/20 group-hover:glow-tech-sm transition-all">
              <span className="text-2xl text-gradient font-bold">
                {chats.reduce((acc, chat) =>
                  acc + chat.participants.filter(p => p.type === 'agent' && p.isOnline).length, 0
                )}
              </span>
            </div>
          </div>
          <div className="text-tech-caption font-medium">Онлайн агентов</div>
          <div className="progress-bar mt-2">
            <div className="progress-fill" style={{width: '90%'}}></div>
          </div>
        </div>
      </div>

      {/* Recent Chats Preview */}
      <div className="bg-bearplus-card rounded-lg">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Последние сообщения</h3>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {chats.slice(0, 3).map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate('/messenger')}
              className="p-4 border-b border-gray-800 cursor-pointer hover:bg-bearplus-card-dark transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white truncate">{chat.title}</h4>
                {chat.unreadCount > 0 && (
                  <span className="bg-bearplus-green text-black text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              
              {chat.lastMessage && (
                <div className="text-sm text-gray-400">
                  <p className="truncate">{chat.lastMessage.content}</p>
                  <p className="text-xs mt-1">{formatTime(chat.lastMessage.timestamp)}</p>
                </div>
              )}

              <div className="flex items-center mt-2">
                {chat.participants
                  .filter(p => p.id !== user?.id)
                  .map((participant) => (
                    <div key={participant.id} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        participant.isOnline ? 'bg-green-400' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-xs text-gray-500">{participant.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {chats.length > 3 && (
          <div className="p-4 text-center border-t border-gray-700">
            <button 
              onClick={() => navigate('/messenger')}
              className="text-bearplus-green hover:text-green-400 text-sm"
            >
              Показать все чаты ({chats.length})
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-bearplus-card rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/messenger')}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <span>📝</span>
            <span>Написать сообщение</span>
          </button>
          <button 
            onClick={() => setShowNewChatModal(true)}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <span>👥</span>
            <span>Новый чат с агентом</span>
          </button>
        </div>
      </div>

      {/* Modern New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4" onClick={() => setShowNewChatModal(false)}>
          <div className="modal-content p-8 w-full max-w-lg animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-tech-secondary/10 rounded-xl border border-tech-secondary/20">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="text-tech-title">Создать новый чат</h3>
                <p className="text-tech-caption">Свяжитесь с нашими логистами</p>
              </div>
            </div>
            
            <div className="alert alert-success mb-6">
              <span className="text-lg">👋</span>
              <span>Новый чат будет создан с нашими логистами для решения ваших вопросов</span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // In production, create new chat
                  console.log('Creating new chat');
                  setShowNewChatModal(false);
                  navigate('/messenger');
                }}
                className="btn-primary flex-1"
              >
                💬 Создать чат
              </button>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="btn-secondary btn-sm px-6"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessengerSystem;