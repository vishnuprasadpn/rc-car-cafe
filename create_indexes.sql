-- Index Creation Script (Transaction-Safe Version)
-- Uses camelCase column names as Prisma uses them
-- This version works in transaction blocks (Supabase SQL Editor, Prisma, etc.)

-- User indexes
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");
CREATE INDEX IF NOT EXISTS "users_createdAt_idx" ON "users"("createdAt");

-- Account indexes
CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON "accounts"("userId");

-- Session indexes
CREATE INDEX IF NOT EXISTS "sessions_userId_idx" ON "sessions"("userId");
CREATE INDEX IF NOT EXISTS "sessions_expires_idx" ON "sessions"("expires");

-- PasswordResetToken indexes
CREATE INDEX IF NOT EXISTS "password_reset_tokens_email_idx" ON "password_reset_tokens"("email");
CREATE INDEX IF NOT EXISTS "password_reset_tokens_expires_idx" ON "password_reset_tokens"("expires");
CREATE INDEX IF NOT EXISTS "password_reset_tokens_used_idx" ON "password_reset_tokens"("used");

-- Game indexes
CREATE INDEX IF NOT EXISTS "games_isActive_idx" ON "games"("isActive");
CREATE INDEX IF NOT EXISTS "games_createdAt_idx" ON "games"("createdAt");

-- Booking indexes
CREATE INDEX IF NOT EXISTS "bookings_userId_idx" ON "bookings"("userId");
CREATE INDEX IF NOT EXISTS "bookings_gameId_idx" ON "bookings"("gameId");
CREATE INDEX IF NOT EXISTS "bookings_status_idx" ON "bookings"("status");
CREATE INDEX IF NOT EXISTS "bookings_paymentStatus_idx" ON "bookings"("paymentStatus");
CREATE INDEX IF NOT EXISTS "bookings_startTime_idx" ON "bookings"("startTime");
CREATE INDEX IF NOT EXISTS "bookings_createdAt_idx" ON "bookings"("createdAt");
-- Composite index for report queries
CREATE INDEX IF NOT EXISTS "bookings_status_paymentStatus_createdAt_idx" ON "bookings"("status", "paymentStatus", "createdAt");

-- Point indexes
CREATE INDEX IF NOT EXISTS "points_userId_idx" ON "points"("userId");
CREATE INDEX IF NOT EXISTS "points_status_idx" ON "points"("status");
CREATE INDEX IF NOT EXISTS "points_createdAt_idx" ON "points"("createdAt");

-- StaffAction indexes
CREATE INDEX IF NOT EXISTS "staff_actions_staffId_idx" ON "staff_actions"("staffId");
CREATE INDEX IF NOT EXISTS "staff_actions_createdAt_idx" ON "staff_actions"("createdAt");

-- EmailLog indexes
CREATE INDEX IF NOT EXISTS "email_logs_status_idx" ON "email_logs"("status");
CREATE INDEX IF NOT EXISTS "email_logs_createdAt_idx" ON "email_logs"("createdAt");

-- Track indexes
CREATE INDEX IF NOT EXISTS "tracks_isActive_idx" ON "tracks"("isActive");
CREATE INDEX IF NOT EXISTS "tracks_type_idx" ON "tracks"("type");

-- Timer indexes (createdAt only, others already exist)
CREATE INDEX IF NOT EXISTS "timers_createdAt_idx" ON "timers"("createdAt");

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
