import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    if (session.user.role === "ADMIN") {
      redirect("/admin")
    } else if (session.user.role === "STAFF") {
      redirect("/staff")
    } else {
      redirect("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to RC Car Café
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience the thrill of indoor RC car racing in Bangalore. 
            Book your slot and compete with friends in our state-of-the-art racing arena.
          </p>
          <div className="space-x-4">
            <Link
              href="/auth/signup"
              className="bg-white text-indigo-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/signin"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-3">Book Your Race</h3>
            <p className="text-gray-200">
              Choose from multiple racing tracks and book your preferred time slot. 
              Each race lasts 20 minutes with up to 4 players.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-3">Earn Points</h3>
            <p className="text-gray-200">
              Compete and earn points for your performance. 
              Redeem points for extra playtime and special privileges.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-3">Track Records</h3>
            <p className="text-gray-200">
              Set new lap records and compete with other racers. 
              Check the leaderboard and see how you rank.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}