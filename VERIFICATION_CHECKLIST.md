# Production Environment Verification Checklist

## ✅ Environment Variables Checklist

Make sure you've added all these to your production environment (Vercel/Railway/etc.):

### Required Variables:
- [ ] `DATABASE_URL` - Your production PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
- [ ] `NEXTAUTH_SECRET` - A secure random string (generate with: `openssl rand -base64 32`)
- [ ] `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret
- [ ] `SMTP_HOST` - Email server (usually `smtp.gmail.com`)
- [ ] `SMTP_PORT` - Email port (usually `587`)
- [ ] `SMTP_USER` - Your email address
- [ ] `SMTP_PASS` - Your email app password
- [ ] `ADMIN_EMAIL` - Admin email (e.g., `furyroadrcclub@gmail.com`)
- [ ] `NEXT_PUBLIC_APP_URL` - Your production URL (same as NEXTAUTH_URL)
- [ ] `NEXT_PUBLIC_APP_NAME` - App name (e.g., `RC Car Café`)

## 🔍 Verification Steps

### 1. Check Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Verify all variables are set for **Production** environment
4. Make sure `NEXTAUTH_URL` matches your production URL exactly

### 2. Verify Google OAuth Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Verify **Authorized redirect URIs** includes:
   ```
   https://your-production-url.com/api/auth/callback/google
   ```
5. Verify **Authorized JavaScript origins** includes:
   ```
   https://your-production-url.com
   ```

### 3. Test Production Deployment

#### Test Google Sign-In:
1. Visit your production URL
2. Click "Continue with Google" on signup/signin page
3. Should redirect to Google and back successfully
4. Should create/login user and redirect to dashboard

#### Test Email Functionality:
1. Try password reset flow
2. Create a test booking
3. Verify emails are sent (check spam folder if needed)

#### Test Database Connection:
1. Sign in to your app
2. Navigate to dashboard
3. Verify data loads correctly
4. Try creating a booking

### 4. Check Vercel Analytics
1. Go to your Vercel project dashboard
2. Click on **Analytics** tab
3. Verify analytics data is being collected
4. Check for any errors or warnings

## 🚨 Common Issues & Solutions

### Issue: "redirect_uri_mismatch" Error
**Solution:**
- Ensure `NEXTAUTH_URL` in production exactly matches your production URL
- Verify redirect URI in Google Console matches: `{NEXTAUTH_URL}/api/auth/callback/google`
- Make sure both use `https://` (not `http://`)

### Issue: Google Sign-In Not Working
**Solution:**
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Verify OAuth consent screen is published (if using external users)
- Check browser console for specific error messages

### Issue: Database Connection Errors
**Solution:**
- Verify `DATABASE_URL` is correct for production database
- Check database is accessible from Vercel's IP ranges
- Ensure database connection pooling is configured (if using Supabase)

### Issue: Emails Not Sending
**Solution:**
- Verify `SMTP_USER` and `SMTP_PASS` are correct
- Check Gmail app password is generated correctly
- Verify `ADMIN_EMAIL` is set correctly
- Check spam folder for test emails

## 📊 Post-Deployment Monitoring

After deployment, monitor:
- [ ] Application logs in Vercel dashboard
- [ ] Analytics data collection
- [ ] Error rates
- [ ] Performance metrics
- [ ] User sign-ups and bookings

## 🔄 Next Steps

1. **Redeploy** if you just added environment variables
2. **Test** all critical flows (sign-up, sign-in, booking)
3. **Monitor** for the first 24-48 hours
4. **Set up alerts** for errors (if available in your plan)

## ✅ Success Indicators

Your production setup is complete when:
- ✅ Google sign-in works on production
- ✅ Users can create accounts
- ✅ Bookings can be created
- ✅ Emails are being sent
- ✅ Analytics data is being collected
- ✅ No console errors in browser
- ✅ All pages load correctly

