# Vercel Logs Troubleshooting Guide

## 🔍 If Logs Are Not Showing in Vercel

### Step 1: Verify Function Is Being Called

1. **Create a test endpoint** (already created: `/api/test-logs`)
2. **Call it from your browser**:
   ```
   https://your-domain.com/api/test-logs
   ```
3. **Check Vercel logs immediately after calling**

### Step 2: Check Vercel Dashboard Location

**Correct Path:**
1. Vercel Dashboard → Your Project
2. **Deployments** tab (top menu)
3. Click on **latest deployment** (green "Ready" status)
4. **Functions** tab (NOT "Overview")
5. Click on `/api/test-logs` function
6. Scroll down to **"Function Logs"** section

**Common Mistakes:**
- ❌ Looking at "Overview" tab (shows build logs, not runtime logs)
- ❌ Looking at old deployment
- ❌ Not clicking on specific function
- ❌ Not scrolling down to "Function Logs" section

### Step 3: Verify Logs Are Actually Being Generated

**Test with the test endpoint:**

1. **Open Vercel Dashboard** in one tab
2. **Navigate to**: Latest Deployment → Functions → `/api/test-logs`
3. **Keep logs open**
4. **In another tab**, visit: `https://your-domain.com/api/test-logs`
5. **Go back to Vercel tab** - logs should appear within 5-10 seconds

**Expected Output:**
```
🔵 ==========================================
🔵 TEST LOGS ENDPOINT CALLED
🔵 ==========================================
🔵 Timestamp: 2024-01-01T12:00:00.000Z
🔵 Environment: production
🔵 Vercel Region: iad1
🔵 SMTP Configuration:
   SMTP_HOST: smtp.gmail.com
   SMTP_PORT: 587 (default)
   SMTP_USER: your-email@gmail.com
   SMTP_PASS: ✅ SET
🔵 Other Environment Variables:
   DATABASE_URL: ✅ SET
   NEXTAUTH_URL: https://your-domain.com
   ...
🔵 ==========================================
✅ If you see this in Vercel logs, logging is working!
🔵 ==========================================
```

### Step 4: Check Vercel Plan Limitations

**Free/Hobby Plan:**
- Logs available for 24 hours
- Real-time logs available
- Function logs visible

**Pro Plan:**
- Extended log retention
- More detailed logs
- Better search functionality

**If you're on free plan:**
- Logs are available, just check recent deployments
- Make sure you're looking at logs within 24 hours

### Step 5: Alternative Ways to View Logs

#### Method 1: Vercel CLI (Most Reliable)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# View logs for your project
vercel logs --follow

# View logs for specific function
vercel logs --function /api/test-logs

# View logs for latest deployment
vercel logs [your-project-name]
```

#### Method 2: Check Build Logs vs Runtime Logs

**Build Logs:**
- Show during deployment
- Found in "Overview" tab
- Show build errors, not runtime logs

**Runtime Logs:**
- Show when functions execute
- Found in "Functions" tab → Specific function → "Function Logs"
- This is what you need!

#### Method 3: Use Vercel's Real-time Logs

1. Go to Project Settings
2. Look for "Logs" or "Observability" section
3. Enable real-time logging
4. View logs in real-time dashboard

### Step 6: Verify Environment Variables

**If logs show "NOT SET" for env vars:**

1. Go to Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**
3. Verify all variables are set:
   - `SMTP_HOST`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - etc.

4. **Important**: Make sure variables are set for **Production** environment
5. **Redeploy** after adding/changing variables

### Step 7: Check Function Execution

**Verify function is actually being called:**

1. **Add a simple response** to verify function executes:
   ```typescript
   return NextResponse.json({ message: "Function executed" })
   ```

2. **Call the endpoint** and check response
3. **If response works but no logs**, there's a logging issue
4. **If no response**, function isn't being called

### Step 8: Common Issues and Fixes

#### Issue: "No logs found"

**Possible Causes:**
- Function hasn't been called yet
- Looking at wrong deployment
- Logs haven't loaded yet

**Fix:**
- Call the function first
- Wait 5-10 seconds
- Refresh the page
- Check latest deployment

#### Issue: "Only see build logs"

**Fix:**
- Go to "Functions" tab, not "Overview"
- Click on specific function
- Scroll to "Function Logs" section

#### Issue: "Logs appear but are empty"

**Possible Causes:**
- console.log not executing
- Error before logging
- Function timing out

**Fix:**
- Check function code for errors
- Verify console.log statements exist
- Check function timeout settings

#### Issue: "Can't find Functions tab"

**Possible Causes:**
- Deployment not complete
- Wrong Vercel project
- Old Vercel interface

**Fix:**
- Wait for deployment to complete
- Verify you're in correct project
- Try refreshing page

### Step 9: Test Admin Login Logs

**After verifying test endpoint works:**

1. **Log in as admin** on production site
2. **Immediately check Vercel logs**:
   - Go to: Latest Deployment → Functions → `/api/auth/[...nextauth]`
   - Look for "ADMIN LOGIN DETECTED" messages
   - Check for email sending logs

3. **If you see test logs but not admin login logs:**
   - Admin login might be using different function
   - Check all functions in Functions tab
   - Look for any function with "auth" in name

### Step 10: Contact Vercel Support

**If nothing works:**

1. **Verify you have access** to the project
2. **Check Vercel status page** for issues
3. **Contact Vercel support** with:
   - Project name
   - Deployment URL
   - Screenshot of where you're looking
   - What you expect to see

## 🧪 Quick Diagnostic Test

**Run this test to verify logging works:**

1. **Call test endpoint**: `https://your-domain.com/api/test-logs`
2. **Check response**: Should return JSON with success: true
3. **Check Vercel logs**: Should see detailed log output
4. **If both work**: Logging is working, check admin login function
5. **If test fails**: There's a logging configuration issue

## 📋 Checklist

- [ ] Test endpoint (`/api/test-logs`) returns success
- [ ] Vercel Dashboard → Latest Deployment → Functions tab
- [ ] Clicked on specific function (`/api/test-logs`)
- [ ] Scrolled to "Function Logs" section
- [ ] Called endpoint while logs are open
- [ ] Waited 5-10 seconds
- [ ] Refreshed if needed
- [ ] Checked environment variables are set
- [ ] Verified deployment is "Ready" (green)
- [ ] Tried Vercel CLI as alternative

## 🔗 Useful Links

- **Vercel Logs Docs**: https://vercel.com/docs/observability/logs
- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Vercel Support**: https://vercel.com/support

## 💡 Pro Tip

**Use Vercel CLI for most reliable log viewing:**

```bash
vercel logs --follow
```

This shows real-time logs in your terminal, which is often more reliable than the dashboard.

