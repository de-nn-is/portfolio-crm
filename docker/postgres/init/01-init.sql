-- Init script for PostgreSQL
-- This runs automatically when the container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Log success
DO $$
BEGIN
  RAISE NOTICE 'Portfolio CRM database initialized successfully';
END $$;
