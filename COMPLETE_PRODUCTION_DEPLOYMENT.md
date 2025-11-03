# Complete End-to-End Production Deployment Guide
## Fury Road RC Club - Step by Step

This guide walks you through deploying your app to production from start to finish.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed locally
- [ ] Git installed and configured
- [ ] GitHub account (or GitLab/Bitbucket)
- [ ] GoDaddy domain (or any domain)
- [ ] Gmail account (for SMTP) or SendGrid account
- [ ] Code pushed to GitHub repository

---

## 🗄️ Step 1: Set Up Production Database

You need a PostgreSQL database. Choose one option:

### Option A: Supabase (Recommended - Free Tier Available)

**Step 1.1: Create Supabase Account**
1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub or email

**Step 1.2: Create New Project**
1. Click **"New Project"**
2. Fill in details:
   - **Name**: `fury-road-rc-club`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `Asia Pacific (Mumbai)` for India)
   - **Pricing Plan**: Free tier is fine to start
3. Click **"Create new project"**
4. Wait 2-3 minutes for project to be created

**Step 1.3: Get Database Connection String**
1. In Supabase dashboard, go to **Settings** (gear icon)
2. Click **"Database"** in left sidebar
3. Scroll to **"Connection string"** section
4. Under **"URI"**, copy the connection string
5. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
6. **Save this connection string** - you'll need it later!

**Step 1.4: Run Database Migrations**
1. Update your local `.env.local` temporarily:
   ```env
   DATABASE_URL="paste-supabase-connection-string-here"
   ```
2. In your project terminal, run:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
3. This creates all tables and seeds initial data
4. **Verify**: Go to Supabase → Table Editor → You should see tables (User, Game, Booking, etc.)

---

### Option B: Railway PostgreSQL

**Step 1.1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

**Step 1.2: Create Database**
1. Click **"New Project"**
2. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway automatically creates database
4. Click on the database service

**Step 1.3: Get Connection String**
1. Go to **"Variables"** tab
2. Copy the `DATABASE_URL` value
3. **Save this connection string**

**Step 1.4: Run Migrations** (same as Supabase)
```bash
# Update .env.local with Railway DATABASE_URL
npx prisma generate
npx prisma db push
npx prisma db seed
```

---

### Option C: Neon (Free Tier)

**Step 1.1: Create Neon Account**
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub

**Step 1.2: Create Database**
1. Click **"Create a project"**
2. Name it: `fury-road-rc-club`
3. Select region closest to users
4. Click **"Create project"**

**Step 1.3: Get Connection String**
1. Copy the connection string from dashboard
2. **Save this connection string**

**Step 1.4: Run Migrations** (same as above)

---

## 💻 Step 2: Prepare Your Code

**Step 2.1: Verify Code is Ready**
```bash
# In your project directory
npm run build
```
If build succeeds, you're good! If errors, fix them first.

**Step 2.2: Commit and Push to GitHub**
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

**Step 2.3: Verify Repository**
- Go to your GitHub repository
- Make sure code is pushed
- Verify `.env` files are NOT committed (should be in `.gitignore`)

---

## 🚀 Step 3: Deploy to Vercel

**Step 3.1: Sign Up for Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

**Step 3.2: Import Your Project**
1. In Vercel dashboard, click **"Add New..."**
2. Click **"Project"**
3. Find your repository in the list
4. Click **"Import"** next to your repository

**Step 3.3: Configure Project Settings**
1. **Project Name**: `fury-road-rc-club` (or your choice)
2. **Framework Preset**: Should auto-detect "Next.js"
3. **Root Directory**: `./` (if repo is at root)
4. **Build Command**: `npm run build` (auto-detected)
5. **Output Directory**: `.next` (auto-detected)
6. **Install Command**: `npm install` (auto-detected)

**Step 3.4: Add Environment Variables**
Before deploying, click **"Environment Variables"** and add these:

```env
# Database (use your Supabase/Railway/Neon connection string)
DATABASE_URL=postgresql://postgres:password@host:5432/postgres

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate-this-secret-below

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Fury Road RC Club
```

