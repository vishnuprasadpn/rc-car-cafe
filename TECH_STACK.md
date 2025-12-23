# Tech Stack & Architecture Overview

## 🏗️ Architecture Pattern

This application uses **Next.js 15 with App Router** - a **Full-Stack React Framework** that combines frontend and backend in a single codebase. This is a **monolithic architecture** where:

- **Frontend** and **Backend** are in the same Next.js application
- **API Routes** serve as the backend (serverless functions)
- **Server Components** and **Client Components** handle rendering
- **Database** is external (PostgreSQL via Supabase)

---

## 📦 Tech Stack Breakdown

### **Frontend Layer**

#### Core Framework
- **Next.js 15.5.9** (React Framework)
  - App Router (file-based routing)
  - Server Components & Client Components
  - Server-Side Rendering (SSR)
  - Static Site Generation (SSG)
  - API Routes (backend endpoints)

#### UI & Styling
- **React 19.1.0** (UI Library)
- **TypeScript 5** (Type Safety)
- **Tailwind CSS 3.4.18** (Utility-first CSS)
- **Lucide React** (Icon Library)
- **Radix UI** (Accessible Component Primitives)
  - Dialog, Dropdown Menu, Select, Tabs, Toast

#### Form Management
- **React Hook Form 7.65.0** (Form State Management)
- **Zod 4.1.12** (Schema Validation)
- **@hookform/resolvers** (Zod Integration)

---

### **Backend Layer** (Next.js API Routes)

#### API Architecture
- **Next.js API Routes** (`src/app/api/**/route.ts`)
  - Serverless functions that run on-demand
  - Each route file exports HTTP methods (GET, POST, PUT, DELETE)
  - Handles authentication, validation, and business logic

#### Authentication & Authorization
- **NextAuth.js 4.24.11** (Authentication Framework)
  - JWT-based sessions
  - Multiple providers:
    - **Credentials Provider** (Email/Password)
    - **Google OAuth Provider** (Social Login)
  - Role-based access control (CUSTOMER, STAFF, ADMIN)
  - Session management with Prisma Adapter

#### Database & ORM
- **Prisma 6.17.1** (ORM - Object-Relational Mapping)
  - Type-safe database client
  - Schema migrations
  - Query builder
- **PostgreSQL** (Relational Database)
  - Hosted on Supabase (cloud)
  - Connection pooling support

#### Password Security
- **bcryptjs 3.0.2** (Password Hashing)
  - Salts and hashes passwords
  - Secure password comparison

---

### **External Services**

#### Email Service
- **Nodemailer 7.0.7** (Email Sending)
  - SMTP configuration (Gmail, SendGrid, etc.)
  - Sends booking confirmations, password resets, notifications

#### Payment Gateways
- **Razorpay 2.9.6** (Payment Processing - India)
- **Stripe 19.1.0** (Payment Processing - Global)
  - Payment intents
  - Webhook handlers for payment verification

#### Analytics
- **Vercel Analytics** (Application Monitoring)
- **Google Analytics 4** (User Tracking)
  - Page views
  - Custom events (button clicks, form submissions, etc.)

---

### **Development Tools**

#### Testing
- **Jest 30.2.0** (Testing Framework)
- **React Testing Library** (Component Testing)
- **Jest DOM** (DOM Testing Utilities)

#### Code Quality
- **ESLint 9** (Linting)
- **TypeScript** (Type Checking)

#### Build Tools
- **Turbopack** (Next.js Fast Bundler)
- **PostCSS** (CSS Processing)
- **Autoprefixer** (CSS Vendor Prefixes)

---

## 🗄️ Database Schema

### Core Models

1. **User** - Users (Customers, Staff, Admins)
   - Email, name, phone, password (optional for OAuth)
   - Role-based access (CUSTOMER, STAFF, ADMIN)
   - OAuth account linking (Google)
   - Tracks authentication method and last login

2. **Game** - Racing games/tracks
   - Name, description, duration, price
   - Active/inactive status

3. **Booking** - Customer reservations
   - User, game, start/end time
   - Players count, total price
   - Status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
   - Payment status and payment ID

4. **Point** - Loyalty points system
   - User, amount, reason
   - Status (PENDING, APPROVED, REJECTED)
   - Approval workflow (approved by admin)

5. **Account** - OAuth account links (NextAuth)
6. **Session** - User sessions (NextAuth)
7. **PasswordResetToken** - Password reset codes
8. **StaffAction** - Audit trail of staff activities

---

## 🔄 How It Works

### **Request Flow**

```
1. User Request
   ↓
2. Next.js Router (App Router)
   ↓
3. Server Component / API Route
   ↓
4. Authentication Check (NextAuth)
   ↓
5. Authorization Check (Role-based)
   ↓
6. Business Logic
   ↓
7. Database Query (Prisma)
   ↓
8. External Services (Email, Payments)
   ↓
9. Response (JSON / HTML)
```

### **Authentication Flow**

#### Email/Password Login:
```
1. User submits credentials
2. API Route: /api/auth/[...nextauth]/route.ts
3. CredentialsProvider validates
4. bcryptjs compares password hash
5. NextAuth creates JWT session
6. Session stored in database (Prisma Adapter)
7. Cookie set in browser
8. User redirected to dashboard
```

#### Google OAuth Login:
```
1. User clicks "Continue with Google"
2. Redirects to Google OAuth consent screen
3. User authorizes
4. Google redirects back with authorization code
5. NextAuth exchanges code for tokens
6. Fetches user info from Google
7. Creates/links user account in database
8. Creates session
9. User redirected to dashboard
```

