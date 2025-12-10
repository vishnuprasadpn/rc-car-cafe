"use client"

import Navigation from "@/components/navigation"
import Image from "next/image"
import Link from "next/link"
import { Users, PartyPopper, Heart, CheckCircle, ArrowLeft, UserPlus, Trophy, Smile, Calendar } from "lucide-react"

export default function GroupFunPage() {
  const groupOptions = [
    {
      title: "Friends & Family",
      description: "Perfect for groups of 2-4 friends or family members. Race together, compete, and create lasting memories.",
      icon: Users,
      groupSize: "Up to 4 players",
      idealFor: "Birthday parties, weekend fun, family bonding"
    },
    {
      title: "Corporate Events",
      description: "Team building activities that bring your team closer. Great for company outings, team building, and corporate events.",
      icon: UserPlus,
      groupSize: "Multiple groups",
      idealFor: "Team building, corporate outings, company events"
    },
    {
      title: "Special Occasions",
      description: "Celebrate special moments with an exciting racing experience. Perfect for birthdays, anniversaries, or any celebration.",
      icon: PartyPopper,
      groupSize: "Custom groups",
      idealFor: "Birthdays, anniversaries, celebrations"
    }
  ]

  const benefits = [
    {
      title: "Multi-Player Racing",
      description: "Race with up to 4 players simultaneously on the same track. Compete head-to-head in thrilling races."
    },
    {
      title: "Social Experience",
      description: "Racing is more fun with friends! Share the excitement, celebrate victories, and enjoy the competition together."
    },
    {
      title: "Team Building",
      description: "Build stronger relationships through friendly competition. Perfect for improving communication and teamwork."
    },
    {
      title: "Memorable Moments",
      description: "Create unforgettable memories with your group. Capture the excitement with photos and share your racing stories."
    }
  ]

  const features = [
    {
      title: "Simultaneous Racing",
      description: "Up to 4 players can race at the same time on our professional tracks",
      icon: Users
    },
    {
      title: "Group Booking",
      description: "Easy booking system for groups. Reserve multiple slots or extended sessions",
      icon: Calendar
    },
    {
      title: "Competitive Fun",
      description: "Track lap times, compete for best times, and see who's the fastest in your group",
      icon: Trophy
    },
    {
      title: "Family Friendly",
      description: "Safe, exciting, and suitable for all ages. Perfect for family entertainment",
      icon: Heart
    }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_0.jpg"
            alt="Group Fun"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-fury-black/90 via-fury-black/80 to-fury-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-400/40 mb-8 backdrop-blur-sm">
              <Users className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-fury-lightGray text-sm font-medium">Group Fun</span>
            </div>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl mb-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent uppercase">
            Group Fun
          </h1>
          <p className="text-xl md:text-2xl text-fury-lightGray mb-8 max-w-4xl mx-auto leading-relaxed">
            Race with up to 4 players simultaneously. Perfect for friends, families,
            and corporate team building events.
          </p>
        </div>
      </div>

      {/* Group Options Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_1.jpg"
            alt="Group Options"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-black/85 to-gray-900/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-6 uppercase">
              Perfect for <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Every Group</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Whether you&apos;re racing with friends, family, or colleagues, we have the perfect setup for your group
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {groupOptions.map((option, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 border border-white/20 group-hover:border-green-500/50">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <option.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl text-white mb-4 uppercase">{option.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{option.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center text-green-400 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{option.groupSize}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Smile className="h-4 w-4 mr-2" />
                      <span>{option.idealFor}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_2.jpg"
            alt="Group Benefits"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-black/85 to-green-900/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-6 uppercase">
              Why <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Group Racing</span>?
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Racing together creates unforgettable experiences and strengthens bonds
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-700/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 border border-white/20 group-hover:border-green-500/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-6">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-heading text-xl text-white mb-4 uppercase">{benefit.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_closeup_of_an_RC_crawler_3.jpg"
            alt="Group Features"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-black/80 to-gray-900/85"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-6 uppercase">
              Group Racing <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Features</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-green-500/50 transition-all duration-500">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-heading text-xl text-white mb-4 uppercase">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_truck_rac_3.jpg"
            alt="Group Fun CTA"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/75 via-black/80 to-green-900/75"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-400/40 mb-8 backdrop-blur-sm">
                <Heart className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-fury-lightGray text-sm font-medium">Group Experience</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-white mb-6 uppercase">
                Ready to Race <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Together</span>?
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Gather your friends, family, or colleagues and experience the thrill of
                multi-player RC racing. Book a group session and create unforgettable memories together!
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-heading text-3xl text-white mb-6 uppercase">Book Your Group</h3>
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    Race with up to 4 players simultaneously. Perfect for any occasion!
                  </p>
                  <Link
                    href="/auth/signup"
                    className="group inline-block bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                  >
                    <span className="flex items-center justify-center">
                      <PartyPopper className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                      BOOK GROUP SESSION
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-green-400 hover:text-green-500 font-semibold transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

