import express from 'express';
import { getDbStatus } from '../config/db.js';
import { config } from '../config/environment.js';

const router = express.Router();
const startTime = Date.now();

router.get('/', (req, res) => {
  const dbStatus = getDbStatus();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memory = process.memoryUsage();

  const isHealthy = dbStatus.isConnected;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'mern-estate-api',
    environment: config.env,
    uptime: `${uptimeSeconds}s`,
    database: dbStatus,
    system: {
      memoryRssMB: Math.round(memory.rss / (1024 * 1024)),
      heapUsedMB: Math.round(memory.heapUsed / (1024 * 1024)),
      nodeVersion: process.version,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
