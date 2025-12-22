# Project Architecture

## 📐 Overview

This is a production-ready NestJS application implementing a modular architecture with JWT authentication, dual API support (REST & GraphQL), and PostgreSQL database integration using TypeORM.

## 🏗️ Architecture Pattern

The project follows **NestJS Modular Architecture** with clear separation of concerns:

```
┌──────────────────────────────────────────────────┐
│                   Main.ts                         │
│  (Bootstrap, Global Config, Middleware Setup)    │
└──────────────┬───────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────┐
│                  App Module                       │
│      (Root Module - Orchestrates Everything)     │
└──────┬───────┬───────┬──────────┬────────────────┘
       │       │       │          │
   ┌───▼───┐ ┌▼────┐ ┌▼─────┐  ┌▼────────┐
   │Auth   │ │User │ │Common│  │Database │
   │Module │ │Module│ │Module│  │Module  │
   └───────┘ └─────┘ └──────┘  └─────────┘
```

## 📦 Module Structure

### 1. **Auth Module** (`src/auth/`)
Handles all authentication and authorization logic.

**Components:**
- **Controllers** (`auth.controller.ts`): REST endpoints for login/register
- **Resolvers** (`auth.resolver.ts`): GraphQL mutations for authentication
- **Service** (`auth.service.ts`): Business logic for JWT token generation and validation
- **DTOs**: Data validation objects
  - `login.dto.ts`: Login credentials validation
  - `register.dto.ts`: Registration data validation
  - `auth-response.dto.ts`: Standard auth response format
- **Guards**: Route protection
  - `jwt-auth.guard.ts`: JWT validation for REST endpoints
  - `gql-auth.guard.ts`: JWT validation for GraphQL
  - `local-auth.guard.ts`: Username/password validation
- **Strategies**: Passport authentication strategies
  - `jwt.strategy.ts`: JWT token validation logic
  - `local.strategy.ts`: Local username/password strategy

### 2. **User Module** (`src/user/`)
Manages user-related operations and data.

**Components:**
- **Controllers** (`user.controller.ts`): REST endpoints for user CRUD
- **Resolvers** (`user.resolver.ts`): GraphQL queries/mutations for users
- **Service** (`user.service.ts`): User business logic
- **Entities** (`entities/user.entity.ts`): TypeORM user database model
- **DTOs**:
  - `create-user.dto.ts`: User creation validation
  - `update-user.dto.ts`: User update validation

### 3. **Common Module** (`src/common/`)
Shared utilities and cross-cutting concerns.

**Components:**
- **Decorators** (`decorators/get-user.decorator.ts`): Custom parameter decorator to extract user from request
- **Filters** (`filters/all-exceptions.filter.ts`): Global exception handling
- **Interceptors**:
  - `logging.interceptor.ts`: Request/response logging
  - `transform.interceptor.ts`: Response standardization

### 4. **Database Module** (`src/database/`)
Database configuration and management.

**Components:**
- `database.module.ts`: TypeORM configuration module
- `data-source.ts`: TypeORM data source configuration for migrations

## 🔄 Request Flow

### REST API Flow
```
Client Request
    ↓
JWT Auth Guard (if protected route)
    ↓
Logging Interceptor (logs request)
    ↓
Controller (route handler)
    ↓
Validation Pipe (validates DTO)
    ↓
Service (business logic)
    ↓
Repository/TypeORM (database)
    ↓
Transform Interceptor (standardize response)
    ↓
Exception Filter (if error occurs)
    ↓
Client Response
```

### GraphQL Flow
```
GraphQL Request
    ↓
GQL Auth Guard (if @UseGuards applied)
    ↓
Resolver (GraphQL handler)
    ↓
Validation Pipe (validates input types)
    ↓
Service (business logic)
    ↓
Repository/TypeORM (database)
    ↓
GraphQL Response Formatting
    ↓
Client Response
```

## 🔐 Authentication Flow

```
┌─────────┐        ┌──────────────┐        ┌──────────┐
│ Client  │───1───→│Local Strategy│───2───→│ Database │
└────┬────┘        └──────┬───────┘        └────┬─────┘
     │                    │                      │
     │                    3. Validate            │
     │                    ←──────────────────────┘
     │                    │
     │            ┌───────▼────────┐
     │         4. │Generate JWT    │
     │            │Token           │
     │            └───────┬────────┘
     │                    │
     5. Return JWT Token  │
     ←────────────────────┘
     │
     6. Include JWT in subsequent requests
     │
     ↓
┌────────────────┐
│JWT Auth Guard  │
│Validates Token │
└────────────────┘
```

## 🗄️ Database Schema

### User Entity
```
┌─────────────────────────────────┐
│           users                 │
├─────────────────────────────────┤
│ id          : uuid (PK)         │
│ email       : varchar (UNIQUE)  │
│ username    : varchar (UNIQUE)  │
│ password    : varchar (hashed)  │
│ firstName   : varchar           │
│ lastName    : varchar           │
│ isActive    : boolean           │
│ createdAt   : timestamp         │
│ updatedAt   : timestamp         │
└─────────────────────────────────┘
```

