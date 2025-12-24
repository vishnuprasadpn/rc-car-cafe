# How to Find Console and Debug

## 🌐 Browser Console (Client-Side Debugging)

### Chrome / Edge / Brave
1. **Method 1 (Keyboard):**
   - Press `F12` (Windows/Linux) or `Cmd + Option + J` (Mac)
   
2. **Method 2 (Right-click):**
   - Right-click anywhere on the page
   - Click **"Inspect"** or **"Inspect Element"**
   - Click the **"Console"** tab at the top

3. **Method 3 (Menu):**
   - Click the three dots (⋮) in top-right corner
   - Go to **More tools** > **Developer tools**
   - Click the **"Console"** tab

### Firefox
1. **Method 1 (Keyboard):**
   - Press `F12` (Windows/Linux) or `Cmd + Option + K` (Mac)
   
2. **Method 2 (Right-click):**
   - Right-click anywhere on the page
   - Click **"Inspect Element"**
   - Click the **"Console"** tab

### Safari (Mac)
1. **First, enable Developer menu:**
   - Go to **Safari** > **Settings** (or **Preferences**)
   - Click **Advanced** tab
   - Check **"Show features for web developers"**
   
2. **Then open console:**
   - Press `Cmd + Option + C`
   - Or go to **Develop** > **Show JavaScript Console**

## 📊 What to Look For in Browser Console

When debugging Google OAuth, look for:

### Success Messages:
```
🔵 Initiating Google OAuth sign-in...
```

### Error Messages:
```
❌ Failed to sign in with Google: ...
❌ OAuth error: ...
```

### Network Errors:
- Red text indicating failed requests
- 4xx or 5xx status codes

## 🖥️ Server Logs (Backend Debugging)

### Development (Local)
1. **Open your terminal** where you ran `npm run dev`
2. **Watch the output** - logs appear in real-time
3. Look for messages starting with:
   - `🔐` - Authentication events
   - `✅` - Success messages
   - `❌` - Error messages
   - `🔍` - Debug information

### Production (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Click **"Logs"** tab at the top
4. Filter by time or search for errors

### Production (Railway)
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your service
3. Click **"Logs"** tab
4. View real-time logs

### Production (Other Platforms)
- Check your deployment platform's logging section
- Usually found in Dashboard > Your Project > Logs

## 🔍 Network Tab (For OAuth Debugging)

### How to Open:
1. Open Developer Tools (`F12`)
2. Click **"Network"** tab (next to Console)
3. Try Google sign-in
4. Look for these requests:

#### Expected Requests:
1. `/api/auth/signin/google` - Should redirect (302)
2. `accounts.google.com/...` - Google OAuth page
3. `/api/auth/callback/google?code=...` - Callback with code

#### Check Status Codes:
- ✅ **200** or **302** = Success
- ❌ **400, 401, 403, 500** = Error

## 📱 Mobile Debugging

### Chrome (Android)
1. Connect phone to computer via USB
2. Enable USB debugging on phone
3. Open Chrome on computer
4. Go to `chrome://inspect`
5. Click "Inspect" on your device

### Safari (iOS)
1. Connect iPhone/iPad to Mac
2. On Mac: Safari > Develop > [Your Device] > [Your Page]
3. Console opens in Safari on Mac

## 🧪 Quick Test

1. **Open Browser Console** (`F12`)
2. **Type this and press Enter:**
   ```javascript
   console.log("Console is working!")
   ```
3. **You should see:** `Console is working!` printed

## 📋 Debugging Checklist

When debugging Google OAuth:

- [ ] Browser console open (`F12`)
- [ ] Network tab open (to see requests)
- [ ] Server logs visible (terminal or platform logs)
- [ ] Try Google sign-in
- [ ] Watch console for error messages
- [ ] Watch network tab for failed requests
- [ ] Watch server logs for backend errors

## 🎯 What to Share When Asking for Help

If you need help debugging, share:

1. **Browser Console Errors:**
   - Screenshot or copy the error messages
   - Look for red text

2. **Network Tab:**
   - Screenshot of failed requests
   - Status codes (400, 500, etc.)

3. **Server Logs:**
   - Copy error messages from terminal/logs
   - Look for `❌` or error messages

4. **What Happens:**
   - "Nothing happens when I click the button"
   - "I get redirected to an error page"
   - "I see an error message: ..."

## 💡 Pro Tips

1. **Clear Console:** Click the 🚫 icon or press `Ctrl+L` (Windows) / `Cmd+K` (Mac)
2. **Filter Logs:** Type in the filter box to search for specific messages
3. **Preserve Log:** Check "Preserve log" to keep logs after page navigation
4. **Copy Errors:** Right-click error message > Copy

## 🔗 Quick Links

- **Chrome DevTools:** [Chrome DevTools Guide](https://developer.chrome.com/docs/devtools/)
- **Firefox DevTools:** [Firefox DevTools Guide](https://firefox-source-docs.mozilla.org/devtools-user/)
- **Safari Web Inspector:** [Safari Web Inspector](https://developer.apple.com/safari/tools/)

