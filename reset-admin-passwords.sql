-- SQL script to reset admin passwords
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new
-- Or use any PostgreSQL client

-- First, check if users exist
SELECT email, name, role, CASE WHEN password IS NULL THEN 'NULL' WHEN password = '' THEN 'EMPTY' ELSE 'SET' END as password_status 
FROM users 
WHERE email IN ('furyroadrcclub@gmail.com', 'vishnuprasad1990@gmail.com');

-- Update password for furyroadrcclub@gmail.com
-- Password: FurY@2024
UPDATE users 
SET password = '$2b$12$2IG80fjBP17GEbexMFWm5OICvxCSw7WAyysjcq3zHTvBOuvoq/cKe'
WHERE email = 'furyroadrcclub@gmail.com';

-- Update password for vishnuprasad1990@gmail.com  
-- Password: Vpn@1991
UPDATE users 
SET password = '$2b$12$R9DV8C8VW/9Ejb6moaOen.M3qADp2NkoUm6/V8g3D4A/yRBflWqum'
WHERE email = 'vishnuprasad1990@gmail.com';

-- Verify the updates
SELECT email, name, role, 
       CASE WHEN password IS NULL THEN 'NULL' 
            WHEN password = '' THEN 'EMPTY' 
            ELSE 'SET (' || LENGTH(password) || ' chars)' 
       END as password_status
FROM users 
WHERE email IN ('furyroadrcclub@gmail.com', 'vishnuprasad1990@gmail.com');
