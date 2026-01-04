import Link from "next/link"
import Navigation from "@/components/navigation"
import Image from "next/image"
import { Gamepad2, Users, Clock, Zap, Trophy, Star } from "lucide-react"

export default function PS5GamingPage() {
  const features = [
    {
      icon: Gamepad2,
      title: "Latest Games",
      description: "Access to the newest PlayStation 5 titles including exclusive releases and popular multiplayer games."
    },
    {
      icon: Users,
      title: "Multiplayer Gaming",
      description: "Play with friends and family. Up to 4 players can enjoy gaming sessions together."
    },
    {
      icon: Clock,
      title: "Flexible Sessions",
      description: "Choose from 30-minute, 1-hour, or extended gaming sessions to fit your schedule."
    },
    {
      icon: Trophy,
      title: "Competitive Play",
      description: "Join tournaments and compete with other gamers. Test your skills in various game modes."
    },
    {
      icon: Star,
      title: "Premium Experience",
      description: "PlayStation 5 consoles with 4K gaming, ray tracing, and lightning-fast load times."
    },
    {
      icon: Zap,
      title: "Instant Gaming",
      description: "No downloads required. Games are pre-installed and ready to play immediately."
    }
  ]

  const popularGames = [
    "FIFA 24",
    "Call of Duty: Modern Warfare III",
    "Gran Turismo 7",
    "Spider-Man 2",
    "God of War Ragnarök",
    "Fortnite",
    "Rocket League",
    "Apex Legends"
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ps5-gaming.png"
            alt="PS5 Gaming Background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-black/80 to-purple-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-blue-500/10"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 mb-6">
                <Gamepad2 className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-blue-200 text-sm font-medium">PS5 Gaming Zone</span>
              </div>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl mb-6 text-white uppercase">
              PlayStation 5 Gaming
            </h1>
            
            <p className="text-sm sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience the next generation of gaming with cutting-edge PlayStation 5 consoles. 
              Play the latest titles in our dedicated gaming zone.
            </p>

            <Link
              href="/book"
              className="inline-block bg-fury-orange text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-fury-orange/90 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25"
            >
              Book Gaming Session
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-2xl sm:text-4xl text-white mb-6 uppercase">Gaming Features</h2>
            <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need for an amazing gaming experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-heading text-lg text-white mb-2 uppercase">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Games Section */}
      <div className="py-24 relative overflow-hidden transition-all duration-700">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ps5-gaming.png"
            alt="PS5 Gaming Background"
            fill
            className="object-cover opacity-30"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-900/95"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-2xl sm:text-4xl text-white mb-6 uppercase">Popular Games</h2>
            <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Play the latest and most popular PlayStation 5 titles
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 sm:p-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {popularGames.map((game, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300">
                  <Gamepad2 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-semibold text-sm">{game}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm mb-4">
                * Game availability may vary. Check with staff for current game library.
              </p>
              <Link
                href="/book"
                className="inline-block bg-fury-orange text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-fury-orange/90 transition-all duration-300"
              >
                Book Your Session
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-2xl sm:text-4xl text-white mb-6 uppercase">Gaming Sessions</h2>
            <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Choose a session duration that fits your schedule
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                duration: "30 Minutes",
                price: 299,
                description: "Perfect for quick gaming sessions or trying out new games"
              },
              {
                duration: "1 Hour",
                price: 499,
                description: "Ideal for extended gaming with friends and family"
              },
              {
                duration: "2 Hours",
                price: 899,
                description: "Best value for serious gamers and tournaments"
              }
            ].map((session, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl text-white mb-2 uppercase">{session.duration}</h3>
                  <div className="text-3xl font-bold text-fury-orange mb-2">₹{session.price}</div>
                  <p className="text-gray-300 text-sm mb-6">{session.description}</p>
                  <Link
                    href="/book"
                    className="block w-full bg-fury-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-fury-orange/90 transition-all duration-300 text-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

