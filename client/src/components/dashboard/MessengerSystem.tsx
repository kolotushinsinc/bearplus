import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';

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
  const { user } = useAppSelector((state) => state.auth);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      
      // Mock chat data
      const mockChats: Chat[] = [
        {
          id: '1',
          title: 'Заявка ORD-2024-001',
          participants: [
            {
              id: user?.id || 'client1',
              name: user?.firstName + ' ' + user?.lastName || 'Клиент',
              type: 'client',
              isOnline: true
            },
            {
              id: 'agent1',
              name: 'Анна Петрова',
              type: 'agent',
              avatar: '/avatars/agent1.jpg',
              isOnline: true
            }
          ],
          lastMessage: {
            id: 'msg1',
            chatId: '1',
            senderId: 'agent1',
            senderName: 'Анна Петрова',
            senderType: 'agent',
            content: 'Документы получены, начинаем обработку заявки',
            type: 'text',
            timestamp: '2024-01-16T14:30:00Z',
            isRead: false
          },
          unreadCount: 2,
          orderId: 'ORD-2024-001',
          status: 'active',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Общие вопросы',
          participants: [
            {
              id: user?.id || 'client1',
              name: user?.firstName + ' ' + user?.lastName || 'Клиент',
              type: 'client',
              isOnline: true
            },
            {
              id: 'agent2',
              name: 'Михаил Сидоров',
              type: 'agent',
              avatar: '/avatars/agent2.jpg',
              isOnline: false
            }
          ],
          lastMessage: {
            id: 'msg2',
            chatId: '2',
            senderId: user?.id || 'client1',
            senderName: user?.firstName + ' ' + user?.lastName || 'Клиент',
            senderType: 'client',
            content: 'Спасибо за помощь!',
            type: 'text',
            timestamp: '2024-01-15T16:45:00Z',
            isRead: true
          },
          unreadCount: 0,
          status: 'active',
          createdAt: '2024-01-14T09:00:00Z'
        }
      ];

      setTimeout(() => {
        setChats(mockChats);
        if (mockChats.length > 0) {
          setSelectedChat(mockChats[0]);
        }
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading chats:', error);
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      // Mock messages data
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
        },
        {
          id: '6',
          chatId: chatId,
          senderId: 'system',
          senderName: 'Система',
          senderType: 'system',
          content: 'Статус заявки изменен на "В обработке"',
          type: 'system',
          timestamp: '2024-01-16T14:31:00Z',
          isRead: false,
          orderId: 'ORD-2024-001'
        }
      ];

      setMessages(mockMessages);
      
      // Mark messages as read
      markMessagesAsRead(chatId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markMessagesAsRead = async (chatId: string) => {
    try {
      // Update unread count in chat
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      chatId: selectedChat.id,
      senderId: user?.id || 'client1',
      senderName: user?.firstName + ' ' + user?.lastName || 'Клиент',
      senderType: 'client',
      content: newMessage.trim(),
      type: 'text',
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update chat's last message
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: message }
        : chat
    ));

    // Show typing indicator for agent response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate agent response
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        chatId: selectedChat.id,
        senderId: 'agent1',
        senderName: 'Анна Петрова',
        senderType: 'agent',
        content: 'Спасибо за сообщение! Я обработаю ваш запрос и свяжусь с вами в ближайшее время.',
        type: 'text',
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 2000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChat) return;

    // Create file message
    const fileMessage: Message = {
      id: Date.now().toString(),
      chatId: selectedChat.id,
      senderId: user?.id || 'client1',
      senderName: user?.firstName + ' ' + user?.lastName || 'Клиент',
      senderType: 'client',
      content: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, fileMessage]);

    // Update chat's last message
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: fileMessage }
        : chat
    ));

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
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
    <div className="h-[600px] flex bg-bearplus-card-dark rounded-xl border border-gray-700 overflow-hidden">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Сообщения</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b border-gray-700/50 cursor-pointer hover:bg-gray-700/50 transition-colors ${
                selectedChat?.id === chat.id ? 'bg-gray-700/50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white text-sm">{chat.title}</h4>
                {chat.unreadCount > 0 && (
                  <span className="bg-bearplus-green text-black text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center mb-2">
                {chat.participants
                  .filter(p => p.id !== user?.id)
                  .map((participant) => (
                    <div key={participant.id} className="flex items-center mr-2">
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        participant.isOnline ? 'bg-green-400' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-xs text-gray-400">{participant.name}</span>
                    </div>
                  ))}
              </div>

              {chat.lastMessage && (
                <div className="text-xs text-gray-500 truncate">
                  <span className="font-medium">
                    {chat.lastMessage.senderType === 'client' && chat.lastMessage.senderId === user?.id ? 'Вы: ' : 
                     chat.lastMessage.senderType === 'system' ? 'Система: ' :
                     chat.lastMessage.senderName + ': '}
                  </span>
                  {chat.lastMessage.type === 'file' ? '📎 ' + chat.lastMessage.fileName : chat.lastMessage.content}
                </div>
              )}
              
              <div className="text-xs text-gray-600 mt-1">
                {chat.lastMessage && formatMessageTime(chat.lastMessage.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 bg-gray-800/50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white">{selectedChat.title}</h3>
                <div className="flex items-center text-sm text-gray-400">
                  {selectedChat.participants
                    .filter(p => p.id !== user?.id)
                    .map((participant, index) => (
                      <div key={participant.id} className="flex items-center">
                        {index > 0 && <span className="mx-1">,</span>}
                        <div className={`w-2 h-2 rounded-full mr-1 ${
                          participant.isOnline ? 'bg-green-400' : 'bg-gray-500'
                        }`}></div>
                        <span>{participant.name}</span>
                        <span className="ml-1">
                          ({participant.isOnline ? 'онлайн' : 'не в сети'})
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              {selectedChat.orderId && (
                <div className="text-xs text-bearplus-green bg-bearplus-green/10 px-2 py-1 rounded">
                  {selectedChat.orderId}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`max-w-[70%] ${
                  message.senderType === 'system' 
                    ? 'mx-auto bg-gray-700/50 text-center text-xs text-gray-400 px-3 py-2 rounded-full'
                    : message.senderId === user?.id
                    ? 'bg-bearplus-green text-black'
                    : 'bg-gray-700 text-white'
                } rounded-lg p-3`}>
                  
                  {message.senderType !== 'system' && message.senderId !== user?.id && (
                    <div className="text-xs text-gray-300 mb-1 font-medium">
                      {message.senderName}
                    </div>
                  )}

                  {message.type === 'file' || message.type === 'image' ? (
                    <div className="space-y-2">
                      {message.type === 'image' ? (
                        <img 
                          src={message.fileUrl} 
                          alt={message.fileName}
                          className="max-w-full rounded cursor-pointer"
                          onClick={() => window.open(message.fileUrl, '_blank')}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 bg-black/20 p-2 rounded">
                          <span>📎</span>
                          <span className="text-sm">{message.fileName}</span>
                          <button 
                            onClick={() => window.open(message.fileUrl, '_blank')}
                            className="text-xs underline hover:no-underline"
                          >
                            Скачать
                          </button>
                        </div>
                      )}
                      {message.content !== message.fileName && (
                        <div className="text-sm">{message.content}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm">{message.content}</div>
                  )}

                  <div className={`text-xs mt-1 ${
                    message.senderId === user?.id ? 'text-black/70' : 'text-gray-400'
                  }`}>
                    {formatMessageTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white rounded-lg p-3 max-w-[70%]">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-400 ml-2">печатает...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-end space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-bearplus-green transition-colors"
                title="Прикрепить файл"
              >
                📎
              </button>
              
              <div className="flex-1">
                <textarea
                  ref={messageInputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Введите сообщение..."
                  className="input-field w-full resize-none"
                  rows={1}
                />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="btn-primary px-4 py-2"
              >
                Отправить
              </button>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="*/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <div>Выберите чат для начала общения</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessengerSystem;