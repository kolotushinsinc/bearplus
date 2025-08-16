# Интеграция Excel и валютных курсов ЦБ РФ

## Обзор

Данная интеграция добавляет в систему BearPlus возможности:
- Обработка Excel файлов для массовой загрузки ставок
- Интеграция с валютными курсами Центрального банка России
- Экспорт данных в Excel формат

## Установка зависимостей

### Server (Node.js)

```bash
cd server
npm install xlsx xml2js
npm install --save-dev @types/xml2js
```

### Client (React)

```bash
cd client
npm install
```

### CRM Client (React)

```bash
cd crm-client
npm install
```

**Исправление ошибки webpack dev server:**

Если при запуске `npm start` в crm-client появляется ошибка:
```
Invalid options object. Dev Server has been initialized using an options object that does not match the API schema.
- options.allowedHosts[0] should be a non-empty string.
```

Решение уже добавлено в файлы `.env` и `.env.local`. Если ошибка все еще возникает, попробуйте:

1. Удалить node_modules и package-lock.json:
```bash
cd crm-client
rm -rf node_modules package-lock.json
npm install
```

2. Или запустить с явными параметрами:
```bash
DANGEROUSLY_DISABLE_HOST_CHECK=true npm start
```

3. Альтернативно, установить более старую версию react-scripts:
```bash
npm install react-scripts@4.0.3
```

## Настройка окружения

### Server

Добавьте в файл `server/.env`:

```env
# Валютные курсы ЦБ РФ
CBR_API_URL=https://www.cbr.ru/scripts/XML_daily.asp
CURRENCY_UPDATE_INTERVAL=30 # минуты

# URL для CRM клиента
CRM_URL=http://localhost:3001
CLIENT_URL=http://localhost:3000
```

### CRM Client

Файлы `.env` и `.env.local` уже созданы с правильными настройками:

```env
# crm-client/.env
PORT=3001
REACT_APP_API_URL=http://localhost:5000
DANGEROUSLY_DISABLE_HOST_CHECK=true
WDS_SOCKET_HOST=localhost
WDS_SOCKET_PORT=3001
```

## Новые API эндпоинты

### Валютные курсы

- `GET /api/currency/rates` - Получить текущие курсы валют
- `POST /api/currency/update` - Обновить курсы валют (только ADMIN)
- `POST /api/currency/convert` - Конвертировать валюты

### Ставки (обновленные)

- `GET /api/rates/template` - Скачать шаблон Excel для загрузки ставок
- `POST /api/rates/upload` - Загрузить ставки из Excel файла
- `GET /api/rates/export?format=excel` - Экспорт ставок в Excel

## Формат Excel файла для загрузки ставок

| Столбец | Описание | Обязательный |
|---------|----------|--------------|
| Откуда | Пункт отправления | Да |
| Куда | Пункт назначения | Да |
| Тип услуги | freight/railway/auto/container | Да |
| Тип контейнера | 20GP, 40GP, 40HC и т.д. | Нет |
| Вес (кг) | Вес груза | Нет |
| Объем (м³) | Объем груза | Нет |
| Ставка | Стоимость | Да |
| Валюта | USD, EUR, RUB, CNY | Да |
| Действует с | Дата начала (YYYY-MM-DD) | Да |
| Действует до | Дата окончания (YYYY-MM-DD) | Да |
| Время доставки (дни) | Транзитное время | Нет |
| Примечания | Дополнительная информация | Нет |

## Использование

### Агентский интерфейс

1. **Управление ставками**:
   - Перейдите в раздел "Управление ставками"
   - Используйте кнопку "Скачать шаблон" для получения Excel шаблона
   - Заполните данные и загрузите через "Импорт из Excel"
   - Экспортируйте текущие ставки через "Экспорт в Excel"

2. **Настройки маржи**:
   - Валютные курсы обновляются автоматически каждые 30 минут
   - Система поддерживает конвертацию между RUB, USD, EUR, CNY

### CRM интерфейс (ADMIN)

1. **Управление валютами**:
   - Администраторы могут принудительно обновить курсы валют
   - Доступны конвертеры валют для расчетов

