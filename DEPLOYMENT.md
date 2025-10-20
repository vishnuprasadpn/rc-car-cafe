# Deployment Guide - RC Car Café

This guide provides step-by-step instructions for deploying the RC Car Café application to production.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)
- Email service (Gmail, SendGrid, etc.)
- Payment gateway accounts (Razorpay/Stripe)

## Environment Setup

### 1. Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb rc_car_cafe

# Create user
sudo -u postgres createuser --interactive
```

#### Option B: Cloud Database (Recommended)
- **Supabase**: Free tier available, easy setup
- **Railway**: PostgreSQL hosting with automatic backups
- **AWS RDS**: Enterprise-grade database hosting
- **PlanetScale**: Serverless MySQL (requires schema migration)

### 2. Email Service Setup

#### Gmail SMTP
1. Enable 2-factor authentication
2. Generate app password
3. Use credentials in environment variables

#### SendGrid (Recommended for production)
1. Create SendGrid account
2. Generate API key
3. Configure SMTP settings

### 3. Payment Gateway Setup

#### Razorpay
1. Create Razorpay account
2. Get API keys from dashboard
3. Configure webhook URL: `https://yourdomain.com/api/payments/razorpay/webhook`

#### Stripe
1. Create Stripe account
2. Get API keys from dashboard
3. Configure webhook URL: `https://yourdomain.com/api/payments/stripe/webhook`

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment with automatic builds and deployments.

#### Steps:
1. **Connect Repository**
   - Push code to GitHub/GitLab
   - Connect repository to Vercel

2. **Configure Environment Variables**
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   NEXTAUTH_URL=https://yourdomain.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   RAZORPAY_KEY_ID=your-razorpay-key
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   STRIPE_PUBLISHABLE_KEY=your-stripe-key
   STRIPE_SECRET_KEY=your-stripe-secret
   STRIPE_WEBHOOK_SECRET=your-webhook-secret
   NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
   NEXT_PUBLIC_APP_NAME=RC Car Café
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Set up custom domain if needed

#### Vercel Configuration
Create `vercel.json`:
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXTAUTH_URL": "https://yourdomain.vercel.app"
  }
}
```

### Option 2: Railway

Railway provides full-stack deployment with database included.

#### Steps:
1. **Connect Repository**
   - Connect GitHub repository to Railway

2. **Add Database**
   - Add PostgreSQL service
   - Copy connection string

3. **Configure Environment Variables**
   - Add all required environment variables
   - Set `NEXTAUTH_URL` to Railway domain

4. **Deploy**
   - Railway will automatically build and deploy

### Option 3: DigitalOcean App Platform

#### Steps:
1. **Create App**
   - Connect GitHub repository
   - Select Node.js buildpack

2. **Add Database**
   - Add managed PostgreSQL database
   - Configure connection

3. **Set Environment Variables**
   - Add all required variables
   - Configure build settings

4. **Deploy**
   - Deploy application

### Option 4: AWS (Advanced)

#### Using AWS Amplify:
1. **Connect Repository**
   - Connect GitHub repository to Amplify

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Set Environment Variables**
   - Add all required variables

4. **Deploy**
   - Deploy application

#### Using EC2 + Docker:
1. **Launch EC2 Instance**
   - Use Ubuntu 20.04 LTS
   - Configure security groups

2. **Install Docker**
   ```bash
   sudo apt update
   sudo apt install docker.io
   sudo usermod -aG docker ubuntu
   ```

3. **Deploy with Docker**
   ```bash
   # Build image
   docker build -t rc-car-cafe .
   
   # Run container
   docker run -d -p 80:3000 --env-file .env rc-car-cafe
   ```

## Database Migration

### Using Prisma:
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate deploy
```

### Manual Database Setup:
```sql
-- Create database
CREATE DATABASE rc_car_cafe;

-- Create user
CREATE USER rc_cafe_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rc_car_cafe TO rc_cafe_user;
```

## SSL Certificate Setup

### Let's Encrypt (Free):
```bash
# Install Certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare (Recommended):
1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS encryption
4. Configure page rules

## Monitoring & Logging

### Application Monitoring:
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and error tracking

### Database Monitoring:
- **pgAdmin**: Database administration
- **DataDog**: Database performance monitoring
- **New Relic**: Full-stack monitoring

## Backup Strategy

### Database Backups:
```bash
# Daily backup script
#!/bin/bash
pg_dump rc_car_cafe > backup_$(date +%Y%m%d).sql
aws s3 cp backup_$(date +%Y%m%d).sql s3://your-backup-bucket/
```

### Application Backups:
- **Git**: Source code version control
- **Environment Variables**: Store securely in password manager
- **File Uploads**: Use cloud storage (AWS S3, Cloudinary)

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set secure environment variables
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] API key rotation
- [ ] Backup verification

## Performance Optimization

### Frontend:
- Enable Next.js Image Optimization
- Configure CDN (Cloudflare, AWS CloudFront)
- Implement caching strategies
- Optimize bundle size

### Backend:
- Database query optimization
- Implement Redis caching
- Use connection pooling
- Monitor API response times

### Database:
- Create appropriate indexes
- Regular VACUUM and ANALYZE
- Monitor query performance
- Consider read replicas for scaling

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**:
   - Verify connection string format
   - Check firewall settings
   - Ensure database is accessible

3. **Payment Integration Issues**:
   - Verify API keys are correct
   - Check webhook configuration
   - Test in sandbox mode first

4. **Email Delivery Issues**:
   - Check SMTP credentials
   - Verify sender email is authenticated
   - Check spam folder

### Debug Commands:
```bash
# Check application logs
npm run dev

# Test database connection
npx prisma db pull

# Verify environment variables
node -e "console.log(process.env.DATABASE_URL)"

# Test email sending
node scripts/test-email.js
```

## Maintenance

### Regular Tasks:
- [ ] Update dependencies monthly
- [ ] Monitor database performance
- [ ] Review security logs
- [ ] Backup verification
- [ ] SSL certificate renewal
- [ ] Performance optimization

### Monitoring Alerts:
- Database connection failures
- High error rates
- Slow response times
- Payment failures
- Email delivery issues

## Support

For deployment issues:
1. Check application logs
2. Verify environment configuration
3. Test database connectivity
4. Review security settings
5. Contact hosting provider support

## Cost Estimation

### Vercel (Recommended):
- **Hobby Plan**: Free (with limitations)
- **Pro Plan**: $20/month
- **Custom Domain**: $15/year

### Railway:
- **Starter Plan**: $5/month
- **Database**: $5/month
- **Custom Domain**: Included

### AWS:
- **EC2 t3.micro**: ~$8/month
- **RDS db.t3.micro**: ~$15/month
- **Route 53**: $0.50/month per hosted zone

### Total Estimated Cost: $20-50/month for small to medium usage
