import mongoose from 'mongoose';
import { config } from './environment.js';

let isConnected = false;

export const connectDB = async () => {
  if (!config.mongoUri) {
    console.error('[DATABASE] MONGO connection string is not defined.');
    if (config.isProduction) {
      process.exit(1);
    }
    return;
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  try {
    const conn = await mongoose.connect(config.mongoUri, options);
    isConnected = true;
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DATABASE ERROR] Failed to connect to MongoDB: ${error.message}`);
    isConnected = false;
    if (config.isProduction) {
      process.exit(1);
    }
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[DATABASE] MongoDB connection lost. Reconnecting...');
    isConnected = false;
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[DATABASE] MongoDB reconnected successfully.');
    isConnected = true;
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[DATABASE ERROR] Runtime connection error: ${err.message}`);
  });
};

export const getDbStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    isConnected: mongoose.connection.readyState === 1,
  };
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[DATABASE] MongoDB connection closed gracefully.');
  } catch (err) {
    console.error(`[DATABASE ERROR] Error during disconnection: ${err.message}`);
  }
};
