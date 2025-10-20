import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency,
    receipt: `receipt_${Date.now()}`,
  }

  try {
    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

export const verifyRazorpayPayment = async (orderId: string, paymentId: string, signature: string) => {
  const crypto = require('crypto')
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  return expectedSignature === signature
}
