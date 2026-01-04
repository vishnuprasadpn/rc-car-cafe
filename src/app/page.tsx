import Link from "next/link"
import Image from "next/image"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Navigation from "@/components/navigation"
import { 
  Trophy, 
  Clock, 
  Users, 
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
    <div className="min-h-screen overflow-hidden">
      <Navigation />
      
      {/* Hero Section with Advanced Animations */}
      <div className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20 overflow-hidden">
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
            {/* Badge - Mobile Optimized */}
            <div className="mb-4 md:mb-8">
              <div className="inline-flex items-center px-3 py-1.5 md:px-6 md:py-3 rounded-full bg-fury-orange/20 border border-fury-orange/40 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-fury-orange rounded-full mr-2 md:mr-3"></div>
                <span className="text-fury-lightGray text-[10px] sm:text-xs md:text-lg font-medium leading-tight">
                  <span className="hidden sm:inline">Bangalore&apos;s Premier RC Racing Experience</span>
                  <span className="sm:hidden">Premier RC Racing</span>
                </span>
              </div>
            </div>
            
            {/* Main Title with Gradient - Better Mobile Scaling */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl mb-3 md:mb-6 bg-gradient-to-r from-fury-orange via-fury-orange to-fury-orange bg-clip-text text-transparent uppercase leading-tight">
              FURY ROAD
            </h1>
            
            <div className="font-heading text-lg sm:text-3xl md:text-4xl text-fury-white mb-4 md:mb-8 uppercase leading-tight">
              RC CLUB
            </div>
            
            {/* Subtitle - Mobile Optimized */}
            <p className="text-xs sm:text-base md:text-xl text-fury-lightGray mb-6 md:mb-12 max-w-4xl mx-auto leading-relaxed px-2">
              Experience the ultimate adrenaline rush with{' '}
              <span className="text-fury-orange font-semibold">high-speed RC racing</span>,{' '}
              <span className="text-fury-lightGray font-semibold">professional tracks</span>, and{' '}
              <span className="text-fury-orange font-semibold">competitive spirit</span>
            </p>
            
            {/* CTA Buttons - Mobile Optimized */}
            <div className="flex justify-center mb-8 md:mb-16 px-2">
              <Link
                href="/tracks"
                className="group relative bg-fury-orange text-fury-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold hover:bg-fury-orange/90 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25 w-full sm:w-auto"
              >
                <span className="relative flex items-center justify-center">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="whitespace-nowrap">START RACING NOW</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Racing Tracks Section with Unique Design */}
      <div className="py-24 relative overflow-hidden transition-all duration-700">
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
            <h2 className="font-heading text-xl sm:text-3xl md:text-4xl text-white mb-6 uppercase">
              Our <span className="bg-gradient-to-r from-red-300 via-yellow-300 to-blue-300 bg-clip-text text-transparent">Racing Tracks</span>
            </h2>
            <p className="text-sm sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Four specialized tracks designed for different RC vehicle types and racing styles
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Fast Track",
                difficulty: "All Levels",
                color: "red",
                priceStartsAt: 149,
                description: "High-speed racing track with Toy Grade and Hobby Grade RC cars. Choose from 15 mins, 30 mins, or 1 hour sessions.",
                gradient: "from-red-500 to-red-700",
                surface: "Asphalt",
                vehicles: "Toy Grade & Hobby Grade RC cars",
                image: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_0.jpg"
              },
              {
                name: "Mud Track",
                difficulty: "Intermediate",
                color: "brown",
                priceStartsAt: 249,
                description: "Off-road mud track with Land Cruiser RC vehicles. Experience challenging terrain with water hazards.",
                gradient: "from-amber-600 to-amber-800",
                surface: "Mud & Water",
                vehicles: "Land Cruiser RC vehicles",
                image: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_truck_rac_3.jpg"
              },
              {
                name: "Crawler Track",
                difficulty: "Advanced",
                color: "green",
                priceStartsAt: 249,
                description: "Technical rock crawling course with Defender and Land Rover RC vehicles. Perfect for precision control.",
                gradient: "from-green-500 to-green-700",
                surface: "Rocks & Obstacles",
                vehicles: "Defender & Land Rover RC Crawlers",
                image: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_0.jpg"
              },
              {
                name: "Sand Track",
                difficulty: "Intermediate",
                color: "yellow",
                priceStartsAt: 149,
                description: "Sand track with RC Trucks, JCB, and Bulldozer vehicles. Heavy machinery racing on sand terrain.",
                gradient: "from-yellow-500 to-yellow-700",
                surface: "Sand & Dunes",
                vehicles: "Trucks, JCB & Bulldozer RC Machines",
                image: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_2.jpg"
              }
            ].map((track, index) => (
              <Link 
                key={index} 
                href={`/book?track=${encodeURIComponent(track.name)}`}
                className="group relative block"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${track.gradient} opacity-0 group-hover:opacity-30 rounded-2xl blur-2xl transition-all duration-500`}></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-500 border border-white/20 group-hover:border-white/40 group-hover:shadow-2xl group-hover:shadow-fury-orange/20">
                  {/* Track Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={track.image}
                      alt={track.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <div className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold backdrop-blur-sm ${
                        track.difficulty === 'Expert' ? 'bg-red-500/30 text-red-200 border border-red-400/50' :
                        track.difficulty === 'Intermediate' ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50' :
                        track.difficulty === 'Beginner' ? 'bg-green-500/30 text-green-200 border border-green-400/50' :
                        'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                      }`}>
                        {track.difficulty}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg sm:text-xl font-bold text-white">{track.name}</h3>
                    </div>
                  </div>
                  
                  {/* Track Details */}
                  <div className="p-5">
                    <p className="text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2">{track.description}</p>
                    
                    <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Surface</span>
                        <span className="text-white font-semibold">{track.surface}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Vehicles</span>
                        <span className="text-white font-semibold text-[10px]">{track.vehicles}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Price starts at</span>
                        <span className="text-fury-orange font-semibold">₹{track.priceStartsAt}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${track.gradient} group-hover:shadow-lg transition-all`}>
                        Book Now
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section with Unique Design */}
      <div id="features-section" className="py-24 relative overflow-hidden transition-all duration-700">
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
            <h2 className="font-heading text-xl sm:text-3xl md:text-4xl text-white mb-6 uppercase">
              Why <span className="bg-gradient-to-r from-fury-orange to-fury-orange bg-clip-text text-transparent">Fury Road</span>?
            </h2>
            <p className="text-sm sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We provide the most professional and thrilling RC car racing experience in Bangalore
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/why/professional-racing" className="group relative block">
              <div className="absolute inset-0 bg-gradient-to-br from-fury-orange/10 to-primary-600/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/20 group-hover:border-fury-orange/40">
                <div className="w-14 h-14 bg-gradient-to-br from-fury-orange to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-heading text-lg text-white mb-2 uppercase">Professional Racing</h3>
                <p className="text-gray-300 leading-relaxed text-xs sm:text-sm mb-4 line-clamp-2">
                  High-performance RC cars with professional-grade controllers and precision tracks designed for competitive racing.
                </p>
                <div className="flex items-center text-fury-orange font-semibold text-sm">
                  <span>Learn More</span>
                  <div className="ml-2 w-0 group-hover:w-6 h-0.5 bg-fury-orange transition-all duration-300"></div>
                </div>
              </div>
            </Link>
            
            <Link href="/why/flexible-timing" className="group relative block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/20 group-hover:border-blue-400/40">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Flexible Timing</h3>
                <p className="text-gray-300 leading-relaxed text-xs sm:text-sm mb-4 line-clamp-2">
                  Book your preferred time slots with 20-minute racing sessions. Perfect for quick races or extended competitions.
                </p>
                <div className="flex items-center text-blue-400 font-semibold text-sm">
                  <span>Learn More</span>
                  <div className="ml-2 w-0 group-hover:w-6 h-0.5 bg-blue-400 transition-all duration-300"></div>
                </div>
              </div>
            </Link>
            
            <Link href="/why/group-fun" className="group relative block">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-800/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/20 group-hover:border-green-400/40">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Group Fun</h3>
                <p className="text-gray-300 leading-relaxed text-xs sm:text-sm mb-4 line-clamp-2">
                  Race with up to 4 players simultaneously. Perfect for friends, families, and corporate team building events.
                </p>
                <div className="flex items-center text-green-400 font-semibold text-sm">
                  <span>Learn More</span>
                  <div className="ml-2 w-0 group-hover:w-6 h-0.5 bg-green-400 transition-all duration-300"></div>
                </div>
              </div>
            </Link>
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
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600/20 to-yellow-600/20 border border-red-500/20 mb-6 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 text-red-400 mr-2" />
                <span className="text-red-200 text-xs sm:text-sm font-medium">The Ultimate Experience</span>
              </div>
              <h2 className="font-heading text-lg sm:text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
                The Ultimate <span className="bg-gradient-to-r from-red-300 via-yellow-300 to-blue-300 bg-clip-text text-transparent">Racing Experience</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
                Experience professional-grade RC car racing with state-of-the-art tracks, 
                premium vehicles, and competitive racing environment.
              </p>
              
              <div className="space-y-4">
                <div className="group flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-300">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm sm:text-base text-white mb-1 uppercase">Precision Racing</h3>
                    <p className="text-gray-300 text-xs sm:text-sm">Master the art of precision control and timing</p>
                  </div>
                </div>
                
                <div className="group flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-300">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1">Competitive Spirit</h3>
                    <p className="text-gray-300 text-xs sm:text-sm">Compete with friends and climb the leaderboards</p>
                  </div>
                </div>
                
                <div className="group flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-300">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1">Fun for Everyone</h3>
                    <p className="text-gray-300 text-xs sm:text-sm">Suitable for all ages and skill levels</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl text-white mb-3 sm:mb-4 uppercase">Ready to Race?</h3>
                  <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">
                    Join the racing community and experience the thrill of RC car racing like never before!
                  </p>
                  <Link
                    href="/auth/signup"
                    className="group inline-block bg-fury-orange text-fury-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold hover:bg-fury-orange/90 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25"
                  >
                    <span className="flex items-center justify-center">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      START YOUR JOURNEY
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Bookings Section */}
      <div className="py-24 relative overflow-hidden transition-all duration-700">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_truck_rac_2.jpg"
            alt="Group Bookings Background"
            fill
            className="object-cover"
            quality={85}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/75 to-blue-900/80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 mb-8 backdrop-blur-sm">
              <Users className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-purple-200 text-sm font-medium">Perfect for Groups</span>
            </div>
            <h2 className="font-heading text-xl sm:text-3xl md:text-4xl text-white mb-6 uppercase">
              Group <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">Bookings</span>
            </h2>
            <p className="text-sm sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Perfect for parties, corporate events, team building, and group celebrations. Book multiple slots for your entire group!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Users,
                title: "Corporate Events",
                description: "Team building activities and corporate outings. Perfect for bonding and fun competition.",
                gradient: "from-blue-500 to-blue-700",
                borderColor: "border-blue-400/40"
              },
              {
                icon: Heart,
                title: "Birthday Parties",
                description: "Celebrate special occasions with exciting RC racing. Memorable experiences for all ages.",
                gradient: "from-pink-500 to-pink-700",
                borderColor: "border-pink-400/40"
              },
              {
                icon: Trophy,
                title: "Group Competitions",
                description: "Organize tournaments and competitions. Race with friends and family for the ultimate bragging rights.",
                gradient: "from-purple-500 to-purple-700",
                borderColor: "border-purple-400/40"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-500`}></div>
                <div className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/20 group-hover:${feature.borderColor}`}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-heading text-lg text-white mb-3 uppercase">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-12 border border-white/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-heading text-xl sm:text-2xl text-white mb-4 uppercase">Why Choose Group Bookings?</h3>
                <ul className="space-y-3">
                  {[
                    "Book multiple time slots for your entire group",
                    "Special group pricing available for large bookings",
                    "Perfect for 4-20+ participants",
                    "Flexible scheduling to accommodate your group",
                    "Dedicated track time for your event",
                    "Professional equipment and guidance included"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-purple-500/30">
                  <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h4 className="font-heading text-xl text-white mb-2 uppercase">Ready to Book?</h4>
                  <p className="text-gray-300 text-sm mb-6">
                    Contact us for group booking inquiries and special pricing
                  </p>
                  <div className="space-y-3">
                    <Link
                      href="/contact"
                      className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    >
                      Contact Us for Group Bookings
                    </Link>
                    <Link
                      href="/book"
                      className="block w-full border-2 border-white/40 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
                    >
                      Book Individual Slots
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location & Final CTA Section */}
      <div className="py-16 sm:py-24 relative overflow-hidden transition-all duration-700">
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
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Location Section */}
          <div className="mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-fury-orange to-primary-600 rounded-full flex items-center justify-center shadow-2xl">
                <MapPin className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white mb-2 uppercase">
                  Located in <span className="bg-gradient-to-r from-fury-orange to-primary-600 bg-clip-text text-transparent">Bangalore</span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  Karnataka, India
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-center sm:justify-start mb-3">
                  <div className="w-10 h-10 bg-fury-orange/20 rounded-lg flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-fury-orange" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Address</div>
                    <div className="text-sm font-semibold text-white">FuryRoad RC Club, Yelenahalli Main Rd, Akshayanagara East, Akshayanagar, Bengaluru, Karnataka 560114</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-center sm:justify-start mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Operating Hours</div>
                    <div className="text-sm font-semibold text-white">Daily 11 AM - 11 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center">
            <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Easy to reach, hard to leave. Experience the best RC car racing in the city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Link
                href="/auth/signup"
                className="group bg-fury-orange text-fury-white px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-fury-orange/90 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25"
              >
                <span className="flex items-center justify-center">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  BOOK YOUR RACE
                </span>
              </Link>
              <Link
                href="/contact"
                className="group border-2 border-fury-white/40 text-fury-white px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-fury-white/10 hover:border-fury-white/60 transition-all duration-300 backdrop-blur-sm"
              >
                GET DIRECTIONS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}