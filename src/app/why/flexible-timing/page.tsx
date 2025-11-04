import Navigation from "@/components/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock, Calendar, Zap, CheckCircle, ArrowLeft, Timer } from "lucide-react"

export default function FlexibleTimingPage() {
  const timingOptions = [
    {
      duration: "20 Minutes",
      description: "Perfect for quick races and testing your skills. Ideal for beginners and time-constrained sessions.",
      price: "Starting from ₹500",
      icon: Timer
    },
    {
      duration: "40 Minutes",
      description: "Extended sessions for multiple races and practice. Great for improving your lap times.",
      price: "Starting from ₹900",
      icon: Clock
    },
    {
      duration: "60 Minutes",
      description: "Full racing experience with unlimited races. Perfect for competitive practice sessions.",
      price: "Starting from ₹1,200",
      icon: Calendar
    }
  ]

  const benefits = [
    {
      title: "24/7 Booking System",
      description: "Book your preferred time slot online anytime, anywhere. Our automated system makes booking effortless."
    },
    {
      title: "Flexible Scheduling",
      description: "Choose from morning, afternoon, or evening slots. We accommodate your busy schedule."
    },
    {
      title: "Last-Minute Bookings",
      description: "Need a quick race? Book sessions with just 2 hours notice. Perfect for spontaneous racing."
    },
    {
      title: "Easy Rescheduling",
      description: "Life happens. Reschedule or cancel your booking up to 24 hours before your session."
    }
  ]

  const scheduleInfo = [
    { day: "Monday - Friday", hours: "10:00 AM - 10:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 11:00 PM" },
    { day: "Sunday", hours: "9:00 AM - 9:00 PM" }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_truck_rac_2.jpg"
            alt="Flexible Timing"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-fury-black/90 via-fury-black/80 to-fury-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/40 mb-8 backdrop-blur-sm">
              <Clock className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-fury-lightGray text-sm font-medium">Flexible Timing</span>
            </div>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent uppercase">
            Flexible Timing
          </h1>
          <p className="text-xl md:text-2xl text-fury-lightGray mb-8 max-w-4xl mx-auto leading-relaxed">
            Book your preferred time slots with our flexible scheduling system.
            Perfect for quick races or extended competitions.
          </p>
        </div>
      </div>

      {/* Timing Options Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_1.jpg"
            alt="Timing Options"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-black/85 to-gray-900/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-6 uppercase">
              Choose Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Session Duration</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We offer flexible session durations to fit your schedule and racing needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {timingOptions.map((option, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 border border-white/20 group-hover:border-blue-500/50">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    <option.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl text-white mb-4 uppercase">{option.duration}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{option.description}</p>
                  <div className="text-blue-400 font-bold text-lg">{option.price}</div>
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
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_truck_rac_3.jpg"
            alt="Flexible Benefits"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-black/85 to-blue-900/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-6 uppercase">
              Why <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Flexible Timing</span>?
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our flexible scheduling system makes it easy to fit racing into your busy lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 border border-white/20 group-hover:border-blue-500/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-6">
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

      {/* Operating Hours Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_0.jpg"
            alt="Operating Hours"
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-black/80 to-gray-900/85"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/40 mb-8 backdrop-blur-sm">
                <Calendar className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-fury-lightGray text-sm font-medium">Operating Hours</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-white mb-6 uppercase">
                When Can You <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Race</span>?
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                We&apos;re open most days of the week with extended hours to accommodate
                your schedule. Book your session at a time that works best for you.
              </p>

              <div className="space-y-4">
                {scheduleInfo.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <span className="text-gray-300 font-medium">{schedule.day}</span>
                    <span className="text-blue-400 font-bold">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <Clock className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-heading text-3xl text-white mb-6 uppercase">Book Your Session</h3>
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    Choose your preferred time slot and get ready for an amazing racing experience.
                    Flexible timing means racing on your schedule!
                  </p>
                  <Link
                    href="/auth/signup"
                    className="group inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                  >
                    <span className="flex items-center justify-center">
                      <Zap className="h-5 w-5 mr-2 group-hover:animate-spin" />
                      BOOK NOW
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
            className="inline-flex items-center text-blue-400 hover:text-blue-500 font-semibold transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

