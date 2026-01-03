-- Test Script to Verify Indexes and Query Performance
-- Run this in Supabase SQL Editor to verify indexes are working

-- 1. Verify all indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND indexname LIKE '%_idx'
ORDER BY tablename, indexname;

-- 2. Test query performance with EXPLAIN ANALYZE
-- This shows if indexes are being used

-- Test User role query (should use users_role_idx)
EXPLAIN ANALYZE
SELECT * FROM "users" WHERE "role" = 'CUSTOMER' LIMIT 10;

-- Test Booking status query (should use bookings_status_idx)
EXPLAIN ANALYZE
SELECT * FROM "bookings" WHERE "status" = 'CONFIRMED' LIMIT 10;

-- Test Booking composite query (should use composite index)
EXPLAIN ANALYZE
SELECT * FROM "bookings" 
WHERE "status" = 'CONFIRMED' 
  AND "paymentStatus" = 'COMPLETED'
  AND "createdAt" >= NOW() - INTERVAL '30 days'
LIMIT 10;

-- Test User bookings query (should use bookings_userId_idx)
EXPLAIN ANALYZE
SELECT * FROM "bookings" WHERE "userId" = (SELECT id FROM "users" LIMIT 1) LIMIT 10;

-- Test Points status query (should use points_status_idx)
EXPLAIN ANALYZE
SELECT * FROM "points" WHERE "status" = 'PENDING' ORDER BY "createdAt" DESC LIMIT 10;

-- Test Timer status query (should use timers_status_idx)
EXPLAIN ANALYZE
SELECT * FROM "timers" WHERE "status" = 'RUNNING' LIMIT 10;

-- 3. Check index usage statistics (if available)
SELECT 
    schemaname,
    relname as tablename,
    indexrelname as indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
    AND indexrelname LIKE '%_idx'
ORDER BY idx_scan DESC;

