# Deploy to Production - Quick Guide

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Connect Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import your GitHub repository: `vishnuprasadpn/rc-car-cafe`
4. Vercel will auto-detect Next.js settings

### Step 2: Configure Environment Variables
In Vercel project settings, add these environment variables:

```env
# Database
DATABASE_URL=your-production-database-url

# NextAuth
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Email
ADMIN_EMAIL=furyroadrcclub@gmail.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_NAME=RC Car Café
```

**Important:** 
- Replace `your-app-name.vercel.app` with your actual Vercel URL after first deployment
- Make sure to select **Production** environment for all variables

### Step 3: Deploy
1. Click **Deploy**
2. Wait for build to complete
3. Your app will be live at `https://your-app-name.vercel.app`

### Step 4: Update Google OAuth
After deployment, update Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials → Your OAuth Client
3. Add **Authorized redirect URI**: `https://your-app-name.vercel.app/api/auth/callback/google`
4. Add **Authorized JavaScript origin**: `https://your-app-name.vercel.app`
5. Save

### Step 5: Update NEXTAUTH_URL
1. Go back to Vercel → Settings → Environment Variables
2. Update `NEXTAUTH_URL` to your actual Vercel URL
3. Redeploy

---

## Option 2: Deploy via Vercel CLI

### Step 1: Login to Vercel
```bash
npx vercel login
```

### Step 2: Deploy
```bash
npx vercel --prod
```

### Step 3: Set Environment Variables
```bash
# Set each variable
npx vercel env add DATABASE_URL production
npx vercel env add NEXTAUTH_URL production
npx vercel env add NEXTAUTH_SECRET production
npx vercel env add GOOGLE_CLIENT_ID production
npx vercel env add GOOGLE_CLIENT_SECRET production
# ... add all other variables
```

### Step 4: Redeploy
```bash
npx vercel --prod
```

---

## Post-Deployment Checklist

- [ ] All environment variables are set in Vercel
- [ ] `NEXTAUTH_URL` matches your production URL
- [ ] Google OAuth redirect URIs are updated
- [ ] Database connection is working
- [ ] Test Google sign-in on production
- [ ] Test email sending
- [ ] Test booking creation
- [ ] Check Vercel Analytics

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Prisma schema is correct

### OAuth Not Working
- Verify `NEXTAUTH_URL` matches production URL exactly
- Check Google OAuth redirect URIs
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- Ensure connection pooling is configured (if using Supabase)

## Need Help?

Check the main `DEPLOYMENT.md` file for detailed instructions.

