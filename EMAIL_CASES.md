# Email Cases - Fury Road RC Club

This document lists all cases where emails are sent in the application.

## Email Functions Available

1. **sendBookingRequestEmail** - Sent to customer when booking is created
2. **sendBookingConfirmationEmail** - Sent to customer when admin confirms booking
3. **sendBookingCancellationEmail** - Sent to customer when booking is cancelled (not currently used)
4. **sendPointsApprovalEmail** - Sent to customer when points are approved (defined but not currently called)
5. **sendBookingNotificationToAdmin** - Sent to admin(s) when new booking is created
6. **sendPasswordResetCodeEmail** - Sent to user when password reset is requested

---

## 1. Booking Request Email (Customer)

**When:** When a customer creates a new booking

**Trigger:** `POST /api/bookings` - After booking is successfully created

**Recipient:** Customer (the user who made the booking)

**Email Function:** `sendBookingRequestEmail()`

**Content:**
- Subject: "Booking Request Received - [Game Name] at Fury Road RC Club"
- Booking details (game, date/time, duration, players, amount, booking ID)
- Status: Pending Confirmation
- Next steps message

**Location:** `src/app/api/bookings/route.ts` (lines 154-175)

---

## 2. Booking Notification Email (Admin)

**When:** When a customer creates a new booking

**Trigger:** `POST /api/bookings` - After booking is successfully created

**Recipients:** 
- `furyroadrcclub@gmail.com`
- `vishnuprasad1990@gmail.com`
- `process.env.ADMIN_EMAIL` (if set and different from above)

**Email Function:** `sendBookingNotificationToAdmin()`

**Content:**
- Subject: "New Booking Request - [Game Name] at Fury Road RC Club"
- Customer details (name, email, phone)
- Booking details (game, date/time, duration, players, amount, booking ID)
- Action required message

**Location:** `src/app/api/bookings/route.ts` (lines 177-200)

---

## 3. Booking Confirmation Email (Customer)

**When:** When admin confirms a pending booking

**Trigger:** `POST /api/admin/bookings/[id]/confirm` - When admin confirms booking

**Recipient:** Customer (the user who made the booking)

**Email Function:** `sendBookingConfirmationEmail()`

**Content:**
- Subject: "Booking Confirmed - [Game Name] at Fury Road RC Club"
- Booking details (game, date/time, duration, players, amount, booking ID)
- Confirmation message
- Arrival instructions

**Location:** `src/app/api/admin/bookings/[id]/confirm/route.ts` (lines 62-83)

---

## 4. Password Reset Code Email (User)

**When:** When a user requests password reset

**Trigger:** `POST /api/auth/forgot-password` - When user submits forgot password form

**Recipient:** User (the email address requesting password reset)

**Email Function:** `sendPasswordResetCodeEmail()`

**Content:**
- Subject: "Password Reset Code - Fury Road RC Club"
- 6-digit reset code (expires in 15 minutes)
- Security notice

**Location:** `src/app/api/auth/forgot-password/route.ts` (line 110)

---

## 5. Points Approval Email (Customer) - NOT CURRENTLY USED

**When:** When admin approves points for a customer

**Trigger:** Currently not implemented (function exists but not called)

**Recipient:** Customer (the user receiving points)

**Email Function:** `sendPointsApprovalEmail()`

**Content:**
- Subject: "Points Approved - [X] points added to your account"
- Points amount
- Reason for points
- Message about using points

**Status:** Function is defined in `src/lib/email.ts` but not called anywhere in the codebase

**Note:** To enable this, add a call to `sendPointsApprovalEmail()` in `src/app/api/admin/points/[id]/route.ts` when status is changed to "APPROVED"

---

## 6. Booking Cancellation Email (Customer) - NOT CURRENTLY USED

**When:** When a booking is cancelled

**Trigger:** Currently not implemented (function exists but not called)

**Recipient:** Customer (the user whose booking was cancelled)

**Email Function:** `sendBookingCancellationEmail()`

**Content:**
- Subject: "Booking Cancelled - [Game Name] at Fury Road RC Club"
- Cancelled booking details
- Refund information

**Status:** Function is defined in `src/lib/email.ts` but not called anywhere in the codebase

**Note:** To enable this, add a call to `sendBookingCancellationEmail()` when booking status is changed to "CANCELLED"

---

## Summary

### Currently Active Email Cases:

1. ✅ **Customer Booking Request** - When customer creates booking
2. ✅ **Admin Booking Notification** - When customer creates booking (sent to all admins)
3. ✅ **Customer Booking Confirmation** - When admin confirms booking
4. ✅ **Password Reset Code** - When user requests password reset

### Defined but Not Used:

5. ⚠️ **Points Approval Email** - Function exists but not called
6. ⚠️ **Booking Cancellation Email** - Function exists but not called

---

## Email Configuration

All emails require SMTP configuration in environment variables:
- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP server port (default: 587)
- `SMTP_USER` - SMTP username/email
- `SMTP_PASS` - SMTP password (use App Password for Gmail)

If SMTP is not configured, emails will not be sent and warnings will be logged to console.