**Generate NEXTAUTH_SECRET:**
- Option 1 (Mac/Linux): Run `openssl rand -base64 32` in terminal
- Option 2 (Windows): Use [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
- Copy the generated string and use it for `NEXTAUTH_SECRET`

**For each variable:**
1. Click **"Add New"**
2. Enter **Key** name
3. Enter **Value**
4. Select **Environment**: ✅ Production, ✅ Preview
5. Click **"Save"**
6. Repeat for all variables above

**Step 3.5: First Deployment**
1. Click **"Deploy"** button
2. Wait 2-5 minutes for build to complete
3. You'll see build logs in real-time
4. When done, you'll get a URL like: `your-project.vercel.app`
5. **Test the URL** - your app should be live!

**Step 3.6: Check Deployment**
1. Visit your Vercel URL
2. Try accessing different pages
3. Check browser console for errors
4. Look at Vercel deployment logs if issues

---

## 📧 Step 4: Set Up Email (Gmail SMTP)

**Step 4.1: Enable Gmail 2FA**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **"Security"** in left sidebar
3. Enable **"2-Step Verification"** if not already enabled

**Step 4.2: Generate App Password**
1. In Google Account → Security
2. Click **"2-Step Verification"**
3. Scroll down to **"App passwords"**
4. Click **"App passwords"**
5. Select **"Mail"** and **"Other (Custom name)"**
6. Name it: `Fury Road RC Club`
7. Click **"Generate"**
8. **Copy the 16-character password** (you won't see it again!)

**Step 4.3: Add to Vercel**
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Update `SMTP_PASS` with the app password you just generated
3. Update `SMTP_USER` with your Gmail address
4. Redeploy (go to Deployments → Latest → ⋯ → Redeploy)

**Step 4.4: Test Email**
1. Go to your live site
2. Try signing up a new user
3. Check email inbox (and spam folder)
4. You should receive a confirmation email

---

## 🌐 Step 5: Connect GoDaddy Domain

**Step 5.1: Get Vercel DNS Records**
1. In Vercel dashboard → Your Project → Settings
2. Click **"Domains"** in left sidebar
3. Click **"Add Domain"**
4. Enter your domain: `yourdomain.com` (without www)
5. Click **"Add"**
6. Vercel will show you DNS configuration

**Step 5.2: Configure GoDaddy DNS**
1. Go to [godaddy.com](https://godaddy.com) and log in
2. Click **"My Products"**
3. Find your domain and click **"DNS"** (or **"Manage DNS"**)

**Step 5.3: Update DNS Records**
You'll typically need to add/modify these records:

**Option 1: CNAME (Recommended)**
- **Record 1 (Root domain):**
  - Type: `CNAME`
  - Name: `@` (or leave blank)
  - Value: `cname.vercel-dns.com` (or what Vercel shows)
  - TTL: `600` (or default)

- **Record 2 (WWW subdomain):**
  - Type: `CNAME`
  - Name: `www`
  - Value: `cname.vercel-dns.com`
  - TTL: `600`

**Option 2: A Record (If CNAME doesn't work)**
- **Record 1:**
  - Type: `A`
  - Name: `@`
  - Value: `76.76.21.21` (check Vercel docs for current IP)
  - TTL: `600`

**Important:** Use the exact values Vercel shows in the Domains section!

**Step 5.4: Save and Wait**
1. Click **"Save"** in GoDaddy
2. DNS changes can take 1-48 hours (usually 1-2 hours)
3. Check propagation: [whatsmydns.net](https://whatsmydns.net)

**Step 5.5: Verify in Vercel**
1. Go back to Vercel → Domains
2. Wait for green checkmark ✅
3. SSL certificate will be automatically provisioned (10-15 minutes)

**Step 5.6: Update Environment Variables**
Once domain is connected:
1. Go to Vercel → Environment Variables
2. Update `NEXTAUTH_URL` to: `https://yourdomain.com`
3. Update `NEXT_PUBLIC_APP_URL` to: `https://yourdomain.com`
4. Redeploy application

---

## ✅ Step 6: Final Setup & Testing

**Step 6.1: Run Database Migrations (Production)**
If you haven't already:
```bash
# In your local terminal with production DATABASE_URL
export DATABASE_URL="your-production-database-url"
npx prisma generate
npx prisma db push
npx prisma db seed
```

**Step 6.2: Create Admin User**
You need an admin account. Two options:

**Option A: Via Database (Supabase)**
1. Go to Supabase → Table Editor → User table
2. Find your user (or create one)
3. Update `role` field to: `ADMIN`
4. Save

**Option B: Via Seed Script**
Add to `prisma/seed.ts`:
```typescript
await prisma.user.upsert({
  where: { email: 'admin@furyroad.com' },
  update: { role: 'ADMIN' },
  create: {
    email: 'admin@furyroad.com',
    name: 'Admin User',
    password: hashedPassword, // hash your password first
    role: 'ADMIN',
  },
})
```
Then run: `npm run db:seed`

**Step 6.3: Test Everything**
Create a checklist and test:

**Authentication:**
- [ ] Can sign up new user
- [ ] Can sign in
- [ ] Can sign out
- [ ] Session persists on page refresh

**Database:**
- [ ] User data saves correctly
- [ ] Can view dashboard
- [ ] Data persists after refresh

**Email:**
- [ ] Receive signup confirmation email
- [ ] Email templates look correct

**Admin Panel:**
- [ ] Can access `/admin` with admin account
- [ ] Can manage games
- [ ] Can view reports

**Public Pages:**
- [ ] Homepage loads correctly
- [ ] Tracks page works
- [ ] About page works
- [ ] Contact page works

**Step 6.4: Check Logs**
1. In Vercel → Deployments → Click latest deployment
2. Check **"Build Logs"** for any warnings
3. Check **"Function Logs"** for runtime errors
4. Fix any issues found

---

## 🔒 Step 7: Security Checklist

- [ ] All environment variables are set (no missing ones)
- [ ] `NEXTAUTH_SECRET` is a long random string
- [ ] Database password is strong
- [ ] Gmail app password is secure
- [ ] HTTPS is enabled (SSL certificate active)
- [ ] No sensitive data in code/console logs
- [ ] `.env` files are in `.gitignore`

---

## 📊 Step 8: Monitoring & Maintenance

**Step 8.1: Set Up Monitoring (Optional)**
- Vercel Analytics (built-in)
- Or use Sentry for error tracking
- Monitor database performance

**Step 8.2: Regular Backups**
- Database: Supabase/Railway/Neon usually auto-backup
- Code: Git repository is your backup
- Consider weekly database exports

**Step 8.3: Update Dependencies**
```bash
# Check for updates
npm outdated

# Update packages (carefully)
npm update
npm run build # Test locally first!
```

---

## 🆘 Troubleshooting Common Issues

### Issue 1: Build Fails
**Solution:**
- Check build logs in Vercel
- Test build locally: `npm run build`
- Fix TypeScript/ESLint errors
- Ensure all dependencies are in `package.json`

### Issue 2: Database Connection Error
**Solution:**
- Verify `DATABASE_URL` is correct
- Check database allows external connections
- Verify network/firewall settings
- Test connection string locally first

### Issue 3: Domain Not Working
**Solution:**
- Wait longer (DNS can take 48 hours)
- Check DNS records match Vercel requirements
- Clear DNS cache: `sudo dscacheutil -flushcache`
- Verify domain in Vercel shows green checkmark

### Issue 4: Emails Not Sending
**Solution:**
- Check Gmail app password is correct
- Verify SMTP settings in environment variables
- Check spam folder
- Test SMTP credentials locally

### Issue 5: Authentication Not Working
**Solution:**
- Verify `NEXTAUTH_URL` matches your domain exactly
- Check `NEXTAUTH_SECRET` is set
- Ensure cookies are enabled
- Check browser console for errors

---

## 📝 Quick Reference Commands

```bash
# Generate secret
openssl rand -base64 32

# Build locally
npm run build
npm start

# Database commands
npx prisma generate
npx prisma db push
npx prisma db seed

# Git commands
git add .
git commit -m "message"
git push origin main
```

---

## ✅ Final Deployment Checklist

Before going live, verify:

- [ ] Database is set up and migrated
- [ ] All environment variables are added to Vercel
- [ ] Domain is connected and verified
- [ ] SSL certificate is active (HTTPS works)
- [ ] Admin user is created
- [ ] Test signup/login works
- [ ] Email notifications work
- [ ] All pages load correctly
- [ ] No errors in browser console
- [ ] No errors in Vercel logs

---

## 🎉 You're Live!

Once all steps are complete:
1. Your app is live at `https://yourdomain.com`
2. Share with your team/users
3. Monitor for any issues
4. Start using in production!

---

## 📞 Need Help?

If stuck:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify all environment variables
4. Test database connection
5. Check DNS propagation status

**Support Resources:**
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Supabase Docs](https://supabase.com/docs)

---

**Good luck with your deployment! 🚀**

