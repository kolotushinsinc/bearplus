# BearPlus - Руководство по деплою

## Обзор системы

BearPlus - это комплексная логистическая платформа для международных перевозок, включающая:

- **Frontend Client** (React + TypeScript + Vite)
- **Backend API** (Node.js + Express + TypeScript) 
- **CRM Client** (React для администраторов)
- **MongoDB** для базы данных
- **RabbitMQ** для очередей сообщений
- **Nginx** как reverse proxy

## Быстрый старт (Development)

### Предварительные требования
- Node.js 18+
- MongoDB 6.0+
- RabbitMQ 3.11+
- Docker и Docker Compose (опционально)

### Локальная разработка

1. **Клонирование и установка зависимостей:**
```bash
git clone <repository-url>
cd bearplus

# Установка зависимостей для всех компонентов
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
cd crm-client && npm install && cd ..
```

2. **Настройка переменных окружения:**
```bash
# Скопировать примеры конфигураций
cp server/.env.example server/.env
cp .env.example .env

# Настроить переменные в server/.env:
NODE_ENV=development
PORT=5005
MONGODB_URI=mongodb://localhost:27017/bearplus
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
CRM_URL=http://localhost:3001
```

3. **Запуск в режиме разработки:**
```bash
# Терминал 1: Запуск backend
cd server
npm run dev

# Терминал 2: Запуск frontend
cd client  
npm run dev

# Терминал 3: Запуск CRM (опционально)
cd crm-client
npm start
```

## Продакшн деплой

### Метод 1: Docker Compose (Рекомендуется)

1. **Подготовка конфигурации:**
```bash
# Настроить переменные в .env
cp .env.example .env
# Отредактировать .env файл с продакшн настройками
```

2. **Запуск с помощью Docker Compose:**
```bash
# Сборка и запуск всех сервисов
docker-compose up -d --build

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

3. **Остановка сервисов:**
```bash
docker-compose down
```

### Метод 2: Ручной деплой

1. **Сборка фронтенда:**
```bash
cd client
npm run build
cd ../crm-client  
npm run build
```

2. **Настройка сервера:**
```bash
cd server
npm run build
npm install --production
```

3. **Настройка веб-сервера (Nginx):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/bearplus/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # CRM
    location /crm {
        root /path/to/bearplus/crm-client/dist;
        try_files $uri $uri/ /crm/index.html;
    }

    # API
    location /api {
        proxy_pass https://api.bearplus.ru/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Переменные окружения

### Backend (.env)
```env
# Основные настройки
NODE_ENV=production
PORT=5005

# База данных
MONGODB_URI=mongodb://mongo:27017/bearplus

# JWT
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# URLs
CLIENT_URL=https://yourdomain.com
CRM_URL=https://yourdomain.com/crm

# Email настройки
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# RabbitMQ
RABBITMQ_URL=amqp://rabbitmq:5672

# Файлы
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# API ключи
CURRENCY_API_KEY=your_currency_api_key
```

### Frontend (.env)
```env
VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME=BearPlus
```

## Мониторинг и логи

### Просмотр логов Docker
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### Мониторинг здоровья
```bash
# Проверка API
curl https://api.bearplus.ru/api/api/health

# Проверка frontend
curl http://localhost:5173

# Проверка CRM
curl http://localhost:3001
```

## Резервное копирование

### MongoDB
```bash
# Создание бэкапа
docker-compose exec mongo mongodump --out /backup

# Восстановление
docker-compose exec mongo mongorestore /backup
```

### Файлы загрузок
```bash
# Бэкап папки uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz server/uploads/
```

## Безопасность

### SSL/TLS
Рекомендуется использовать Let's Encrypt для SSL сертификатов:
```bash
sudo certbot --nginx -d yourdomain.com
```

### Firewall
```bash
# Открыть только необходимые порты
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## Обновление

1. **Остановка сервисов:**
```bash
docker-compose down
```

2. **Обновление кода:**
```bash
git pull origin main
```

3. **Пересборка и запуск:**
```bash
docker-compose up -d --build
```

## Troubleshooting

### Часто встречающиеся проблемы:

1. **Ошибка подключения к MongoDB:**
   - Проверить статус: `docker-compose ps`
   - Проверить логи: `docker-compose logs mongo`

2. **Ошибки CORS:**
   - Убедиться что CLIENT_URL и CRM_URL настроены правильно
   - Проверить настройки CORS в backend

3. **Проблемы с email:**
   - Проверить настройки SMTP
   - Для Gmail использовать App Password

4. **Проблемы с файлами:**
   - Проверить права доступа к папке uploads
   - Убедиться что MAX_FILE_SIZE достаточен

## Контакты

По вопросам деплоя и технической поддержки обращайтесь к команде разработки.