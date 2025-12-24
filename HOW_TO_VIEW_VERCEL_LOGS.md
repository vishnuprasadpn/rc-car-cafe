# How to View Logs in Vercel

## 🔍 Method 1: Vercel Dashboard (Recommended)

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in if needed

2. **Select Your Project**
   - Click on your project name (e.g., "rc-car-cafe")

3. **View Deployments**
   - Click on **"Deployments"** tab at the top
   - Or click on the latest deployment card

4. **Open Function Logs**
   - Click on the latest deployment
   - Click on **"Functions"** tab
   - You'll see a list of all API routes/functions
   - Click on any function (e.g., `/api/auth/[...nextauth]`)
   - Scroll down to see **"Function Logs"** section

5. **View Real-time Logs**
   - Logs appear in real-time when functions are called
   - You can filter by time range
   - Search for specific log messages

## 🔍 Method 2: Vercel CLI (Advanced)

### Install Vercel CLI:
```bash
npm install -g vercel
```

### Login:
```bash
vercel login
```

### View Logs:
```bash
# View logs for a specific deployment
vercel logs [deployment-url]

# Follow logs in real-time
vercel logs --follow

# View logs for a specific function
vercel logs --function /api/auth/[...nextauth]
```

## 🔍 Method 3: Direct Function Logs

1. Go to your project dashboard
2. Click on **"Deployments"**
3. Click on latest deployment
4. Look for **"View Function Logs"** button
5. This opens a dedicated logs view

## ⚠️ Important Notes

### Logs Only Appear When Functions Are Called

- **Server startup logs**: Appear when the first request hits the server
- **Admin login logs**: Appear when an admin actually logs in
- **Email logs**: Appear when email function is called

### What Vercel Shows:

✅ **Server-side logs** (API routes, server components):
- `console.log()` in API routes
- `console.error()` in API routes
- Server-side function logs

❌ **Client-side logs** (browser):
- `console.log()` in client components
- Browser console logs
- Use browser DevTools (F12) for these

## 📋 What to Look For

### When Server Starts (First Request):
```
✅ SMTP configuration detected
   SMTP_HOST: smtp.gmail.com
   SMTP_PORT: 587 (default)
   SMTP_USER: your-email@gmail.com
   SMTP_PASS: ✅ Set (hidden)
   Environment: production
```

OR if not configured:
```
⚠️  SMTP NOT CONFIGURED - EMAIL DISABLED
⚠️  Required environment variables:
   - SMTP_HOST: ❌ MISSING
   - SMTP_USER: ❌ MISSING
   - SMTP_PASS: ❌ MISSING
```

### When Admin Logs In:
```
📧 ==========================================
📧 ADMIN LOGIN DETECTED - TRIGGERING TEST EMAIL
📧 ==========================================
📧 User: Admin Name (admin@email.com)
📧 Role: ADMIN
📧 Login Method: email/password
📧 ==========================================
```

### Email Sending Process:
```
📧 ==========================================
📧 ADMIN LOGIN TEST EMAIL - START
📧 ==========================================
📧 Environment: production
📧 Admin Email: admin@email.com
📧 Admin Name: Admin Name
📧 Login Method: email/password
📧 Timestamp: 2024-01-01T12:00:00.000Z
📧 SMTP Configuration Check:
   SMTP_HOST: ✅ smtp.gmail.com
   SMTP_PORT: 587 (default)
   SMTP_USER: ✅ your-email@gmail.com
   SMTP_PASS: ✅ Set (hidden)
✅ SMTP transporter is configured
📧 Recipient emails: furyroadrcclub@gmail.com, vishnuprasad1990@gmail.com
📧 From email: your-email@gmail.com
📤 Preparing to send admin login test email via SMTP...
📤 Verifying SMTP connection...
✅ SMTP connection verified successfully
📤 Sending email now...
✅ ==========================================
✅ Admin login test email sent successfully!
✅ ==========================================
```

