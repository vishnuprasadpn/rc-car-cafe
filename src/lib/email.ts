import nodemailer from 'nodemailer'

// Check if SMTP is configured
const isSMTPConfigured = () => {
  const configured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  if (!configured) {
    console.warn('⚠️  SMTP not configured. Email functionality will be disabled.')
    console.warn('   Required env vars: SMTP_HOST, SMTP_USER, SMTP_PASS')
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
    console.log('✅ SMTP server connection verified')
  }).catch((error) => {
    console.error('❌ SMTP server connection failed:', error)
    console.error('   Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in your .env.local file.')
    console.error('   If using Gmail, ensure you are using an App Password and 2-Step Verification is enabled.')
    console.error('   Error details:', error.message)
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
  if (!transporter) {
    console.warn('⚠️  SMTP not configured. Booking request email not sent.')
    return
  }

  const { user, booking, game } = data

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
    await transporter.sendMail(mailOptions)
    console.log('Booking request email sent to customer:', user.email)
  } catch (error) {
    console.error('Error sending booking request email to customer:', error)
    throw error
  }
}

export const sendBookingConfirmationEmail = async (data: BookingConfirmationData) => {
  if (!transporter) {
    console.warn('⚠️  SMTP not configured. Booking confirmation email not sent.')
    return
  }

  const { user, booking, game } = data

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
    await transporter.sendMail(mailOptions)
    console.log('Booking confirmation email sent to:', user.email)
  } catch (error) {
    console.error('Error sending booking confirmation email:', error)
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
  console.log('📧 Attempting to send booking notification email to admin...')
  console.log('   Environment check:')
  console.log('     NODE_ENV:', process.env.NODE_ENV)
  console.log('     SMTP_HOST:', process.env.SMTP_HOST ? `✅ ${process.env.SMTP_HOST}` : '❌ Missing')
  console.log('     SMTP_USER:', process.env.SMTP_USER ? `✅ ${process.env.SMTP_USER}` : '❌ Missing')
  console.log('     SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set (hidden)' : '❌ Missing')
  console.log('     SMTP_PORT:', process.env.SMTP_PORT || '587 (default)')
  
  if (!transporter) {
    console.error('❌ CRITICAL: Cannot send email - SMTP transporter is null')
    console.error('   This means SMTP configuration is missing or invalid')
    console.error('   Required environment variables:')
    console.error('     - SMTP_HOST (e.g., smtp.gmail.com)')
    console.error('     - SMTP_USER (your email address)')
    console.error('     - SMTP_PASS (your app password for Gmail)')
    console.error('   Optional:')
    console.error('     - SMTP_PORT (default: 587)')
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
  
  console.log('✅ Transporter is configured, preparing admin notification email...')
  console.log('   From:', process.env.SMTP_USER)
  console.log('   To (Admins):', adminEmails.join(', '))

  const { customer, booking, game } = data

  console.log('   Booking details:')
  console.log('     - Customer:', customer.name, `(${customer.email})`)
  console.log('     - Game:', game.name)
  console.log('     - Booking ID:', booking.id)
  console.log('     - Total Price: ₹', booking.totalPrice)

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
    console.log('📤 Sending admin notification email via SMTP...')
    console.log('   From:', process.env.SMTP_USER)
    console.log('   To:', adminEmails.join(', '))
    console.log('   Subject:', mailOptions.subject)
    
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ SUCCESS: Booking notification email sent successfully!')
    console.log('   To admins:', adminEmails.join(', '))
    console.log('   Message ID:', info.messageId)
    console.log('   Response:', info.response || 'No response')
    
    if (nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info)
      if (previewUrl) {
        console.log('   Preview URL:', previewUrl)
      }
    }
    return info
  } catch (error) {
    console.error('❌ CRITICAL ERROR: Failed to send booking notification email to admins!')
    console.error('   Target emails:', adminEmails.join(', '))
    console.error('   Error type:', error?.constructor?.name || typeof error)
    
    if (error instanceof Error) {
      console.error('   Error message:', error.message)
      console.error('   Error name:', error.name)
      if (error.stack) {
        console.error('   Error stack:', error.stack)
      }
    }
    
    // Check for specific SMTP error codes
    if (error && typeof error === 'object') {
      if ('code' in error) {
        console.error('   Error code:', (error as { code: unknown }).code)
        const errorCode = String((error as { code: unknown }).code)
        if (errorCode === 'EAUTH') {
          console.error('   ⚠️  Authentication failed! Check SMTP_USER and SMTP_PASS')
          console.error('   For Gmail: Use App Password (not regular password)')
        } else if (errorCode === 'ECONNECTION') {
          console.error('   ⚠️  Connection failed! Check SMTP_HOST and SMTP_PORT')
        } else if (errorCode === 'ETIMEDOUT') {
          console.error('   ⚠️  Connection timeout! Check network/firewall settings')
        }
      }
      if ('response' in error) {
        console.error('   SMTP Response:', (error as { response: unknown }).response)
      }
      if ('responseCode' in error) {
        console.error('   SMTP Response Code:', (error as { responseCode: unknown }).responseCode)
      }
      if ('command' in error) {
        console.error('   Failed SMTP Command:', (error as { command: unknown }).command)
      }
    }
    
    // Log full error object for debugging
    console.error('   Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    
    throw error
  }
}

export const sendPasswordResetCodeEmail = async (userEmail: string, userName: string, code: string) => {
  console.log('📧 Attempting to send password reset code email to:', userEmail)
  
  if (!transporter) {
    console.error('❌ Cannot send email: SMTP not configured')
    console.error('   SMTP_HOST:', process.env.SMTP_HOST ? '✅ Set' : '❌ Missing')
    console.error('   SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ Missing')
    console.error('   SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Missing')
    throw new Error('Email service is not configured. Please contact the administrator.')
  }

  console.log('✅ Transporter is configured, preparing email...')
  console.log('   From:', process.env.SMTP_USER)
  console.log('   To:', userEmail)
  console.log('   Code:', code)

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
    console.log('📤 Sending email via SMTP...')
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Password reset code email sent successfully to:', userEmail)
    console.log('   Message ID:', info.messageId)
    if (nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info)
      if (previewUrl) {
        console.log('   Preview URL:', previewUrl)
      }
    }
    return info
  } catch (error) {
    console.error('❌ Error sending password reset code email to', userEmail, ':')
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    if (error && typeof error === 'object' && 'response' in error) {
      console.error('SMTP Response:', (error as { response: unknown }).response)
    }
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Error code:', (error as { code: unknown }).code)
    }
    throw error
  }
}
