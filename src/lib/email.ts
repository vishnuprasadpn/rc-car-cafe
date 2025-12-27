import nodemailer from 'nodemailer'

// Check if SMTP is configured
const isSMTPConfigured = () => {
  const configured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  if (!configured) {
    console.warn('⚠️  ==========================================')
    console.warn('⚠️  SMTP NOT CONFIGURED - EMAIL DISABLED')
    console.warn('⚠️  ==========================================')
    console.warn('⚠️  Required environment variables:')
    console.warn('   - SMTP_HOST:', process.env.SMTP_HOST || '❌ MISSING')
    console.warn('   - SMTP_USER:', process.env.SMTP_USER || '❌ MISSING')
    console.warn('   - SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ MISSING')
    console.warn('⚠️  Environment:', process.env.NODE_ENV || 'not set')
    console.warn('⚠️  ==========================================')
  } else {
    console.log('✅ SMTP configuration detected')
    console.log('   SMTP_HOST:', process.env.SMTP_HOST)
    console.log('   SMTP_PORT:', process.env.SMTP_PORT || '587 (default)')
    console.log('   SMTP_USER:', process.env.SMTP_USER)
    console.log('   SMTP_PASS:', '✅ Set (hidden)')
    console.log('   Environment:', process.env.NODE_ENV || 'not set')
  }
  return configured
}

const transporter = isSMTPConfigured() ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // Use 'true' for port 465, 'false' for other ports like 587 or 25
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Add connection timeout and retry settings
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  // Enable debug logging in development
  debug: process.env.NODE_ENV === "development",
  logger: process.env.NODE_ENV === "development",
}) : null

// Verify transporter connection on startup (optional, can be removed if causing issues)
if (transporter) {
  transporter.verify().then(() => {
    console.log('✅ ==========================================')
    console.log('✅ SMTP SERVER CONNECTION VERIFIED')
    console.log('✅ ==========================================')
    console.log('✅ Environment:', process.env.NODE_ENV || 'not set')
    console.log('✅ SMTP_HOST:', process.env.SMTP_HOST)
    console.log('✅ SMTP_PORT:', process.env.SMTP_PORT || '587 (default)')
    console.log('✅ SMTP_USER:', process.env.SMTP_USER)
    console.log('✅ ==========================================')
  }).catch((error) => {
    console.error('❌ ==========================================')
    console.error('❌ SMTP SERVER CONNECTION FAILED')
    console.error('❌ ==========================================')
    console.error('❌ Environment:', process.env.NODE_ENV || 'not set')
    console.error('❌ Error:', error instanceof Error ? error.message : String(error))
    console.error('❌ Check SMTP configuration:')
    console.error('   - SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET')
    console.error('   - SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET (using default 587)')
    console.error('   - SMTP_USER:', process.env.SMTP_USER || 'NOT SET')
    console.error('   - SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET')
    console.error('❌ If using Gmail:')
    console.error('   - Ensure 2-Step Verification is enabled')
    console.error('   - Use an App Password (not your regular password)')
    console.error('   - App Password: https://myaccount.google.com/apppasswords')
    console.error('❌ ==========================================')
  })
}

interface BookingConfirmationData {
  user: {
    name: string
    email: string
  }
  booking: {
    id: string
    startTime: string
    endTime: string
    totalPrice: number
    players: number
  }
  game: {
    name: string
    duration: number
  }
}

interface BookingRequestData {
  user: {
    name: string
    email: string
  }
  booking: {
    id: string
    startTime: string
    endTime: string
    totalPrice: number
    players: number
  }
  game: {
    name: string
    duration: number
  }
}

interface BookingCancellationData {
  user: {
    name: string
    email: string
  }
  booking: {
    id: string
    startTime: string
    totalPrice: number
  }
  game: {
    name: string
  }
}

