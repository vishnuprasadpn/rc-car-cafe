import Link from "next/link"
import Image from "next/image"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Navigation from "@/components/navigation"
import { 
  Trophy, 
  Clock, 
  Users, 
  Star, 
  MapPin, 
  Zap, 
  Target,
  Award,
  Heart,
  Car
} from "lucide-react"

export default async function HomePage() {
  // Allow authenticated users to view the homepage
  // They can navigate to their dashboards via the navigation menu
  // Session is checked but not used here - navigation component handles auth display
  // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
  void await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Navigation />
      
      {/* Hero Section with Advanced Animations */}
      <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_2.jpg"
            alt="RC Car Racing Background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-fury-black/80 via-fury-black/70 to-fury-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-fury-black/60 via-transparent to-fury-orange/10"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-fury-white">
            {/* Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-fury-orange/20 border border-fury-orange/40 mb-8 backdrop-blur-sm">
                <div className="w-2 h-2 bg-fury-orange rounded-full mr-3"></div>
                <span className="text-fury-lightGray text-lg font-medium">Bangalore&apos;s Premier RC Racing Experience</span>
              </div>
            </div>
            
            {/* Main Title with Gradient */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-fury-orange via-fury-orange to-fury-orange bg-clip-text text-transparent">
              FURY ROAD
            </h1>
            
            <div className="text-3xl md:text-4xl font-semibold text-fury-white mb-8">
              RC CLUB
            </div>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-fury-lightGray mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the ultimate adrenaline rush with 
              <span className="text-fury-orange font-semibold"> high-speed RC racing</span>, 
              <span className="text-fury-lightGray font-semibold"> professional tracks</span>, and 
              <span className="text-fury-orange font-semibold"> competitive spirit</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                href="/auth/signup"
                className="group relative bg-gradient-to-r from-fury-orange to-primary-600 text-fury-white px-8 py-3.5 rounded-lg text-base font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25"
              >
                <span className="relative flex items-center justify-center">
                  <Zap className="h-5 w-5 mr-2 group-hover:animate-spin" />
                  START RACING NOW
                </span>
              </Link>
              <Link
                href="/auth/signin"
                className="group border-2 border-fury-white/40 text-fury-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-fury-white/10 hover:border-fury-white/60 transition-all duration-300 backdrop-blur-sm"
              >
                SIGN IN
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-fury-orange mb-2">500+</div>
                <div className="text-fury-lightGray text-sm">Races Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-fury-orange mb-2">50+</div>
                <div className="text-fury-lightGray text-sm">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-fury-orange mb-2">4</div>
                <div className="text-fury-lightGray text-sm">Professional Tracks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-fury-orange mb-2">5★</div>
                <div className="text-fury-lightGray text-sm">Member Rating</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Features Section with Unique Design */}
      <div id="features-section" className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_0.jpg"
            alt="RC Crawler Background"
            fill
            className="object-cover"
            quality={85}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-black/80 to-gray-900/85"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-fury-orange/10 border border-fury-orange/20 mb-8">
              <Trophy className="h-4 w-4 text-fury-orange mr-2" />
              <span className="text-fury-lightGray text-sm font-medium">Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why <span className="bg-gradient-to-r from-fury-orange to-fury-orange bg-clip-text text-transparent">Fury Road</span>?
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We provide the most professional and thrilling RC car racing experience in Bangalore
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-fury-orange/20 to-primary-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-10 hover:bg-white/20 transition-all duration-500 border border-white/20 group-hover:border-fury-orange/50">
                <div className="w-20 h-20 bg-gradient-to-br from-fury-orange to-primary-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Professional Racing</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  High-performance RC cars with professional-grade controllers and precision tracks designed for competitive racing.
                </p>
                <div className="mt-6 flex items-center text-fury-orange font-semibold">
                  <span>Learn More</span>
                  <div className="ml-2 w-0 group-hover:w-8 h-0.5 bg-fury-orange transition-all duration-300"></div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-10 hover:bg-white/20 transition-all duration-500 border border-white/20 group-hover:border-blue-500/50">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <Clock className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Flexible Timing</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Book your preferred time slots with 20-minute racing sessions. Perfect for quick races or extended competitions.
                </p>
                <div className="mt-6 flex items-center text-blue-400 font-semibold">
                  <span>Learn More</span>
                  <div className="ml-2 w-0 group-hover:w-8 h-0.5 bg-blue-400 transition-all duration-300"></div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-10 hover:bg-white/20 transition-all duration-500 border border-white/20 group-hover:border-green-500/50">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Group Fun</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Race with up to 4 players simultaneously. Perfect for friends, families, and corporate team building events.
                </p>
                <div className="mt-6 flex items-center text-green-400 font-semibold">
                  <span>Learn More</span>
                  <div className="ml-2 w-0 group-hover:w-8 h-0.5 bg-green-400 transition-all duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Racing Tracks Section with Unique Design */}
      <div className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_0.jpg"
            alt="RC Car Drift Background"
            fill
            className="object-cover"
            quality={85}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/70 via-black/80 to-blue-900/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20 border border-red-500/20 mb-8 backdrop-blur-sm">
              <Car className="h-4 w-4 text-red-400 mr-2" />
              <span className="text-red-200 text-sm font-medium">Our Racing Tracks</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-red-300 via-yellow-300 to-blue-300 bg-clip-text text-transparent">Racing Tracks</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Four specialized tracks designed for different RC vehicle types and racing styles
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Racing Track",
                difficulty: "Expert",
                color: "red",
                description: "High-speed asphalt track with challenging turns and elevation changes",
                length: "2.5km",
                bestTime: "1:23.45",
                gradient: "from-red-500 to-red-700",
                surface: "Asphalt",
                vehicles: "High-speed RC cars"
              },
              {
                name: "Mud Track",
                difficulty: "Intermediate",
                color: "brown",
                description: "Off-road mud track with water hazards and challenging terrain",
                length: "1.8km",
                bestTime: "2:15.30",
                gradient: "from-amber-600 to-amber-800",
                surface: "Mud & Water",
                vehicles: "Off-road RC vehicles"
              },
              {
                name: "Crawler Track",
                difficulty: "Beginner",
                color: "green",
                description: "Technical rock crawling course with obstacles and steep inclines",
                length: "1.2km",
                bestTime: "3:45.12",
                gradient: "from-green-500 to-green-700",
                surface: "Rocks & Obstacles",
                vehicles: "RC Crawlers"
              },
              {
                name: "Sand Track",
                difficulty: "Advanced",
                color: "yellow",
                description: "Heavy machinery sand track for large-scale RC vehicles",
                length: "3.2km",
                bestTime: "4:12.88",
                gradient: "from-yellow-500 to-yellow-700",
                surface: "Sand & Dunes",
                vehicles: "Heavy RC Machines"
              }
            ].map((track, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${track.gradient} opacity-20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 border border-white/20 group-hover:border-white/40">
                  <div className={`w-16 h-16 bg-gradient-to-br ${track.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">{track.name}</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                    track.difficulty === 'Expert' ? 'bg-red-500/20 text-red-300' :
                    track.difficulty === 'Intermediate' ? 'bg-blue-500/20 text-blue-300' :
                    track.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                    'bg-purple-500/20 text-purple-300'
                  }`}>
                    {track.difficulty} Level
                  </div>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">{track.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Length:</span>
                      <span className="text-white font-bold">{track.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Surface:</span>
                      <span className="text-white font-bold">{track.surface}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Vehicles:</span>
                      <span className="text-white font-bold text-xs">{track.vehicles}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Best Time:</span>
                      <span className="text-red-400 font-bold">{track.bestTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-yellow-400 mb-6">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  
                  <Link
                    href={`/book?track=${encodeURIComponent(track.name)}`}
                    className={`w-full py-2.5 px-5 rounded-lg text-sm font-semibold text-white transition-all duration-300 bg-gradient-to-r ${track.gradient} hover:opacity-90 shadow-lg hover:shadow-xl inline-block text-center`}
                  >
                    Book This Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Section with Unique Design */}
      <div className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_1.jpg"
            alt="RC Crawler Experience Background"
            fill
            className="object-cover"
            quality={85}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-black/75 to-gray-900/80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-600/20 to-yellow-600/20 border border-red-500/20 mb-8 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-red-400 mr-2" />
                <span className="text-red-200 text-sm font-medium">The Ultimate Experience</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                The Ultimate <span className="bg-gradient-to-r from-red-300 via-yellow-300 to-blue-300 bg-clip-text text-transparent">Racing Experience</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Experience professional-grade RC car racing with state-of-the-art tracks, 
                premium vehicles, and competitive racing environment.
              </p>
              
              <div className="space-y-8">
                <div className="group flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Precision Racing</h3>
                    <p className="text-gray-300 text-sm">Master the art of precision control and timing</p>
                  </div>
                </div>
                
                <div className="group flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Competitive Spirit</h3>
                    <p className="text-gray-300 text-sm">Compete with friends and climb the leaderboards</p>
                  </div>
                </div>
                
                <div className="group flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Fun for Everyone</h3>
                    <p className="text-gray-300 text-sm">Suitable for all ages and skill levels</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-blue-600/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6">Ready to Race?</h3>
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    Join the racing community and experience the thrill of RC car racing like never before!
                  </p>
                  <Link
                    href="/auth/signup"
                    className="group inline-block bg-gradient-to-r from-fury-orange to-primary-600 text-fury-white px-8 py-3.5 rounded-lg text-base font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25"
                  >
                    <span className="flex items-center justify-center">
                      <Zap className="h-5 w-5 mr-2 group-hover:animate-spin" />
                      START YOUR JOURNEY
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_truck_rac_2.jpg"
            alt="RC Truck Racing Background"
            fill
            className="object-cover"
            quality={85}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/75 via-black/80 to-blue-900/75"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mr-4 shadow-2xl">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <span className="text-white text-xl font-bold">Located in Bangalore</span>
          </div>
          <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            Easy to reach, hard to leave. Experience the best RC car racing in the city.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/signup"
              className="group bg-gradient-to-r from-fury-orange to-primary-600 text-fury-white px-8 py-3.5 rounded-lg text-base font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25"
            >
              <span className="flex items-center justify-center">
                <Trophy className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                BOOK YOUR RACE
              </span>
            </Link>
            <Link
              href="/auth/signin"
              className="group border-2 border-fury-white/40 text-fury-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-fury-white/10 hover:border-fury-white/60 transition-all duration-300 backdrop-blur-sm"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}