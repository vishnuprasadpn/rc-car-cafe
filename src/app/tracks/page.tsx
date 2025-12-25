import Link from "next/link"
import Navigation from "@/components/navigation"
import Image from "next/image"
import { Trophy, Clock, Users, Star } from "lucide-react"

export default function TracksPage() {
  const tracks = [
    {
      id: 1,
      name: "Fast Track",
      difficulty: "All Levels",
      duration: "15/30/60 minutes",
      priceStartsAt: 149,
      description: "Book high-speed racing on our asphalt track. Available with Toy Grade (₹149/₹249/₹449) or Hobby Grade (₹249/₹399/₹699) RC cars for 15 mins, 30 mins, or 1 hour sessions. Perfect for speed enthusiasts!",
      features: ["Toy Grade & Hobby Grade options", "Multiple duration options", "High-speed sections", "Professional timing"],
      surface: "Asphalt",
      vehicles: "Toy Grade & Hobby Grade RC cars",
      image: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_0.jpg",
      color: "red"
    },
    {
      id: 2,
      name: "Mud Track",
      difficulty: "Intermediate",
      duration: "15/30/60 minutes",
      priceStartsAt: 249,
      description: "Book an off-road adventure on our mud track. Drive Land Cruiser RC vehicles through challenging terrain with water hazards. Sessions: 15 mins (₹249), 30 mins (₹399), or 1 hr (₹699).",
      features: ["Land Cruiser vehicles", "Water hazards", "Mud sections", "Off-road terrain"],
      surface: "Mud & Water",
      vehicles: "Land Cruiser RC vehicles",
      image: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_truck_rac_3.jpg",
      color: "brown"
    },
    {
      id: 3,
      name: "Crawler Track",
      difficulty: "Advanced",
      duration: "15/30/60 minutes",
      priceStartsAt: 249,
      description: "Book a technical rock crawling session. Master precision control with Defender and Land Rover RC vehicles on challenging rock obstacles. Sessions: 15 mins (₹249), 30 mins (₹399), or 1 hr (₹699).",
      features: ["Defender & Land Rover", "Rock obstacles", "Steep inclines", "Precision control"],
      surface: "Rocks & Obstacles",
      vehicles: "Defender & Land Rover RC Crawlers",
      image: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_0.jpg",
      color: "green"
    },
    {
      id: 4,
      name: "Sand Track",
      difficulty: "Intermediate",
      duration: "15/30/60 minutes",
      priceStartsAt: 149,
      description: "Book heavy machinery racing on our sand track. Choose from RC Trucks (₹149/₹249/₹449) or JCB/Bulldozer (₹249/₹399/₹699) for 15 mins, 30 mins, or 1 hr sessions. Experience power on sand terrain!",
      features: ["Trucks, JCB & Bulldozer", "Sand dunes", "Heavy machinery", "Advanced terrain"],
      surface: "Sand & Dunes",
      vehicles: "Trucks, JCB & Bulldozer RC Machines",
      image: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_2.jpg",
      color: "yellow"
    }
  ]



  return (
    <div className="min-h-screen">
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
                <span className="text-red-200 text-sm font-medium">Book Your Racing Session</span>
              </div>
            </div>
            
            <h1 className="font-heading text-5xl md:text-6xl mb-6 text-white uppercase">
              Choose Your Track & Start Racing
            </h1>
            
            <p className="text-sm sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Select from our professional racing tracks and book your session. 
              Each track offers unique challenges and vehicles. Book now to secure your slot!
            </p>
          </div>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="py-24 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto">
            {tracks.map((track) => (
              <div key={track.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 flex flex-col h-full">
                {/* Track Image */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <Image
                    src={track.image}
                    alt={track.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      track.difficulty === 'Expert' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      track.difficulty === 'Intermediate' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      track.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {track.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-heading text-base sm:text-lg text-white uppercase line-clamp-1">{track.name}</h3>
                  </div>
                </div>

                {/* Track Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-gray-300 mb-4 leading-relaxed text-sm line-clamp-3">{track.description}</p>
                  
                  {/* Track Stats */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-400">Duration</div>
                        <div className="font-semibold text-white text-sm">{track.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>
                        <div className="text-xs text-gray-400">Price starts at</div>
                        <div className="font-semibold text-fury-orange text-sm">₹{track.priceStartsAt}</div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-white mb-2">Features</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {track.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 border border-white/20 text-gray-300">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button - Sticky to bottom */}
                  <div className="mt-auto pt-4">
                    <Link 
                      href={`/book?track=${encodeURIComponent(track.name)}`}
                      className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all inline-block text-center bg-gradient-to-r from-fury-orange to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-fury-orange/25"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Track Comparison */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-2xl sm:text-4xl text-white mb-6 uppercase">Compare Tracks & Book</h2>
            <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Compare all available tracks below and select the perfect one for your racing session
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Track</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Difficulty</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Features</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {tracks.map((track) => (
                    <tr key={track.id} className="hover:bg-white/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{track.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          track.difficulty === 'Expert' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          track.difficulty === 'Intermediate' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          track.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}>
                          {track.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {track.features.slice(0, 2).map((feature, index) => (
                            <span key={index} className="text-xs text-gray-300 bg-white/10 border border-white/20 px-2 py-1 rounded">
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
      <div className="py-24 bg-gradient-to-r from-fury-orange to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white mb-6 tracking-tight">Ready to Book Your Session?</h2>
          <p className="text-sm sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Select any track above and book your racing session. Sign up or sign in to get started!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-fury-orange px-4 py-2 sm:px-8 sm:py-3 rounded-lg text-xs sm:text-base font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign Up to Book
            </Link>
            <Link
              href="/auth/signin"
              className="border-2 border-white text-white px-4 py-2 sm:px-8 sm:py-3 rounded-lg text-xs sm:text-base font-semibold hover:bg-white/10 transition-colors"
            >
              Sign In to Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
