# Padel Statistics App

A real-time padel match statistics tracking application with multi-user observation capabilities, player statistics, and tournament management.

## 🚀 Features

- **Real-time Match Tracking**: Live statistics recording with multiple observers
- **Player Statistics**: Comprehensive padel-specific metrics
- **Tournament Management**: Complete tournament lifecycle
- **Multi-user Support**: Multiple observers can record events simultaneously
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠 Technology Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (frontend) + Railway/Render (backend)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Git

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone [your-repo-url]
cd padelApp
npm run install:all
```

### 2. Database Setup

1. Create a PostgreSQL database
2. Copy `backend/config.env` to `backend/.env`
3. Update the `DATABASE_URL` in `backend/.env` with your database credentials
4. Run database setup:

```bash
npm run db:setup
```

### 3. Environment Configuration

Create `backend/.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/padel_stats_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"
```

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

## 📁 Project Structure

```
padelApp/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   └── types/           # TypeScript types
│   └── package.json
├── backend/                  # Node.js Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── socket/          # Socket.io handlers
│   │   └── utils/           # Utility functions
│   ├── prisma/              # Database schema
│   └── package.json
├── shared/                   # Shared utilities
└── package.json             # Root package.json
```

## 🗄 Database Schema

The application uses the following main entities:

- **User**: Players and observers
- **Match**: Match information and status
- **MatchPlayer**: Player assignments to matches
- **MatchEvent**: Individual events during matches
- **PlayerStats**: Calculated statistics per player per match
- **Tournament**: Tournament management

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development
- `npm run install:all` - Install dependencies for all packages
- `npm run db:setup` - Setup database schema and migrations
- `npm run db:studio` - Open Prisma Studio for database management

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Matches
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create new match
- `GET /api/matches/:id` - Get match details
- `PUT /api/matches/:id` - Update match

### Events
- `POST /api/events` - Record match event
- `GET /api/matches/:id/events` - Get match events

### Statistics
- `GET /api/stats/player/:id` - Get player statistics
- `GET /api/stats/match/:id` - Get match statistics

## 🔌 Real-time Events

The application uses Socket.io for real-time communication:

- `join-match` - Join a match room
- `leave-match` - Leave a match room
- `record-event` - Record a match event
- `match-update` - Receive match updates

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`
4. Add environment variables

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set build command: `cd backend && npm run build`
3. Set start command: `cd backend && npm start`
4. Add environment variables
5. Set up PostgreSQL database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository. 