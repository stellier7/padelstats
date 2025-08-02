import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { exec } from 'child_process';
import { promisify } from 'util';

// Import routes
import authRoutes from './routes/auth';
import matchRoutes from './routes/matches';
import eventRoutes from './routes/events';

// Load environment variables
dotenv.config({ path: '.env' });

const app = express();
const server = createServer(app);

// Determine CORS origins based on environment
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = isProduction 
  ? [
      'https://padelstats-uvgl.vercel.app',
      'https://padelstats.vercel.app',
      'https://padelstats.onrender.com'
    ]
  : ['http://localhost:3000', 'http://localhost:3001'];

console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔗 Allowed CORS origins:', allowedOrigins);
console.log('🚀 Deployment timestamp:', new Date().toISOString());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Padel Statistics API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/events', eventRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-match', (matchId: string) => {
    socket.join(matchId);
    console.log(`User ${socket.id} joined match ${matchId}`);
  });
  
  socket.on('leave-match', (matchId: string) => {
    socket.leave(matchId);
    console.log(`User ${socket.id} left match ${matchId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database setup function
const setupDatabase = async () => {
  const execAsync = promisify(exec);
  
  try {
    console.log('🗄️ Setting up database...');
    
    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    await execAsync('npx prisma generate');
    
    // Run migrations
    console.log('🔄 Running database migrations...');
    await execAsync('npx prisma migrate deploy');
    
    // Seed database
    console.log('🌱 Seeding database...');
    await execAsync('npx prisma db seed');
    
    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('⚠️ Continuing without database setup...');
  }
};

server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Padel Statistics API ready`);
  console.log(`🔗 CORS Origin: ${process.env.CORS_ORIGIN || "http://localhost:3000"}`);
  
  // Setup database on startup
  await setupDatabase();
});

export { app, io }; 