# SLBL ERP Backend API

Sardar Landmark & Builders Ltd. - Enterprise Resource Planning System Backend

## 🏗️ Architecture

**Framework:** NestJS (Node.js + TypeScript)
**Database:** PostgreSQL
**ORM:** TypeORM
**Authentication:** JWT + Passport

## 📁 Project Structure

```
Backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── config/                 # Configuration files
│   ├── common/                 # Shared utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── dtos/
│   ├── modules/                # Feature modules
│   │   ├── auth/              # Authentication
│   │   ├── users/             # User management
│   │   ├── accounting/        # Accounting module
│   │   ├── projects/          # Projects module
│   │   ├── clients/           # Clients module
│   │   ├── procurement/      # Procurement module
│   │   ├── construction/     # Construction module
│   │   ├── investors/        # Investors module
│   │   ├── hr/               # HR module
│   │   ├── reports/          # Reports module
│   │   └── settings/         # Settings module
│   ├── database/              # Database setup
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── schema/
│   └── entities/              # Shared entities
├── test/                      # Test files
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure database in .env
```

### Database Setup

```bash
# Create database
createdb slbl_erp

# Run migrations
npm run migration:run

# Seed database (optional)
npm run seed
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 🔐 API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get current user profile

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## 🔧 Configuration

Environment variables are defined in `.env`:

```env
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=slbl_erp
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🏢 Company Information

**Company:** Sardar Landmark & Builders Ltd.
**System:** SLBL ERP
**Version:** 1.0.0

## 📝 License

Proprietary - All rights reserved
