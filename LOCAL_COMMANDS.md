# 🚀 Local Run Commands - RC Car Café

## Quick Start Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data (optional)
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```
- App runs at: **http://localhost:3000**
- Network access: **http://192.168.0.202:3000**

---

## All Available Commands

### Development
```bash
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server (after build)
```

### Database Commands
```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio (database GUI)
npm run db:seed          # Seed database with initial data
```

### Testing
```bash
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

### Code Quality
```bash
npm run lint             # Run ESLint
```

---

## Fixing Common Issues

### 1. Clear Next.js Cache (Fix ENOENT Errors)
```bash
# Remove .next directory to fix build manifest errors
rm -rf .next

# Restart dev server
npm run dev
```

### 2. Clean Install
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 3. Reset Database
```bash
# Reset and reseed database
npm run db:push -- --force-reset
npm run db:seed
```

### 4. Check Environment Variables
```bash
# Make sure .env.local exists
cp env.example .env.local

# Edit with your values
nano .env.local
```

---

## Development Workflow

### Daily Development
```bash
# 1. Start development server
npm run dev

# 2. In another terminal, open database GUI (optional)
npm run db:studio
# Opens at http://localhost:5555
```

### Before Committing
```bash
# 1. Run linter
npm run lint

# 2. Run tests
npm test

# 3. Build to check for errors
npm run build
```

---

## Troubleshooting Commands

### Check Node Version
```bash
node --version    # Should be 18+
```

### Check Database Connection
```bash
# Test Prisma connection
npx prisma db pull
```

### View Database
```bash
npm run db:studio
```

### Check Port Availability
```bash
# Check if port 3000 is in use
lsof -ti:3000

# Kill process on port 3000 if needed
kill -9 $(lsof -ti:3000)
```

---

## Default Login Credentials

After seeding the database:
- **Admin**: `admin@rccarcafe.com` / `admin123`
- **Staff**: `staff@rccarcafe.com` / `staff123`
- **Customer**: `customer@rccarcafe.com` / `customer123`

---

## Environment Variables Required

Create `.env.local` file with:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/rc_car_cafe"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
RAZORPAY_KEY_ID="your-key"
RAZORPAY_KEY_SECRET="your-secret"
STRIPE_PUBLISHABLE_KEY="your-key"
STRIPE_SECRET_KEY="your-secret"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="RC Car Café"
```

