# Production Email Troubleshooting Guide

## 🔍 Issue: Admin Login Email Works Locally But Not in Production

This guide covers all possible reasons why email sending might fail in production (Vercel) but work locally.

## 📋 Common Issues and Solutions

### Issue 1: Environment Variables Not Set in Production

**Symptoms:**
- Email works locally
- No email in production
- Logs show "SMTP_NOT_CONFIGURED" or "SMTP transporter is null"

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these variables are set for **Production**:
   - `SMTP_HOST` (e.g., `smtp.gmail.com`)
   - `SMTP_PORT` (e.g., `587`)
   - `SMTP_USER` (your Gmail address)
   - `SMTP_PASS` (Gmail App Password - 16 characters)
3. **Important**: Make sure they're set for **Production** environment (not just Preview/Development)
4. **Redeploy** after adding/changing variables

**How to Check:**
- Look for logs: `❌ SMTP NOT CONFIGURED - EMAIL DISABLED`
- Check Vercel environment variables dashboard

---

### Issue 2: SMTP Connection Timeout in Serverless

**Symptoms:**
- Email works locally
- Timeout errors in production logs
- "Connection timeout" or "Socket timeout" errors

**Why It Happens:**
- Vercel serverless functions have cold starts
- Network latency to SMTP server
- Connection pooling doesn't work in serverless

**Solution:**
1. **Increase timeout values** (already set to 10 seconds):
   ```typescript
   connectionTimeout: 10000,
   greetingTimeout: 10000,
   socketTimeout: 10000,
   ```

2. **Use connection pooling service** (if needed):
   - Consider using a service like SendGrid, Mailgun, or Resend
   - These are optimized for serverless environments

3. **Check Vercel function timeout**:
   - Default is 10 seconds for Hobby plan
   - Pro plan allows up to 60 seconds
   - Check `vercel.json` for `maxDuration` settings

---

### Issue 3: Gmail App Password Issues

**Symptoms:**
- Works locally with same credentials
- Fails in production
- "Authentication failed" errors

**Why It Happens:**
- App Password might be expired
- 2-Step Verification disabled
- Wrong App Password used

**Solution:**
1. **Verify 2-Step Verification is enabled**:
   - Go to: https://myaccount.google.com/security
   - Ensure 2-Step Verification is ON

2. **Generate new App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Generate new password for "Mail"
   - Use the 16-character password (no spaces)

3. **Update in Vercel**:
   - Go to Environment Variables
   - Update `SMTP_PASS` with new App Password
   - Redeploy

4. **Verify format**:
   - App Password should be 16 characters
   - No spaces or dashes
   - Example: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

---

### Issue 4: Email Sent But Not Received

**Symptoms:**
- Logs show "Email sent successfully"
- But email not in inbox

**Why It Happens:**
- Email in spam folder
- Gmail filters blocking it
- Email address typo
- Rate limiting

**Solution:**
1. **Check spam/junk folder**
2. **Check Gmail "All Mail" folder**
3. **Verify recipient email** is correct: `vishnuprasad1990@gmail.com`
4. **Check Gmail filters**:
   - Settings → Filters and Blocked Addresses
   - Look for filters blocking emails
5. **Check sender reputation**:
   - Gmail might be blocking if sender is new
   - Try sending from a verified domain

---

### Issue 5: Async Email Sending Fails Silently

**Symptoms:**
- No errors in logs
- Email just doesn't send
- Function completes successfully

**Why It Happens:**
- Email is sent asynchronously (doesn't block login)
- Errors are caught but might not be logged properly
- Promise rejection not handled

**Current Implementation:**
```typescript
sendAdminLoginTestEmail(...).catch((error) => {
  console.error("❌ FAILED TO SEND ADMIN LOGIN TEST EMAIL")
  // Error is logged but doesn't fail login
})
```

**Solution:**
1. **Check Vercel logs** for error messages:
   - Look for "❌ FAILED TO SEND ADMIN LOGIN TEST EMAIL"
   - Check for SMTP errors

2. **Add more detailed error logging**:
   - Already implemented with comprehensive logging
   - Check logs for specific error messages

3. **Test email sending separately**:
   - Create a test endpoint to verify email works
   - Call it directly to isolate the issue

---

### Issue 6: Vercel Function Cold Start Issues

**Symptoms:**
- Email works sometimes
- Fails on first request after inactivity
- Works after warm-up

**Why It Happens:**
- Serverless functions have cold starts
- First request takes longer
- SMTP connection might timeout during cold start

**Solution:**
1. **Keep functions warm** (Pro plan feature):
   - Use Vercel Cron Jobs to ping functions
   - Or use external service to keep functions warm

2. **Increase timeout**:
   - Already set to 10 seconds
   - Consider upgrading to Pro plan for 60 seconds

3. **Use edge functions** (if applicable):
   - Some email services support edge functions
   - Faster cold starts

---

### Issue 7: Network/Firewall Restrictions

**Symptoms:**
- Works locally
- Fails in production
- Connection refused errors

**Why It Happens:**
- Vercel's network might be blocked
- Gmail SMTP might block serverless IPs
- Firewall rules

**Solution:**
1. **Check Gmail security settings**:
   - Allow "Less secure app access" (if still available)
   - Or use App Password (recommended)

2. **Verify SMTP port**:
   - Port 587 (TLS) should work
   - Port 465 (SSL) might have issues
   - Current: Port 587

3. **Check Vercel IP restrictions**:
   - Gmail might block Vercel IPs
   - Consider using email service (SendGrid, etc.)

---

### Issue 8: Environment Variable Format Issues

**Symptoms:**
- Variables set but not working
- Wrong values being used

**Why It Happens:**
- Trailing spaces
- Quotes in values
- Wrong environment selected

**Solution:**
1. **Check variable format in Vercel**:
   - No quotes needed: `smtp.gmail.com` (not `"smtp.gmail.com"`)
   - No trailing spaces
   - Case-sensitive

2. **Verify environment selection**:
   - Production variables apply to production
   - Preview variables apply to preview deployments
   - Development variables apply to local dev

3. **Redeploy after changes**:
   - Environment variables require redeployment
   - Changes don't apply to running functions

---

### Issue 9: Rate Limiting

**Symptoms:**
- Works initially
- Fails after multiple logins
- "Too many requests" errors

**Why It Happens:**
- Gmail has rate limits
- Too many emails sent quickly
- Account flagged for suspicious activity

**Solution:**
1. **Check Gmail rate limits**:
   - Free Gmail: ~500 emails/day
   - Check if limit is reached

2. **Implement rate limiting**:
   - Don't send email on every login
   - Only send once per hour/day
   - Or use email service with higher limits

3. **Check Gmail account status**:
   - Go to: https://myaccount.google.com/security
   - Check for security alerts
   - Verify account is not restricted

---

### Issue 10: Code Not Deployed

**Symptoms:**
- Changes work locally
- Production still has old code
- Old behavior persists

**Why It Happens:**
- Code not pushed to git
- Deployment failed
- Cached build

**Solution:**
1. **Verify deployment**:
   - Check Vercel Dashboard → Deployments
   - Ensure latest commit is deployed
   - Check deployment status (should be "Ready")

2. **Clear cache**:
   - Vercel caches builds
   - Force redeploy: Settings → Clear Build Cache

3. **Verify code is in git**:
   - Check GitHub repository
   - Ensure latest code is pushed

---

## 🔍 Diagnostic Checklist

Use this checklist to identify the issue:

- [ ] **Environment Variables Set?**
  - Check Vercel Dashboard → Environment Variables
  - Verify all SMTP variables are set for Production
  - No typos or missing values

- [ ] **SMTP Configuration Correct?**
  - `SMTP_HOST`: `smtp.gmail.com`
  - `SMTP_PORT`: `587`
  - `SMTP_USER`: Full Gmail address
  - `SMTP_PASS`: 16-character App Password (no spaces)

- [ ] **Gmail Account Ready?**
  - 2-Step Verification enabled
  - App Password generated
  - Account not restricted

- [ ] **Deployment Status?**
  - Latest code deployed
  - Deployment status: "Ready"
  - No build errors

- [ ] **Logs Checked?**
  - Check Vercel logs for errors
  - Look for "SMTP NOT CONFIGURED"
  - Look for connection errors
  - Look for authentication errors

- [ ] **Email Actually Sent?**
  - Check logs for "Email sent successfully"
  - Check spam folder
  - Check Gmail "All Mail"

- [ ] **Network Issues?**
  - Check for timeout errors
  - Check for connection refused
  - Verify SMTP port is accessible

---

## 🧪 Testing Steps

### Step 1: Verify Environment Variables

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Verify all SMTP variables are set
3. Check they're set for **Production** environment
4. Note: Changes require redeployment

### Step 2: Check Vercel Logs

1. Log in as admin on production site
2. Immediately check Vercel logs:
   - Dashboard → Deployments → Latest → Functions → `/api/auth/[...nextauth]`
3. Look for:
   - `📧 ADMIN LOGIN DETECTED`
   - `📧 ADMIN LOGIN TEST EMAIL - START`
   - `✅ Email sent successfully` OR `❌ Error`

### Step 3: Test SMTP Connection

Create a test endpoint to verify SMTP works:

```typescript
// /api/test-email
export async function GET() {
  // Test SMTP connection
  // Send test email
  // Return result
}
```

### Step 4: Verify Gmail Settings

1. Go to: https://myaccount.google.com/security
2. Verify 2-Step Verification is ON
3. Go to: https://myaccount.google.com/apppasswords
4. Generate new App Password if needed
5. Update in Vercel

---

## 🚨 Most Likely Issues (Priority Order)

1. **Environment Variables Not Set** (90% of cases)
   - Variables not set in Vercel
   - Set for wrong environment
   - Typos in variable names

2. **Gmail App Password Issues** (80% of cases)
   - Wrong App Password
   - 2-Step Verification disabled
   - App Password expired

3. **Email in Spam** (70% of cases)
   - Email sent but in spam folder
   - Gmail filters blocking
   - Check spam/junk folder

4. **SMTP Connection Timeout** (30% of cases)
   - Serverless cold start
   - Network latency
   - Timeout too short

5. **Code Not Deployed** (20% of cases)
   - Latest code not deployed
   - Old version still running
   - Cache issues

---

## 💡 Recommended Solutions

### Quick Fix (Most Common):

1. **Verify Environment Variables in Vercel**
2. **Generate New Gmail App Password**
3. **Update SMTP_PASS in Vercel**
4. **Redeploy**

### Long-term Solution:

Consider using a dedicated email service:
- **Resend** (recommended for Next.js)
- **SendGrid**
- **Mailgun**
- **AWS SES**

These services are:
- Optimized for serverless
- Better deliverability
- Higher rate limits
- Better error handling

---

## 📞 Next Steps

1. **Check Vercel logs** after admin login
2. **Verify environment variables** are set correctly
3. **Check spam folder** for emails
4. **Generate new App Password** if needed
5. **Redeploy** after making changes

If issue persists, share:
- Vercel logs output
- Environment variable status (without values)
- Error messages from logs

