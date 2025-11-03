#!/bin/bash

echo "🔧 Database Connection Fix Script"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

echo "Current DATABASE_URL from .env:"
grep DATABASE_URL .env | head -1
echo ""

echo "📋 Steps to Fix:"
echo ""
echo "1. Check Supabase Dashboard:"
echo "   - Go to https://supabase.com"
echo "   - Find your project (zmtlfrsnjcnshqxcqbry)"
echo "   - Check if it's PAUSED → Click RESUME"
echo ""
echo "2. Get Fresh Connection String:"
echo "   - Supabase → Settings → Database"
echo "   - Copy 'Connection string' under 'URI'"
echo "   - OR use 'Connection pooling' (more reliable)"
echo ""
echo "3. Update .env file with new connection string"
echo ""
echo "4. Test connection:"
echo "   npx prisma db pull"
echo ""
echo "5. If connection works:"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo "   npm run db:seed"
echo ""

# Check if Supabase URL is reachable
echo "Testing connection..."
DB_HOST=$(grep DATABASE_URL .env | sed 's/.*@\([^:]*\):.*/\1/')
if [ -n "$DB_HOST" ]; then
    echo "Testing $DB_HOST..."
    nc -zv "$DB_HOST" 5432 2>&1 || echo "❌ Cannot reach database server"
else
    echo "❌ Could not parse database host"
fi

echo ""
echo "💡 Alternative: Create New Supabase Project"
echo "   1. Go to supabase.com → New Project"
echo "   2. Copy new connection string"
echo "   3. Update DATABASE_URL in .env"

