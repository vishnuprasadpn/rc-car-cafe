import Navigation from "@/components/navigation"
import Image from "next/image"
import { Trophy, Users, Heart, Shield, MapPin, Phone, Mail } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Trophy,
      title: "Excellence",
      description: "We strive for excellence in every race, every track, and every customer interaction."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Our passion for RC racing drives us to provide the best possible experience."
    },
    {
      icon: Shield,
      title: "Safety",
      description: "Safety is our top priority. All our equipment is regularly maintained and inspected."
    },
    {
      icon: Users,
      title: "Community",
      description: "We build a strong racing community where everyone feels welcome and supported."
    }
  ]

  // Stats section is hidden
  // const stats = [
  //   { number: "500+", label: "Races Completed" },
  //   { number: "50+", label: "Happy Members" },
  //   { number: "4", label: "Professional Tracks" },
  //   { number: "5★", label: "Average Rating" }
  // ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_2.jpg"
            alt="RC Crawler About Background"
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
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary-yellow/10 border border-secondary-yellow/30 mb-6">
                <Trophy className="h-4 w-4 text-secondary-yellow mr-2" />
                <span className="text-secondary-yellow/90 text-sm font-medium">About Fury Road RC Club</span>
              </div>
            </div>
            
            <h1 className="font-heading text-5xl md:text-6xl mb-6 text-white uppercase">
              Our Story
            </h1>
            
            <p className="text-sm sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Passionate about bringing the thrill of RC car racing to Bangalore. 
              We&apos;re more than just a racing club - we&apos;re a community of speed enthusiasts.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-24 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-2xl sm:text-4xl text-white mb-6 uppercase">How It All Started</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Fury Road RC Club was born from a simple passion - the love for high-speed RC car racing. 
                  Our founder spent years racing RC cars as a hobby, but always dreamed of 
                  creating a professional racing environment in Bangalore.
                </p>
                <p>
                  What started as a small group of friends racing in parking lots has evolved into Bangalore&apos;s 
                  premier RC racing destination. We&apos;ve built state-of-the-art tracks, assembled a fleet of 
                  professional-grade RC cars, and created a community where racing enthusiasts can come together.
                </p>
                <p>
                  Today, we&apos;re proud to offer four unique tracks designed for different skill levels, 
                  from beginners taking their first laps to experts competing for the fastest times. 
                  Our mission is to make RC racing accessible, exciting, and safe for everyone.
                </p>
              </div>
            </div>
            <div className="relative h-96 w-full">
              <Image
                src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_3.jpg"
                alt="RC Racing Track"
                fill
                className="rounded-2xl shadow-2xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Hidden */}
      {/* <div className="py-24 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-2xl sm:text-4xl text-white mb-6 uppercase">Our Impact</h2>
            <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Numbers that speak to our commitment to excellence and community building
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-fury-orange mb-2">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Values Section */}
      <div className="py-24 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-2xl sm:text-4xl text-white mb-6 uppercase">Our Values</h2>
            <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do at Fury Road RC Club
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition-all">
                <div className="w-16 h-16 bg-secondary-yellow/20 border border-secondary-yellow/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-secondary-yellow" />
                </div>
                <h3 className="font-heading text-base sm:text-xl text-white mb-4 uppercase">{value.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Mission Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-fury-orange to-primary-600 rounded-2xl p-12 text-center text-white">
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold mb-6 tracking-tight">Our Mission</h2>
            <p className="text-sm sm:text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              To create the ultimate RC racing experience in Bangalore, bringing together speed enthusiasts 
              of all skill levels in a safe, exciting, and professional environment. We&apos;re building a 
              community where passion for racing meets cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/signup"
                className="bg-white text-fury-orange px-4 py-2 sm:px-8 sm:py-3 rounded-lg text-xs sm:text-base font-semibold hover:bg-gray-100 transition-colors"
              >
                Join Our Community
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-4 py-2 sm:px-8 sm:py-3 rounded-lg text-xs sm:text-base font-semibold hover:bg-white/10 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="py-16 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-heading text-lg sm:text-2xl text-white mb-8 uppercase">Ready to Start Racing?</h3>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <div className="flex items-start text-white">
                <MapPin className="h-5 w-5 text-fury-orange mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-left">FuryRoad RC Club, Yelenahalli Main Rd, Akshayanagara East, Akshayanagar, Bengaluru, Karnataka 560114</span>
              </div>
              <div className="flex items-center text-white">
                <Phone className="h-5 w-5 text-fury-orange mr-2" />
                <span>+91 99455 76007</span>
              </div>
              <div className="flex items-center text-white">
                <Mail className="h-5 w-5 text-fury-orange mr-2" />
                <span>furyroadrcclub@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
