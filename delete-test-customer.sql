-- SQL script to delete test customer account
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new
-- Or use any PostgreSQL client

-- First, check if the customer exists
SELECT id, email, name, role, 
       (SELECT COUNT(*) FROM bookings WHERE "userId" = users.id) as bookings_count,
       (SELECT COUNT(*) FROM points WHERE "userId" = users.id) as points_count
FROM users 
WHERE email = 'customer@rccarcafe.com';

-- Delete bookings from test customer
DELETE FROM bookings 
WHERE "userId" IN (
  SELECT id FROM users WHERE email = 'customer@rccarcafe.com'
);

-- Delete points from test customer
DELETE FROM points 
WHERE "userId" IN (
  SELECT id FROM users WHERE email = 'customer@rccarcafe.com'
);

-- Delete the test customer account
DELETE FROM users 
WHERE email = 'customer@rccarcafe.com';

-- Verify deletion
SELECT email, name, role 
FROM users 
WHERE email = 'customer@rccarcafe.com';
-- Should return 0 rows

