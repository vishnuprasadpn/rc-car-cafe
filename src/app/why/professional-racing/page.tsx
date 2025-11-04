import Navigation from "@/components/navigation"
import Image from "next/image"
import Link from "next/link"
import { Trophy, Zap, Target, Award, CheckCircle, ArrowLeft, Car } from "lucide-react"

export default function ProfessionalRacingPage() {
  const features = [
    {
      icon: Trophy,
      title: "Professional-Grade Vehicles",
      description: "Our fleet consists of high-performance RC cars with brushless motors, advanced suspension systems, and precision-engineered chassis designed for competitive racing."
    },
    {
      icon: Zap,
      title: "Advanced Controllers",
      description: "State-of-the-art 2.4GHz radio systems with real-time telemetry, adjustable throttle curves, and programmable ESC settings for ultimate control."
    },
    {
      icon: Target,
      title: "Precision Tracks",
      description: "Expertly designed tracks with banked turns, elevation changes, and technical sections that challenge even the most skilled racers."
    },
    {
      icon: Award,
      title: "Competitive Racing",
      description: "Join our racing leagues, compete in time trials, and climb the leaderboards. Track your best lap times and compete with other members."
    }
  ]

  const specifications = [
    { label: "Motor Type", value: "Brushless 3500KV" },
    { label: "Top Speed", value: "80+ km/h" },
    { label: "Battery Life", value: "15-20 minutes" },
    { label: "Control Range", value: "150 meters" },
    { label: "Suspension", value: "Oil-filled adjustable" },
    { label: "Tire Type", value: "Professional racing slicks" }
  ]

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_2.jpg"
            alt="Professional Racing"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-fury-black/90 via-fury-black/80 to-fury-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-fury-orange/20 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-fury-orange/20 border border-fury-orange/40 mb-8 backdrop-blur-sm">
              <Trophy className="h-4 w-4 text-fury-orange mr-2" />
              <span className="text-fury-lightGray text-sm font-medium">Professional Racing</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-fury-orange via-fury-orange to-primary-600 bg-clip-text text-transparent">
            Professional Racing
          </h1>
          <p className="text-sm sm:text-xl md:text-2xl text-fury-lightGray mb-8 max-w-4xl mx-auto leading-relaxed">
            Experience the thrill of high-performance RC car racing with professional-grade equipment
            and precision-engineered tracks designed for competitive racing.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_1.jpg"
            alt="RC Car Features"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-black/85 to-gray-900/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-fury-orange to-primary-600 bg-clip-text text-transparent">Professional Racing</span>?
            </h2>
            <p className="text-sm sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We provide the most advanced RC racing experience with cutting-edge technology and professional-grade equipment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-fury-orange/10 to-primary-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 border border-white/20 group-hover:border-fury-orange/50">
                  <div className="w-16 h-16 bg-gradient-to-br from-fury-orange to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_0.jpg"
            alt="RC Car Specifications"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-black/85 to-blue-900/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-fury-orange/20 border border-fury-orange/40 mb-8 backdrop-blur-sm">
                <Car className="h-4 w-4 text-fury-orange mr-2" />
                <span className="text-fury-lightGray text-sm font-medium">Vehicle Specifications</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Professional <span className="bg-gradient-to-r from-fury-orange to-primary-600 bg-clip-text text-transparent">Equipment</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Our RC cars are built with professional-grade components and cutting-edge technology
                to deliver the ultimate racing experience. Every vehicle is maintained to perfection
                and ready for competitive racing.
              </p>

              <div className="space-y-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <span className="text-gray-300 font-medium">{spec.label}</span>
                    <span className="text-fury-orange font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-fury-orange/20 to-primary-600/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-fury-orange to-primary-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6">Ready to Race?</h3>
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    Experience professional-grade RC racing with our state-of-the-art equipment
                    and precision tracks. Join the competition and test your skills!
                  </p>
                  <Link
                    href="/auth/signup"
                    className="group inline-block bg-gradient-to-r from-fury-orange to-primary-600 text-fury-white px-8 py-3.5 rounded-lg text-base font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25"
                  >
                    <span className="flex items-center justify-center">
                      <Zap className="h-5 w-5 mr-2 group-hover:animate-spin" />
                      START RACING NOW
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_3.jpg"
            alt="Racing Benefits"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-black/80 to-gray-900/85"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Racing <span className="bg-gradient-to-r from-fury-orange to-primary-600 bg-clip-text text-transparent">Benefits</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Skill Development",
                description: "Improve your racing skills, hand-eye coordination, and reaction time through competitive racing."
              },
              {
                title: "Adrenaline Rush",
                description: "Experience the thrill of high-speed racing with professional-grade RC cars on challenging tracks."
              },
              {
                title: "Community",
                description: "Join a community of passionate racers, share tips, compete in tournaments, and make new friends."
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-fury-orange/50 transition-all duration-500">
                <div className="w-12 h-12 bg-gradient-to-br from-fury-orange to-primary-600 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-fury-orange hover:text-primary-600 font-semibold transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

