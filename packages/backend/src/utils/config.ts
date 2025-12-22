import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Utility functions for configuration
export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  corsOrigins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
};

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
export const useDatabase = !!config.databaseUrl;

/**
 * Log configuration on startup
 */
export function logConfig(): void {
  console.log('⚙️  Server Configuration:');
  console.log(`   NODE_ENV: ${config.nodeEnv}`);
  console.log(`   PORT: ${config.port}`);
  console.log(`   Database: ${useDatabase ? 'PostgreSQL' : 'JSON Files'}`);
  console.log(`   CORS Origins: ${config.corsOrigins.join(', ')}`);
}