export const sendBookingRequestEmail = async (data: BookingRequestData) => {
  console.log('📧 ==========================================')
  console.log('📧 EMAIL: Booking Request (Customer)')
  console.log('📧 ==========================================')
  console.log('📧 Environment:', process.env.NODE_ENV || 'not set')
  console.log('📧 Timestamp:', new Date().toISOString())
  
  if (!transporter) {
    console.error('❌ ==========================================')
    console.error('❌ EMAIL FAILED: SMTP NOT CONFIGURED')
    console.error('❌ ==========================================')
    console.error('❌ Function: sendBookingRequestEmail')
    console.error('❌ Recipient:', data.user.email)
    console.error('❌ Reason: SMTP transporter is null')
    console.error('❌ Action Required: Set SMTP environment variables in production')
    console.error('❌ Required: SMTP_HOST, SMTP_USER, SMTP_PASS')
    console.error('❌ ==========================================')
    return
  }

  const { user, booking, game } = data
  console.log('📧 Recipient:', user.email)
  console.log('📧 Booking ID:', booking.id)
  console.log('📧 Game:', game.name)

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: `Booking Request Received - ${game.name} at Fury Road RC Club`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F97316;">Booking Request Received!</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for your booking request. We have received it and it is pending admin confirmation.</p>
        
        <div style="background-color: #FFF7ED; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F97316;">
          <h3 style="margin-top: 0; color: #F97316;">Booking Details</h3>
          <p><strong>Game:</strong> ${game.name}</p>
          <p><strong>Date & Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
          <p><strong>Duration:</strong> ${game.duration} minutes</p>
          <p><strong>End Time:</strong> ${new Date(booking.endTime).toLocaleString()}</p>
          <p><strong>Players:</strong> ${booking.players}</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalPrice}</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p><strong>Status:</strong> <span style="color: #F59E0B; font-weight: bold;">Pending Confirmation</span></p>
        </div>
        
        <p style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B;">
          <strong>Next Steps:</strong> Our admin team will review your booking and send you a confirmation email shortly. 
          Please wait for confirmation before arriving at the venue.
        </p>
        
        <p>If you have any questions, please contact us at <a href="mailto:furyroadrcclub@gmail.com">furyroadrcclub@gmail.com</a> or call us at +91 99455 76007.</p>
        
        <p>Best regards,<br>Fury Road RC Club Team</p>
      </div>
    `,
  }

  try {
    console.log('📤 Attempting to send email via SMTP...')
    const startTime = Date.now()
    const info = await transporter.sendMail(mailOptions)
    const duration = Date.now() - startTime
    
    console.log('✅ ==========================================')
    console.log('✅ EMAIL SENT SUCCESSFULLY')
    console.log('✅ ==========================================')
    console.log('✅ Function: sendBookingRequestEmail')
    console.log('✅ Recipient:', user.email)
    console.log('✅ Message ID:', info.messageId)
    console.log('✅ Duration:', `${duration}ms`)
    console.log('✅ ==========================================')
    return info
  } catch (error) {
    console.error('❌ ==========================================')
    console.error('❌ EMAIL SEND FAILED')
    console.error('❌ ==========================================')
    console.error('❌ Function: sendBookingRequestEmail')
    console.error('❌ Recipient:', user.email)
    console.error('❌ Error Type:', error?.constructor?.name || typeof error)
    
    if (error instanceof Error) {
      console.error('❌ Error Message:', error.message)
      console.error('❌ Error Name:', error.name)
      if (error.stack) {
        console.error('❌ Error Stack:', error.stack)
      }
    }
    
    if (error && typeof error === 'object') {
      if ('code' in error) {
        const errorCode = String((error as { code: unknown }).code)
        console.error('❌ Error Code:', errorCode)
        if (errorCode === 'EAUTH') {
          console.error('❌ Issue: Authentication failed')
          console.error('❌ Solution: Check SMTP_USER and SMTP_PASS (use Gmail App Password)')
        } else if (errorCode === 'ECONNECTION') {
          console.error('❌ Issue: Connection failed')
          console.error('❌ Solution: Check SMTP_HOST and SMTP_PORT')
        } else if (errorCode === 'ETIMEDOUT') {
          console.error('❌ Issue: Connection timeout')
          console.error('❌ Solution: Check network/firewall settings')
        }
      }
      if ('response' in error) {
        console.error('❌ SMTP Response:', (error as { response: unknown }).response)
      }
    }
    console.error('❌ ==========================================')
    throw error
  }
}

export const sendBookingConfirmationEmail = async (data: BookingConfirmationData) => {
  console.log('📧 ==========================================')
  console.log('📧 EMAIL: Booking Confirmation (Customer)')
  console.log('📧 ==========================================')
  console.log('📧 Environment:', process.env.NODE_ENV || 'not set')
  console.log('📧 Timestamp:', new Date().toISOString())
  
  if (!transporter) {
    console.error('❌ ==========================================')
    console.error('❌ EMAIL FAILED: SMTP NOT CONFIGURED')
    console.error('❌ ==========================================')
    console.error('❌ Function: sendBookingConfirmationEmail')
    console.error('❌ Recipient:', data.user.email)
    console.error('❌ Reason: SMTP transporter is null')
    console.error('❌ Action Required: Set SMTP environment variables in production')
    console.error('❌ ==========================================')
    return
  }

  const { user, booking, game } = data
  console.log('📧 Recipient:', user.email)
  console.log('📧 Booking ID:', booking.id)

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: `Booking Confirmed - ${game.name} at Fury Road RC Club`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Booking Confirmed!</h2>
        <p>Dear ${user.name},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Booking Details</h3>
          <p><strong>Game:</strong> ${game.name}</p>
          <p><strong>Date & Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
          <p><strong>Duration:</strong> ${game.duration} minutes</p>
          <p><strong>Players:</strong> ${booking.players}</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalPrice}</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
        </div>
        
        <p>Please arrive 10 minutes before your scheduled time. We look forward to seeing you!</p>
        
        <p>Best regards,<br>Fury Road RC Club Team</p>
      </div>
    `,
  }

  try {
    console.log('📤 Attempting to send email via SMTP...')
    const startTime = Date.now()
    const info = await transporter.sendMail(mailOptions)
    const duration = Date.now() - startTime
    
    console.log('✅ ==========================================')
    console.log('✅ EMAIL SENT SUCCESSFULLY')
    console.log('✅ ==========================================')
    console.log('✅ Function: sendBookingConfirmationEmail')
    console.log('✅ Recipient:', user.email)
    console.log('✅ Message ID:', info.messageId)
    console.log('✅ Duration:', `${duration}ms`)
    console.log('✅ ==========================================')
    return info
  } catch (error) {
    console.error('❌ ==========================================')
    console.error('❌ EMAIL SEND FAILED')
    console.error('❌ ==========================================')
    console.error('❌ Function: sendBookingConfirmationEmail')
    console.error('❌ Recipient:', user.email)
    console.error('❌ Error:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('❌ Stack:', error.stack)
    }
    console.error('❌ ==========================================')
    throw error
  }
}

