import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

// Placeholder - will be implemented in Phase 3
async function startServer() {
  console.log('🚀 Backend server starting...');
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'JSON Fallback'}`);
  
  // TODO: Initialize GraphQL server
  // TODO: Setup database connection
  // TODO: Apply middleware
  
  app.use(cors());
  app.use(express.json());
  
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  app.listen(PORT, () => {
    console.log(`✅ Server ready at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('❌ Server failed to start:', error);
  process.exit(1);
});
