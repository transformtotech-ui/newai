# NestJS Dependency Injection Demo

A comprehensive project demonstrating dependency injection concepts in NestJS.

## 📚 What is Dependency Injection?

Dependency Injection (DI) is a design pattern where a class receives its dependencies from external sources rather than creating them itself. NestJS has a built-in DI container that manages the lifecycle and injection of dependencies.

### Benefits of DI:
- **Loose Coupling**: Classes don't create their own dependencies
- **Testability**: Easy to mock dependencies in tests
- **Maintainability**: Changes to dependencies don't affect dependent classes
- **Reusability**: Services can be shared across the application

## 🏗️ Project Structure

```
src/
├── controllers/
│   ├── app.controller.ts       # Basic controller with DI
│   └── user.controller.ts      # User CRUD operations
├── services/
│   ├── logger.service.ts       # Singleton logger service
│   ├── database.service.ts     # Database connection service
│   ├── user.service.ts         # User business logic
│   └── request-context.service.ts  # Request-scoped service
├── app.module.ts               # Root module with providers
└── main.ts                     # Application entry point
```

## 🎯 Key Concepts Demonstrated

### 1. Constructor Injection
The most common DI pattern in NestJS. Dependencies are injected through the constructor:

```typescript
@Injectable()
export class UserService {
  constructor(
    private readonly logger: LoggerService,
    private readonly database: DatabaseService,
  ) {}
}
```

### 2. Provider Scopes

#### Singleton Scope (Default)
- Single instance shared across the entire application
- Example: `LoggerService`, `DatabaseService`

```typescript
@Injectable()  // Default scope is SINGLETON
export class LoggerService { }
```

#### Request Scope
- New instance created for each HTTP request
- Example: `RequestContextService`

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService { }
```

### 3. Custom Providers

#### Value Provider
Provides a static value or configuration:

```typescript
{
  provide: 'DATABASE_CONFIG',
  useValue: {
    host: 'localhost',
    port: 5432,
    database: 'nestjs_demo',
  }
}
```

#### Factory Provider
Creates provider using a factory function:

```typescript
{
  provide: 'DATABASE_CONNECTION',
  useFactory: (config: DatabaseConfig) => {
    return createConnection(config);
  },
  inject: ['DATABASE_CONFIG'],
}
```

#### Class Provider
Alternative class implementation:

```typescript
{
  provide: LoggerService,
  useClass: CustomLoggerService,  // Alternative implementation
}
```

### 4. Module Organization

The `AppModule` registers all providers and makes them available for injection:

```typescript
@Module({
  controllers: [AppController, UserController],
  providers: [
    LoggerService,
    DatabaseService,
    UserService,
    RequestContextService,
  ],
})
export class AppModule {}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

```bash
# Development mode with auto-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Testing the Endpoints

Once the application is running on `http://localhost:3000`:

```bash
# Get application info
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/users

# Get user by ID
curl http://localhost:3000/users/1

# Create a new user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Wonder","email":"alice@example.com"}'

# Delete a user
curl -X DELETE http://localhost:3000/users/1
```

## 💡 Learning Points

### Service Dependencies

1. **LoggerService**: Independent service, no dependencies
2. **DatabaseService**: Independent service
3. **UserService**: Depends on LoggerService and DatabaseService
4. **Controllers**: Depend on services

This creates a dependency graph:
```
Controllers
    ↓
UserService
    ↓
LoggerService & DatabaseService
```

### Accessing Services from DI Container

You can manually get services from the DI container:

```typescript
const app = await NestFactory.create(AppModule);
const logger = app.get(LoggerService);
const database = app.get(DatabaseService);
```

### Request-Scoped Services

The `RequestContextService` demonstrates request scoping:
- Each HTTP request gets a new instance
- Useful for request-specific data (user context, request ID, etc.)
- Notice different request IDs on each request

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Dependency Injection in NestJS](https://docs.nestjs.com/providers)
- [Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers)
- [Injection Scopes](https://docs.nestjs.com/fundamentals/injection-scopes)

## 🔍 Exercises to Try

1. **Add a new service**: Create a `ProductService` that depends on `LoggerService`
2. **Create a custom provider**: Add a configuration provider using `useValue`
3. **Module organization**: Split into feature modules (UsersModule, DatabaseModule)
4. **Interface-based injection**: Use tokens to inject interface implementations
5. **Transient scope**: Create a service with `Scope.TRANSIENT` and observe its behavior

## 📝 Notes

- Services must be decorated with `@Injectable()` to be managed by NestJS DI
- Services must be registered in a module's `providers` array
- Controllers automatically get access to registered providers
- Circular dependencies should be avoided or handled with `forwardRef()`

## 🎓 Best Practices

1. **Use constructor injection** for required dependencies
2. **Keep services focused** on a single responsibility
3. **Use interfaces** for better abstraction and testing
4. **Prefer singleton scope** unless you specifically need request/transient scope
5. **Organize related providers** into feature modules

---

Happy learning! 🚀
