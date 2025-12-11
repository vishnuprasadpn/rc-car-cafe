import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Try to use direct connection if pooler is full
let databaseUrl = process.env.DATABASE_URL || ''
// Replace pooler with direct connection for Supabase
if (databaseUrl.includes('pooler.supabase.com')) {
  databaseUrl = databaseUrl.replace('pooler.supabase.com', 'supabase.com').replace(':5432/postgres', ':6543/postgres')
  console.log('🔄 Using direct connection instead of pooler...')
}

// Create Prisma client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})

async function main() {
  console.log('🔐 Updating admin passwords...')
  console.log('⏳ Waiting for database connection...')

  try {
    // Test connection first
    await prisma.$connect()
    console.log('✅ Connected to database')

    // Update first admin password
    console.log('📝 Updating password for furyroadrcclub@gmail.com...')
    const admin1Password = await bcrypt.hash('FurY@2024', 12)
    const admin1 = await prisma.user.updateMany({
      where: { email: 'furyroadrcclub@gmail.com' },
      data: { password: admin1Password }
    })
    console.log(`✅ Updated password for furyroadrcclub@gmail.com (${admin1.count} user(s))`)

    // Update second admin password
    console.log('📝 Updating password for vishnuprasad1990@gmail.com...')
    const admin2Password = await bcrypt.hash('Vpn@1991', 12)
    const admin2 = await prisma.user.updateMany({
      where: { email: 'vishnuprasad1990@gmail.com' },
      data: { password: admin2Password }
    })
    console.log(`✅ Updated password for vishnuprasad1990@gmail.com (${admin2.count} user(s))`)

    console.log('\n✅ Admin passwords updated successfully!')
    console.log('👤 Admin 1: furyroadrcclub@gmail.com / FurY@2024')
    console.log('👤 Admin 2: vishnuprasad1990@gmail.com / Vpn@1991')
  } catch (error) {
    console.error('❌ Error updating admin passwords:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    try {
      await prisma.$disconnect()
      console.log('🔌 Disconnected from database')
    } catch (e) {
      // Ignore disconnect errors
    }
  })

