-- SQL script to reset admin passwords
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new
-- Or use any PostgreSQL client

-- Update password for furyroadrcclub@gmail.com
-- Password: FurY@2024
UPDATE "User" 
SET password = '$2b$12$V97HUH747SPO6xgvuzqg4efmOHT15UFWV1HibBm3rFzsq2XJ9bc/2'
WHERE email = 'furyroadrcclub@gmail.com';

-- Update password for vishnuprasad1990@gmail.com  
-- Password: Vpn@1991
UPDATE "User" 
SET password = '$2b$12$z0/a.LukQhirBUXmJ.L03.4vvHMCJd5i9C85ySToXR1JAHouG0eTi'
WHERE email = 'vishnuprasad1990@gmail.com';

-- Verify the updates
SELECT email, name, role FROM "User" WHERE role = 'ADMIN';