### **API Route Example** (Booking Creation)

```typescript
// src/app/api/bookings/route.ts

POST /api/bookings
├── 1. Check authentication (getServerSession)
├── 2. Validate request body (Zod schema)
├── 3. Check user authorization (role check)
├── 4. Business logic:
│   ├── Calculate booking duration
│   ├── Calculate total price
│   ├── Check time slot availability
│   └── Create booking record
├── 5. Database operation (Prisma):
│   └── prisma.booking.create()
├── 6. External services:
│   ├── Send email to customer (Nodemailer)
│   └── Send email to admin (Nodemailer)
└── 7. Return response (JSON)
```

---

## 🏛️ Project Structure

```
rc-car-cafe/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # Backend API Routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── bookings/      # Booking CRUD
│   │   │   ├── admin/         # Admin-only endpoints
│   │   │   └── staff/         # Staff endpoints
│   │   ├── auth/              # Auth pages (signin, signup)
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── staff/             # Staff dashboard pages
│   │   ├── dashboard/         # Customer dashboard
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── navigation.tsx    # Top navigation
│   │   ├── sidebar.tsx       # Sidebar navigation
│   │   └── footer.tsx         # Footer
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── prisma.ts         # Prisma client
│   │   ├── email.ts          # Email sending functions
│   │   └── analytics.ts      # Google Analytics
│   └── types/                # TypeScript types
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
├── public/                    # Static assets
└── package.json              # Dependencies
```

---

## 🔐 Security Features

1. **Authentication**
   - NextAuth.js with JWT sessions
   - Password hashing with bcryptjs
   - OAuth 2.0 for social login

2. **Authorization**
   - Role-based access control (RBAC)
   - Route protection (middleware)
   - API endpoint authorization checks

3. **Data Validation**
   - Zod schemas for all inputs
   - TypeScript for type safety
   - SQL injection prevention (Prisma ORM)

4. **Security Headers**
   - CSRF protection (NextAuth)
   - XSS protection (React)
   - Secure cookies

---

## 🚀 Deployment Architecture

### **Recommended: Vercel**
- **Serverless Functions**: API routes run as serverless functions
- **Edge Network**: Global CDN for static assets
- **Automatic Scaling**: Handles traffic spikes
- **Environment Variables**: Secure secret management

### **Database: Supabase (PostgreSQL)**
- **Cloud-hosted PostgreSQL**
- **Connection pooling** for serverless functions
- **Direct connection** for migrations/seeds

### **Email: SMTP (Gmail/SendGrid)**
- **Nodemailer** sends emails via SMTP
- **App Passwords** for Gmail
- **Templates** for different email types

---

## 📊 Data Flow Example: Booking Creation

```
┌─────────────┐
│   Browser   │
│  (React UI) │
└──────┬──────┘
       │ 1. User fills booking form
       │ 2. Submit POST /api/bookings
       ▼
┌─────────────────────┐
│  Next.js API Route  │
│ /api/bookings/route │
└──────┬──────────────┘
       │ 3. Authenticate user
       │ 4. Validate input (Zod)
       │ 5. Calculate price
       ▼
┌─────────────────────┐
│   Prisma Client     │
│   (Database ORM)    │
└──────┬──────────────┘
       │ 6. Create booking record
       ▼
┌─────────────────────┐
│   PostgreSQL DB     │
│   (Supabase)        │
└──────┬──────────────┘
       │ 7. Return booking data
       ▼
┌─────────────────────┐
│   Nodemailer        │
│   (Email Service)   │
└──────┬──────────────┘
       │ 8. Send emails
       │    - Customer confirmation
       │    - Admin notification
       ▼
┌─────────────────────┐
│   Response (JSON)   │
│   { booking: {...} }│
└─────────────────────┘
```

---

## 🎯 Key Technologies Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 | Full-stack React framework |
| **Language** | TypeScript | Type-safe development |
| **UI** | React 19 + Tailwind CSS | User interface |
| **Backend** | Next.js API Routes | Serverless API endpoints |
| **Database** | PostgreSQL (Supabase) | Data storage |
| **ORM** | Prisma | Database access layer |
| **Auth** | NextAuth.js | Authentication & sessions |
| **Validation** | Zod | Schema validation |
| **Forms** | React Hook Form | Form state management |
| **Email** | Nodemailer | Email sending |
| **Payments** | Razorpay + Stripe | Payment processing |
| **Analytics** | Google Analytics 4 | User tracking |
| **Deployment** | Vercel | Hosting platform |

---

## 💡 Why This Architecture?

1. **Monolithic but Scalable**
   - Single codebase for frontend + backend
   - Easy to develop and deploy
   - Can scale individual API routes

2. **Type Safety**
   - TypeScript throughout
   - Prisma generates types from schema
   - Zod validates runtime data

3. **Developer Experience**
   - Hot reload with Turbopack
   - File-based routing
   - Server Components reduce client bundle

4. **Performance**
   - Server-side rendering
   - Static generation where possible
   - Edge network (Vercel CDN)

5. **Security**
   - Built-in CSRF protection
   - SQL injection prevention (Prisma)
   - Secure authentication (NextAuth)

---

This architecture provides a modern, scalable, and maintainable full-stack application with a clear separation of concerns while keeping everything in a single codebase for easier development and deployment.

