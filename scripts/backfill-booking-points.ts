import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

async function main() {
  console.log('🔄 Starting points backfill for existing bookings...')

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection established')

    // Find an admin user for auto-approval
    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true, name: true },
    })

    if (!adminUser) {
      console.error('❌ No admin user found. Cannot backfill points.')
      process.exit(1)
    }

    console.log(`✅ Using admin user: ${adminUser.name} (${adminUser.id})`)

    // Get all confirmed/completed bookings that should have points
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["CONFIRMED", "COMPLETED"],
        },
      },
      include: {
        game: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    console.log(`📊 Found ${bookings.length} bookings to process`)

    let processedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const booking of bookings) {
      try {
        // Calculate points (10 points per ₹100 spent)
        const pointsEarned = Math.floor(Number(booking.totalPrice) / 100) * 10

        if (pointsEarned <= 0) {
          skippedCount++
          continue
        }

        // Check if points already exist for this booking
        const existingPoints = await prisma.point.findFirst({
          where: {
            userId: booking.userId,
            reason: {
              contains: `Booking points - ${booking.game.name}`,
            },
            createdAt: {
              gte: new Date(booking.createdAt.getTime() - 60000), // Within 1 minute of booking creation
              lte: new Date(booking.createdAt.getTime() + 60000),
            },
          },
        })

        if (existingPoints) {
          console.log(`⏭️  Skipping booking ${booking.id} - points already exist`)
          skippedCount++
          continue
        }

        // Create points entry
        await prisma.point.create({
          data: {
            userId: booking.userId,
            amount: pointsEarned,
            reason: `Booking points - ${booking.game.name} (₹${Number(booking.totalPrice).toLocaleString("en-IN")})`,
            status: "APPROVED",
            approvedBy: adminUser.id,
            approvedAt: new Date(),
          },
        })

        processedCount++
        console.log(`✅ Allocated ${pointsEarned} points to ${booking.user.name} for booking ${booking.id}`)
      } catch (error) {
        console.error(`❌ Error processing booking ${booking.id}:`, error)
        errorCount++
      }
    }

    console.log('\n📈 Backfill Summary:')
    console.log(`   ✅ Processed: ${processedCount} bookings`)
    console.log(`   ⏭️  Skipped: ${skippedCount} bookings`)
    console.log(`   ❌ Errors: ${errorCount} bookings`)
    console.log(`   📊 Total: ${bookings.length} bookings`)

    console.log('\n✅ Points backfill completed!')
  } catch (error) {
    console.error('❌ Error during points backfill:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })

