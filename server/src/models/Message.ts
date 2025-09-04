import mongoose, { Schema, Model } from 'mongoose';

interface IMessage extends mongoose.Document {
  chatId: string;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderType: 'client' | 'agent' | 'system';
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
  fileName?: string;
  timestamp: Date;
  isRead: boolean;
  orderId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IChat extends mongoose.Document {
  title: string;
  participants: Array<{
    id: mongoose.Types.ObjectId;
    name: string;
    type: 'client' | 'agent';
    avatar?: string;
    isOnline: boolean;
  }>;
  lastMessage?: mongoose.Types.ObjectId;
  unreadCount: number;
  orderId?: mongoose.Types.ObjectId;
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  chatId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderType: {
    type: String,
    enum: ['client', 'agent', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'system'],
    default: 'text'
  },
  fileUrl: String,
  fileName: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const chatSchema = new Schema<IChat>({
  title: {
    type: String,
    required: true
  },
  participants: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['client', 'agent'],
      required: true
    },
    avatar: String,
    isOnline: {
      type: Boolean,
      default: false
    }
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы для сообщений
messageSchema.index({ chatId: 1, timestamp: -1 });
messageSchema.index({ senderId: 1, isRead: 1 });

// Индексы для чатов
chatSchema.index({ 'participants.id': 1 });
chatSchema.index({ status: 1, updatedAt: -1 });

// Методы для чата
chatSchema.methods.addMessage = function(this: IChat, messageId: mongoose.Types.ObjectId) {
  this.lastMessage = messageId;
  this.unreadCount += 1;
  return this.save();
};

chatSchema.methods.markAsRead = function(this: IChat, userId: mongoose.Types.ObjectId) {
  // В реальной реализации здесь будет логика пометки сообщений как прочитанных
  this.unreadCount = 0;
  return this.save();
};

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);
const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);

export { Message, Chat, IMessage, IChat };