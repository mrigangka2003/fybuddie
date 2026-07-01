import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { requestLogger } from './middleware/requestLogger.middleware';
import { errorHandler } from './middleware/error.middleware';
import { apiRateLimit } from './middleware/rateLimit.middleware';
import routes from './routes/index';
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc"; 

const app = express();

// ── Swagger Configuration ───────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Api documentation',
      version: '1.0.0',
      description: 'API documentation for the Express backend application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server (v1)',
      },
    ],
  },
  // Adjust paths to where your actual route files are located
  apis: ['./src/routes/*.js', './src/routes/**/*.js', './routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ── Core middleware ─────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

// ── Health check (before rate limiting so it's always fast) ────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Swagger UI Route ────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── API routes ──────────────────────────────────────────────────────────────
app.use('/api/v1', apiRateLimit, routes);

// ── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Centralized error handler ────────────────────────────────────────────────
app.use(errorHandler);

export default app;
