import Link from "next/link"
import Navigation from "@/components/navigation"
import Image from "next/image"
import { 
  Check,
  Car,
  Gamepad2,
  Calendar,
  Shield,
  Gift
} from "lucide-react"

export default function MembershipPage() {
  const plans = [
    {
      id: 1,
      name: "RC TRACK MEMBERSHIP",
      subtitle: "Racers Unlimited",
      price: 6999,
      period: "Month",
      icon: Car,
      gradient: "from-red-500 to-orange-600",
      badge: "Most Popular",
      sessions: 16,
      sessionDuration: "45 minutes",
      peoplePerSession: "1 or 2 people",
      totalPlaytime: "12 hours per month",
      walkInValue: 16776,
      savings: 9777,
      features: [
        "16 sessions per month",
        "Each session = 45 minutes",
        "Can be used by 1 or 2 people",
        "Whether one person comes or both together, only 1 session is deducted",
        "Access to all RC zones:",
        "  ✔ Speed Track",
        "  ✔ Crawler Trail",
        "  ✔ Mud Track",
        "  ✔ Excavator Zone"
      ],
      highlights: [
        { label: "Total Playtime", value: "12 hours per month" },
        { label: "Walk-in value", value: "₹16,776" },
        { label: "You save", value: "₹9,777 every month" }
      ]
    },
    {
      id: 2,
      name: "PS5 GAMER DUO PASS",
      subtitle: "Monthly Gaming Membership",
      price: 3499,
      period: "Month",
      icon: Gamepad2,
      gradient: "from-blue-500 to-purple-600",
      badge: "Best Value",
      sessions: 16,
      sessionDuration: "2 hours",
      peoplePerSession: "1 or 2 players",
      totalPlaytime: "32 hours of gaming per month",
      effectivePrice: "₹55 per hour",
      games: [
        "EA FC",
        "GTA",
        "NFS",
        "Mortal Kombat",
        "Spider-Man",
        "God of War",
        "Call of Duty",
        "Co-op & Versus Games"
      ],
      features: [
        "16 gaming sessions per month",
        "Each session = 2 hours",
        "Can be used by 1 or 2 players on a single PS5",
        "If two players come together, only 1 session is deducted",
        "Valid for all PS5 titles, including:",
        "  • EA FC • GTA • NFS • Mortal Kombat",
        "  • Spider-Man • God of War • Call of Duty",
        "  • Co-op & Versus Games"
      ],
      highlights: [
        { label: "Total Playtime", value: "32 hours per month" },
        { label: "Effective price", value: "₹55 per hour" },
        { label: "Huge savings", value: "for daily or regular gamers" }
      ]
    }
  ]

  const rules = [
    "Membership validity: 30 days from activation",
    "Sessions must be pre-booked",
    "Unused sessions cannot be carried forward",
    "Membership is non-transferable",
    "ID verification required for dual memberships",
    "Fair-usage & safety rules apply",
    "No refunds after activation"
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden pt-16 md:pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_1.jpg"
            alt="Membership Background"
            fill
            className="object-cover opacity-30"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-gray-900/90"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-fury-orange/10 border border-fury-orange/20 mb-6">
                <Gift className="h-4 w-4 text-fury-orange mr-2" />
                <span className="text-fury-orange text-sm font-medium">Monthly Membership Plans</span>
              </div>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl mb-6 text-white uppercase">
              ⭐ Monthly Membership Plans
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-4 font-semibold">
              Unlimited Fun • Big Savings • More Playtime
            </p>
          </div>
        </div>
      </div>

      {/* Membership Plans */}
      <div className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {plans.map((plan) => {
              const IconComponent = plan.icon
              return (
                <div 
                  key={plan.id} 
                  className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:shadow-fury-orange/20"
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        plan.id === 1 
                          ? 'bg-red-500/30 text-red-200 border border-red-400/50' 
                          : 'bg-blue-500/30 text-blue-200 border border-blue-400/50'
                      }`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className={`bg-gradient-to-r ${plan.gradient} p-8 text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                      <div className="flex items-center mb-4">
                        <IconComponent className="h-8 w-8 mr-3" />
                        <div>
                          <h2 className="text-2xl font-bold uppercase">{plan.name}</h2>
                          <p className="text-sm opacity-90">{plan.subtitle}</p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-extrabold">₹{plan.price.toLocaleString()}</span>
                          <span className="text-lg ml-2 opacity-80">/ {plan.period}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-4">What You Get</h3>
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-gray-300 text-sm">
                            <Check className="h-5 w-5 text-fury-orange mr-3 mt-0.5 flex-shrink-0" />
                            <span className={feature.startsWith("  ") ? "ml-4" : ""}>{feature.replace(/^  /, "")}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Highlights */}
                    <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
                      <div className="space-y-3">
                        {plan.highlights.map((highlight, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">{highlight.label}</span>
                            <span className="text-white font-semibold text-sm">{highlight.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href="/auth/signup"
                      className={`w-full py-3 px-6 rounded-lg text-center font-semibold text-white transition-all inline-block bg-gradient-to-r ${plan.gradient} hover:opacity-90 shadow-lg hover:shadow-xl`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* General Membership Rules */}
      <div className="py-24 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4 uppercase">
              📝 General Membership Rules
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            <ul className="space-y-4">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <Shield className="h-5 w-5 text-fury-orange mr-3 mt-0.5 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-6">
              Have questions about memberships? Contact us for more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-fury-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/tracks"
                className="border-2 border-fury-orange text-fury-orange px-6 py-3 rounded-lg font-semibold hover:bg-fury-orange/10 transition-colors"
              >
                View Tracks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

