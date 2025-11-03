# Quiz Game API


This project implements Clean Architecture with clear separation of concerns:

```
src/
├── domain/                  # Domain Layer (Business Entities)
│   ├── entities/           # Business entities (User, Room, Quiz, etc.)
│   └── enums/              # Domain enums (RoomStatus, UserRole)
├── application/            # Application Layer (Use Cases)
│   ├── use-cases/          # Business logic implementations
│   │   ├── auth/           # Authentication use cases
│   │   ├── room/           # Room management use cases
│   │   └── quiz/           # Quiz gameplay use cases
│   └── dto/                # Data Transfer Objects
├── infrastructure/         # Infrastructure Layer
│   ├── database/           # Database entities, repositories, seeds
│   ├── config/             # Configuration files
│   ├── guards/             # Auth guards
│   ├── strategies/         # Passport strategies
│   ├── decorators/         # Custom decorators
│   └── modules/            # NestJS modules
└── presentation/           # Presentation Layer
    ├── controllers/        # REST API controllers
    └── gateways/           # WebSocket gateways
```

## ✨ Features

- **🔐 JWT Authentication**: Access & refresh tokens with Passport.js
- **🎮 Real-time Gameplay**: Socket.IO for live quiz events
- **🏠 Room Management**: Create, join, leave rooms with unique codes
- **📊 Live Leaderboard**: Real-time scoring and rankings
- **✅ DTO Validation**: class-validator for request validation
- **🛡️ Security**: Rate limiting, CORS, guards
- **📚 API Documentation**: Auto-generated Swagger/OpenAPI docs
- **🗄️ PostgreSQL**: TypeORM with seed data
- **🧪 Testing**: Jest unit & e2e tests

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <https://github.com/safwencse/QUIZ_API>
cd QUIZGAMEAPI 
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/quiz_game
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

4. **Seed the database**
```bash
npm run seed
```

5. **Start the server**
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

Once the server is running, access the interactive Swagger documentation at:

**http://localhost:3000/api/docs**

## 🔑 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | Login user | ❌ |
| POST | `/api/v1/auth/refresh` | Refresh access token | ❌ |

### Rooms

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/rooms` | Create a new room | ✅ |
| POST | `/api/v1/rooms/join` | Join room by code | ✅ |
| GET | `/api/v1/rooms/:id` | Get room details | ✅ |
| DELETE | `/api/v1/rooms/:id/leave` | Leave a room | ✅ |

### Quiz

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/quiz/rooms/:roomId/start` | Start quiz (host only) | ✅ |
| GET | `/api/v1/quiz/rooms/:roomId/question` | Get current question | ✅ |
| POST | `/api/v1/quiz/rooms/:roomId/answer` | Submit answer | ✅ |
| GET | `/api/v1/quiz/rooms/:roomId/leaderboard` | Get leaderboard | ✅ |

## 🎮 Game Flow Example

1. **Register/Login**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","email":"player1@example.com","password":"password123"}'
```

2. **Create a Room**
```bash
curl -X POST http://localhost:3000/api/v1/rooms \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Quiz Room","quizId":"QUIZ_ID","maxPlayers":10}'
```

3. **Join Room** (from another client)
```bash
curl -X POST http://localhost:3000/api/v1/rooms/join \
  -H "Authorization: Bearer ANOTHER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"ABC123"}'
```

4. **Start Quiz** (host only)
```bash
curl -X POST http://localhost:3000/api/v1/quiz/rooms/ROOM_ID/start \
  -H "Authorization: Bearer HOST_ACCESS_TOKEN"
```

5. **Get Current Question**
```bash
curl -X GET http://localhost:3000/api/v1/quiz/rooms/ROOM_ID/question \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

6. **Submit Answer**
```bash
curl -X POST http://localhost:3000/api/v1/quiz/rooms/ROOM_ID/answer \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"questionId":"QUESTION_ID","selectedAnswer":2,"timeSpent":15}'
```

7. **Get Leaderboard**
```bash
curl -X GET http://localhost:3000/api/v1/quiz/rooms/ROOM_ID/leaderboard \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔌 WebSocket Events

Connect to Socket.IO at `ws://localhost:3000`

**Authentication Required**: All WebSocket events require JWT authentication. Include your access token when connecting:

```javascript
const socket = io('ws://localhost:3000', {
  auth: {
    token: 'YOUR_ACCESS_TOKEN'
  }
});
// OR via headers:
const socket = io('ws://localhost:3000', {
  extraHeaders: {
    Authorization: 'Bearer YOUR_ACCESS_TOKEN'
  }
});
```

### Client → Server Events

| Event | Payload | Description | Auth Required |
|-------|---------|-------------|---------------|
| `joinRoom` | `{roomId: string, username: string}` | Join a room for real-time updates |  |
| `leaveRoom` | `{roomId: string}` | Leave a room | |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `playerJoined` | `{clientId: string, username: string}` | Player joined the room |
| `playerLeft` | `{clientId: string}` | Player left the room |
| `quizStarted` | `{roomId: string}` | Quiz has started |
| `nextQuestion` | `{question data}` | New question available |
| `answerSubmitted` | `{answer data}` | Answer was submitted |
| `leaderboardUpdate` | `{leaderboard data}` | Leaderboard updated |
| `quizFinished` | `{finalLeaderboard data}` | Quiz completed |

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 Database Schema

### Entities

- **User**: Authentication and user profiles
- **Quiz**: Quiz collections
- **Question**: Individual quiz questions
- **Room**: Game rooms for quiz sessions
- **RoomParticipant**: Players in a room
- **Answer**: Submitted answers with scoring

### Relationships

- User → Room (one-to-many, as host)
- User → RoomParticipant (one-to-many)
- Quiz → Question (one-to-many)
- Quiz → Room (one-to-many)
- Room → RoomParticipant (one-to-many)
- Room → Answer (one-to-many)

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Signed access & refresh tokens
- **Rate Limiting**: 10 requests per minute per IP
- **DTO Validation**: Automatic request validation
- **CORS**: Configured for security
- **Guards**: JWT & Role-based access control

## 🏷️ Roles & Permissions

| Role | Permissions |
|------|-------------|
| **PLAYER** | Create/join rooms, submit answers, view leaderboard |
| **ADMIN** | All player permissions + future admin features |

## 📦 Built With

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript
- **PostgreSQL** - Relational database
- **Socket.IO** - Real-time bidirectional communication
- **Passport.js** - Authentication middleware
- **Swagger** - API documentation
- **Jest** - Testing framework
- **class-validator** - Validation decorators

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start in development mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production server |
| `npm run seed` | Seed database with sample data |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run e2e tests |
| `npm run lint` | Lint code |
| `npm run format` | Format code |

## 📝 Sample Quiz Data

The seed script creates 3 quizzes:

1. **General Knowledge Quiz** (5 questions)
2. **Science & Technology** (5 questions)
3. **Pop Culture Trivia** (3 questions)




---


