import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { app, server } from './socket/socket.js';
import { config, validateEnv } from './config/environment.js';
import { connectDB, disconnectDB, getDbStatus } from './config/db.js';
import { securityHeaders, corsMiddleware, requestLogger } from './middlewares/security.middleware.js';
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';
import { globalErrorHandler, notFoundHandler } from './middlewares/error.middleware.js';

import healthRouter from './routes/health.route.js';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import messageRouter from './routes/message.route.js';
import chatbotRouter from './routes/chatbot.route.js';

// Validate environment variables at startup
validateEnv();

// Initialize database connection
connectDB();

const __dirname = path.resolve();

// Standard middlewares
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(requestLogger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter);

// Health check endpoint (for load balancers, orchestrators, and monitoring)
app.use('/api/health', healthRouter);

// Fail quickly instead of letting Mongoose buffer requests while the database is unavailable.
app.use(['/api/user', '/api/auth', '/api/listing', '/api/messages'], (req, res, next) => {
  if (!getDbStatus().isConnected) {
    return res.status(503).json({
      success: false,
      statusCode: 503,
      message: 'Database is unavailable. Please try again shortly.',
    });
  }
  next();
});

// Domain API routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/messages', messageRouter);
app.use('/api/chatbot', chatbotRouter);

// Serve static assets in production
const clientDistPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  // If request begins with /api, forward to 404 handler instead of serving index.html
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Real Estate API Server is running. Client frontend is buildable via "npm run build".');
    }
  });
});

// Centralized 404 & error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start server
const PORT = config.port;
const runningServer = server.listen(PORT, () => {
  console.log(`[SERVER] Estate Application Server active on port ${PORT} [${config.env} mode]`);
});

// Graceful Shutdown Handler
const gracefulShutdown = async (signal) => {
  console.log(`\n[SERVER] ${signal} signal received: closing HTTP server...`);
  runningServer.close(async () => {
    console.log('[SERVER] HTTP server closed.');
    await disconnectDB();
    process.exit(0);
  });

  // Force close after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    console.error('[SERVER] Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