## 🛠️ Technology Stack

### Core Framework
- **NestJS 10.x**: Progressive Node.js framework
- **TypeScript 5.x**: Static typing

### Database
- **PostgreSQL**: Relational database
- **TypeORM 0.3.x**: ORM for database operations

### Authentication
- **Passport**: Authentication middleware
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing

### API
- **REST**: Express-based HTTP endpoints
- **GraphQL**: Apollo Server integration
- **Swagger/OpenAPI**: API documentation

### Validation & Transformation
- **class-validator**: DTO validation
- **class-transformer**: Object transformation

### Logging
- **Winston**: Logging library
- **nest-winston**: NestJS Winston integration

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework

## 📝 Configuration

### Environment Variables
The application uses `.env` file for configuration:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=nestjs_auth_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development
```

### Global Configuration (main.ts)
- **Validation Pipe**: Automatic DTO validation with whitelist
- **Global Filters**: Exception handling
- **Global Interceptors**: Logging and response transformation
- **CORS**: Cross-origin resource sharing
- **Swagger**: API documentation at `/api/docs`

## 🔍 Key Features

### 1. Dual API Support
- **REST API**: Traditional HTTP endpoints with Swagger docs
- **GraphQL API**: Flexible queries with Apollo playground

### 2. Security
- JWT-based stateless authentication
- Password hashing with bcrypt
- Route protection with guards
- Input validation and sanitization

### 3. Error Handling
- Global exception filter
- Standardized error responses
- Detailed logging for debugging

### 4. Logging
- Winston logger with multiple transports
- Console output for development
- File logging (`logs/error.log`, `logs/combined.log`)
- Request/response logging interceptor

### 5. Validation
- Automatic DTO validation
- Custom error messages
- Whitelist mode (strips unknown properties)

## 📂 Project Structure Philosophy

### Modular Design
Each module is self-contained with:
- Controllers/Resolvers (API layer)
- Services (Business logic)
- Entities (Data models)
- DTOs (Data validation)
- Guards/Strategies (Security)

### Separation of Concerns
- **Controllers/Resolvers**: Handle HTTP/GraphQL requests
- **Services**: Implement business logic
- **Repositories**: Database operations
- **Guards**: Authorization checks
- **Interceptors**: Cross-cutting concerns
- **Filters**: Exception handling

### Scalability
- Easy to add new modules
- Clear dependencies between modules
- Shared utilities in common module
- Environment-based configuration

## 🚀 Deployment Considerations

### Build Process
```bash
npm run build  # Compiles TypeScript to JavaScript in dist/
```

### Production Mode
- Disable GraphQL playground
- Enable proper CORS configuration
- Use environment-specific secrets
- Enable production logging
- Run compiled JavaScript: `npm run start:prod`

### Database Migrations
```bash
npm run migration:generate  # Generate migration from entity changes
npm run migration:run       # Apply migrations
npm run migration:revert    # Rollback last migration
```

## 📊 API Endpoints

### REST Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get current user (protected)
- `GET /users` - List users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `PATCH /users/:id` - Update user (protected)
- `DELETE /users/:id` - Delete user (protected)

### GraphQL Operations
- **Mutations**: `login`, `register`
- **Queries**: `me`, `users`, `user`
- **Authentication**: Via HTTP Authorization header

### Documentation
- **Swagger UI**: http://localhost:3000/api/docs
- **GraphQL Playground**: http://localhost:3000/graphql

## 🧪 Testing Strategy

The project is configured for:
- **Unit Tests**: Testing individual components
- **Integration Tests**: Testing module interactions
- **E2E Tests**: Testing complete workflows
- **Coverage Reports**: Code coverage tracking

Run tests with:
```bash
npm run test          # Unit tests
npm run test:watch    # Watch mode
npm run test:cov      # With coverage
npm run test:e2e      # End-to-end tests
```

## 📚 Best Practices Implemented

1. **Dependency Injection**: Full use of NestJS DI container
2. **Interface Segregation**: Clear separation between REST and GraphQL
3. **Single Responsibility**: Each module has a specific purpose
4. **Type Safety**: Full TypeScript typing throughout
5. **Security First**: Guards, validation, hashing, JWT
6. **Logging**: Comprehensive logging for debugging
7. **Documentation**: Swagger, inline comments, this architecture doc
8. **Configuration Management**: Environment-based config
9. **Error Handling**: Graceful error responses
10. **Code Quality**: ESLint, Prettier, consistent structure

## 🔄 Future Enhancements

Potential improvements:
- [ ] Role-based access control (RBAC)
- [ ] Refresh token mechanism
- [ ] Email verification
- [ ] Password reset flow
- [ ] Rate limiting
- [ ] Caching (Redis)
- [ ] Database replication
- [ ] Microservices architecture
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Unit test coverage
- [ ] API versioning

---

**Last Updated**: December 17, 2025
