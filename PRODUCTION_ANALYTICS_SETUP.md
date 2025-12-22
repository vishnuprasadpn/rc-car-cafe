# Fix: Google Analytics Not Working in Production

## Issue
Google Analytics works locally but not in production.

## Solution

### Step 1: Add Environment Variable in Production

**For Vercel:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Name:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** `G-3YGNXQ9MRP`
   - **Environment:** Select **Production** (and **Preview** if needed)
6. Click **Save**
7. **Redeploy** your application

**For Railway:**
1. Go to Railway dashboard
2. Select your project
3. Go to **Variables** tab
4. Add:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-3YGNXQ9MRP`
5. Redeploy

**For Other Platforms:**
- Add the environment variable in your platform's settings
- Make sure it's set for **Production** environment
- Redeploy after adding

### Step 2: Verify the Variable is Set

After redeploying, verify:
1. Visit your production site
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Run: `console.log(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)`
   - Should show: `G-3YGNXQ9MRP`
5. Go to **Network** tab
6. Filter by "gtag" or "googletagmanager"
7. You should see requests to:
   - `https://www.googletagmanager.com/gtag/js?id=G-3YGNXQ9MRP`
   - `https://www.google-analytics.com/g/collect?...`

### Step 3: Check Google Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to **Reports** → **Realtime**
4. Visit your production site
5. You should see data within 10-30 seconds

## Troubleshooting

### Still Not Working?

1. **Clear browser cache** and hard refresh (Ctrl+Shift+R)
2. **Check build logs** - ensure the variable is available during build
3. **Verify variable name** - must be exactly `NEXT_PUBLIC_GA_MEASUREMENT_ID`
4. **Check for typos** - Measurement ID should be `G-3YGNXQ9MRP`
5. **Wait a few minutes** - sometimes there's a delay in propagation

### Verify in Production

Check the page source (View Source or Inspect):
- Search for "googletagmanager"
- Should find script tags with your Measurement ID
- If not found, the environment variable isn't set

### Quick Test

Add this temporarily to a page to verify:
```tsx
{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
  <div>GA ID: {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}</div>
)}
```

If it shows the ID, the variable is set. If not, it's missing in production.

## Important Notes

- `NEXT_PUBLIC_` prefix is required for client-side access
- Variable must be set in **Production** environment (not just Preview)
- Must **redeploy** after adding environment variables
- Changes take effect after deployment completes

