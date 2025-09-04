import mongoose, { Schema, Model } from 'mongoose';

interface IOrder extends mongoose.Document {
  orderNumber: string;
  clientId: mongoose.Types.ObjectId;
  agentId?: mongoose.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  transportType: 'freight' | 'auto' | 'railway';
  route: {
    departure: string;
    arrival: string;
  };
  cargo: {
    description: string;
    weight: number;
    containerType: string;
    isDangerous: boolean;
  };
  dates: {
    created: Date;
    estimatedDeparture?: Date;
    estimatedArrival?: Date;
    actualDeparture?: Date;
    actualArrival?: Date;
  };
  tracking?: {
    currentLocation: string;
    vesselName?: string;
    vesselIMO?: string;
    lastUpdate: Date;
  };
  cost: {
    total: number;
    currency: string;
    paid: boolean;
  };
  documents: mongoose.Types.ObjectId[];
  stages: Array<{
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'requires_confirmation';
    description: string;
    completedAt?: Date;
    requiresClientConfirmation: boolean;
  }>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  transportType: {
    type: String,
    enum: ['freight', 'auto', 'railway'],
    required: true
  },
  route: {
    departure: {
      type: String,
      required: true
    },
    arrival: {
      type: String,
      required: true
    }
  },
  cargo: {
    description: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    containerType: {
      type: String,
      required: true
    },
    isDangerous: {
      type: Boolean,
      default: false
    }
  },
  dates: {
    created: {
      type: Date,
      default: Date.now
    },
    estimatedDeparture: Date,
    estimatedArrival: Date,
    actualDeparture: Date,
    actualArrival: Date
  },
  tracking: {
    currentLocation: String,
    vesselName: String,
    vesselIMO: String,
    lastUpdate: Date
  },
  cost: {
    total: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true,
      default: 'RUB'
    },
    paid: {
      type: Boolean,
      default: false
    }
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  stages: [{
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'requires_confirmation'],
      default: 'pending'
    },
    description: String,
    completedAt: Date,
    requiresClientConfirmation: {
      type: Boolean,
      default: false
    }
  }],
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ clientId: 1, status: 1 });
orderSchema.index({ agentId: 1, status: 1 });
orderSchema.index({ 'route.departure': 1, 'route.arrival': 1 });
orderSchema.index({ createdAt: -1 });

// Автогенерация номера заказа
orderSchema.pre<IOrder>('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments({
      orderNumber: new RegExp(`^ORD-${year}-`)
    });
    this.orderNumber = `ORD-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
export { IOrder };