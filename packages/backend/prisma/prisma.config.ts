import type { Config } from 'prisma';

const config: Config = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

export default config;
