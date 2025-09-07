# 🐻 BearPlus - Professional Logistics Platform

BearPlus is a comprehensive logistics management platform designed for international freight forwarding, shipping calculations, and cargo tracking. The platform consists of three main components: a client application for end users, a CRM system for agents, and a robust backend API.

## 🏗️ Architecture

### Frontend Applications
- **Client App** (React + TypeScript + Vite) - Main user interface for clients
- **CRM Client** (React + TypeScript) - Administrative interface for agents and staff

### Backend
- **API Server** (Node.js + Express + TypeScript) - RESTful API server
- **Database** (MongoDB) - Document database for data storage
- **File Storage** - Local file system for document uploads

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional, for MongoDB)
- MongoDB (if not using Docker)

### Installation & Startup

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd bearplus
   chmod +x start.sh stop.sh
   ```

2. **Start the application:**
   ```bash
   ./start.sh
   ```

3. **Access the applications:**
   - Main Client: http://localhost:5173
   - CRM Client: http://localhost:3000  
   - API Server: https://api.bearplus.ru/api
   - API Health: https://api.bearplus.ru/api/api/health

4. **Stop the application:**
   ```bash
   ./stop.sh
   ```

## 📋 Features

### Client Application Features
- **Shipping Calculator** - Calculate freight, railway, and auto delivery costs
- **Order Management** - Create, track, and manage shipping orders
- **Document Management** - Upload and manage shipping documents
- **Real-time Messaging** - Communicate with logistics agents
- **Ship Tracking** - Track vessel locations and cargo status
- **User Dashboard** - Comprehensive overview of user activities

### CRM Features
- **User Management** - Manage clients and agents
- **Order Processing** - Process and update order statuses
- **Rate Management** - Create and manage shipping rates
- **Excel Integration** - Import/export rates via Excel files
- **Margin Settings** - Configure profit margins by service type
- **Loyalty Management** - Manage client discounts and loyalty programs
- **Analytics Dashboard** - Business intelligence and reporting

### API Features
- **RESTful API** - Full REST API with proper HTTP status codes
- **Authentication** - JWT-based authentication with role-based access
- **File Upload** - Secure file upload for documents and Excel files
- **Email Integration** - Automated email notifications
- **Rate Limiting** - API rate limiting for security
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Proper error handling and logging

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
# Database
MONGODB_URI=mongodb://admin:password@localhost:27017/bearplus?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Server Configuration
PORT=5005
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173
CRM_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@bearplus.com
```

#### Client (.env)
```env
VITE_API_URL=https://api.bearplus.ru/api/api
VITE_APP_NAME=BearPlus
VITE_APP_VERSION=1.0.0
```

#### CRM Client (.env)
```env
REACT_APP_API_URL=https://api.bearplus.ru/api/api
REACT_APP_NAME=BearPlus CRM
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email address

### Order Management
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (agents only)
- `POST /api/orders/:id/stages/:stageId/confirm` - Confirm order stage
- `DELETE /api/orders/:id` - Delete order

### Document Management
- `GET /api/documents` - Get user documents
- `POST /api/documents/upload` - Upload documents
- `GET /api/documents/:id` - Get document by ID
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document

### Shipping Services
- `POST /api/shipping/calculate` - Calculate shipping rates
- `POST /api/shipping/dangerous-cargo` - Submit dangerous cargo request

### Rate Management (Agents)
- `GET /api/rates` - Get agent rates
- `POST /api/rates` - Create new rate
- `PUT /api/rates/:id` - Update rate
- `DELETE /api/rates/:id` - Delete rate
- `POST /api/rates/upload` - Upload rates from Excel
- `GET /api/rates/export` - Export rates to Excel
- `GET /api/rates/template` - Download Excel template

### Messaging System
- `GET /api/messages/chats` - Get user chats
- `POST /api/messages/chats` - Create new chat
- `GET /api/messages/chats/:id/messages` - Get chat messages
- `POST /api/messages/chats/:id/messages` - Send message
- `POST /api/messages/chats/:id/read` - Mark messages as read

## 🎭 User Roles

### Client
- Calculate shipping costs
- Create and manage orders
- Upload documents
- Communicate with agents
- Track shipments

### Agent
- All client permissions
- Manage shipping rates
- Configure margins and settings
- Manage client loyalty programs
- Process orders and update statuses
- Access advanced analytics

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Different permissions for clients and agents
- **Rate Limiting** - Protection against abuse
- **Input Validation** - Comprehensive request validation
- **File Upload Security** - Secure file handling with type restrictions
- **Password Security** - Bcrypt hashing with salt
- **Account Lockout** - Protection against brute force attacks

## 📦 File Upload Support

### Supported File Types
- **Documents**: PDF, DOC, DOCX, JPG, PNG
- **Excel Files**: XLS, XLSX (for rate imports)
- **Maximum Size**: 10MB per file

### Upload Endpoints
- `/api/documents/upload` - Multiple document upload
- `/api/rates/upload` - Excel file upload for rates

## 🌐 Internationalization

The platform supports multiple languages:
- **Russian** (ru) - Default
- **English** (en)
- **Chinese** (zh)

Language can be changed in user settings.

## 🔧 Development

### Project Structure
```
bearplus/
├── server/          # Backend API server
├── client/          # Main client application
├── crm-client/      # CRM interface
├── start.sh         # Startup script
├── stop.sh          # Stop script
└── README.md        # This file
```

### Development Scripts

#### Server
```bash
cd server
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
```

#### Client
```bash
cd client
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

#### CRM Client
```bash
cd crm-client
npm start           # Start development server
npm run build       # Build for production
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
docker-compose up -d
```

This will start:
- MongoDB database
- API server
- Client application
- CRM client
- Nginx reverse proxy

### Environment Variables for Docker
Configure the `.env` files appropriately for your deployment environment.

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in server/.env
   - Verify credentials

2. **Port Already in Use**
   - Check if services are already running
   - Use `./stop.sh` to stop all services
   - Change ports in configuration if needed

3. **File Upload Issues**
   - Check file size limits (10MB max)
   - Verify file types are supported
   - Ensure upload directory permissions

4. **CORS Issues**
   - Verify CLIENT_URL and CRM_URL in server/.env
   - Check that frontend URLs match configuration

### Logs and Debugging
- Server logs: Check terminal output from server process
- Client logs: Browser developer console
- API testing: Use tools like Postman or curl

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**BearPlus** - Professional logistics made simple 🐻📦