# Admin Manual - RC Car Café

This manual provides comprehensive guidance for administrators managing the RC Car Café booking system.

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Management](#user-management)
3. [Game Management](#game-management)
4. [Booking Management](#booking-management)
5. [Points System](#points-system)
6. [Reports & Analytics](#reports--analytics)
7. [System Settings](#system-settings)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Initial Setup

1. **Access Admin Panel**
   - Navigate to `https://yourdomain.com/admin`
   - Sign in with admin credentials
   - Complete initial setup wizard

2. **First-Time Configuration**
   - Set up your first racing game
   - Configure pricing structure
   - Set up email templates
   - Create staff accounts

3. **Dashboard Overview**
   - View key metrics at a glance
   - Monitor recent activity
   - Quick access to common tasks

## User Management

### Customer Management

#### Viewing Customers
1. Navigate to **Admin → Users**
2. Filter by role: Customer
3. View customer details, booking history, and points

#### Customer Registration
Staff can register customers on-site:
1. Go to **Staff → Register Customer**
2. Fill in customer details
3. Customer receives login credentials via email

#### Customer Support
- **Reset Password**: Admin can reset customer passwords
- **Account Status**: Suspend/activate customer accounts
- **Booking History**: View all customer bookings
- **Points History**: Track point allocations and redemptions

### Staff Management

#### Adding Staff Members
1. Go to **Admin → Users → Add User**
2. Set role to "Staff"
3. Provide login credentials
4. Staff receives welcome email

#### Staff Permissions
Staff members can:
- Register new customers
- Allocate points to customers
- View and manage bookings
- Access staff dashboard

#### Staff Training
- Provide staff with login credentials
- Train on customer registration process
- Explain points allocation system
- Review booking management procedures

### Admin Accounts

#### Creating Additional Admins
1. Go to **Admin → Users → Add User**
2. Set role to "Admin"
3. Provide secure credentials
4. Grant full system access

#### Admin Security
- Use strong, unique passwords
- Enable two-factor authentication
- Regular password updates
- Monitor admin activity logs

## Game Management

### Creating Games

#### Basic Game Setup
1. Navigate to **Admin → Games → Add Game**
2. Fill in required information:
   - **Game Name**: e.g., "Racing Track 1"
   - **Description**: Brief description of the game
   - **Duration**: Game duration in minutes (default: 20)
   - **Price**: Price per player in ₹
   - **Max Players**: Maximum players per session (1-4)

#### Advanced Configuration
- **Active Status**: Enable/disable game availability
- **Special Pricing**: Set different rates for peak hours
- **Equipment Requirements**: Note any special equipment needed
- **Safety Instructions**: Add safety guidelines

### Pricing Management

#### Setting Base Prices
1. Go to **Admin → Games**
2. Edit existing games
3. Update pricing as needed
4. Changes apply to new bookings immediately

#### Dynamic Pricing
- **Peak Hours**: Higher rates during busy times
- **Group Discounts**: Reduced rates for multiple players
- **Seasonal Pricing**: Adjust rates for holidays/events
- **Member Pricing**: Special rates for loyalty members

### Game Maintenance

#### Regular Updates
- Update game descriptions
- Adjust pricing based on demand
- Add new games for variety
- Archive discontinued games

#### Equipment Tracking
- Monitor equipment usage
- Schedule maintenance
- Track replacement needs
- Update availability status

## Booking Management

### Viewing Bookings

#### All Bookings
1. Navigate to **Admin → Bookings**
2. View all bookings with filters:
   - Date range
   - Game type
   - Booking status
   - Customer name

#### Today's Schedule
- View today's bookings
- Check availability
- Monitor check-ins
- Track no-shows

### Booking Operations

#### Confirming Bookings
1. Find pending bookings
2. Verify payment status
3. Confirm booking details
4. Send confirmation email

#### Managing Cancellations
1. Process cancellation requests
2. Apply cancellation policy
3. Process refunds if applicable
4. Update availability

#### Rescheduling
1. Find booking to reschedule
2. Check new time availability
3. Update booking details
4. Notify customer of changes

### Payment Management

#### Payment Status
- **Pending**: Payment not yet received
- **Completed**: Payment successful
- **Failed**: Payment failed
- **Refunded**: Payment refunded

#### Refund Processing
1. Verify refund eligibility
2. Process through payment gateway
3. Update booking status
4. Send refund confirmation

## Points System

### Points Allocation

#### Automatic Points
- Configure automatic point rules
- Set points per booking
- Bonus points for milestones
- Special event points

#### Manual Points
1. Go to **Admin → Points**
2. Select customer
3. Enter point amount
4. Provide reason
5. Approve allocation

### Points Approval

#### Review Process
1. Navigate to **Admin → Points**
2. Filter by "Pending" status
3. Review point requests
4. Approve or reject with reason

#### Approval Criteria
- Verify customer eligibility
- Check point request validity
- Ensure fair distribution
- Maintain system integrity

### Points Redemption

#### Redemption Rules
- Set minimum redemption amounts
- Define redemption options
- Limit redemption frequency
- Track redemption history

#### Redemption Management
1. Process redemption requests
2. Verify customer points balance
3. Apply redemption to booking
4. Update points balance

## Reports & Analytics

### Financial Reports

#### Revenue Reports
1. Go to **Admin → Reports**
2. Select date range
3. View revenue breakdown:
   - Total revenue
   - Revenue by game
   - Revenue by period
   - Payment method breakdown

#### Booking Reports
- Total bookings
- Booking completion rate
- Cancellation rate
- Peak hours analysis

### Customer Analytics

#### Customer Insights
- New customer registrations
- Customer retention rate
- Average booking value
- Customer lifetime value

#### Points Analytics
- Points earned vs. redeemed
- Popular redemption options
- Points expiration tracking
- Customer engagement metrics

### Operational Reports

#### Staff Performance
- Staff activity logs
- Customer registrations by staff
- Points allocated by staff
- Booking management efficiency

#### System Usage
- Peak usage times
- Popular games
- Equipment utilization
- System performance metrics

## System Settings

### Global Configuration

#### Business Settings
1. Navigate to **Admin → Settings**
2. Configure:
   - Business name and logo
   - Contact information
   - Operating hours
   - Holiday schedules

#### Booking Settings
- Default booking duration
- Maximum advance booking time
- Cancellation policy
- No-show policy

### Email Configuration

#### Email Templates
1. Go to **Admin → Email Templates**
2. Customize templates:
   - Booking confirmation
   - Cancellation notice
   - Points approval
   - Password reset

#### SMTP Settings
- Configure email server
- Test email delivery
- Set up email monitoring
- Configure bounce handling

### Payment Settings

#### Payment Gateway Configuration
- Razorpay settings
- Stripe settings
- Webhook configuration
- Test payment processing

#### Refund Policy
- Set refund rules
- Configure processing time
- Define eligibility criteria
- Set up automated refunds

## Troubleshooting

### Common Issues

#### Booking Issues
**Problem**: Customer can't book a slot
**Solution**: 
1. Check game availability
2. Verify time slot is open
3. Check for system conflicts
4. Clear browser cache

**Problem**: Payment not processing
**Solution**:
1. Verify payment gateway status
2. Check customer payment method
3. Review error logs
4. Contact payment provider

#### User Management Issues
**Problem**: Staff can't access system
**Solution**:
1. Verify user account status
2. Check role permissions
3. Reset password if needed
4. Contact system administrator

**Problem**: Customer login issues
**Solution**:
1. Verify email address
2. Check account status
3. Reset password
4. Check for typos

#### Points System Issues
**Problem**: Points not showing up
**Solution**:
1. Check approval status
2. Verify allocation rules
3. Review system logs
4. Manual point adjustment

**Problem**: Points redemption failing
**Solution**:
1. Check points balance
2. Verify redemption rules
3. Check booking status
4. Review system settings

### System Maintenance

#### Regular Tasks
- **Daily**: Check system status, review bookings
- **Weekly**: Generate reports, review performance
- **Monthly**: Update pricing, analyze trends
- **Quarterly**: System updates, security review

#### Backup Procedures
- **Database**: Daily automated backups
- **Files**: Weekly file backups
- **Configuration**: Monthly settings backup
- **Testing**: Regular restore testing

#### Monitoring
- **Uptime**: Monitor system availability
- **Performance**: Track response times
- **Errors**: Monitor error rates
- **Security**: Review access logs

### Support Contacts

#### Technical Support
- **System Issues**: Contact development team
- **Payment Issues**: Contact payment provider
- **Email Issues**: Contact email service provider
- **Database Issues**: Contact database administrator

#### Business Support
- **Customer Complaints**: Handle through admin panel
- **Staff Training**: Schedule training sessions
- **Policy Questions**: Review business policies
- **Feature Requests**: Submit to development team

## Best Practices

### Security
- Use strong passwords
- Enable two-factor authentication
- Regular security updates
- Monitor access logs
- Backup data regularly

### Customer Service
- Respond to inquiries promptly
- Maintain professional communication
- Document all interactions
- Follow up on issues
- Gather customer feedback

### System Management
- Monitor system performance
- Regular maintenance
- Keep software updated
- Test new features
- Document procedures

### Staff Training
- Provide comprehensive training
- Regular refresher sessions
- Document procedures
- Encourage feedback
- Monitor performance

## Emergency Procedures

### System Outage
1. Notify customers immediately
2. Switch to manual booking if possible
3. Contact technical support
4. Document incident details
5. Implement recovery plan

### Data Loss
1. Stop all system operations
2. Assess data loss extent
3. Restore from backup
4. Verify data integrity
5. Notify affected users

### Security Breach
1. Secure the system immediately
2. Change all passwords
3. Notify relevant authorities
4. Document the incident
5. Implement security measures

## Conclusion

This admin manual provides comprehensive guidance for managing the RC Car Café booking system. Regular review and updates of procedures will ensure smooth operations and excellent customer service.

For additional support or questions not covered in this manual, please contact the development team or refer to the technical documentation.
