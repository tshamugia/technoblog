import express, { Express } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user-routes.js';

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config();
}

// Set default NODE_ENV if not set
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log('Environment:', process.env.NODE_ENV);
const app: Express = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

export { app };
