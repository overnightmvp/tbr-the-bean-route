-- Migration: Enable pgvector extension for semantic search
-- Date: 2026-02-28
-- Description: Enables pgvector extension in Supabase PostgreSQL for embedding-based
-- semantic search functionality. Required for barista profile semantic search and
-- skills matching features.
--
-- MANUAL DEPLOYMENT INSTRUCTIONS:
-- 1. Log into Supabase dashboard: https://app.supabase.com
-- 2. Navigate to your project
-- 3. Go to SQL Editor
-- 4. Create a new query
-- 5. Copy the SQL below and execute
-- 6. Verify the extension is enabled by checking the verification query result
--
-- Once enabled, the pgvector extension will be available for:
-- - Creating vector columns for embeddings
-- - Performing vector similarity searches using cosine/L2 distance
-- - Semantic search on barista skills, experience, and profile descriptions

-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify extension is enabled
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
