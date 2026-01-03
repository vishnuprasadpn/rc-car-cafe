-- Concurrent Index Creation Script
-- This script creates all indexes concurrently for better performance on large tables
-- Run this script directly in your Supabase SQL editor or via psql

-- User indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "users_role_idx" ON "users"("role");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "users_created_at_idx" ON "users"("created_at");

-- Account indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "accounts_user_id_idx" ON "accounts"("userId");

-- Session indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "sessions_user_id_idx" ON "sessions"("userId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "sessions_expires_idx" ON "sessions"("expires");

-- PasswordResetToken indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "password_reset_tokens_email_idx" ON "password_reset_tokens"("email");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "password_reset_tokens_expires_idx" ON "password_reset_tokens"("expires");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "password_reset_tokens_used_idx" ON "password_reset_tokens"("used");

-- Game indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "games_is_active_idx" ON "games"("isActive");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "games_created_at_idx" ON "games"("created_at");

-- Booking indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "bookings_user_id_idx" ON "bookings"("userId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "bookings_game_id_idx" ON "bookings"("gameId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "bookings_status_idx" ON "bookings"("status");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "bookings_payment_status_idx" ON "bookings"("paymentStatus");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "bookings_start_time_idx" ON "bookings"("startTime");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "bookings_created_at_idx" ON "bookings"("created_at");
-- Composite index for report queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS "bookings_status_payment_status_created_at_idx" ON "bookings"("status", "paymentStatus", "created_at");

-- Point indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "points_user_id_idx" ON "points"("userId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "points_status_idx" ON "points"("status");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "points_created_at_idx" ON "points"("created_at");

-- StaffAction indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "staff_actions_staff_id_idx" ON "staff_actions"("staffId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "staff_actions_created_at_idx" ON "staff_actions"("created_at");

-- EmailLog indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "email_logs_status_idx" ON "email_logs"("status");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "email_logs_created_at_idx" ON "email_logs"("created_at");

-- Track indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "tracks_is_active_idx" ON "tracks"("isActive");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "tracks_type_idx" ON "tracks"("type");

-- Timer indexes (created_at only, others already exist)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "timers_created_at_idx" ON "timers"("created_at");

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND indexname LIKE '%_idx'
ORDER BY tablename, indexname;

