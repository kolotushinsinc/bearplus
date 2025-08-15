# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Собираем TypeScript проект
RUN npm run build

# Создаем директорию для загрузок
RUN mkdir -p uploads

# Открываем порт
EXPOSE 5000

# Устанавливаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S bearplus -u 1001
USER bearplus

# Запускаем приложение
CMD ["npm", "start"]