import mongoose, { Schema, Model } from 'mongoose';

interface IRate extends mongoose.Document {
  agentId: mongoose.Types.ObjectId;
  type: 'freight' | 'railway' | 'auto' | 'container_rental';
  origin: string;
  destination: string;
  containerType: string;
  weight?: number;
  volume?: number;
  price: number;
  currency: string;
  validFrom: Date;
  validTo: Date;
  transitTime?: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IMarginSetting extends mongoose.Document {
  agentId: mongoose.Types.ObjectId;
  type: 'container_rental' | 'railway' | 'freight' | 'auto_delivery';
  marginPercent: number;
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const rateSchema = new Schema<IRate>({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['freight', 'railway', 'auto', 'container_rental'],
    required: true,
    index: true
  },
  origin: {
    type: String,
    required: true,
    index: true
  },
  destination: {
    type: String,
    required: true,
    index: true
  },
  containerType: {
    type: String,
    required: true
  },
  weight: Number,
  volume: Number,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'RUB', 'CNY']
  },
  validFrom: {
    type: Date,
    required: true,
    index: true
  },
  validTo: {
    type: Date,
    required: true,
    index: true
  },
  transitTime: {
    type: Number,
    min: 1
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const marginSettingSchema = new Schema<IMarginSetting>({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['container_rental', 'railway', 'freight', 'auto_delivery'],
    required: true
  },
  marginPercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы для ставок
rateSchema.index({ agentId: 1, type: 1 });
rateSchema.index({ origin: 1, destination: 1, type: 1 });
rateSchema.index({ validFrom: 1, validTo: 1 });
rateSchema.index({ isActive: 1, validFrom: 1, validTo: 1 });

// Индексы для настроек маржи
marginSettingSchema.index({ agentId: 1, type: 1 }, { unique: true });

// Виртуальное поле для маршрута
rateSchema.virtual('route').get(function(this: IRate) {
  return `${this.origin} - ${this.destination}`;
});

// Методы для проверки валидности ставки
rateSchema.methods.isValid = function(this: IRate, date?: Date): boolean {
  const checkDate = date || new Date();
  return this.isActive && 
         this.validFrom <= checkDate && 
         this.validTo >= checkDate;
};

// Статический метод для поиска актуальных ставок
rateSchema.statics.findActiveRates = function(
  origin: string, 
  destination: string, 
  type: string, 
  date?: Date
) {
  const checkDate = date || new Date();
  return this.find({
    origin: new RegExp(origin, 'i'),
    destination: new RegExp(destination, 'i'),
    type,
    isActive: true,
    validFrom: { $lte: checkDate },
    validTo: { $gte: checkDate }
  }).sort({ price: 1 });
};

const Rate: Model<IRate> = mongoose.model<IRate>('Rate', rateSchema);
const MarginSetting: Model<IMarginSetting> = mongoose.model<IMarginSetting>('MarginSetting', marginSettingSchema);

export { Rate, MarginSetting, IRate, IMarginSetting };