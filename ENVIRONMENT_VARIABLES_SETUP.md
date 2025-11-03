# Where to Add Environment Variables - Step by Step Guide

This guide shows you exactly where to add environment variables on different hosting platforms.

## 📋 Complete List of Required Variables

Copy this list and fill in your values:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Fury Road RC Club
```

## 📋 Optional Variables (Not Required Now)

Payment gateway variables - **Skip these for now** (payment is disabled):

```env
# Razorpay (Optional - Currently Disabled)
# RAZORPAY_KEY_ID=your-razorpay-key-id
# RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Stripe (Optional - Currently Disabled)
# STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
# STRIPE_SECRET_KEY=your-stripe-secret-key
# STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

---

## 🌐 Option 1: Vercel (Recommended)

### Step-by-Step Instructions:

1. **Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your account

2. **Select Your Project**
   - Click on your project name from the dashboard
   - (Or create a new project first by importing from GitHub)

3. **Navigate to Settings**
   - Click on **"Settings"** tab (top navigation)
   - Look for **"Environment Variables"** in the left sidebar
   - Click on **"Environment Variables"**

4. **Add Variables One by One**
   For each variable:
   - Click **"Add New"** button
   - **Key**: Enter the variable name (e.g., `DATABASE_URL`)
   - **Value**: Enter the variable value
   - **Environment**: Select where to apply:
     - ✅ **Production** (for live site)
     - ✅ **Preview** (for test deployments)
     - ✅ **Development** (optional, for local testing)
   - Click **"Save"**

5. **Repeat for All Variables**
   Add each variable from the list above.

### Visual Guide:

```
Vercel Dashboard
└── Your Project
    └── Settings (top nav)
        └── Environment Variables (left sidebar)
            └── Click "Add New"
                ├── Key: DATABASE_URL
                ├── Value: postgresql://...
                └── Environment: Production ✅
```

### Important Notes for Vercel:
- You can add variables **before or after** deployment
- After adding variables, you need to **redeploy**:
  - Go to **Deployments** tab
  - Click the **three dots** (⋯) on latest deployment
   - Click **"Redeploy"**
- Variables are encrypted and secure
- Use **Production** environment for your live site

---

## 🚂 Option 2: Railway

### Step-by-Step Instructions:

1. **Login to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Select Your Project**
   - Click on your project from dashboard

3. **Open Your Service**
   - Click on your web service (the service running your Next.js app)

4. **Go to Variables Tab**
   - Click on **"Variables"** tab (top navigation)
   - Or look for **"Variables"** in the left sidebar

5. **Add Variables**
   - Click **"New Variable"** or **"Raw Editor"** button
   - **Raw Editor** lets you paste multiple variables at once:
     ```
     DATABASE_URL=postgresql://...
     NEXTAUTH_URL=https://...
     ```
   - Or add one by one:
     - **Key**: Variable name
     - **Value**: Variable value
     - Click **"Add"**

6. **Redeploy** (if needed)
   - Railway auto-redeploys when you add variables
   - Or click **"Redeploy"** button manually

### Visual Guide:

```
Railway Dashboard
└── Your Project
    └── Your Service (Next.js app)
        └── Variables Tab (top nav)
            └── Click "New Variable" or "Raw Editor"
```

---

## ☁️ Option 3: Netlify

### Step-by-Step Instructions:

1. **Login to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in

2. **Select Your Site**
   - Click on your site from dashboard

3. **Go to Site Configuration**
   - Click **"Site configuration"** or **"Configuration"** in top nav
   - Look for **"Environment variables"** in the menu
   - Click **"Environment variables"**

4. **Add Variables**
   - Click **"Add variable"** button
   - **Key**: Variable name
   - **Value**: Variable value
   - **Scopes**: Select where to apply (Production, Deploy previews, Branch deploys)
   - Click **"Save"**

---

## 🐳 Option 4: Docker / Self-Hosted

If deploying with Docker or on your own server:

1. **Create `.env.production` file** in project root:
   ```bash
   cp env.example .env.production
   ```

2. **Edit `.env.production`**:
   ```env
   DATABASE_URL=your-production-database-url
   NEXTAUTH_URL=https://yourdomain.com
   # ... add all variables
   ```

3. **Use in Docker:**
   ```bash
   docker run -d --env-file .env.production -p 3000:3000 your-app
   ```

---

## 🔧 How to Get Each Variable Value

