import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';

import journeyRoutes from './routes/journey.routes.js';
import yearbookRoutes from './routes/yearbook.routes.js';
import mediaRoutes from './routes/media.routes.js';
import wallRoutes from './routes/wall.routes.js';
import messageRoutes from './routes/message.routes.js';

import { clerkMiddleware } from '@clerk/express';
import logger from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Required for Render/Proxies to work with express-rate-limit
app.set('trust proxy', 1);

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Global Exception Handlers for silent crashes
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ promise, reason }, 'Unhandled Rejection at promise');
});

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'Uncaught Exception thrown');
  process.exit(1);
});

// Verify Clerk Configuration
logger.info({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY ? 'Present' : 'MISSING',
  secretKey: process.env.CLERK_SECRET_KEY ? 'Present' : 'MISSING',
  nodeEnv: process.env.NODE_ENV || 'development'
}, 'Clerk Config State');

if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  logger.warn('CRITICAL: Clerk Publishable Key or Secret Key is missing from environment variables.');
}


app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
const mongoURI = process.env.MONGODB_URI;
if (mongoURI) {
  mongoose.connect(mongoURI)
    .then(() => logger.info('MongoDB Connected'))
    .catch(err => logger.error(err, 'MongoDB connection error'));
} else {
  logger.warn('MONGODB_URI is not defined in environment variables.');
}

// Routes
app.use('/api/journey', (req, res, next) => {
  logger.debug({ method: req.method, url: req.url }, 'Accessing Journey Route');
  next();
}, journeyRoutes);

app.use('/api/yearbook', (req, res, next) => {
  logger.debug({ method: req.method, url: req.url }, 'Accessing Yearbook Route');
  next();
}, yearbookRoutes);

app.use('/api/media', (req, res, next) => {
  logger.debug({ method: req.method, url: req.url }, 'Accessing Media Route');
  next();
}, mediaRoutes);

app.use('/api/messages', messageRoutes);

app.use('/api/wall', wallRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('Batch-26 API is running...');
});

// 404 Handler
app.use((req, res) => {
  logger.info({ method: req.method, url: req.url }, '404 NOT FOUND');
  res.status(404).json({ message: 'Route not found', path: req.url });
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(err, 'GLOBAL ERROR');
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message 
  });
});

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful Shutdown
const shutdown = () => {
  logger.info('Shutting down server...');
  server.close(() => {
    logger.info('HTTP server closed.');
    mongoose.connection.close(false).then(() => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
