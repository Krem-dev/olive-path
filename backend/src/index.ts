import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import sequelize from './db/connection';
import './models'; // initialize associations

// Routes
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import userRoutes from './routes/user';

// Middleware
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

// ── Global Middleware ──
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// ── Health Check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', environment: config.nodeEnv });
});

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/user', userRoutes);

// ── Error Handling ──
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync tables in development
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database tables synced.');
    }

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
