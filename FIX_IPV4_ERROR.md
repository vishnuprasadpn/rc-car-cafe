# 🔧 Fix "Not IPv4 Compatible" Error

This error occurs when your system tries to resolve the database hostname to IPv6, but your network or system doesn't support it.

## ✅ Solution 1: Use Supabase Connection Pooling (Recommended)

Connection pooling URLs are more compatible and reliable.

### Steps:

1. **Go to Supabase Dashboard:**
   - Open [supabase.com](https://supabase.com)
   - Select your project
   - Go to **Settings** (gear icon) → **Database**

2. **Get Connection Pooling URL:**
   - Scroll to **"Connection string"** section
   - Click on **"Connection pooling"** tab
   - Select **"Session"** mode (for Prisma)
   - Copy the connection string
   - It looks like: `postgresql://postgres.gqxxxxx:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`

3. **Update .env file:**
   ```bash
   # Edit .env
   nano .env
   ```
   
   Replace `DATABASE_URL` with the pooled connection string:
   ```env
   DATABASE_URL="postgresql://postgres.gqxxxxx:Furyroadrc@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
   ```

4. **Test connection:**
   ```bash
   npx prisma db pull
   ```

✅ This should fix the IPv4 error!

---

## ✅ Solution 2: Force IPv4 with Direct Connection

If you want to keep using direct connection:

1. **Go to Supabase Dashboard:**
   - Settings → Database → Connection string
   - Copy the **"URI"** connection string

2. **Update .env with IPv4 parameters:**
   ```env
   DATABASE_URL="postgresql://postgres:Furyroadrc@db.zmtlfrsnjcnshqxcqbry.supabase.co:5432/postgres?sslmode=require&connect_timeout=10"
   ```

3. **Or resolve to IP address directly:**
   
   First, get the IPv4 address:
   ```bash
   dig +short db.zmtlfrsnjcnshqxcqbry.supabase.co A
   ```
   
   Then use IP directly in connection string:
   ```env
   DATABASE_URL="postgresql://postgres:Furyroadrc@[IP-ADDRESS]:5432/postgres?sslmode=require"
   ```

---

## ✅ Solution 3: Use Supabase Direct Connection with SSL

Add SSL and connection parameters:

```env
DATABASE_URL="postgresql://postgres:Furyroadrc@db.zmtlfrsnjcnshqxcqbry.supabase.co:5432/postgres?sslmode=require&application_name=fury_road_app"
```

---

## ✅ Solution 4: Create New Supabase Project (If Above Don't Work)

Sometimes starting fresh helps:

1. **Create New Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name: `fury-road-rc-club`
   - Region: `Asia Pacific (Mumbai)` or closest
   - Password: Create strong password
   - Wait 2-3 minutes

2. **Get Connection Pooling URL:**
   - Settings → Database → Connection pooling → Session mode
   - Copy connection string

3. **Update .env:**
   ```env
   DATABASE_URL="postgresql://postgres.gqxxxxx:NEW-PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
   ```

4. **Run migrations:**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

---

## 🧪 Test Connection After Fix

```bash
# Test if connection works
npx prisma db pull

# If successful, continue
npx prisma generate
npx prisma db push
npm run db:seed

# Start app
npm run dev
```

---

## 📝 Quick Reference

**Best Practice:** Always use **Connection Pooling** URL from Supabase for better reliability and compatibility.

**Connection Pooling Format:**
```
postgresql://postgres.gqxxxxx:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
```

**Direct Connection Format:**
```
postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

---

## ⚠️ Common Issues

1. **Still getting error?**
   - Make sure Supabase project is active (not paused)
   - Check password is correct in connection string
   - Try different network (mobile hotspot)

2. **Connection pooling port is 6543, not 5432**
   - This is normal - connection pooling uses port 6543
   - Direct connection uses port 5432

3. **"Authentication failed"**
   - Verify password in connection string matches Supabase
   - Check if password has special chars that need encoding

---

## 🎯 Recommended: Use Connection Pooling

**Why Connection Pooling is Better:**
- ✅ More reliable connections
- ✅ Better performance
- ✅ IPv4/IPv6 compatible
- ✅ Handles connection limits better
- ✅ Recommended by Supabase for production

**Get it from:** Supabase Dashboard → Settings → Database → Connection pooling → Session mode

