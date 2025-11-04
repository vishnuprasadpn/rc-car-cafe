"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'Thank you for your message! We&apos;ll get back to you soon.' })
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch {
      setMessage({ type: 'error', text: 'Failed to send message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: ["Fury Road RC Club", "123 Race Track Road", "Bangalore, Karnataka 560001"],
      color: "text-red-600"
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 98765 43210", "+91 98765 43211"],
      color: "text-blue-600"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@furyroadrc.com", "bookings@furyroadrc.com"],
      color: "text-green-600"
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon - Fri: 10:00 AM - 10:00 PM", "Sat - Sun: 9:00 AM - 11:00 PM"],
      color: "text-purple-600"
    }
  ]

  const subjects = [
    "General Inquiry",
    "Booking Information",
    "Track Availability",
    "Membership",
    "Corporate Events",
    "Technical Support",
    "Feedback",
    "Other"
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-600/10 border border-red-500/20 mb-6">
                <Phone className="h-4 w-4 text-red-400 mr-2" />
                <span className="text-red-200 text-sm font-medium">Get in Touch</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Contact Us
            </h1>
            
            <p className="text-sm sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Have questions about our tracks, bookings, or just want to say hello? 
              We&apos;d love to hear from you!
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6">Get in Touch</h2>
            <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Multiple ways to reach us - choose what works best for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition-all">
                <div className={`w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <info.icon className={`h-8 w-8 ${info.color === 'text-red-600' ? 'text-fury-orange' : info.color === 'text-blue-600' ? 'text-blue-400' : info.color === 'text-green-600' ? 'text-green-400' : 'text-purple-400'}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-300">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form and Map */}
      <div className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-6">Send us a Message</h3>
              
              {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center ${
                  message.type === 'success' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white transition-all"
                    >
                      <option value="" className="bg-gray-900">Select a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject} className="bg-gray-900">{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-fury-orange to-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-fury-orange focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg hover:shadow-fury-orange/25"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map and Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-6">Find Us</h3>
                <div className="bg-white/5 border border-white/10 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">Interactive Map</p>
                    <p className="text-sm text-gray-500">123 Race Track Road, Bangalore</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-fury-orange mr-3" />
                    <div>
                      <div className="font-semibold text-white">Call Us</div>
                      <div className="text-gray-300">+91 98765 43210</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-fury-orange mr-3" />
                    <div>
                      <div className="font-semibold text-white">Email Us</div>
                      <div className="text-gray-300">info@furyroadrc.com</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-fury-orange mr-3" />
                    <div>
                      <div className="font-semibold text-white">Visit Us</div>
                      <div className="text-gray-300">Mon-Sun: 9:00 AM - 11:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Quick answers to common questions about our racing experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all">
              <h3 className="text-base sm:text-xl font-bold text-white mb-4">Do I need to bring my own RC car?</h3>
              <p className="text-xs sm:text-sm text-gray-300">No! We provide professional-grade RC cars for all our tracks. Just bring your racing spirit!</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all">
              <h3 className="text-base sm:text-xl font-bold text-white mb-4">What&apos;s the minimum age to race?</h3>
              <p className="text-xs sm:text-sm text-gray-300">Children 8 and above can race with adult supervision. We have beginner-friendly tracks perfect for kids.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all">
              <h3 className="text-base sm:text-xl font-bold text-white mb-4">How do I book a session?</h3>
              <p className="text-xs sm:text-sm text-gray-300">Simply sign up on our website, choose your track and time slot, and you&apos;re ready to race!</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all">
              <h3 className="text-base sm:text-xl font-bold text-white mb-4">Can I host corporate events?</h3>
              <p className="text-xs sm:text-sm text-gray-300">Absolutely! We offer corporate packages for team building events and private parties.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
