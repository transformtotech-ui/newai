# NestJS Authentication API

A comprehensive NestJS application with PostgreSQL, JWT authentication, Swagger documentation, and GraphQL support. Perfect for learning NestJS and building scalable backend applications.

## 🚀 Features

- **Authentication System**: Login/Register with JWT tokens
- **Database**: PostgreSQL with TypeORM
- **API Documentation**: Swagger/OpenAPI integration
- **GraphQL**: Apollo Server with authentication
- **Validation**: Class-validator with custom error messages
- **Logging**: Winston logger with file and console output
- **Error Handling**: Global exception filters
- **Security**: JWT authentication with guards
- **Development Tools**: Hot reload, debugging, linting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/download/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd nestjs-auth-api

# Install dependencies
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE nestjs_auth_db;

-- Create user (optional)
CREATE USER nestjs_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nestjs_auth_db TO nestjs_user;
```

### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password_here
DATABASE_NAME=nestjs_auth_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 4. Run the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## 📚 API Documentation

Once the application is running, you can access:

- **Swagger Documentation**: http://localhost:3000/api/docs
- **GraphQL Playground**: http://localhost:3000/graphql
- **API Base URL**: http://localhost:3000

## 🔗 API Endpoints

### Authentication Endpoints

#### REST API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/refresh` | Refresh JWT token | ✅ |
| GET | `/auth/profile` | Get user profile | ✅ |
| POST | `/auth/logout` | User logout | ✅ |

#### GraphQL Mutations/Queries

```graphql
# Register user
mutation {
  register(input: {
    email: "john@example.com"
    password: "password123"
    firstName: "John"
    lastName: "Doe"
  }) {
    accessToken
    tokenType
    expiresIn
    user {
      id
      email
      firstName
      lastName
      fullName
    }
  }
}

# Login user
mutation {
  login(input: {
    email: "john@example.com"
    password: "password123"
  }) {
    accessToken
    tokenType
    user {
      id
      email
      fullName
    }
  }
}

# Get profile (requires authentication)
query {
  profile {
    id
    email
    firstName
    lastName
    fullName
    createdAt
  }
}
```

### User Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | ✅ |
| GET | `/users/me` | Get current user | ✅ |
| GET | `/users/stats` | Get user statistics | ✅ |
| GET | `/users/:id` | Get user by ID | ✅ |
| PATCH | `/users/me` | Update profile | ✅ |
| PATCH | `/users/:id` | Update user | ✅ |
| DELETE | `/users/:id` | Delete user | ✅ |

## 🧪 Testing the API

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get profile (replace TOKEN with actual JWT)
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Using Swagger UI

1. Go to http://localhost:3000/api/docs
2. Click on "Authorize" button
3. Enter your JWT token (after login/register)
4. Test any protected endpoints

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # Auth guards (JWT, Local)
│   ├── strategies/      # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.resolver.ts
│   └── auth.module.ts
├── user/                # User management module
│   ├── dto/             # User DTOs
│   ├── entities/        # User entity
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.resolver.ts
│   └── user.module.ts
├── database/            # Database configuration
│   ├── data-source.ts   # TypeORM data source
│   └── database.module.ts
├── common/              # Shared utilities
│   ├── decorators/      # Custom decorators
│   ├── filters/         # Exception filters
│   ├── interceptors/    # Request/Response interceptors
│   └── common.module.ts
├── app.module.ts        # Main application module
└── main.ts              # Application entry point
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev        # Start with hot reload
npm run start:debug      # Start in debug mode

# Building
npm run build           # Build for production
npm run start:prod      # Run production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run format          # Format code with Prettier

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Run tests with coverage
npm run test:e2e        # Run end-to-end tests

# Database
npm run migration:generate  # Generate migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert migration
```

### Debugging

#### VS Code Debugging

1. Set breakpoints in your code
2. Run `npm run start:debug`
3. Use VS Code's "Attach to Node Process" configuration

#### Logging

The application uses Winston logger with different levels:

```typescript
import { Logger } from '@nestjs/common';

export class YourService {
  private readonly logger = new Logger(YourService.name);

  someMethod() {
    this.logger.log('Info message');
    this.logger.error('Error message');
    this.logger.warn('Warning message');
    this.logger.debug('Debug message');
  }
}
```

Logs are saved to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console output during development

## 🔒 Security Features

### JWT Authentication
- Secure token generation
- Configurable expiration
- Bearer token authentication
- Automatic token validation

### Password Security
- Bcrypt hashing (12 rounds)
- Password validation rules
- Secure password comparison

### Input Validation
- Class-validator decorators
- Automatic validation pipes
- Custom validation messages
- XSS protection via data sanitization

### Database Security
- TypeORM query builder (SQL injection protection)
- Input sanitization
- Connection security

## 🚀 Production Deployment

### Environment Variables

Set these environment variables in production:

```env
NODE_ENV=production
JWT_SECRET=your-very-secure-secret-key
DATABASE_HOST=your-production-db-host
DATABASE_PASSWORD=your-secure-password
PORT=3000
```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### Build for Production

```bash
npm run build
npm run start:prod
```

## 📖 Learning Resources

### NestJS Concepts Covered

1. **Modules**: Organizing code into logical units
2. **Controllers**: Handling HTTP requests
3. **Services**: Business logic and data access
4. **Guards**: Authentication and authorization
5. **Interceptors**: Request/response transformation
6. **Filters**: Exception handling
7. **Pipes**: Data validation and transformation
8. **Decorators**: Metadata and dependency injection

### PostgreSQL & TypeORM

1. **Entity Definition**: Database schema as code
2. **Migrations**: Database version control
3. **Relationships**: Entity associations
4. **Query Builder**: Type-safe database queries
5. **Validation**: Entity-level constraints

### GraphQL Integration

1. **Schema First vs Code First**: This project uses Code First
2. **Resolvers**: GraphQL query handlers
3. **Authentication**: Protecting GraphQL endpoints
4. **Input Types**: GraphQL input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   Solution: Check your database credentials in .env file
   Ensure PostgreSQL is running
   ```

2. **JWT Token Invalid**
   ```
   Solution: Check JWT_SECRET in .env file
   Ensure token is not expired
   ```

3. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```

4. **Module Not Found Errors**
   ```bash
   # Clear npm cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Getting Help

- Check the [NestJS Documentation](https://docs.nestjs.com/)
- Review [TypeORM Documentation](https://typeorm.io/)
- Browse [GraphQL Documentation](https://graphql.org/learn/)
- Ask questions in the issues section

---

**Happy coding! 🎉**

This project provides a solid foundation for building scalable NestJS applications with modern development practices.