export const sendBookingCancellationEmail = async (data: BookingCancellationData) => {
  if (!transporter) {
    console.warn('⚠️  SMTP not configured. Booking cancellation email not sent.')
    return
  }

  const { user, booking, game } = data

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: `Booking Cancelled - ${game.name} at Fury Road RC Club`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DC2626;">Booking Cancelled</h2>
        <p>Dear ${user.name},</p>
        <p>Your booking has been cancelled. Here are the details:</p>
        
        <div style="background-color: #FEF2F2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #DC2626;">
          <h3 style="margin-top: 0; color: #DC2626;">Cancelled Booking</h3>
          <p><strong>Game:</strong> ${game.name}</p>
          <p><strong>Date & Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
          <p><strong>Amount Refunded:</strong> ₹${booking.totalPrice}</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
        </div>
        
        <p>If you have any questions about this cancellation, please contact us.</p>
        
        <p>Best regards,<br>Fury Road RC Club Team</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Booking cancellation email sent to:', user.email)
  } catch (error) {
    console.error('Error sending booking cancellation email:', error)
    throw error
  }
}

export const sendPointsApprovalEmail = async (userEmail: string, userName: string, points: number, reason: string) => {
  if (!transporter) {
    console.warn('⚠️  SMTP not configured. Points approval email not sent.')
    return
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: `Points Approved - ${points} points added to your account`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Points Approved!</h2>
        <p>Dear ${userName},</p>
        <p>Great news! Your points have been approved and added to your account.</p>
        
        <div style="background-color: #ECFDF5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <h3 style="margin-top: 0; color: #059669;">Points Details</h3>
          <p><strong>Points Added:</strong> ${points}</p>
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        
        <p>You can now use these points to redeem extra playtime or other rewards!</p>
        
        <p>Best regards,<br>Fury Road RC Club Team</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Points approval email sent to:', userEmail)
  } catch (error) {
    console.error('Error sending points approval email:', error)
    throw error
  }
}

