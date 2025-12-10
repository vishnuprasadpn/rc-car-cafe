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

  // Delete all existing games and their bookings to start fresh
  console.log('🗑️  Removing old games and bookings...')
  await prisma.booking.deleteMany({}) // Delete bookings first due to foreign key constraint
  await prisma.game.deleteMany({}) // Delete all old games
  console.log('✅ Old games and bookings removed')

  // Create games based on actual pricing structure
  const games = [
    // Fast Track - Toy Grade
    {
      name: 'Fast Track - Toy Grade (15 mins)',
      description: 'Fast track with toy grade RC cars. Perfect for beginners and quick sessions.',
      duration: 15,
      price: 149,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Fast Track - Toy Grade (30 mins)',
      description: 'Fast track with toy grade RC cars. Extended session for more racing fun.',
      duration: 30,
      price: 249,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Fast Track - Toy Grade (1 hr)',
      description: 'Fast track with toy grade RC cars. Full hour of racing excitement.',
      duration: 60,
      price: 449,
      maxPlayers: 4,
      isActive: true
    },
    // Fast Track - Hobby Grade
    {
      name: 'Fast Track - Hobby Grade (15 mins)',
      description: 'Fast track with hobby grade RC cars. Professional quality racing experience.',
      duration: 15,
      price: 249,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Fast Track - Hobby Grade (30 mins)',
      description: 'Fast track with hobby grade RC cars. Extended professional racing session.',
      duration: 30,
      price: 399,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Fast Track - Hobby Grade (1 hr)',
      description: 'Fast track with hobby grade RC cars. Full hour of professional racing.',
      duration: 60,
      price: 699,
      maxPlayers: 4,
      isActive: true
    },
    // Sand Track - Truck
    {
      name: 'Sand Track - Truck (15 mins)',
      description: 'Sand track with RC trucks. Experience off-road racing on sand terrain.',
      duration: 15,
      price: 149,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Sand Track - Truck (30 mins)',
      description: 'Sand track with RC trucks. Extended off-road racing session.',
      duration: 30,
      price: 249,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Sand Track - Truck (1 hr)',
      description: 'Sand track with RC trucks. Full hour of sand track racing.',
      duration: 60,
      price: 449,
      maxPlayers: 4,
      isActive: true
    },
    // Sand Track - JCB / Bulldozer
    {
      name: 'Sand Track - JCB / Bulldozer (15 mins)',
      description: 'Sand track with JCB and Bulldozer RC vehicles. Heavy machinery racing experience.',
      duration: 15,
      price: 249,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Sand Track - JCB / Bulldozer (30 mins)',
      description: 'Sand track with JCB and Bulldozer RC vehicles. Extended heavy machinery session.',
      duration: 30,
      price: 399,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Sand Track - JCB / Bulldozer (1 hr)',
      description: 'Sand track with JCB and Bulldozer RC vehicles. Full hour of heavy machinery racing.',
      duration: 60,
      price: 699,
      maxPlayers: 4,
      isActive: true
    },
    // Crawler Track - Defender / Land Rover
    {
      name: 'Crawler Track - Defender / Land Rover (15 mins)',
      description: 'Crawler track with Defender and Land Rover RC vehicles. Technical rock crawling experience.',
      duration: 15,
      price: 249,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Crawler Track - Defender / Land Rover (30 mins)',
      description: 'Crawler track with Defender and Land Rover RC vehicles. Extended crawling session.',
      duration: 30,
      price: 399,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Crawler Track - Defender / Land Rover (1 hr)',
      description: 'Crawler track with Defender and Land Rover RC vehicles. Full hour of technical crawling.',
      duration: 60,
      price: 699,
      maxPlayers: 4,
      isActive: true
    },
    // Mud Track - Land Cruiser
    {
      name: 'Mud Track - Land Cruiser (15 mins)',
      description: 'Mud track with Land Cruiser RC vehicles. Off-road mud racing experience.',
      duration: 15,
      price: 249,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Mud Track - Land Cruiser (30 mins)',
      description: 'Mud track with Land Cruiser RC vehicles. Extended mud racing session.',
      duration: 30,
      price: 399,
      maxPlayers: 4,
      isActive: true
    },
    {
      name: 'Mud Track - Land Cruiser (1 hr)',
      description: 'Mud track with Land Cruiser RC vehicles. Full hour of mud track racing.',
      duration: 60,
      price: 699,
      maxPlayers: 4,
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

