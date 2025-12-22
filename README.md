# RC Car Café - Indoor Racing Experience

A production-ready responsive web application for an indoor RC Car Café in Bangalore with comprehensive booking, payment, and management features.

## Features

### Customer Features
- **User Registration & Authentication**: Secure signup/login with role-based access
- **Game Booking**: Book racing slots with customizable duration and player count
- **Multiple Slot Booking**: Book multiple consecutive time slots
- **Points System**: Earn and redeem points for extra playtime
- **Payment Integration**: Secure online payments via Razorpay/Stripe
- **Email Notifications**: Booking confirmations and cancellation alerts

### Staff Features
- **Customer Registration**: Register new customers on-site
- **Points Allocation**: Allocate points to customers based on performance
- **Booking Management**: View and manage customer bookings
- **Dashboard**: Overview of daily operations and statistics

### Admin Features
- **Game Management**: CRUD operations for racing games and pricing
- **User Management**: Manage customers, staff, and admin accounts
- **Booking Management**: Full control over all bookings
- **Points Approval**: Review and approve customer point requests
- **Analytics & Reports**: Weekly/monthly performance reports
- **System Settings**: Configure global settings and pricing

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Razorpay, Stripe
- **Email**: Nodemailer with SMTP
- **Testing**: Jest, React Testing Library

## Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- SMTP email service (Gmail, SendGrid, etc.)
- Razorpay/Stripe account for payments

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rc-car-cafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in the required environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/rc_car_cafe"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Google OAuth (Optional - see GOOGLE_OAUTH_SETUP.md)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Email Configuration
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   
   # Razorpay
   RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
   
   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_NAME="RC Car Café"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main entities:

- **Users**: Customers, staff, and admin accounts
- **Games**: Racing games with configurable duration and pricing
- **Bookings**: Customer reservations with payment tracking
- **Points**: Customer loyalty points with approval workflow
- **Staff Actions**: Audit trail of staff activities
- **Email Templates**: Customizable email notifications
- **System Settings**: Global configuration options

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/session` - Get current session

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

### Games
- `GET /api/games` - Get available games
- `POST /api/admin/games` - Create game (admin)
- `PUT /api/admin/games/[id]` - Update game (admin)
- `DELETE /api/admin/games/[id]` - Delete game (admin)

### Payments
- `POST /api/payments/razorpay` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify Razorpay payment
- `POST /api/payments/stripe` - Create Stripe payment intent
- `POST /api/payments/stripe/webhook` - Stripe webhook handler

### Reports
- `GET /api/admin/reports` - Get analytics data (admin)

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Docker

1. **Build the Docker image**
   ```bash
   docker build -t rc-car-cafe .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 --env-file .env.local rc-car-cafe
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Admin Manual

### Getting Started

1. **Access Admin Panel**: Navigate to `/admin` and sign in with admin credentials
2. **Initial Setup**: Configure games, pricing, and system settings
3. **Create Staff Accounts**: Add staff members who can manage customers and bookings

### Game Management

1. **Add New Games**:
   - Go to Admin → Games
   - Click "Add Game"
   - Fill in game details (name, description, duration, price, max players)
   - Set as active/inactive

2. **Update Pricing**:
   - Edit existing games to change pricing
   - Changes apply to new bookings immediately

### User Management

1. **View All Users**: Admin → Users
2. **Create Staff Accounts**: Add new staff members
3. **Manage Customer Accounts**: View customer details and booking history

### Points System

1. **Review Pending Points**: Admin → Points
2. **Approve/Reject Points**: Review customer point requests
3. **View Points History**: Track all point allocations

### Reports & Analytics

1. **View Reports**: Admin → Reports
2. **Filter by Period**: Weekly, monthly, or custom date range
3. **Key Metrics**:
   - Total revenue
   - Booking statistics
   - Popular games
   - Customer growth

### Staff Operations

1. **Register Customers**: Staff can register new customers on-site
2. **Allocate Points**: Award points for good performance
3. **View Bookings**: Check today's schedule and manage bookings

## Security Features

- **Role-based Access Control**: Secure admin, staff, and customer areas
- **Input Validation**: All forms validated with Zod schemas
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: NextAuth.js provides CSRF protection
- **Secure Payments**: PCI-compliant payment processing

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check DATABASE_URL in environment variables
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Email Not Sending**:
   - Check SMTP configuration
   - Verify email credentials
   - Check spam folder

3. **Payment Issues**:
   - Verify Razorpay/Stripe keys
   - Check webhook configuration
   - Ensure HTTPS in production

### Support

For technical support or questions:
- Check the logs in the console
- Review the database for data consistency
- Verify all environment variables are set correctly

## License

This project is proprietary software. All rights reserved.

## Contributing

This is a private project. For any modifications or improvements, please contact the development team.