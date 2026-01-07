import Link from "next/link"
import Image from "next/image"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Navigation from "@/components/navigation"
import { TrackedLink } from "@/components/tracked-link"
import { 
  Trophy, 
  Clock, 
  Users, 
  MapPin, 
  Zap, 
  Target,
  Award,
  Heart,
  Car,
  Instagram,
  Youtube
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
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-4 md:mb-8 bg-gradient-to-r from-secondary-yellow via-secondary-yellow to-secondary-yellow bg-clip-text text-transparent leading-tight">
              India&apos;s Biggest RC Track Gaming Experience
            </h1>
            
            {/* Subtitle - Mobile Optimized */}
            <p className="text-xs sm:text-base md:text-xl text-fury-lightGray mb-6 md:mb-12 max-w-4xl mx-auto leading-relaxed px-2">
              Experience the ultimate adrenaline rush with{' '}
              <span className="text-secondary-yellow font-semibold">high-speed RC racing</span>,{' '}
              <span className="text-fury-lightGray font-semibold">professional tracks</span>, and{' '}
              <span className="text-secondary-yellow font-semibold">competitive spirit</span>
            </p>
            
            {/* CTA Buttons - Mobile Optimized */}
            <div className="flex justify-center mb-8 md:mb-16 px-2">
              <TrackedLink
                href="/book"
                buttonName="Book Now"
                location="home_hero"
                className="group relative bg-fury-orange text-fury-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold hover:bg-fury-orange/90 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25 w-full sm:w-auto"
              >
                <span className="relative flex items-center justify-center">
                  <span className="whitespace-nowrap">Book Now</span>
                </span>
              </TrackedLink>
            </div>
          </div>
        </div>

      </div>

      {/* What We Offer Section */}
      <div className="py-24 relative overflow-hidden transition-all duration-700">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_0.jpg"
            alt="What We Offer Background"
            fill
            className="object-cover"
            quality={85}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/70 via-black/80 to-blue-900/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-secondary-yellow/20 to-blue-600/20 border border-secondary-yellow/30 mb-8 backdrop-blur-sm">
              <Trophy className="h-4 w-4 text-secondary-yellow mr-2" />
              <span className="text-secondary-yellow/90 text-sm font-medium">What We Offer</span>
            </div>
            <h2 className="font-heading text-xl sm:text-3xl md:text-4xl text-white mb-6 uppercase">
              What We Offer
            </h2>
            <p className="text-sm sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover our exciting range of activities and experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "RC Tracks",
                description: "Experience adrenaline-pumping RC racing on professional tracks. Choose from Fast Track, Mud Track, Sand Track, and Crawler Track with various vehicle options.",
                gradient: "from-red-500 to-red-700",
                textColor: "text-secondary-yellow",
                underlineColor: "bg-secondary-yellow",
                icon: Car,
                link: "/tracks",
                image: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_0.jpg"
              },
              {
                name: "PS5 Gaming",
                description: "Enjoy cutting-edge PlayStation 5 gaming experience. Play the latest games with friends and family in our dedicated gaming zone.",
                gradient: "from-blue-500 to-blue-700",
                textColor: "text-blue-400",
                underlineColor: "bg-blue-400",
                icon: Zap,
                link: "/ps5-gaming",
                image: "/ps5-gaming.png"
              },
              {
                name: "Birthday & Corporate Events",
                description: "Host unforgettable birthday parties and corporate team-building events. Perfect for groups looking for fun, competitive, and memorable experiences.",
                gradient: "from-purple-500 to-purple-700",
                textColor: "text-purple-400",
                underlineColor: "bg-purple-400",
                icon: Users,
                link: "/contact",
                image: "/birthday-events.png"
              },
              {
                name: "Cafe",
                description: "Relax and refuel at our cafe. Enjoy delicious food and beverages while watching the racing action or taking a break between sessions.",
                gradient: "from-amber-500 to-amber-700",
                textColor: "text-amber-400",
                underlineColor: "bg-amber-400",
                icon: Heart,
                link: "/contact",
                image: "/cafe.png"
              }
            ].map((offer, index) => {
              const IconComponent = offer.icon
              return (
                <TrackedLink 
                  key={index} 
                  href={offer.link}
                  buttonName={`Know More - ${offer.name}`}
                  location="home_what_we_offer"
                  className="group relative block"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient} opacity-0 group-hover:opacity-30 rounded-2xl blur-2xl transition-all duration-500`}></div>
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-500 border border-white/20 group-hover:border-white/40 group-hover:shadow-2xl group-hover:shadow-fury-orange/20 h-full flex flex-col">
                    {/* Offer Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={offer.image}
                        alt={offer.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg sm:text-xl font-bold text-white">{offer.name}</h3>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3 flex-1">{offer.description}</p>
                      
                      <div className={`flex items-center ${offer.textColor} font-semibold text-sm`}>
                        <span>Know More</span>
                        <div className={`ml-2 w-0 group-hover:w-6 h-0.5 ${offer.underlineColor} transition-all duration-300`}></div>
                      </div>
                    </div>
                  </div>
                </TrackedLink>
              )
            })}
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
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary-yellow/10 border border-secondary-yellow/30 mb-8">
              <Trophy className="h-4 w-4 text-secondary-yellow mr-2" />
              <span className="text-fury-lightGray text-sm font-medium">Why Choose Us</span>
            </div>
            <h2 className="font-heading text-xl sm:text-3xl md:text-4xl text-white mb-6 uppercase">
              Why <span className="bg-gradient-to-r from-secondary-yellow to-secondary-yellow bg-clip-text text-transparent">Fury Road</span>?
            </h2>
            <p className="text-sm sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We provide the most professional and thrilling RC car racing experience in Bangalore
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TrackedLink href="/why/professional-racing" buttonName="Learn More - Professional Racing" location="home_why_fury_road" className="group relative block">
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
            </TrackedLink>
            
            <TrackedLink href="/why/flexible-timing" buttonName="Learn More - Flexible Timing" location="home_why_fury_road" className="group relative block">
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
            </TrackedLink>
            
            <TrackedLink href="/why/group-fun" buttonName="Learn More - Group Fun" location="home_why_fury_road" className="group relative block">
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
            </TrackedLink>
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
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-secondary-yellow/20 to-yellow-600/20 border border-secondary-yellow/30 mb-6 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 text-secondary-yellow mr-2" />
                <span className="text-secondary-yellow/90 text-xs sm:text-sm font-medium">The Ultimate Experience</span>
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
                  <TrackedLink
                    href="/auth/signup"
                    buttonName="START YOUR JOURNEY"
                    location="home_ultimate_experience"
                    className="group inline-block bg-fury-orange text-fury-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold hover:bg-fury-orange/90 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25"
                  >
                    <span className="flex items-center justify-center">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      START YOUR JOURNEY
                    </span>
                  </TrackedLink>
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
                    <TrackedLink
                      href="/contact"
                      buttonName="Contact Us for Group Bookings"
                      location="home_group_bookings"
                      className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    >
                      Contact Us for Group Bookings
                    </TrackedLink>
                    <TrackedLink
                      href="/book"
                      buttonName="Book Individual Slots"
                      location="home_group_bookings"
                      className="block w-full border-2 border-white/40 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
                    >
                      Book Individual Slots
                    </TrackedLink>
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
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary-yellow to-secondary-yellow rounded-full mb-4 shadow-2xl">
                <MapPin className="h-8 w-8 text-dark-100" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white mb-2 uppercase">
                Located in <span className="bg-gradient-to-r from-secondary-yellow to-secondary-yellow bg-clip-text text-transparent">Bangalore</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                Karnataka, India
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {/* Google Maps Embed */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 h-full min-h-[400px]">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=FuryRoad+RC+Club,+Yelenahalli+Main+Rd,+Akshayanagara+East,+Akshayanagar,+Bengaluru,+Karnataka+560114&output=embed"
                  title="FuryRoad RC Club Location"
                  className="w-full h-full"
                />
              </div>
              
              {/* Details Section */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition-all h-full flex flex-col">
                <div className="space-y-6 flex-1">
                  {/* Address */}
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-secondary-yellow/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="h-6 w-6 text-secondary-yellow" />
                      </div>
                      <div className="text-base font-semibold text-white uppercase">Address</div>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed pl-16">
                      FuryRoad RC Club, Yelenahalli Main Rd, Akshayanagara East, Akshayanagar, Bengaluru, Karnataka 560114
                    </p>
                  </div>
                  
                  {/* Operating Hours */}
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <Clock className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="text-base font-semibold text-white uppercase">Operating Hours</div>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed pl-16">
                      Daily 11 AM - 11 PM
                    </p>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="text-sm text-gray-400 mb-3">Follow Us</div>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://www.instagram.com/furyroad.club/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center hover:bg-pink-600/30 transition-colors group"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5 text-pink-400 group-hover:text-pink-300" />
                    </a>
                    <a
                      href="https://www.youtube.com/@furyroad_rc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center hover:bg-red-600/30 transition-colors group"
                      aria-label="YouTube"
                    >
                      <Youtube className="h-5 w-5 text-red-400 group-hover:text-red-300" />
                    </a>
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
              <TrackedLink
                href="/auth/signup"
                buttonName="BOOK YOUR RACE"
                location="home_location"
                className="group bg-fury-orange text-fury-white px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-fury-orange/90 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25"
              >
                <span className="flex items-center justify-center">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  BOOK YOUR RACE
                </span>
              </TrackedLink>
              <TrackedLink
                href="/contact"
                buttonName="GET DIRECTIONS"
                location="home_location"
                className="group border-2 border-fury-white/40 text-fury-white px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-fury-white/10 hover:border-fury-white/60 transition-all duration-300 backdrop-blur-sm"
              >
                GET DIRECTIONS
              </TrackedLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}