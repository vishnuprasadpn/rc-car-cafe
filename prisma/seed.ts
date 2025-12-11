import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

async function main() {
  console.log('🌱 Starting database seed...')

  // Test database connection first
  try {
    await prisma.$connect()
    console.log('✅ Database connection established')
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    console.error('💡 Tip: Close Prisma Studio and dev server, then try again')
    process.exit(1)
  }

  // Delete old admin user if exists (to migrate to new email)
  // Wrap in try-catch to handle connection pool issues gracefully
  try {
    await prisma.user.deleteMany({
      where: { 
        email: 'admin@rccarcafe.com',
        role: 'ADMIN'
      }
    })
    console.log('✅ Old admin user deleted (if existed)')
  } catch (error) {
    console.log('ℹ️  Could not delete old admin user (this is okay if it doesn\'t exist or connection pool is full)')
  }

  // Create first admin user
  console.log('🔐 Creating first admin user...')
  const adminPassword = await bcrypt.hash('FurY@2024', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'furyroadrcclub@gmail.com' },
    update: {
      password: adminPassword, // Update password if admin already exists
    },
    create: {
      email: 'furyroadrcclub@gmail.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+91 9876543210'
    }
  })

  // Create second admin user
  const admin2Password = await bcrypt.hash('Vpn@1991', 12)
  await prisma.user.upsert({
    where: { email: 'vishnuprasad1990@gmail.com' },
    update: {
      password: admin2Password, // Update password if admin already exists
    },
    create: {
      email: 'vishnuprasad1990@gmail.com',
      name: 'Vishnu Prasad',
      password: admin2Password,
      role: 'ADMIN',
      phone: '+91 9876543211'
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

  // Delete only dummy/test data (bookings from test customer)
  console.log('🗑️  Removing dummy/test data...')
  
  // Find test customer
  const testCustomer = await prisma.user.findUnique({
    where: { email: 'customer@rccarcafe.com' }
  })
  
  // Delete only bookings from test customer (dummy data)
  if (testCustomer) {
    const deletedBookings = await prisma.booking.deleteMany({
      where: {
        userId: testCustomer.id
      }
    })
    console.log(`✅ Deleted ${deletedBookings.count} dummy bookings from test customer`)
  }
  
  // Delete only test customer's points (dummy data)
  if (testCustomer) {
    const deletedPoints = await prisma.point.deleteMany({
      where: {
        userId: testCustomer.id,
        reason: 'Welcome bonus' // Only delete the welcome bonus test points
      }
    })
    console.log(`✅ Deleted ${deletedPoints.count} dummy points from test customer`)
  }
  
  // Preserve all real user data (bookings, games, etc.)
  console.log('📦 Preserving all real user data...')

  // Create games based on actual pricing structure
  const games = [
    // Fast Track - Toy Grade
    {
      name: 'Fast Track - Toy Grade (15 mins)',
      description: 'Fast track with toy grade RC cars. Perfect for beginners and quick sessions.',
      duration: 15,
      price: 149,
      isActive: true
    },
    {
      name: 'Fast Track - Toy Grade (30 mins)',
      description: 'Fast track with toy grade RC cars. Extended session for more racing fun.',
      duration: 30,
      price: 249,
      isActive: true
    },
    {
      name: 'Fast Track - Toy Grade (1 hr)',
      description: 'Fast track with toy grade RC cars. Full hour of racing excitement.',
      duration: 60,
      price: 449,
      isActive: true
    },
    // Fast Track - Hobby Grade
    {
      name: 'Fast Track - Hobby Grade (15 mins)',
      description: 'Fast track with hobby grade RC cars. Professional quality racing experience.',
      duration: 15,
      price: 249,
      isActive: true
    },
    {
      name: 'Fast Track - Hobby Grade (30 mins)',
      description: 'Fast track with hobby grade RC cars. Extended professional racing session.',
      duration: 30,
      price: 399,
      isActive: true
    },
    {
      name: 'Fast Track - Hobby Grade (1 hr)',
      description: 'Fast track with hobby grade RC cars. Full hour of professional racing.',
      duration: 60,
      price: 699,
      isActive: true
    },
    // Sand Track - Truck
    {
      name: 'Sand Track - Truck (15 mins)',
      description: 'Sand track with RC trucks. Experience off-road racing on sand terrain.',
      duration: 15,
      price: 149,
      isActive: true
    },
    {
      name: 'Sand Track - Truck (30 mins)',
      description: 'Sand track with RC trucks. Extended off-road racing session.',
      duration: 30,
      price: 249,
      isActive: true
    },
    {
      name: 'Sand Track - Truck (1 hr)',
      description: 'Sand track with RC trucks. Full hour of sand track racing.',
      duration: 60,
      price: 449,
      isActive: true
    },
    // Sand Track - JCB / Bulldozer
    {
      name: 'Sand Track - JCB / Bulldozer (15 mins)',
      description: 'Sand track with JCB and Bulldozer RC vehicles. Heavy machinery racing experience.',
      duration: 15,
      price: 249,
      isActive: true
    },
    {
      name: 'Sand Track - JCB / Bulldozer (30 mins)',
      description: 'Sand track with JCB and Bulldozer RC vehicles. Extended heavy machinery session.',
      duration: 30,
      price: 399,
      isActive: true
    },
    {
      name: 'Sand Track - JCB / Bulldozer (1 hr)',
      description: 'Sand track with JCB and Bulldozer RC vehicles. Full hour of heavy machinery racing.',
      duration: 60,
      price: 699,
      isActive: true
    },
    // Crawler Track - Defender / Land Rover
    {
      name: 'Crawler Track - Defender / Land Rover (15 mins)',
      description: 'Crawler track with Defender and Land Rover RC vehicles. Technical rock crawling experience.',
      duration: 15,
      price: 249,
      isActive: true
    },
    {
      name: 'Crawler Track - Defender / Land Rover (30 mins)',
      description: 'Crawler track with Defender and Land Rover RC vehicles. Extended crawling session.',
      duration: 30,
      price: 399,
      isActive: true
    },
    {
      name: 'Crawler Track - Defender / Land Rover (1 hr)',
      description: 'Crawler track with Defender and Land Rover RC vehicles. Full hour of technical crawling.',
      duration: 60,
      price: 699,
      isActive: true
    },
    // Mud Track - Land Cruiser
    {
      name: 'Mud Track - Land Cruiser (15 mins)',
      description: 'Mud track with Land Cruiser RC vehicles. Off-road mud racing experience.',
      duration: 15,
      price: 249,
      isActive: true
    },
    {
      name: 'Mud Track - Land Cruiser (30 mins)',
      description: 'Mud track with Land Cruiser RC vehicles. Extended mud racing session.',
      duration: 30,
      price: 399,
      isActive: true
    },
    {
      name: 'Mud Track - Land Cruiser (1 hr)',
      description: 'Mud track with Land Cruiser RC vehicles. Full hour of mud track racing.',
      duration: 60,
      price: 699,
      isActive: true
    }
  ]

  // Create all new games
  console.log('🎮 Creating new games...')
  for (const gameData of games) {
    await prisma.game.create({
      data: gameData
    })
  }
  console.log(`✅ Created ${games.length} games`)

  // Create sample points for customer (only if doesn't exist) - preserve existing points
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
    console.log('✅ Created welcome bonus points for customer')
  } else {
    console.log('ℹ️  Welcome bonus points already exist for customer')
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

  // Create/update system settings (preserve existing)
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
  console.log('👤 Admin user 1: furyroadrcclub@gmail.com / FurY@2024')
  console.log('👤 Admin user 2: vishnuprasad1990@gmail.com / Vpn@1991')
  console.log('👤 Staff user: staff@rccarcafe.com / staff123')
  console.log('👤 Customer user: customer@rccarcafe.com / customer123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    if (e.message && e.message.includes('MaxClients')) {
      console.error('\n💡 Connection pool exhausted. Try:')
      console.error('   1. Stop the dev server (Ctrl+C)')
      console.error('   2. Close Prisma Studio if open')
      console.error('   3. Wait 30 seconds')
      console.error('   4. Run: npm run db:seed')
      console.error('\n   Or use the SQL script directly in Supabase SQL Editor')
    }
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  })

