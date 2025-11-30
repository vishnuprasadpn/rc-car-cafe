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

export const sendPasswordResetCodeEmail = async (userEmail: string, userName: string, code: string) => {
  if (!transporter) {
    console.error('❌ Cannot send email: SMTP not configured')
    throw new Error('Email service is not configured. Please contact the administrator.')
  }

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
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Password reset code email sent successfully to:', userEmail)
    console.log('   Message ID:', info.messageId)
    console.log('   Preview URL:', nodemailer.getTestMessageUrl(info)) // Only available if using ethereal
    return info
  } catch (error) {
    console.error('❌ Error sending password reset code email to', userEmail, ':', error)
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
