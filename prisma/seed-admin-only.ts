import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Use direct connection (not pooled) for seed script
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.replace('?pgbouncer=true', '') || process.env.DATABASE_URL
    }
  }
})

async function seedAdmins() {
  console.log('🌱 Starting admin seed (minimal connection)...')

  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection established')

    // Hash passwords
    const admin1Password = await bcrypt.hash('FurY@2024', 12)
    const admin2Password = await bcrypt.hash('Vpn@1991', 12)

    console.log('🔐 Creating/updating admin users...')

    // Create/update first admin
    const admin1 = await prisma.user.upsert({
      where: { email: 'furyroadrcclub@gmail.com' },
      update: {
        password: admin1Password,
        role: 'ADMIN',
      },
      create: {
        email: 'furyroadrcclub@gmail.com',
        name: 'Admin User',
        password: admin1Password,
        role: 'ADMIN',
        phone: '+91 9876543210'
      }
    })
    console.log('✅ Admin 1:', admin1.email)

    // Create/update second admin
    const admin2 = await prisma.user.upsert({
      where: { email: 'vishnuprasad1990@gmail.com' },
      update: {
        password: admin2Password,
        role: 'ADMIN',
      },
      create: {
        email: 'vishnuprasad1990@gmail.com',
        name: 'Vishnu Prasad',
        password: admin2Password,
        role: 'ADMIN',
        phone: '+91 9876543211'
      }
    })
    console.log('✅ Admin 2:', admin2.email)

    console.log('\n✅ Admin seed completed successfully!')
    console.log('👤 Admin 1: furyroadrcclub@gmail.com / FurY@2024')
    console.log('👤 Admin 2: vishnuprasad1990@gmail.com / Vpn@1991')

  } catch (error) {
    console.error('❌ Error seeding admins:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
      if (error.message.includes('MaxClients')) {
        console.error('\n💡 Connection pool exhausted. Options:')
        console.error('   1. Stop dev server (Ctrl+C), wait 30s, then run: npx tsx prisma/seed-admin-only.ts')
        console.error('   2. Use SQL script in Supabase: reset-admin-passwords.sql')
      }
    }
    throw error
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Connection closed')
  }
}

seedAdmins()
  .catch(() => {
    process.exit(1)
  })

