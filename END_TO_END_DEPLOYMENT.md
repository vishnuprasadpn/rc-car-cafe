# 🚀 End-to-End Production Deployment Guide
## Fury Road RC Club - Complete Step-by-Step

This guide takes you from code to production in the simplest way possible.

---

## ❌ Fix Database Connection Error First

**The Error:**
```
Error: P1001
Can't reach database server at `localhost:51214`
```

**The Problem:** Your `.env.local` has an invalid `DATABASE_URL` pointing to a database that doesn't exist.

**Quick Fix for Local Development:**
1. You have two options:
   - **Option A:** Set up a cloud database now (skip to Step 1 below) - Recommended for production
   - **Option B:** Use Docker for local development (optional)

---

## 📋 Complete Deployment Steps

### Step 1: Set Up Production Database (5-10 minutes)

**Choose ONE option:**

#### ✅ Option A: Supabase (Recommended - FREE)

```bash
# 1. Go to https://supabase.com and sign up
# 2. Create new project
# 3. Go to Settings → Database → Copy connection string
# 4. Create .env.local file in your project root:
```

Create/update `.env.local`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-below"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Fury Road RC Club"
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

**Run database migrations:**
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

✅ **Your database error is now fixed!**

---

### Step 2: Push Code to GitHub

```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit - ready for production"

# If already a repo, just push
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Verify:**
- Go to github.com → Your repository
- Make sure all files are pushed (except `.env.local` - should be in `.gitignore`)

---

### Step 3: Deploy to Vercel (5 minutes)

**3.1: Sign Up**
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel

**3.2: Import Project**
1. Click "Add New..." → "Project"
2. Find your repository → Click "Import"

**3.3: Configure Project**
- Project Name: `fury-road-rc-club` (or your choice)
- Framework: Next.js (auto-detected)
- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)

**3.4: Add Environment Variables**

Click "Environment Variables" button and add:

```env
# Database (from Step 1 - Supabase)
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=paste-generated-secret-here

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# App Config
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Fury Road RC Club
```

**For each variable:**
1. Click "Add New"
2. Enter Key and Value
3. Select ✅ Production, ✅ Preview
4. Click Save

**3.5: Deploy**
1. Click "Deploy" button
2. Wait 2-5 minutes
3. Get your URL: `your-project.vercel.app`
4. ✅ Test it works!

---

### Step 4: Set Up Email (Gmail) - 5 minutes

**4.1: Enable 2FA**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → Enable 2-Step Verification

**4.2: Generate App Password**
1. Google Account → Security → 2-Step Verification
2. Click "App passwords"
3. Select "Mail" → "Other" → Name it "Fury Road"
4. Generate → Copy the 16-character password

**4.3: Update Vercel**
1. Vercel → Project → Settings → Environment Variables
2. Update `SMTP_PASS` with app password
3. Update `SMTP_USER` with your Gmail
4. Redeploy: Deployments → Latest → ⋯ → Redeploy

---

### Step 5: Connect GoDaddy Domain - 10 minutes

**5.1: Add Domain in Vercel**
1. Vercel → Project → Settings → Domains
2. Click "Add Domain"
3. Enter: `yourdomain.com` (without www)
4. Click "Add"
5. Vercel shows DNS records needed

**5.2: Configure GoDaddy DNS**
1. Go to [godaddy.com](https://godaddy.com) → Login
2. My Products → Your Domain → DNS (or Manage DNS)

**5.3: Add DNS Records**

**For Root Domain (@):**
- Type: `CNAME`
- Name: `@` (or leave blank)
- Value: `cname.vercel-dns.com` (or what Vercel shows)
- TTL: `600`

**For WWW:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`
- TTL: `600`

**Save** and wait 1-2 hours (usually faster)

**5.4: Update Environment Variables**
Once domain is verified (green checkmark in Vercel):
1. Vercel → Environment Variables
2. Update `NEXTAUTH_URL` to: `https://yourdomain.com`
3. Update `NEXT_PUBLIC_APP_URL` to: `https://yourdomain.com`
4. Redeploy

---

### Step 6: Run Production Database Migrations

```bash
# In your local terminal
# Set production DATABASE_URL temporarily
export DATABASE_URL="your-production-supabase-url-from-vercel"

# Run migrations
npx prisma generate
npx prisma db push
npm run db:seed

# This creates all tables in production database
```

**Verify:**
- Go to Supabase → Table Editor
- You should see: User, Game, Booking, Point, etc.

---

### Step 7: Create Admin User

**Option A: Via Supabase Dashboard**
1. Go to Supabase → Table Editor → User table
2. Create new user or find existing
3. Update `role` field to: `ADMIN`
4. Save

**Option B: Via Seed Script**
The seed script should create:
- `admin@rccarcafe.com` / `admin123` (ADMIN)
- `staff@rccarcafe.com` / `staff123` (STAFF)
- `customer@rccarcafe.com` / `customer123` (CUSTOMER)

If seed didn't run, update manually in Supabase.

---

### Step 8: Test Everything

**Test Checklist:**
- [ ] Visit `https://yourdomain.com` - homepage loads
- [ ] Sign up new user - works
- [ ] Sign in - works
- [ ] Check email received (for signup)
- [ ] Access `/admin` with admin account
- [ ] View dashboard
- [ ] No errors in browser console
- [ ] No errors in Vercel logs

---

## ✅ Final Checklist

Before going live:
- [ ] Database is set up (Supabase)
- [ ] Code is pushed to GitHub
- [ ] App is deployed on Vercel
- [ ] All environment variables added to Vercel
- [ ] Email (Gmail) configured
- [ ] Domain connected (GoDaddy)
- [ ] Database migrations run
- [ ] Admin user created
- [ ] Tested signup/login
- [ ] Tested email sending
- [ ] No errors anywhere

---

## 🔧 Troubleshooting Database Error

**If you still get database errors:**

1. **Check DATABASE_URL format:**
   ```
   ✅ Correct: postgresql://postgres:password@host:5432/postgres
   ❌ Wrong: postgresql://localhost:51214 (invalid port)
   ```

2. **Test connection:**
   ```bash
   # Test if Supabase connection works
   npx prisma db pull
   ```

3. **Verify in Supabase:**
   - Go to Supabase → Settings → Database
   - Check "Connection string" matches your DATABASE_URL
   - Ensure database is not paused

4. **Check Vercel environment variables:**
   - Vercel → Settings → Environment Variables
   - Verify DATABASE_URL is set correctly
   - Make sure it's for Production environment

---

## 📝 Quick Reference

```bash
# Generate secret
openssl rand -base64 32

# Database commands
npx prisma generate
npx prisma db push
npm run db:seed

# Build test
npm run build

# Git commands
git add .
git commit -m "message"
git push origin main
```

---

## 🎉 You're Done!

Your app is now live at `https://yourdomain.com`

**Default Login:**
- Admin: `admin@rccarcafe.com` / `admin123`
- Staff: `staff@rccarcafe.com` / `staff123`
- Customer: `customer@rccarcafe.com` / `customer123`

---

## 📞 Need Help?

**Database Issues:**
- Check DATABASE_URL format
- Verify Supabase project is active
- Test connection locally first

**Deployment Issues:**
- Check Vercel build logs
- Verify all environment variables
- Test build locally: `npm run build`

**Domain Issues:**
- Wait longer (up to 48 hours)
- Check DNS records match Vercel
- Verify domain in Vercel shows ✅

**Email Issues:**
- Check Gmail app password
- Verify SMTP variables
- Check spam folder

---

**Good luck! 🚀**