2. **Управление пользователями**:
   - Полный интерфейс для управления агентами
   - Подтверждение заявок на регистрацию

## Технические детали

### Обработка Excel файлов

Система использует библиотеку `xlsx` для чтения Excel файлов. Поддерживаются форматы:
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)

### Валютные курсы ЦБ РФ

- API: `https://www.cbr.ru/scripts/XML_daily.asp`
- Автоматическое обновление каждые 30 минут
- Поддержка основных валют: USD, EUR, CNY, GBP, JPY
- Fallback на mock данные при недоступности ЦБ РФ

### Безопасность

- Все операции требуют аутентификации
- Управление валютами доступно только администраторам
- Файлы автоматически удаляются после обработки
- Лимит размера файла: 10MB

## Структура файлов

```
server/
├── src/
│   ├── controllers/
│   │   ├── currencyController.ts    # Контроллер валют
│   │   └── ratesController.ts       # Обновленный контроллер ставок
│   ├── routes/
│   │   ├── currency.ts              # Маршруты валют
│   │   └── rates.ts                 # Обновленные маршруты ставок
│   └── utils/
│       └── excelProcessor.ts        # Утилиты для Excel
└── uploads/rates/                   # Временные файлы загрузок

client/
└── src/components/dashboard/        # Агентские компоненты

crm-client/
└── src/                            # CRM интерфейс для админов
```

## Устранение неполадок

### Ошибка CRM клиента при запуске

Все необходимые файлы для запуска CRM клиента созданы:
- [`crm-client/.env`](crm-client/.env) - основная конфигурация
- [`crm-client/.env.local`](crm-client/.env.local) - локальные настройки
- [`crm-client/tsconfig.json`](crm-client/tsconfig.json) - конфигурация TypeScript
- [`crm-client/public/index.html`](crm-client/public/index.html) - HTML шаблон
- [`crm-client/public/manifest.json`](crm-client/public/manifest.json) - PWA манифест

Если все еще возникают ошибки:

1. **Ошибки импорта модулей**:
```bash
cd crm-client
rm -rf node_modules package-lock.json
npm install
npm start
```

2. **Ошибка webpack dev server**:
```bash
cd crm-client
DANGEROUSLY_DISABLE_HOST_CHECK=true npm start
```

3. **TypeScript ошибки JSX**:
Файл `tsconfig.json` настроен с правильными параметрами для React JSX.

### TypeScript ошибки

После установки всех пакетов TypeScript ошибки должны исчезнуть:
```bash
# В server/
npm install xlsx xml2js @types/xml2js

# В client/ и crm-client/
npm install
```

### Запуск всей системы

```bash
# Терминал 1: Сервер
cd server
npm install xlsx xml2js @types/xml2js
npm start

# Терминал 2: Клиент агентов
cd client
npm start

# Терминал 3: CRM админов
cd crm-client
npm start
```

Система будет доступна:
- Клиент агентов: http://localhost:3000
- CRM админов: http://localhost:3001
- API сервер: http://localhost:5000

## Дальнейшие улучшения

1. **Реальная интеграция с XLSX**: Замените mock функции на реальную обработку
2. **Кэширование валют**: Добавьте Redis для кэширования курсов
3. **Валидация данных**: Расширьте валидацию Excel данных
4. **Логирование**: Добавьте подробное логирование операций
5. **Тестирование**: Создайте тесты для новых функций

## Примеры использования

### Загрузка ставок из Excel

```javascript
// Фронтенд код для загрузки
const formData = new FormData();
formData.append('file', excelFile);

const response = await fetch('/api/rates/upload', {
  method: 'POST',
  body: formData,
  credentials: 'include'
});

const result = await response.json();
console.log(`Загружено ${result.data.uploaded} ставок`);
```

### Конвертация валют

```javascript
// Конвертация 100 USD в RUB
const response = await fetch('/api/currency/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 100,
    fromCurrency: 'USD',
    toCurrency: 'RUB'
  }),
  credentials: 'include'
});

const result = await response.json();
console.log(`100 USD = ${result.data.convertedAmount} RUB`);