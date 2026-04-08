import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import journeyRoutes from './routes/journey.routes.js';
import yearbookRoutes from './routes/yearbook.routes.js';
import mediaRoutes from './routes/media.routes.js';
import wallRoutes from './routes/wall.routes.js';
import messageRoutes from './routes/message.routes.js';

import { clerkMiddleware } from '@clerk/express';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Global Exception Handlers for silent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Verify Clerk Configuration
console.log('Clerk Config State:', {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY ? 'Present' : 'MISSING',
  secretKey: process.env.CLERK_SECRET_KEY ? 'Present' : 'MISSING',
  nodeEnv: process.env.NODE_ENV || 'development'
});

if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  console.warn('CRITICAL: Clerk Publishable Key or Secret Key is missing from environment variables.');
}

app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
const mongoURI = process.env.MONGODB_URI;
if (mongoURI) {
  mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI is not defined in environment variables.');
}

// Routes
app.use('/api/journey', (req, res, next) => {
  console.log('Accessing Journey Route:', req.method, req.url);
  next();
}, journeyRoutes);

app.use('/api/yearbook', (req, res, next) => {
  console.log('Accessing Yearbook Route:', req.method, req.url);
  next();
}, yearbookRoutes);

app.use('/api/media', (req, res, next) => {
  console.log('Accessing Media Route:', req.method, req.url);
  next();
}, mediaRoutes);

app.use('/api/messages', messageRoutes);

app.use('/api/wall', wallRoutes);

app.get('/', (req, res) => {
  res.send('Batch-26 API is running...');
});

// 404 Handler
app.use((req, res) => {
  console.log('404 NOT FOUND:', req.method, req.url);
  res.status(404).json({ message: 'Route not found', path: req.url });
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('GLOBAL ERROR:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