interface BookingNotificationData {
  customer: {
    name: string
    email: string
    phone?: string
  }
  booking: {
    id: string
    startTime: string
    endTime: string
    totalPrice: number
    players: number
  }
  game: {
    name: string
    duration: number
  }
}

export const sendBookingNotificationToAdmin = async (data: BookingNotificationData) => {
  console.log('📧 ==========================================')
  console.log('📧 EMAIL: Admin Booking Notification (CRITICAL)')
  console.log('📧 ==========================================')
  console.log('📧 Environment:', process.env.NODE_ENV || 'not set')
  console.log('📧 Timestamp:', new Date().toISOString())
  console.log('📧 ==========================================')
  console.log('📧 SMTP Configuration Check:')
  console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set')
  console.log('   SMTP_HOST:', process.env.SMTP_HOST ? `✅ ${process.env.SMTP_HOST}` : '❌ MISSING')
  console.log('   SMTP_PORT:', process.env.SMTP_PORT || '587 (default)')
  console.log('   SMTP_USER:', process.env.SMTP_USER ? `✅ ${process.env.SMTP_USER}` : '❌ MISSING')
  console.log('   SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set (hidden)' : '❌ MISSING')
  console.log('📧 ==========================================')
  
  if (!transporter) {
    console.error('❌ ==========================================')
    console.error('❌ CRITICAL EMAIL FAILURE')
    console.error('❌ ==========================================')
    console.error('❌ Function: sendBookingNotificationToAdmin')
    console.error('❌ Status: SMTP TRANSPORTER IS NULL')
    console.error('❌ Reason: SMTP configuration is missing or invalid')
    console.error('❌ ==========================================')
    console.error('❌ REQUIRED ENVIRONMENT VARIABLES:')
    console.error('   - SMTP_HOST (e.g., smtp.gmail.com)')
    console.error('   - SMTP_USER (your email address)')
    console.error('   - SMTP_PASS (Gmail App Password - 16 characters)')
    console.error('❌ Optional:')
    console.error('   - SMTP_PORT (default: 587)')
    console.error('❌ ==========================================')
    console.error('❌ ACTION REQUIRED:')
    console.error('   1. Go to Vercel Dashboard → Settings → Environment Variables')
    console.error('   2. Add SMTP_HOST, SMTP_USER, SMTP_PASS for PRODUCTION')
    console.error('   3. Redeploy the application')
    console.error('❌ ==========================================')
    throw new Error('Email service is not configured. Please check SMTP environment variables.')
  }

  // Get admin emails - send to both admins
  const adminEmails = [
    'furyroadrcclub@gmail.com',
    'vishnuprasad1990@gmail.com'
  ]
  
  // Also include ADMIN_EMAIL from env if set and different
  if (process.env.ADMIN_EMAIL && !adminEmails.includes(process.env.ADMIN_EMAIL)) {
    adminEmails.push(process.env.ADMIN_EMAIL)
  }
  
  console.log('✅ SMTP Transporter is configured')
  console.log('📧 Email Details:')
  console.log('   From:', process.env.SMTP_USER)
  console.log('   To (Admins):', adminEmails.join(', '))

  const { customer, booking, game } = data

  console.log('📧 Booking Details:')
  console.log('   Customer:', customer.name, `(${customer.email})`)
  console.log('   Phone:', customer.phone || 'N/A')
  console.log('   Game:', game.name)
  console.log('   Booking ID:', booking.id)
  console.log('   Start Time:', new Date(booking.startTime).toISOString())
  console.log('   Players:', booking.players)
  console.log('   Total Price: ₹', booking.totalPrice)

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: adminEmails.join(','), // Send to all admin emails
    subject: `New Booking Request - ${game.name} at Fury Road RC Club`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F97316;">New Booking Request</h2>
        <p>Dear Admin,</p>
        <p>A new booking has been created and requires your confirmation:</p>
        
        <div style="background-color: #FFF7ED; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F97316;">
          <h3 style="margin-top: 0; color: #F97316;">Booking Details</h3>
          <p><strong>Customer Name:</strong> ${customer.name}</p>
          <p><strong>Customer Email:</strong> ${customer.email}</p>
          ${customer.phone ? `<p><strong>Customer Phone:</strong> ${customer.phone}</p>` : ''}
          <p><strong>Game:</strong> ${game.name}</p>
          <p><strong>Date & Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
          <p><strong>Duration:</strong> ${game.duration} minutes</p>
          <p><strong>End Time:</strong> ${new Date(booking.endTime).toLocaleString()}</p>
          <p><strong>Players:</strong> ${booking.players}</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalPrice}</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
        </div>
        
        <p style="background-color: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B;">
          <strong>Action Required:</strong> Please log in to the admin panel to confirm this booking.
        </p>
        
        <p>Best regards,<br>Fury Road RC Club System</p>
      </div>
    `,
  }

  try {
    console.log('📤 Attempting to send email via SMTP...')
    console.log('   From:', process.env.SMTP_USER)
    console.log('   To:', adminEmails.join(', '))
    console.log('   Subject:', mailOptions.subject)
    
    const startTime = Date.now()
    const info = await transporter.sendMail(mailOptions)
    const duration = Date.now() - startTime
    
    console.log('✅ ==========================================')
    console.log('✅ EMAIL SENT SUCCESSFULLY')
    console.log('✅ ==========================================')
    console.log('✅ Function: sendBookingNotificationToAdmin')
    console.log('✅ Recipients:', adminEmails.join(', '))
    console.log('✅ Message ID:', info.messageId)
    console.log('✅ Response:', info.response || 'No response')
    console.log('✅ Duration:', `${duration}ms`)
    console.log('✅ ==========================================')
    
    if (nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info)
      if (previewUrl) {
        console.log('   Preview URL:', previewUrl)
      }
    }
    return info
  } catch (error) {
    console.error('❌ ==========================================')
    console.error('❌ CRITICAL EMAIL FAILURE')
    console.error('❌ ==========================================')
    console.error('❌ Function: sendBookingNotificationToAdmin')
    console.error('❌ Recipients:', adminEmails.join(', '))
    console.error('❌ Error Type:', error?.constructor?.name || typeof error)
    console.error('❌ ==========================================')
    
    if (error instanceof Error) {
      console.error('❌ Error Message:', error.message)
      console.error('❌ Error Name:', error.name)
      if (error.stack) {
        console.error('❌ Error Stack:', error.stack)
      }
    }
    
    // Check for specific SMTP error codes
    if (error && typeof error === 'object') {
      if ('code' in error) {
        const errorCode = String((error as { code: unknown }).code)
        console.error('❌ Error Code:', errorCode)
        if (errorCode === 'EAUTH') {
          console.error('❌ Issue: Authentication failed')
          console.error('❌ Solution: Check SMTP_USER and SMTP_PASS')
          console.error('❌ For Gmail: Use App Password (not regular password)')
          console.error('❌ App Password: https://myaccount.google.com/apppasswords')
        } else if (errorCode === 'ECONNECTION') {
          console.error('❌ Issue: Connection failed')
          console.error('❌ Solution: Check SMTP_HOST and SMTP_PORT')
        } else if (errorCode === 'ETIMEDOUT') {
          console.error('❌ Issue: Connection timeout')
          console.error('❌ Solution: Check network/firewall settings')
        }
      }
      if ('response' in error) {
        console.error('❌ SMTP Response:', (error as { response: unknown }).response)
      }
      if ('responseCode' in error) {
        console.error('❌ SMTP Response Code:', (error as { responseCode: unknown }).responseCode)
      }
      if ('command' in error) {
        console.error('❌ Failed SMTP Command:', (error as { command: unknown }).command)
      }
    }
    
    console.error('❌ ==========================================')
    console.error('❌ ACTION REQUIRED:')
    console.error('   1. Check Vercel environment variables')
    console.error('   2. Verify SMTP credentials are correct')
    console.error('   3. Check Gmail App Password is valid')
    console.error('   4. Review full error details above')
    console.error('❌ ==========================================')
    
    throw error
  }
}

export const sendPasswordResetCodeEmail = async (userEmail: string, userName: string, code: string) => {
  console.log('📧 ==========================================')
  console.log('📧 EMAIL: Password Reset Code')
  console.log('📧 ==========================================')
  console.log('📧 Environment:', process.env.NODE_ENV || 'not set')
  console.log('📧 Timestamp:', new Date().toISOString())
  console.log('📧 Recipient:', userEmail)
  
  if (!transporter) {
    console.error('❌ ==========================================')
    console.error('❌ EMAIL FAILED: SMTP NOT CONFIGURED')
    console.error('❌ ==========================================')
    console.error('❌ Function: sendPasswordResetCodeEmail')
    console.error('❌ Recipient:', userEmail)
    console.error('❌ Reason: SMTP transporter is null')
    console.error('❌ SMTP_HOST:', process.env.SMTP_HOST ? '✅ Set' : '❌ MISSING')
    console.error('❌ SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ MISSING')
    console.error('❌ SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ MISSING')
    console.error('❌ Action Required: Set SMTP environment variables in production')
    console.error('❌ ==========================================')
    throw new Error('Email service is not configured. Please contact the administrator.')
  }

  console.log('✅ Transporter is configured')
  console.log('📧 From:', process.env.SMTP_USER)
  console.log('📧 To:', userEmail)

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: `Password Reset Code - Fury Road RC Club`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F97316;">Password Reset Request</h2>
        <p>Dear ${userName},</p>
        <p>You have requested to reset your password. Use the code below to verify your identity:</p>
        
        <div style="background-color: #FFF7ED; padding: 30px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F97316; text-align: center;">
          <h3 style="margin-top: 0; color: #F97316; font-size: 32px; letter-spacing: 8px; font-weight: bold;">
            ${code}
          </h3>
          <p style="color: #9A3412; font-size: 14px; margin-top: 10px;">This code will expire in 15 minutes</p>
        </div>
        
        <p style="color: #DC2626; font-size: 14px; margin-top: 20px;">
          <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
        </p>
        
        <p>Best regards,<br>Fury Road RC Club Team</p>
      </div>
    `,
  }

  try {
    console.log('📤 Attempting to send email via SMTP...')
    const startTime = Date.now()
    const info = await transporter.sendMail(mailOptions)
    const duration = Date.now() - startTime
    
    console.log('✅ ==========================================')
    console.log('✅ EMAIL SENT SUCCESSFULLY')
    console.log('✅ ==========================================')
    console.log('✅ Function: sendPasswordResetCodeEmail')
    console.log('✅ Recipient:', userEmail)
    console.log('✅ Message ID:', info.messageId)
    console.log('✅ Duration:', `${duration}ms`)
    if (nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info)
      if (previewUrl) {
        console.log('✅ Preview URL:', previewUrl)
      }
    }
    console.log('✅ ==========================================')
    return info
  } catch (error) {
    console.error('❌ ==========================================')
    console.error('❌ EMAIL SEND FAILED')
    console.error('❌ ==========================================')
    console.error('❌ Function: sendPasswordResetCodeEmail')
    console.error('❌ Recipient:', userEmail)
    console.error('❌ Error Type:', error?.constructor?.name || typeof error)
    
    if (error instanceof Error) {
      console.error('❌ Error Message:', error.message)
      console.error('❌ Error Name:', error.name)
      if (error.stack) {
        console.error('❌ Error Stack:', error.stack)
      }
    }
    
    if (error && typeof error === 'object') {
      if ('code' in error) {
        const errorCode = String((error as { code: unknown }).code)
        console.error('❌ Error Code:', errorCode)
        if (errorCode === 'EAUTH') {
          console.error('❌ Issue: Authentication failed')
          console.error('❌ Solution: Check SMTP_USER and SMTP_PASS (use Gmail App Password)')
        }
      }
      if ('response' in error) {
        console.error('❌ SMTP Response:', (error as { response: unknown }).response)
      }
    }
    console.error('❌ ==========================================')
    throw error
  }
}

