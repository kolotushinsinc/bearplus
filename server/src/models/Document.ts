import mongoose, { Schema, Model } from 'mongoose';

interface IDocument extends mongoose.Document {
  name: string;
  originalName: string;
  type: 'invoice' | 'packing_list' | 'certificate' | 'msds' | 'contract' | 'other';
  mimeType: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: mongoose.Types.ObjectId;
  url: string;
  orderId?: mongoose.Types.ObjectId;
  status: 'uploaded' | 'processing' | 'approved' | 'rejected';
  comments?: string;
  isPublic: boolean;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  name: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['invoice', 'packing_list', 'certificate', 'msds', 'contract', 'other'],
    required: true,
    index: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    index: true
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'approved', 'rejected'],
    default: 'uploaded',
    index: true
  },
  comments: String,
  isPublic: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы
documentSchema.index({ uploadedBy: 1, createdAt: -1 });
documentSchema.index({ orderId: 1, type: 1 });
documentSchema.index({ status: 1 });

// Виртуальное поле для размера в читаемом формате
documentSchema.virtual('sizeFormatted').get(function(this: IDocument) {
  const bytes = this.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Метод для увеличения счетчика скачиваний
documentSchema.methods.incrementDownloadCount = function(this: IDocument) {
  this.downloadCount += 1;
  return this.save();
};

const Document: Model<IDocument> = mongoose.model<IDocument>('Document', documentSchema);

export default Document;
export { IDocument };