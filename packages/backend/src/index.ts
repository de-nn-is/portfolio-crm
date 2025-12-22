import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { config, useDatabase, logConfig } from './utils/config';
import { getUserIdFromHeaders } from './services/auth.service';
import { PostgresService } from './services/postgres.service';
import { JsonService } from './services/json.service';
import { generateMockData } from './data/mock/generator';
import type { IDatabase } from './services/database.interface';

async function startServer() {
  const app = express();

  // Initialize database
  let db: IDatabase;

  if (useDatabase) {
    console.log('🔌 Using PostgreSQL database');
    db = new PostgresService();
  } else {
    console.log('📁 Using JSON file database');
    db = new JsonService();
    
    // Generate mock data for JSON database
    try {
      const mockData = await generateMockData();
      // Save mock data
      const fs = await import('fs/promises');
      const path = await import('path');
      const jsonPath = path.join(__dirname, 'data/json/db.json');
      await fs.mkdir(path.dirname(jsonPath), { recursive: true });
      await fs.writeFile(jsonPath, JSON.stringify(mockData, null, 2));
      console.log('✅ Mock data initialized');
    } catch (error) {
      console.warn('⚠️  Could not initialize mock data:', error);
    }
  }

  await db.connect();

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Apply middleware
  app.use(
    '/graphql',
    cors({
      origin: config.corsOrigins,
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const userId = getUserIdFromHeaders(req.headers);
        return { db, userId: userId || undefined };
      },
    })
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', database: useDatabase ? 'postgres' : 'json' });
  });

  // Start server
  app.listen(config.port, () => {
    logConfig();
    console.log(`🚀 Server ready at http://localhost:${config.port}/graphql`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await db.disconnect();
    process.exit(0);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
