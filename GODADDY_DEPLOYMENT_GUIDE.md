# Deployment Guide - Fury Road RC Club with GoDaddy Domain

This guide will walk you through deploying your Next.js application online and connecting it to your GoDaddy domain.

## Quick Start Options

### Option 1: Vercel (Recommended - Easiest for Next.js)

Vercel is the best platform for Next.js applications with:
- ✅ Automatic deployments from GitHub
- ✅ Free SSL certificates
- ✅ Built-in CDN
- ✅ Easy GoDaddy domain connection
- ✅ Free tier available

### Option 2: Railway

- ✅ Full-stack deployment with database
- ✅ Easy setup
- ✅ Custom domain support

### Option 3: AWS / DigitalOcean

- ✅ More control
- ⚠️ More complex setup
- ✅ Better for high traffic

---

## Step-by-Step: Deploy with Vercel + GoDaddy

### Part 1: Prepare Your Code

1. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/rc-car-cafe.git
   git push -u origin main
   ```

2. **Create `.env.production` file** (optional, for reference)
   ```env
   DATABASE_URL=your-production-database-url
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your-production-secret
   # ... other variables
   ```

### Part 2: Deploy to Vercel

1. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Your Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `./` (if your repo is at root)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

4. **Set Environment Variables**
   Go to Project Settings → Environment Variables and add:
   
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:port/database
   
   # NextAuth
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=generate-a-random-secret-here
   
   # Email (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   NEXT_PUBLIC_APP_NAME=Fury Road RC Club
   ```
   
   **Note:** Payment gateway variables (Razorpay/Stripe) are NOT required - payment functionality is currently disabled.

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

5. **First Deployment**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

### Part 3: Connect GoDaddy Domain

#### Step 1: Get Your Vercel Domain IP/Records

1. In Vercel dashboard, go to **Settings → Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `furyroadrcclub.com`)
4. Vercel will show you DNS records needed

#### Step 2: Configure DNS in GoDaddy

1. **Login to GoDaddy**
   - Go to [godaddy.com](https://godaddy.com)
   - Login to your account

2. **Access DNS Management**
   - Go to **My Products** → Select your domain
   - Click **DNS** or **Manage DNS**

3. **Update DNS Records**

   **For Root Domain (example.com):**
   
   Add an **A Record**:
   - Type: `A`
   - Name: `@` (or leave blank)
   - Value: `76.76.21.21` (Vercel's IP - this may change, check Vercel docs)
   - TTL: `600` (or default)

   **OR Use CNAME (Recommended):**
   - Type: `CNAME`
   - Name: `@` (or `www`)
   - Value: `cname.vercel-dns.com`
   - TTL: `600`

   **Note:** Vercel provides specific DNS records - use the exact values shown in your Vercel dashboard!

   **For WWW Subdomain:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `600`

4. **Save Changes**
   - Click **Save** or **Update**
   - DNS changes can take 24-48 hours, but usually work within 1-2 hours

#### Step 3: Verify in Vercel

1. Go back to Vercel dashboard
2. Under Domains, wait for verification (green checkmark)
3. SSL certificate will be automatically provisioned (may take a few minutes)

### Part 4: Database Setup

You need a production database. Options:

#### Option A: Supabase (Free Tier Available)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Update `DATABASE_URL` in Vercel environment variables

#### Option B: Railway PostgreSQL
1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy connection string
4. Update `DATABASE_URL` in Vercel

#### Option C: Neon (Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Create database
3. Copy connection string
4. Update `DATABASE_URL` in Vercel

#### Run Database Migrations
```bash
# In Vercel, you can run this via CLI or add to build command
npx prisma generate
npx prisma db push
```

Or add to `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma db push && next build"
  }
}
```

### Part 5: Update Next.js Config (Optional)

Update `next.config.ts` for production:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['yourdomain.com'],
    // Configure image qualities for Next.js 16
    qualities: [75, 85, 90, 95, 100],
  },
  // Add your domain to allowed hosts if needed
};

export default nextConfig;
```

---

## Alternative: Deploy with Railway

### Railway Deployment Steps

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically creates database
   - Copy connection string

4. **Set Environment Variables**
   - Go to your service → Variables
   - Add all required environment variables
   - Use Railway's database URL for `DATABASE_URL`

5. **Deploy**
   - Railway auto-deploys on git push
   - Get your Railway domain: `your-app.railway.app`

### Connect GoDaddy Domain to Railway

1. **In Railway Dashboard:**
   - Go to your service → Settings → Networking
   - Add custom domain: `yourdomain.com`

2. **In GoDaddy DNS:**
   - Add CNAME record:
     - Name: `@` or `www`
     - Value: Railway provides (check Railway docs for current value)
   - Or use A record with Railway's IP (if provided)

---

## Post-Deployment Checklist

- [ ] Domain is connected and working
- [ ] SSL certificate is active (HTTPS works)
- [ ] Database is connected and migrated
- [ ] Environment variables are set correctly
- [ ] Test user registration works
- [ ] Test authentication flow
- [ ] Email notifications are working
- [ ] Check application logs for errors
- [ ] Set up monitoring (optional)
- [ ] Configure backups (optional)

---

## Troubleshooting

### Domain Not Connecting?

1. **Check DNS Propagation:**
   - Use [whatsmydns.net](https://whatsmydns.net) to check if DNS is propagated
   - Wait up to 48 hours for full propagation

2. **Verify DNS Records:**
   - Double-check records in GoDaddy match Vercel/Railway requirements
   - Ensure no conflicting records exist

3. **Clear DNS Cache:**
   ```bash
   # On Mac/Linux
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # On Windows
   ipconfig /flushdns
   ```

### SSL Certificate Issues?

- Wait 10-15 minutes after domain verification
- Ensure DNS is fully propagated
- Check Vercel/Railway dashboard for SSL status
- Contact hosting provider support if issues persist

### Database Connection Errors?

- Verify `DATABASE_URL` format is correct
- Check database allows connections from hosting IP
- Ensure database is accessible (not blocked by firewall)
- Test connection string locally first

### Build Errors?

- Check Vercel/Railway build logs
- Ensure all environment variables are set
- Verify Node.js version compatibility
- Check for TypeScript/linting errors

---

## Cost Estimation

### Vercel:
- **Hobby Plan**: FREE (suitable for small sites)
  - Unlimited deployments
  - 100GB bandwidth/month
  - Custom domains included
- **Pro Plan**: $20/month (for production use)
  - Better performance
  - Team collaboration
  - Advanced analytics

### Database (Supabase Free Tier):
- FREE: 500MB database, 2GB bandwidth
- Or use Railway PostgreSQL: ~$5/month

### GoDaddy Domain:
- $10-15/year (already have)

### Total: **$0-25/month** depending on plan

---

## Quick Reference Commands

```bash
# Generate secure secret
openssl rand -base64 32

# Test database connection
npx prisma db pull

# Build locally to test
npm run build
npm start

# Push to production
git push origin main  # Auto-deploys on Vercel/Railway
```

---

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **GoDaddy Support**: [support.godaddy.com](https://support.godaddy.com)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)

---

## Need Help?

If you encounter issues:
1. Check application logs in hosting dashboard
2. Verify all environment variables
3. Test database connection
4. Review DNS settings
5. Check hosting provider status page

Good luck with your deployment! 🚀