## 🔧 Troubleshooting: No Logs Appearing

### Issue 1: Logs Don't Show Up

**Possible Causes:**
1. Function hasn't been called yet
2. Looking at wrong deployment
3. Deployment not complete
4. Logs take a few seconds to appear

**Solutions:**
1. **Trigger an action**: Log in as admin to trigger logs
2. **Check deployment status**: Should be "Ready" (green)
3. **Refresh the page**: Logs might need a refresh
4. **Wait a few seconds**: Logs can take 5-10 seconds to appear
5. **Check latest deployment**: Make sure you're viewing the most recent one

### Issue 2: Can't Find Function Logs

**Solutions:**
1. Go to: Project → Deployments → Latest Deployment
2. Click on **"Functions"** tab (not "Overview")
3. Click on a function name (e.g., `/api/auth/[...nextauth]`)
4. Scroll down to see logs

### Issue 3: Only See Build Logs

**Solutions:**
1. Build logs are different from runtime logs
2. Runtime logs appear in **"Functions"** tab
3. Make sure you're looking at function logs, not build logs

### Issue 4: Logs Are Empty

**Possible Causes:**
1. Function hasn't been called
2. No console.log statements executed
3. Error occurred before logging

**Solutions:**
1. **Trigger the function**: Make a request that calls the function
2. **Check code**: Verify console.log statements are present
3. **Check for errors**: Look for error messages in logs

## 🧪 How to Trigger Logs

### To See Admin Login Logs:

1. **Go to your production site**
2. **Navigate to**: `/auth/signin`
3. **Log in as admin**:
   - Email: `furyroadrcclub@gmail.com`
   - Password: `FurY@2024`
   - OR
   - Email: `vishnuprasad1990@gmail.com`
   - Password: `Vpn@1991`

4. **Immediately check Vercel logs**:
   - Go to Vercel Dashboard
   - Open latest deployment
   - Click "Functions" tab
   - Click on `/api/auth/[...nextauth]` function
   - You should see logs appear within 5-10 seconds

### To See SMTP Configuration Logs:

1. **Make any API request** (this triggers server startup)
2. **Check logs** for SMTP configuration messages
3. **Or log in** (this will also trigger startup logs)

## 📊 Log Levels in Vercel

Vercel shows different log levels:
- **Info** (console.log): White/blue text
- **Warning** (console.warn): Yellow text
- **Error** (console.error): Red text

## 🔍 Search and Filter Logs

### In Vercel Dashboard:
1. Open function logs
2. Use the search box to filter logs
3. Search for keywords like:
   - "SMTP"
   - "ADMIN LOGIN"
   - "ERROR"
   - "Email"

### Time Range:
- Logs are shown for the last 24 hours by default
- You can change the time range
- Older logs might not be available (depends on plan)

## 💡 Pro Tips

1. **Keep logs open**: Open function logs before triggering actions
2. **Use search**: Search for specific keywords to find relevant logs
3. **Check multiple functions**: Logs might be in different functions
4. **Real-time monitoring**: Keep logs open while testing
5. **Copy logs**: Right-click to copy log messages for sharing

## 🚨 If Still No Logs

If you've tried everything and still don't see logs:

1. **Check environment variables**: Make sure they're set in Vercel
2. **Verify deployment**: Make sure latest code is deployed
3. **Check function execution**: Verify function is actually being called
4. **Contact Vercel support**: If logs should appear but don't

## 📝 Quick Checklist

- [ ] Deployment is complete and "Ready"
- [ ] Looking at latest deployment
- [ ] Clicked on "Functions" tab
- [ ] Clicked on a specific function
- [ ] Scrolled down to "Function Logs" section
- [ ] Triggered an action (like admin login)
- [ ] Waited 5-10 seconds for logs to appear
- [ ] Refreshed the page if needed

## 🔗 Direct Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs - Logs**: https://vercel.com/docs/observability/logs
- **Vercel CLI Docs**: https://vercel.com/docs/cli

