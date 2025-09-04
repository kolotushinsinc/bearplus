// MongoDB initialization script for BearPlus logistics platform

// Переключаемся на базу данных bearplus
db = db.getSiblingDB('bearplus');

// Создаем пользователей
db.createUser({
  user: 'bearplus_user',
  pwd: 'bearplus_password_2024',
  roles: [
    {
      role: 'readWrite',
      db: 'bearplus'
    }
  ]
});

// Создаем коллекции с индексами для оптимизации
print('Creating collections and indexes...');

// Коллекция пользователей
db.createCollection('users');
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "userType": 1 });
db.users.createIndex({ "isActive": 1 });
db.users.createIndex({ "createdAt": 1 });

// Коллекция заказов
db.createCollection('orders');
db.orders.createIndex({ "orderId": 1 }, { unique: true });
db.orders.createIndex({ "clientId": 1 });
db.orders.createIndex({ "agentId": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "serviceType": 1 });
db.orders.createIndex({ "createdAt": 1 });
db.orders.createIndex({ "estimatedDelivery": 1 });

// Коллекция тарифов
db.createCollection('rates');
db.rates.createIndex({ "origin": 1, "destination": 1 });
db.rates.createIndex({ "serviceType": 1 });
db.rates.createIndex({ "validFrom": 1, "validTo": 1 });
db.rates.createIndex({ "isActive": 1 });

// Коллекция документов
db.createCollection('documents');
db.documents.createIndex({ "orderId": 1 });
db.documents.createIndex({ "documentType": 1 });
db.documents.createIndex({ "uploadedAt": 1 });

// Коллекция сообщений
db.createCollection('messages');
db.messages.createIndex({ "orderId": 1 });
db.messages.createIndex({ "senderId": 1 });
db.messages.createIndex({ "recipientId": 1 });
db.messages.createIndex({ "createdAt": 1 });

// Коллекция настроек лояльности
db.createCollection('loyaltysettings');
db.loyaltysettings.createIndex({ "isActive": 1 });

// Коллекция настроек маржи
db.createCollection('marginsettings');
db.marginsettings.createIndex({ "serviceType": 1 });
db.marginsettings.createIndex({ "isActive": 1 });

// Создаем администратора по умолчанию
print('Creating default admin user...');
db.users.insertOne({
  _id: ObjectId(),
  email: 'admin@bearplus.com',
  firstName: 'Администратор',
  lastName: 'Системы',
  password: '$2b$10$LKKx8y5A6S7QnJgYqYfOl.Q2P7K9x4R3zF8sW9vN2M8K1Lx5C6yHe', // password: admin123
  userType: 'admin',
  isEmailVerified: true,
  isActive: true,
  createdAt: new Date(),
  lastLogin: new Date()
});

// Создаем тестового агента
print('Creating test agent...');
db.users.insertOne({
  _id: ObjectId(),
  email: 'agent@bearplus.com',
  firstName: 'Тестовый',
  lastName: 'Агент',
  password: '$2b$10$LKKx8y5A6S7QnJgYqYfOl.Q2P7K9x4R3zF8sW9vN2M8K1Lx5C6yHe', // password: admin123
  userType: 'agent',
  companyName: 'BearPlus Logistics',
  phone: '+7 (999) 123-45-67',
  isEmailVerified: true,
  isActive: true,
  createdAt: new Date(),
  lastLogin: new Date()
});

// Создаем тестового клиента
print('Creating test client...');
db.users.insertOne({
  _id: ObjectId(),
  email: 'client@test.com',
  firstName: 'Тестовый',
  lastName: 'Клиент',
  password: '$2b$10$LKKx8y5A6S7QnJgYqYfOl.Q2P7K9x4R3zF8sW9vN2M8K1Lx5C6yHe', // password: admin123
  userType: 'client',
  companyName: 'ООО "Тест"',
  phone: '+7 (999) 987-65-43',
  isEmailVerified: true,
  isActive: true,
  loyaltyDiscount: 5,
  totalOrders: 0,
  totalRevenue: 0,
  createdAt: new Date(),
  lastLogin: new Date()
});

// Создаем базовые настройки лояльности
print('Creating default loyalty settings...');
db.loyaltysettings.insertOne({
  _id: ObjectId(),
  name: 'Базовые настройки лояльности',
  tiers: [
    {
      name: 'Бронзовый',
      minOrders: 0,
      minAmount: 0,
      discount: 0,
      color: '#CD7F32'
    },
    {
      name: 'Серебряный',
      minOrders: 5,
      minAmount: 50000,
      discount: 3,
      color: '#C0C0C0'
    },
    {
      name: 'Золотой',
      minOrders: 15,
      minAmount: 200000,
      discount: 7,
      color: '#FFD700'
    },
    {
      name: 'Платиновый',
      minOrders: 30,
      minAmount: 500000,
      discount: 12,
      color: '#E5E4E2'
    }
  ],
  bonusRules: {
    orderBonus: 1, // % от суммы заказа
    referralBonus: 5000, // фиксированная сумма за привлечение
    reviewBonus: 500 // бонус за отзыв
  },
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Создаем базовые настройки маржи
print('Creating default margin settings...');
db.marginsettings.insertMany([
  {
    _id: ObjectId(),
    serviceType: 'sea_freight',
    serviceName: 'Морские перевозки',
    margin: 15,
    minMargin: 5,
    maxMargin: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    serviceType: 'air_freight',
    serviceName: 'Авиаперевозки',
    margin: 20,
    minMargin: 10,
    maxMargin: 35,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    serviceType: 'land_freight',
    serviceName: 'Автоперевозки',
    margin: 12,
    minMargin: 5,
    maxMargin: 25,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    serviceType: 'customs',
    serviceName: 'Таможенное оформление',
    margin: 25,
    minMargin: 15,
    maxMargin: 40,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('MongoDB initialization completed successfully!');