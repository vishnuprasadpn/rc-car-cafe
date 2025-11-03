import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

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
