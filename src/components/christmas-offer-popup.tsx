"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { X, Calendar, Clock, Gift } from "lucide-react"
import Image from "next/image"

export default function ChristmasOfferPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if popup has been shown in this session
    const hasSeenPopup = sessionStorage.getItem("christmas-offer-seen")
    
    if (!hasSeenPopup) {
      // Show popup after 10 seconds
      const timer = setTimeout(() => {
        setShowPopup(true)
        sessionStorage.setItem("christmas-offer-seen", "true")
      }, 10000) // 10 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const handleBookNow = () => {
    setShowPopup(false)
    router.push("/book-christmas-offer")
  }

  const handleClose = () => {
    setShowPopup(false)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close if clicking on the backdrop (not on the popup content)
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  useEffect(() => {
    // Close on ESC key press
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPopup) {
        handleClose()
      }
    }

    if (showPopup) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when popup is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [showPopup])

  if (!showPopup) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Background Image */}
        <div className="relative w-full h-[500px] md:h-[600px]">
          <Image
            src="/christmas_offer.jpg"
            alt="Christmas Special Offer"
            fill
            className="object-cover"
            priority
          />
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm hover:scale-110 shadow-lg"
            aria-label="Close popup"
            title="Close (ESC)"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
            <div className="max-w-2xl">
              {/* Offer Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-red-600/90 backdrop-blur-sm rounded-full mb-6 border-2 border-white/30">
                <Gift className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-bold text-sm md:text-base">CHRISTMAS & NEW YEAR OFFER</span>
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                Limited Time Offer!
              </h2>

              {/* Offer Details */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-6 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-center text-white">
                    <Clock className="h-6 w-6 md:h-8 md:w-8 mr-3 text-yellow-400" />
                    <span className="text-xl md:text-2xl font-semibold">
                      1 Hour of Playtime
                    </span>
                  </div>
                  <div className="text-white/90 text-base md:text-lg">
                    <p className="mb-2">1 hour of playtime on any track</p>
                    <p className="text-yellow-400 font-bold text-2xl md:text-3xl">
                      Just ₹599
                    </p>
                  </div>
                  <div className="flex items-center justify-center text-white/80 text-sm md:text-base pt-2 border-t border-white/20">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    <span>Valid till 1st January 2025</span>
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg md:text-xl rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all transform hover:scale-105 duration-200"
              >
                Book Now
              </button>

              {/* Terms */}
              <p className="text-white/70 text-xs md:text-sm mt-4">
                * Terms and conditions apply
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

