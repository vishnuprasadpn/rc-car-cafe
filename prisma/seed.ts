import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rccarcafe.com' },
    update: {},
    create: {
      email: 'admin@rccarcafe.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+91 9876543210'
    }
  })

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 12)
  await prisma.user.upsert({
    where: { email: 'staff@rccarcafe.com' },
    update: {},
    create: {
      email: 'staff@rccarcafe.com',
      name: 'Staff User',
      password: staffPassword,
      role: 'STAFF',
      phone: '+91 9876543211'
    }
  })

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@rccarcafe.com' },
    update: {},
    create: {
      email: 'customer@rccarcafe.com',
      name: 'John Doe',
      password: customerPassword,
      role: 'CUSTOMER',
      phone: '+91 9876543212'
    }
  })

  // Create sample games
  const games = [
    {
      name: 'Racing Track 1',
      description: 'Fast track for experienced racers with challenging turns and high-speed sections',
      duration: 20,
      price: 500,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Racing Track 2',
      description: 'Beginner-friendly track with wide turns and smooth surfaces',
      duration: 20,
      price: 400,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Racing Track 3',
      description: 'Advanced track with obstacles and technical sections',
      duration: 30,
      price: 750,
      maxPlayers: 2,
      isActive: true
    },
    {
      name: 'Mini Track',
      description: 'Compact track for quick races and practice sessions',
      duration: 15,
      price: 300,
      maxPlayers: 2,
      isActive: true
    }
  ]

  // Create games (check if they exist first)
  for (const gameData of games) {
    const existingGame = await prisma.game.findFirst({
      where: { name: gameData.name }
    })
    
    if (!existingGame) {
      await prisma.game.create({
        data: gameData
      })
    }
  }

  // Create sample points for customer (only if doesn't exist)
  const existingPoint = await prisma.point.findFirst({
    where: {
      userId: customer.id,
      reason: 'Welcome bonus'
    }
  })
  
  if (!existingPoint) {
    await prisma.point.create({
      data: {
        userId: customer.id,
        amount: 100,
        reason: 'Welcome bonus',
        status: 'APPROVED',
        approvedBy: admin.id,
        approvedAt: new Date()
      }
    })
  }

  // Create email templates
  const emailTemplates = [
    {
      name: 'booking_confirmation',
      subject: 'Booking Confirmed - RC Car Café',
      body: `Dear {{customerName}},

Your booking has been confirmed for {{gameName}} at {{bookingTime}}.

Booking Details:
- Game: {{gameName}}
- Date & Time: {{bookingTime}}
- Duration: {{duration}} minutes
- Players: {{players}}
- Total Amount: ₹{{totalPrice}}
- Booking ID: {{bookingId}}

Please arrive 10 minutes before your scheduled time.

Best regards,
RC Car Café Team`
    },
    {
      name: 'booking_cancellation',
      subject: 'Booking Cancelled - RC Car Café',
      body: `Dear {{customerName}},

Your booking for {{gameName}} on {{bookingTime}} has been cancelled.

Booking Details:
- Game: {{gameName}}
- Date & Time: {{bookingTime}}
- Amount Refunded: ₹{{totalPrice}}
- Booking ID: {{bookingId}}

If you have any questions, please contact us.

Best regards,
RC Car Café Team`
    },
    {
      name: 'points_approval',
      subject: 'Points Approved - RC Car Café',
      body: `Dear {{customerName}},

Great news! Your points have been approved and added to your account.

Points Details:
- Points Added: {{points}}
- Reason: {{reason}}
- Total Points: {{totalPoints}}

You can now use these points to redeem extra playtime or other rewards!

Best regards,
RC Car Café Team`
    }
  ]

  for (const template of emailTemplates) {
    await prisma.emailTemplate.upsert({
      where: { name: template.name },
      update: {},
      create: template
    })
  }

  // Create system settings
  const systemSettings = [
    { key: 'business_name', value: 'RC Car Café', type: 'string' },
    { key: 'business_email', value: 'info@rccarcafe.com', type: 'string' },
    { key: 'business_phone', value: '+91 9876543210', type: 'string' },
    { key: 'default_booking_duration', value: '20', type: 'number' },
    { key: 'max_advance_booking_days', value: '30', type: 'number' },
    { key: 'cancellation_hours', value: '2', type: 'number' },
    { key: 'points_per_rupee', value: '0.1', type: 'number' },
    { key: 'min_redemption_points', value: '100', type: 'number' }
  ]

  for (const setting of systemSettings) {
    await prisma.systemSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user: admin@rccarcafe.com / admin123')
  console.log('👤 Staff user: staff@rccarcafe.com / staff123')
  console.log('👤 Customer user: customer@rccarcafe.com / customer123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
