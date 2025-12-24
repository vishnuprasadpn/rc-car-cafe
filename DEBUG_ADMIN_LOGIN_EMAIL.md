# Debug Admin Login Test Email in Production

## 🔍 What Was Added

Comprehensive logging has been added to help debug why the admin login test email works locally but not in production.

## 📋 Logs to Check

### 1. Server Startup Logs

When the server starts, you should see:

```
✅ SMTP configuration detected
   SMTP_HOST: smtp.gmail.com
   SMTP_PORT: 587 (default)
   SMTP_USER: your-email@gmail.com
   SMTP_PASS: ✅ Set (hidden)
   Environment: production
```

OR if SMTP is not configured:

```
⚠️  SMTP NOT CONFIGURED - EMAIL DISABLED
⚠️  Required environment variables:
   - SMTP_HOST: ❌ MISSING
   - SMTP_USER: ❌ MISSING
   - SMTP_PASS: ❌ MISSING
```

### 2. SMTP Connection Verification

On startup, the system verifies SMTP connection:

**Success:**
```
✅ SMTP SERVER CONNECTION VERIFIED
✅ Environment: production
✅ SMTP_HOST: smtp.gmail.com
✅ SMTP_PORT: 587 (default)
✅ SMTP_USER: your-email@gmail.com
```

**Failure:**
```
❌ SMTP SERVER CONNECTION FAILED
❌ Environment: production
❌ Error: [error message]
❌ Check SMTP configuration:
   - SMTP_HOST: NOT SET
   - SMTP_PORT: NOT SET
   - SMTP_USER: NOT SET
   - SMTP_PASS: NOT SET
```

### 3. Admin Login Detection Logs

When an admin logs in, you'll see:

```
📧 ==========================================
📧 ADMIN LOGIN DETECTED - TRIGGERING TEST EMAIL
📧 ==========================================
📧 User: Admin Name (admin@email.com)
📧 Role: ADMIN
📧 Login Method: email/password
📧 ==========================================
```

### 4. Email Sending Process Logs

Detailed logs during email sending:

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
   From: "Fury Road RC Club" <your-email@gmail.com>
   To: furyroadrcclub@gmail.com, vishnuprasad1990@gmail.com
   Subject: 🔐 Admin Login Test - Admin Name logged in
📤 Verifying SMTP connection...
✅ SMTP connection verified successfully
📤 Sending email now...
✅ ==========================================
✅ Admin login test email sent successfully!
✅ ==========================================
✅ Message ID: <message-id>
✅ Response: 250 2.0.0 OK
✅ To: furyroadrcclub@gmail.com, vishnuprasad1990@gmail.com
✅ Duration: 1234ms
✅ ==========================================
```

### 5. Error Logs

If email fails, you'll see detailed error information:

```
❌ ==========================================
❌ ERROR SENDING ADMIN LOGIN TEST EMAIL
❌ ==========================================
❌ Error type: Error
❌ Error message: [specific error]
❌ Error name: [error name]
❌ Error stack: [full stack trace]
❌ SMTP Response: [if available]
❌ SMTP Response Code: [if available]
❌ SMTP Command: [if available]
❌ Error Code: [if available]
❌ Environment: production
❌ SMTP_HOST: smtp.gmail.com
❌ SMTP_USER: your-email@gmail.com
❌ SMTP_PASS: SET
❌ ==========================================
❌ Continuing with login despite email error...
❌ ==========================================
```

## 🔧 Common Issues and Fixes

### Issue 1: SMTP Not Configured

**Symptoms:**
- Logs show "SMTP NOT CONFIGURED"
- Transporter is null

**Fix:**
1. Check production environment variables:
   - `SMTP_HOST` (e.g., `smtp.gmail.com`)
   - `SMTP_USER` (your Gmail address)
   - `SMTP_PASS` (Gmail App Password)
   - `SMTP_PORT` (optional, defaults to 587)

2. In Vercel:
   - Go to Project Settings → Environment Variables
   - Add all SMTP variables
   - Redeploy

3. In Railway:
   - Go to Variables tab
   - Add all SMTP variables
   - Redeploy

### Issue 2: SMTP Connection Verification Fails

**Symptoms:**
- Logs show "SMTP SERVER CONNECTION FAILED"
- Error during verification

**Fix:**
1. **Gmail App Password:**
   - Enable 2-Step Verification
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use App Password (not regular password) in `SMTP_PASS`

2. **Check SMTP Settings:**
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `587` (or `465` for SSL)
   - `SMTP_USER`: Full Gmail address
   - `SMTP_PASS`: 16-character App Password

3. **Firewall/Network:**
   - Ensure production server can reach `smtp.gmail.com:587`
   - Check if port 587 is blocked

### Issue 3: Email Sends But Not Received

**Symptoms:**
- Logs show "Email sent successfully"
- But email not in inbox

**Fix:**
1. Check spam/junk folder
2. Check email filters
3. Verify recipient email addresses are correct
4. Check Gmail "All Mail" folder

### Issue 4: Timeout Errors

**Symptoms:**
- Error: "Connection timeout"
- Error: "Socket timeout"

**Fix:**
1. Increase timeout values (already set to 10 seconds)
2. Check network connectivity from production server
3. Verify SMTP server is accessible

## 📊 How to Check Logs

### Vercel
1. Go to your project dashboard
2. Click on "Deployments"
3. Click on latest deployment
4. Click "Functions" tab
5. Click on any function to see logs
6. Or use Vercel CLI: `vercel logs`

### Railway
1. Go to your project dashboard
2. Click on your service
3. Click "Deployments" tab
4. Click on latest deployment
5. View logs in real-time

### Local Development
- Check terminal where `npm run dev` is running
- All logs appear in console

## 🧪 Testing Steps

1. **Check Startup Logs:**
   - Verify SMTP configuration is detected
   - Verify SMTP connection is verified

2. **Log In as Admin:**
   - Use: `furyroadrcclub@gmail.com` / `FurY@2024`
   - Or: `vishnuprasad1990@gmail.com` / `Vpn@1991`

3. **Check Logs:**
   - Look for "ADMIN LOGIN DETECTED" message
   - Look for "ADMIN LOGIN TEST EMAIL - START" message
   - Check for any error messages

4. **Check Email:**
   - Check inbox for test email
   - Check spam folder
   - Verify email was sent (check logs for "Email sent successfully")

## 🔑 Key Environment Variables

Make sure these are set in production:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

## 📝 Next Steps

1. Deploy the updated code
2. Check server startup logs for SMTP configuration
3. Log in as admin
4. Check logs for email sending process
5. Share logs if email still doesn't work

The comprehensive logging will help identify exactly where the issue is occurring!

