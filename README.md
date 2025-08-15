# BearPlus - Логистическая платформа

Полнофункциональная веб-платформа для логистических услуг с калькулятором доставки, системой управления заявками и административной панелью.

## 🚀 Технологический стек

### Backend
- **Node.js** с **TypeScript**
- **Express.js** - веб-фреймворк
- **MongoDB** - основная база данных
- **Mongoose** - ODM для MongoDB
- **JWT** - аутентификация
- **RabbitMQ** - очереди сообщений
- **Redis** - кеширование
- **Nodemailer** - отправка email
- **Docker** - контейнеризация

### Frontend
- **React** с **TypeScript**
- **Redux Toolkit** - управление состоянием
- **React Router** - маршрутизация
- **Axios** - HTTP клиент
- **React Hook Form** - работа с формами
- **Styled Components** - стилизация
- **React Toastify** - уведомления
- **i18next** - интернационализация (RU/EN/ZH)

### DevOps & Infrastructure
- **Docker & Docker Compose**
- **Nginx** - reverse proxy и веб-сервер
- **MongoDB** - база данных
- **RabbitMQ** - message broker
- **Redis** - кеширование

## 📁 Структура проекта

```
bearplus/
├── server/                 # Backend API (Node.js + TypeScript)
│   ├── src/
│   │   ├── controllers/    # Контроллеры API
│   │   ├── middleware/     # Middleware функции
│   │   ├── models/         # Модели данных (Mongoose)
│   │   ├── routes/         # Маршруты API
│   │   ├── types/          # TypeScript типы
│   │   ├── utils/          # Утилиты
│   │   ├── validators/     # Валидация данных
│   │   └── index.ts        # Точка входа
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── client/                 # Frontend клиентское приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы приложения
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API сервисы
│   │   ├── store/          # Redux store и slices
│   │   ├── types/          # TypeScript типы
│   │   └── App.tsx         # Главный компонент
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── crm-client/             # CRM административная панель
│   ├── src/                # Аналогичная структура client
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml      # Конфигурация Docker Compose
└── README.md
```

## 🛠️ Установка и запуск

### Предварительные требования

- **Node.js** 18+
- **Docker** и **Docker Compose**
- **Git**

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd bearplus
```

### 2. Настройка переменных окружения

#### Сервер
```bash
cd server
cp .env.example .env
```

Отредактируйте [`server/.env`](server/.env) и укажите:
- `MONGODB_URI` - строка подключения к MongoDB
- `EMAIL_USER` и `EMAIL_PASS` - данные для отправки email
- Другие настройки по необходимости

### 3. Запуск с Docker Compose (рекомендуется)

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка сервисов
docker-compose down
```

### 4. Локальная разработка

#### Запуск сервера
```bash
cd server
npm install
npm run dev
```

#### Запуск клиентского приложения
```bash
cd client
npm install
npm start
```

#### Запуск CRM
```bash
cd crm-client
npm install
npm start
```

## 🌐 Доступ к приложениям

После запуска будут доступны:

- **Клиентское приложение**: http://localhost:3000
- **CRM панель**: http://localhost:3001
- **API сервер**: http://localhost:5000
- **MongoDB**: localhost:27017
- **RabbitMQ Management**: http://localhost:15672 (admin/password123)
- **Nginx**: http://localhost:80

## 🔐 Система аутентификации

### Типы пользователей
- **Client** - клиенты, заказывающие логистические услуги
- **Agent** - агенты, предоставляющие услуги и управляющие заявками

### Функционал аутентификации
- ✅ Регистрация с подтверждением email
- ✅ Вход/выход из системы
- ✅ Восстановление пароля
- ✅ JWT токены с refresh
- ✅ Защищенные маршруты
- ✅ Проверка ролей пользователей
- ✅ Блокировка при множественных неудачных попытках

### API Endpoints

#### Аутентификация
```
POST /api/auth/register     # Регистрация
POST /api/auth/login        # Вход
GET  /api/auth/me          # Текущий пользователь
POST /api/auth/logout      # Выход
GET  /api/auth/verify-email/:token  # Подтверждение email
POST /api/auth/forgot-password      # Запрос сброса пароля
PUT  /api/auth/reset-password/:token # Сброс пароля
```

#### Пользователи
```
GET  /api/users/profile/:id    # Профиль пользователя
PUT  /api/users/profile/:id    # Обновление профиля
PUT  /api/users/change-password # Смена пароля
PUT  /api/users/deactivate     # Деактивация аккаунта
GET  /api/users               # Список пользователей (агенты)
PUT  /api/users/:id/loyalty   # Настройка скидки (агенты)
```

## 🏗️ Архитектура

### Backend Architecture
- **MVC Pattern** - разделение логики на Model-View-Controller
- **Middleware Pipeline** - обработка запросов через цепочку middleware
- **JWT Authentication** - stateless аутентификация
- **Error Handling** - централизованная обработка ошибок
- **Validation** - валидация данных с express-validator
- **TypeScript** - строгая типизация

### Frontend Architecture
- **Component-Based** - модульная архитектура компонентов
- **Redux Pattern** - предсказуемое управление состоянием
- **Protected Routes** - контроль доступа на уровне маршрутов
- **Service Layer** - абстракция API вызовов
- **TypeScript** - типобезопасность

### Database Schema
```
Users Collection:
- userType: 'client' | 'agent'
- firstName, lastName, username, email, phone
- companyName, organizationType, activityType (для агентов)
- isEmailVerified, isPhoneVerified, isActive
- loyaltyDiscount, language
- loginAttempts, lockUntil
- timestamps
```

## 🔧 Конфигурация

### Environment Variables

#### Server (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bearplus
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RABBITMQ_URL=amqp://localhost:5672
CLIENT_URL=http://localhost:3000
CRM_URL=http://localhost:3001
```

#### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚦 Статус разработки

### ✅ Готово
- [x] Структура проекта (client, crm-client, server)
- [x] Конфигурация TypeScript для всех приложений
- [x] MongoDB модели и схемы
- [x] API аутентификации и авторизации
- [x] Redux store и управление состоянием
- [x] Защищенные маршруты и middleware
- [x] Docker контейнеризация
- [x] Docker Compose конфигурация

### 🔄 В разработке
- [ ] UI компоненты форм входа и регистрации
- [ ] Дизайн интерфейса согласно Figma макетам
- [ ] Калькулятор доставки
- [ ] Система управления заявками
- [ ] Мессенджер и файловый обмен
- [ ] Интеграция с внешними API

### 📋 Планируется
- [ ] Модуль "Ставки фрахта"
- [ ] Модуль "Судовая карта" (интеграция с MarineTraffic)
- [ ] Модуль "Аренда КТК"
- [ ] Модуль "Авто доставка"
- [ ] Модуль "ЖД доставка"
- [ ] Система уведомлений
- [ ] Аналитика и отчеты
- [ ] Мобильная адаптация

## 🐛 Отладка

### Логи Docker Compose
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f mongodb
```

### Подключение к контейнерам
```bash
# Сервер
docker-compose exec server sh

# MongoDB
docker-compose exec mongodb mongosh

# Перезапуск сервиса
docker-compose restart server
```

## 🤝 Контрибьютинг

1. Создайте feature branch
2. Внесите изменения
3. Добавьте тесты
4. Создайте Pull Request

## 📝 Лицензия

MIT License

## 📞 Поддержка

Для вопросов и поддержки создавайте Issues в репозитории.