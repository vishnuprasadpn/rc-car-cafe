# Troubleshooting Google Analytics - No Data in Realtime

## Quick Checks

### 1. Verify Environment Variable

Check if the variable is set correctly:
```bash
# In your .env.local file, it should be:
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-3YGNXQ9MRP"
```

**Important:** 
- Must start with `NEXT_PUBLIC_` (for client-side access)
- No quotes needed in .env.local (but quotes are fine)
- No spaces around the `=`

### 2. Restart Development Server

After adding/changing environment variables:
```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

### 3. Check Browser Console

Open browser DevTools (F12) → Console tab:
- Look for any errors related to `gtag` or `GoogleAnalytics`
- Check if `window.gtag` is defined
- Look for network requests to `googletagmanager.com`

### 4. Verify Script is Loading

In browser DevTools → Network tab:
- Filter by "gtag" or "googletagmanager"
- You should see a request to: `https://www.googletagmanager.com/gtag/js?id=G-3YGNXQ9MRP`
- Status should be 200 (success)

### 5. Check Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Verify you're looking at the correct property
3. Check the Measurement ID matches: `G-3YGNXQ9MRP`
4. Make sure the property is active (not deleted)

### 6. Test in Incognito/Private Mode

- Ad blockers can block Google Analytics
- Try in incognito mode with extensions disabled
- Some privacy-focused browsers block tracking by default

## Debug Steps

### Step 1: Verify Component is Rendering

Check if the GoogleAnalytics component is actually in the DOM:

1. Open browser DevTools
2. Go to Elements/Inspector
3. Search for "gtag" or "googletagmanager"
4. You should see script tags in the `<head>` or `<body>`

### Step 2: Manual Test in Console

Open browser console and run:
```javascript
// Check if gtag is loaded
console.log(typeof window.gtag)

// Should output: "function"

// Manually send a test event
if (window.gtag) {
  window.gtag('event', 'test_event', {
    event_category: 'test',
    event_label: 'manual_test'
  })
  console.log('Test event sent!')
}
```

### Step 3: Check Network Tab

1. Open DevTools → Network
2. Filter: "gtag" or "collect"
3. Visit a page
4. You should see requests to:
   - `https://www.googletagmanager.com/gtag/js?id=G-3YGNXQ9MRP`
   - `https://www.google-analytics.com/g/collect?...`

### Step 4: Verify Environment Variable at Runtime

Add temporary debug code to check if variable is available:

In `src/app/layout.tsx`, temporarily add:
```tsx
{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
  <>
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    {/* Temporary debug - remove after testing */}
    <script dangerouslySetInnerHTML={{
      __html: `console.log('GA ID:', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}')`
    }} />
  </>
)}
```

Check browser console - you should see the ID logged.

## Common Issues

### Issue 1: Environment Variable Not Loading

**Symptoms:** Component doesn't render, no script tags

**Solution:**
- Make sure variable name is exactly `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Restart dev server after adding/changing
- For production, add in deployment platform settings

### Issue 2: Ad Blocker Blocking

**Symptoms:** Script loads but no data in GA

**Solution:**
- Disable ad blockers
- Test in incognito mode
- Check browser console for blocked requests

### Issue 3: Wrong Property/Measurement ID

**Symptoms:** Script loads but data goes to wrong property

**Solution:**
- Double-check Measurement ID: `G-3YGNXQ9MRP`
- Verify in Google Analytics Admin → Data Streams
- Make sure you're looking at the correct property in GA dashboard

### Issue 4: Production vs Development

**Symptoms:** Works locally but not in production

**Solution:**
- Add environment variable in deployment platform (Vercel, etc.)
- Make sure it's set for "Production" environment
- Redeploy after adding variable

### Issue 5: Delay in Realtime Reports

**Symptoms:** Everything looks correct but no data

**Solution:**
- Realtime data can take 10-30 seconds to appear
- Wait a bit and refresh the Realtime report
- Make sure you're in the correct property view

## Manual Verification

### Test 1: Check Script Tag

In browser, view page source (Ctrl+U or Cmd+Option+U):
- Search for "googletagmanager"
- Should find script tag with your Measurement ID

### Test 2: Check gtag Function

In browser console:
```javascript
// Check if gtag exists
console.log(window.gtag)

// Check dataLayer
console.log(window.dataLayer)
```

### Test 3: Send Test Event

```javascript
// If gtag exists, send test event
if (window.gtag) {
  window.gtag('event', 'page_view', {
    page_title: 'Test Page',
    page_location: window.location.href
  })
  console.log('✅ Test event sent!')
} else {
  console.log('❌ gtag not found')
}
```

## Alternative: Direct Script Implementation

If `@next/third-parties` isn't working, we can add the script directly:

1. Remove `GoogleAnalytics` component from layout
2. Add script tags directly in `layout.tsx` or use Next.js Script component

But first, let's try to fix the current implementation.

## Still Not Working?

1. **Check build output:**
   ```bash
   npm run build
   ```
   Look for any errors or warnings

2. **Check runtime:**
   - Open browser console
   - Look for errors
   - Check Network tab for failed requests

3. **Verify package:**
   ```bash
   npm list @next/third-parties
   ```
   Should show the package is installed

4. **Try clearing cache:**
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Restart dev server