### 1. DATABASE_URL

**If using Supabase:**
1. Go to [supabase.com](https://supabase.com) → Your project
2. Click **Settings** → **Database**
3. Scroll to **Connection string**
4. Copy **Connection pooling** or **URI** connection string
5. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

**If using Railway PostgreSQL:**
1. Go to Railway → Your PostgreSQL database
2. Click **"Variables"** tab
3. Copy the `DATABASE_URL` value

**If using Neon:**
1. Go to [neon.tech](https://neon.tech) → Your project
2. Copy connection string from dashboard
3. Format: `postgresql://user:password@host/database`

### 2. NEXTAUTH_URL
- Use your domain: `https://yourdomain.com`
- Or use Vercel/Railway domain: `https://your-app.vercel.app`
- **Important**: Must start with `https://` in production

### 3. NEXTAUTH_SECRET
Generate a random secret:
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
-credential get-random -count 1 | Format-List

# Or use online generator:
# https://generate-secret.vercel.app/32
```

### 4. SMTP (Email) Variables

**For Gmail:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google Account Settings](https://myaccount.google.com/)
3. Click **Security** → **2-Step Verification** → **App passwords**
4. Generate app password for "Mail"
5. Use:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=your-email@gmail.com`
   - `SMTP_PASS=the-app-password-you-generated`

**For SendGrid:**
1. Create account at [sendgrid.com](https://sendgrid.com)
2. Go to Settings → API Keys
3. Create API key
4. Use:
   - `SMTP_HOST=smtp.sendgrid.net`
   - `SMTP_PORT=587`
   - `SMTP_USER=apikey`
   - `SMTP_PASS=your-api-key`

### 5. Payment Gateway Keys (OPTIONAL - Currently Disabled)

**⚠️ Skip this section - payment gateways are not needed now.**

When you're ready to enable payments later:

**Razorpay:**
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings** → **API Keys**
3. Generate/test key pair
4. Copy Key ID and Key Secret

**Stripe:**
1. Login to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API keys**
3. Copy Publishable key and Secret key
4. For webhook secret: Go to **Webhooks** → Create endpoint → Copy signing secret

### 6. App Configuration

- `NEXT_PUBLIC_APP_URL`: Same as `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_NAME`: `Fury Road RC Club`

---

## ✅ Verification Checklist

After adding all variables:

- [ ] All variables added to hosting platform
- [ ] `DATABASE_URL` points to production database
- [ ] `NEXTAUTH_URL` uses your actual domain (with https://)
- [ ] `NEXTAUTH_SECRET` is a long random string
- [ ] Email SMTP credentials are correct
- [ ] ~~Payment gateway keys~~ (Skipped - not needed now)
- [ ] Redeployed application after adding variables
- [ ] Checked application logs for any errors

---

## 🧪 Test Your Variables

After deployment, test that variables are working:

1. **Check Application Logs**
   - Vercel: Deployments → Click deployment → View logs
   - Railway: Deployments → Click deployment → View logs

2. **Test Database Connection**
   - Try registering a new user
   - Check if data saves to database

3. **Test Email**
   - Request password reset or signup
   - Check if email is received

4. **Test Authentication**
   - Login/logout should work
   - Sessions should persist

---

## ⚠️ Common Mistakes

1. **Forgetting `https://` in URLs**
   - ❌ Wrong: `http://yourdomain.com` or `yourdomain.com`
   - ✅ Correct: `https://yourdomain.com`

2. **Using Test/Development Keys in Production**
   - ~~Payment gateway keys~~ (Not applicable - payments disabled)

3. **Not Redeploying After Adding Variables**
   - Always redeploy after adding environment variables

4. **Typos in Variable Names**
   - Double-check spelling: `NEXTAUTH_SECRET` not `NEXTAUTH_KEY`

5. **Missing Quotes in Values**
   - Usually not needed, but if value has spaces, wrap in quotes

---

## 🔒 Security Tips

1. **Never commit `.env` files to Git**
2. **Use strong secrets** (especially for `NEXTAUTH_SECRET`)
3. **Rotate keys regularly**
4. **Don't share environment variables** in screenshots or emails
5. **Use different values for development and production**

---

## 📞 Need Help?

If you're stuck:
1. Check hosting platform documentation
2. Look at application logs for error messages
3. Verify each variable is spelled correctly
4. Ensure values don't have extra spaces

Good luck! 🚀

