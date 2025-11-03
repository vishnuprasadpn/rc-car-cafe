# 🔧 Quick Fix: Database Connection Error

## The Problem You Had

**Error:** `Can't reach database server at localhost:51214`

**Root Cause:** Your `.env` file had an invalid `DATABASE_URL` pointing to a Prisma Cloud connection that doesn't exist.

## ✅ The Fix

I've already fixed it by copying your correct Supabase connection from `.env.local` to `.env`.

## 🔍 Verify Connection

**Test your database connection:**

```bash
# 1. Test connection
npx prisma db pull

# 2. If connection works, run migrations
npx prisma generate
npx prisma db push
npm run db:seed
```

## ⚠️ If Connection Still Fails

**Possible reasons:**

1. **Supabase Database is Paused**
   - Go to [supabase.com](https://supabase.com) → Your Project
   - Check if database shows "Paused" - if so, click "Resume"

2. **Wrong Password in Connection String**
   - Your password is: `Furyroadrc`
   - Check if password has special characters that need URL encoding
   - Special chars like `@`, `#`, `%` need to be encoded:
     - `@` → `%40`
     - `#` → `%23`
     - `%` → `%25`

3. **Connection String Format**
   - Current: `postgresql://postgres:Furyroadrc@db.zmtlfrsnjcnshqxcqbry.supabase.co:5432/postgres`
   - If password has special chars, encode them

4. **Network/Firewall**
   - Check if your network allows connections to Supabase
   - Try from different network

**Fix Password Encoding:**
```bash
# If password is "Fury@road#rc", encode it:
# postgresql://postgres:Fury%40road%23rc@db.xxxxx.supabase.co:5432/postgres
```

## ✅ After Fix Works

Once `npx prisma db push` succeeds:
```bash
# Seed the database
npm run db:seed

# Run the app
npm run dev
```

Your app should now work! 🎉

---

## 📋 Next: Full Production Deployment

See `END_TO_END_DEPLOYMENT.md` for complete production deployment steps.

