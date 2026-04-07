import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

import journeyRoutes from './routes/journey.routes.js';
import yearbookRoutes from './routes/yearbook.routes.js';
import mediaRoutes from './routes/media.routes.js';
import wallRoutes from './routes/wall.routes.js';

import { clerkMiddleware } from '@clerk/express';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
app.use('/api/journey', journeyRoutes);
app.use('/api/yearbook', yearbookRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/wall', wallRoutes);

app.get('/', (req, res) => {
  res.send('Batch-26 API is running...');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
