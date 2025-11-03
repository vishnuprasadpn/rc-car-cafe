import Navigation from "@/components/navigation"
import Image from "next/image"
import { Trophy, Users, Clock, Target, Award, Heart, Zap, Shield, Star, MapPin, Phone, Mail } from "lucide-react"

export default function AboutPage() {
  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Passionate about RC racing for over 15 years. Former professional racer turned entrepreneur."
    },
    {
      name: "Priya Sharma",
      role: "Track Manager",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Expert in track design and maintenance. Ensures every race is safe and exciting."
    },
    {
      name: "Arjun Patel",
      role: "Technical Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "RC car technician with 10+ years experience. Keeps our fleet in perfect condition."
    }
  ]

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

  const stats = [
    { number: "500+", label: "Races Completed" },
    { number: "50+", label: "Happy Members" },
    { number: "4", label: "Professional Tracks" },
    { number: "5★", label: "Average Rating" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
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
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-600/10 border border-red-500/20 mb-6">
                <Trophy className="h-4 w-4 text-red-400 mr-2" />
                <span className="text-red-200 text-sm font-medium">About Fury Road RC Club</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Our Story
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Passionate about bringing the thrill of RC car racing to Bangalore. 
              We're more than just a racing club - we're a community of speed enthusiasts.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">How It All Started</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Fury Road RC Club was born from a simple passion - the love for high-speed RC car racing. 
                  Our founder, Rajesh Kumar, spent years racing RC cars as a hobby, but always dreamed of 
                  creating a professional racing environment in Bangalore.
                </p>
                <p>
                  What started as a small group of friends racing in parking lots has evolved into Bangalore's 
                  premier RC racing destination. We've built state-of-the-art tracks, assembled a fleet of 
                  professional-grade RC cars, and created a community where racing enthusiasts can come together.
                </p>
                <p>
                  Today, we're proud to offer four unique tracks designed for different skill levels, 
                  from beginners taking their first laps to experts competing for the fastest times. 
                  Our mission is to make RC racing accessible, exciting, and safe for everyone.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="RC Racing Track"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Numbers that speak to our commitment to excellence and community building
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Fury Road RC Club
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 text-center border border-white/20">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate people behind Fury Road RC Club
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 text-center border border-white/20">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-red-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-red-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              To create the ultimate RC racing experience in Bangalore, bringing together speed enthusiasts 
              of all skill levels in a safe, exciting, and professional environment. We're building a 
              community where passion for racing meets cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/signup"
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Join Our Community
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Ready to Start Racing?</h3>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <div className="flex items-center text-white">
                <MapPin className="h-5 w-5 text-red-400 mr-2" />
                <span>Bangalore, Karnataka</span>
              </div>
              <div className="flex items-center text-white">
                <Phone className="h-5 w-5 text-red-400 mr-2" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center text-white">
                <Mail className="h-5 w-5 text-red-400 mr-2" />
                <span>info@furyroadrc.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
