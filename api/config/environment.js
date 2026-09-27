import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ['MONGO', 'JWT_SECRET'];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);
  if (missing.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`CRITICAL: Missing required environment variables: ${missing.join(', ')}`);
    } else {
      console.warn(`[WARN] Missing recommended environment variables: ${missing.join(', ')}`);
    }
  }
};

export const config = {
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoUri: process.env.MONGO || '',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  clientOrigin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ],
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
};
