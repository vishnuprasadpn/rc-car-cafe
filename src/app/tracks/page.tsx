import Link from "next/link"
import Navigation from "@/components/navigation"
import Image from "next/image"
import { Trophy, Clock, Users, Star, MapPin } from "lucide-react"

export default function TracksPage() {
  const tracks = [
    {
      id: 1,
      name: "Racing Track",
      difficulty: "Expert",
      length: "2.5km",
      duration: "20 minutes",
      maxPlayers: 4,
      bestTime: "1:23.45",
      description: "High-speed asphalt track with challenging turns and elevation changes. Perfect for experienced racers who love speed.",
      features: ["High-speed sections", "Technical corners", "Elevation changes", "Professional timing"],
      surface: "Asphalt",
      vehicles: "High-speed RC cars",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "red"
    },
    {
      id: 2,
      name: "Mud Track",
      difficulty: "Intermediate",
      length: "1.8km",
      duration: "20 minutes",
      maxPlayers: 4,
      bestTime: "2:15.30",
      description: "Off-road mud track with water hazards and challenging terrain. Great for developing off-road racing skills.",
      features: ["Water hazards", "Mud sections", "Off-road terrain", "Challenging obstacles"],
      surface: "Mud & Water",
      vehicles: "Off-road RC vehicles",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "brown"
    },
    {
      id: 3,
      name: "Crawler Track",
      difficulty: "Beginner",
      length: "1.2km",
      duration: "20 minutes",
      maxPlayers: 4,
      bestTime: "3:45.12",
      description: "Technical rock crawling course with obstacles and steep inclines. Perfect for learning precision control.",
      features: ["Rock obstacles", "Steep inclines", "Precision control", "Technical challenges"],
      surface: "Rocks & Obstacles",
      vehicles: "RC Crawlers",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "green"
    },
    {
      id: 4,
      name: "Sand Track",
      difficulty: "Advanced",
      length: "3.2km",
      duration: "20 minutes",
      maxPlayers: 4,
      bestTime: "4:12.88",
      description: "Heavy machinery sand track for large-scale RC vehicles. The ultimate challenge for heavy RC machines.",
      features: ["Sand dunes", "Heavy machinery", "Large scale", "Advanced terrain"],
      surface: "Sand & Dunes",
      vehicles: "Heavy RC Machines",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      color: "yellow"
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-blue-100 text-blue-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      case "Pro":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_1.jpg"
            alt="RC Car Drift Track Background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/75 via-gray-800/70 to-gray-900/75"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-600/10 border border-red-500/20 mb-6">
                <Trophy className="h-4 w-4 text-red-400 mr-2" />
                <span className="text-red-200 text-sm font-medium">Professional Racing Tracks</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Our Racing Tracks
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Four professional tracks designed for different skill levels and racing styles. 
              Experience the thrill of high-speed RC car racing on our state-of-the-art circuits.
            </p>
          </div>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {tracks.map((track) => (
              <div key={track.id} className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300">
                {/* Track Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={track.image}
                    alt={track.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(track.difficulty)}`}>
                      {track.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{track.name}</h3>
                    <div className="flex items-center text-white/80">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{track.length}</span>
                    </div>
                  </div>
                </div>

                {/* Track Details */}
                <div className="p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed">{track.description}</p>
                  
                  {/* Track Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="font-semibold text-gray-900">{track.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Max Players</div>
                        <div className="font-semibold text-gray-900">{track.maxPlayers}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Best Time</div>
                        <div className="font-semibold text-gray-900">{track.bestTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Rating</div>
                        <div className="font-semibold text-gray-900">5.0</div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Track Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {track.features.map((feature, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link 
                    href={`/book?track=${encodeURIComponent(track.name)}`}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors inline-block text-center ${
                      track.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                      track.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                      track.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                      'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    Book This Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Track Comparison */}
      <div className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Track Comparison</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare our tracks to find the perfect one for your skill level and racing style
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Track</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Difficulty</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Length</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Best Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tracks.map((track) => (
                    <tr key={track.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{track.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(track.difficulty)}`}>
                          {track.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{track.length}</td>
                      <td className="px-6 py-4 text-gray-900">{track.bestTime}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {track.features.slice(0, 2).map((feature, index) => (
                            <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-24 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Race?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Book your slot on any of our professional tracks and experience the thrill of RC car racing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join the Club
            </a>
            <a
              href="/auth/signin"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
