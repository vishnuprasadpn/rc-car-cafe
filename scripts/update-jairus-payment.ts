import { prisma } from '../src/lib/prisma'

async function updateJairusPayment() {
  try {
    console.log('🔍 Looking for user: jairus@draiklin.com')
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: 'jairus@draiklin.com' }
    })

    if (!user) {
      console.error('❌ User jairus@draiklin.com not found.')
      return
    }

    console.log('✅ Found user:', user.name, user.email)

    // Find the membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        transactions: true
      }
    })

    if (!membership) {
      console.error('❌ No membership found for this user.')
      return
    }

    console.log('✅ Found membership:', membership.id)

    // Update the transaction payment method
    if (membership.transactions.length > 0) {
      const transaction = membership.transactions[0]
      const updated = await prisma.membershipTransaction.update({
        where: { id: transaction.id },
        data: {
          paymentMethod: 'UPI'
        }
      })

      console.log('✅ Updated transaction payment method to UPI')
      console.log('📊 Transaction Details:')
      console.log(`   ID: ${updated.id}`)
      console.log(`   Amount: ₹${Number(updated.amount).toLocaleString()}`)
      console.log(`   Payment Method: ${updated.paymentMethod}`)
      console.log(`   Status: ${updated.status}`)
      console.log(`   Date: ${updated.transactionDate.toLocaleDateString()}`)
    } else {
      console.log('⚠️  No transactions found for this membership')
    }
    
  } catch (error) {
    console.error('❌ Error updating payment method:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateJairusPayment()
  .then(() => {
    console.log('✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })

