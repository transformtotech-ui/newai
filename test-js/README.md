# NestJS API with Swagger - Vercel Deployment

A NestJS API with Swagger documentation and PostgreSQL database, configured for deployment on Vercel.

## Features

- ✅ NestJS framework
- ✅ Swagger/OpenAPI documentation
- ✅ PostgreSQL database integration
- ✅ TypeORM for database management
- ✅ User management endpoints
- ✅ Vercel serverless deployment ready
- ✅ CORS enabled

## API Endpoints

### GET /hello

Returns a greeting message.

**Query Parameters:**
- `name` (optional): Name to greet

**Example:**
```bash
curl https://y-sigma-rust.vercel.app/hello?name=John
```

### POST /users

Create a new user with name and address.

**Request Body:**
```json
{
  "name": "John Doe",
  "address": "123 Main St, New York, NY"
}
```

**Example:**
```bash
curl -X POST https://y-sigma-rust.vercel.app/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","address":"123 Main St, New York, NY"}'
```

### GET /users

Get all users from the database.

**Example:**
```bash
curl https://y-sigma-rust.vercel.app/users
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "address": "123 Main St, New York, NY"
  }
]
```

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will start on `http://localhost:3000`

### Swagger Documentation

Access the Swagger UI at: `http://localhost:3000/api`

## Deployment to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to deploy

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

### Environment Variables (Optional)

You can set environment variables in Vercel dashboard:
- `DATABASE_URL` - PostgreSQL connection string (already configured)
- `PORT` - Server port (default: 3000)

## Project Structure

```
├── api/
│   ├── index.ts          # Vercel serverless entry point
│   └── tsconfig.json     # TypeScript config for API
├── src/
│   ├── app.controller.ts # API controller with endpoint
│   ├── app.service.ts    # Business logic
│   ├── app.module.ts     # Root module
│   └── main.ts           # Application entry point
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
└── nest-cli.json         # NestJS CLI configuration
```

## Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Run production build
- `npm run lint` - Lint the code
- `npm run format` - Format code with Prettier

## API Documentation

Once deployed, your Swagger documentation will be available at:
- Local: `http://localhost:3000/api`
- Vercel: `https://your-app.vercel.app/api`

## License

MIT