/**
 * Send a test email when an admin logs in
 * This is useful for testing email functionality
 */
export const sendAdminLoginTestEmail = async (adminEmail: string, adminName: string, loginMethod: string) => {
  console.log('📧 ==========================================')
  console.log('📧 ADMIN LOGIN TEST EMAIL - START')
  console.log('📧 ==========================================')
  console.log('📧 Environment:', process.env.NODE_ENV || 'not set')
  console.log('📧 Admin Email:', adminEmail)
  console.log('📧 Admin Name:', adminName)
  console.log('📧 Login Method:', loginMethod)
  console.log('📧 Timestamp:', new Date().toISOString())
  
  // Check SMTP configuration
  console.log('📧 SMTP Configuration Check:')
  console.log('   SMTP_HOST:', process.env.SMTP_HOST ? `✅ ${process.env.SMTP_HOST}` : '❌ MISSING')
  console.log('   SMTP_PORT:', process.env.SMTP_PORT || '587 (default)')
  console.log('   SMTP_USER:', process.env.SMTP_USER ? `✅ ${process.env.SMTP_USER}` : '❌ MISSING')
  console.log('   SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set (hidden)' : '❌ MISSING')
  
  if (!transporter) {
    console.error('❌ ==========================================')
    console.error('❌ CRITICAL: Cannot send admin login test email - SMTP transporter is null')
    console.error('❌ This means SMTP configuration is missing or invalid')
    console.error('❌ Required environment variables:')
    console.error('   - SMTP_HOST')
    console.error('   - SMTP_USER')
    console.error('   - SMTP_PASS')
    console.error('❌ ==========================================')
    return
  }

  console.log('✅ SMTP transporter is configured')

  try {
    // Send admin login email only to vishnuprasad1990@gmail.com
    const adminEmails = [
      'vishnuprasad1990@gmail.com'
    ]

    console.log('📧 Recipient emails:', adminEmails.join(', '))
    console.log('📧 From email:', process.env.SMTP_USER || 'NOT SET')

    if (!process.env.SMTP_USER) {
      console.error('❌ CRITICAL: SMTP_USER is not set! Cannot send email.')
      return
    }

    const mailOptions = {
      from: `"Fury Road RC Club" <${process.env.SMTP_USER}>`,
      to: adminEmails.join(','), // Send to all admin emails
      subject: `🔐 Admin Login Test - ${adminName} logged in`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #FF6B35; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Admin Login Test</h1>
            </div>
            <div class="content">
              <p>Hello Admin Team,</p>
              <p>This is a test email to confirm that email functionality is working correctly.</p>
              
              <div class="info-box">
                <strong>Login Details:</strong><br>
                <strong>Admin Name:</strong> ${adminName}<br>
                <strong>Admin Email:</strong> ${adminEmail}<br>
                <strong>Login Method:</strong> ${loginMethod}<br>
                <strong>Login Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}<br>
                <strong>IP Address:</strong> ${process.env.NODE_ENV === 'production' ? 'Not available' : 'Development'}
              </div>
              
              <p>If you received this email, it means:</p>
              <ul>
                <li>✅ SMTP configuration is correct</li>
                <li>✅ Email service is operational</li>
                <li>✅ Admin login detection is working</li>
              </ul>
              
              <p>This is an automated test email sent when an admin logs into the system.</p>
            </div>
            <div class="footer">
              <p>Fury Road RC Club - Admin System</p>
              <p>This is an automated message. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Admin Login Test

Hello Admin Team,

This is a test email to confirm that email functionality is working correctly.

Login Details:
- Admin Name: ${adminName}
- Admin Email: ${adminEmail}
- Login Method: ${loginMethod}
- Login Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

If you received this email, it means:
- SMTP configuration is correct
- Email service is operational
- Admin login detection is working

This is an automated test email sent when an admin logs into the system.

Fury Road RC Club - Admin System
      `
    }

    console.log('📤 Preparing to send admin login test email via SMTP...')
    console.log('   From:', mailOptions.from)
    console.log('   To:', adminEmails.join(', '))
    console.log('   Subject:', mailOptions.subject)
    
    // Verify transporter connection before sending
    console.log('📤 Verifying SMTP connection...')
    try {
      await transporter.verify()
      console.log('✅ SMTP connection verified successfully')
    } catch (verifyError) {
      console.error('❌ SMTP connection verification failed:')
      if (verifyError instanceof Error) {
        console.error('   Error:', verifyError.message)
      }
      console.error('   This might indicate SMTP configuration issues')
      // Continue anyway - sometimes verify fails but sendMail works
    }
    
    console.log('📤 Sending email now...')
    const startTime = Date.now()
    const info = await transporter.sendMail(mailOptions)
    const duration = Date.now() - startTime
    
    console.log('✅ ==========================================')
    console.log('✅ Admin login test email sent successfully!')
    console.log('✅ ==========================================')
    console.log('✅ Message ID:', info.messageId)
    console.log('✅ Response:', info.response || 'No response')
    console.log('✅ To:', adminEmails.join(', '))
    console.log('✅ Duration:', `${duration}ms`)
    console.log('✅ ==========================================')
    
    return info
  } catch (error) {
    console.error('❌ ==========================================')
    console.error('❌ ERROR SENDING ADMIN LOGIN TEST EMAIL')
    console.error('❌ ==========================================')
    console.error('❌ Error type:', error?.constructor?.name || typeof error)
    
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message)
      console.error('❌ Error name:', error.name)
      if (error.stack) {
        console.error('❌ Error stack:', error.stack)
      }
    }
    
    if (error && typeof error === 'object') {
      if ('response' in error) {
        console.error('❌ SMTP Response:', (error as { response: unknown }).response)
      }
      if ('responseCode' in error) {
        console.error('❌ SMTP Response Code:', (error as { responseCode: unknown }).responseCode)
      }
      if ('command' in error) {
        console.error('❌ SMTP Command:', (error as { command: unknown }).command)
      }
      if ('code' in error) {
        console.error('❌ Error Code:', (error as { code: unknown }).code)
      }
    }
    
    console.error('❌ Environment:', process.env.NODE_ENV || 'not set')
    console.error('❌ SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET')
    console.error('❌ SMTP_USER:', process.env.SMTP_USER || 'NOT SET')
    console.error('❌ SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET')
    console.error('❌ ==========================================')
    console.error('❌ Continuing with login despite email error...')
    console.error('❌ ==========================================')
    
    // Don't throw - we don't want login to fail if email fails
    // But log everything for debugging
  }
}
