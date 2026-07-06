-- TripDekho PostgreSQL Init Script
-- Runs automatically when the Postgres container is first created.
-- Ensures required extensions are available and search_path is correct.

-- Enable uuid-ossp for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for gen_random_uuid() (fallback)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable pg_stat_statements for query analysis
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Set search_path so uuid_generate_v4() is always found
ALTER DATABASE tripdekho SET search_path TO "$user", public, extensions;
