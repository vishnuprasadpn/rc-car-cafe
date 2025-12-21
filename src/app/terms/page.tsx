import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export const metadata = {
  title: "Terms and Conditions - Fury Road RC Club",
  description: "Terms and Conditions for Fury Road RC Club",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 md:p-12">
            <div className="flex items-center mb-8">
              <FileText className="h-8 w-8 text-fury-orange mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Terms and Conditions</h1>
            </div>
            
            <p className="text-gray-400 text-sm mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-fury-orange" />
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  By accessing and using the Fury Road RC Club website and services, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. Use License</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Permission is granted to temporarily access the materials on Fury Road RC Club&apos;s website for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside ml-4 text-gray-300 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. Booking and Reservations</h2>
                <div className="text-gray-300 space-y-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-fury-orange" />
                      Booking Requirements
                    </h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>All bookings must be made through our official website or authorized channels</li>
                      <li>Bookings are subject to availability</li>
                      <li>Full payment is required at the time of booking</li>
                      <li>Minimum age requirement: 18 years (or with parental consent)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2 flex items-center">
                      <XCircle className="h-4 w-4 mr-2 text-fury-orange" />
                      Cancellation Policy
                    </h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Cancellations made 24 hours or more before the scheduled time: Full refund</li>
                      <li>Cancellations made less than 24 hours before: 50% refund</li>
                      <li>No-shows: No refund</li>
                      <li>Refunds will be processed within 5-7 business days</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Safety and Conduct</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  All participants must:
                </p>
                <ul className="list-disc list-inside ml-4 text-gray-300 space-y-2">
                  <li>Follow all safety instructions provided by staff</li>
                  <li>Wear appropriate safety gear as required</li>
                  <li>Respect other participants and staff members</li>
                  <li>Not engage in any dangerous or reckless behavior</li>
                  <li>Not consume alcohol or drugs before or during sessions</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Failure to comply with safety rules may result in immediate removal from the premises without refund.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Payment Terms</h2>
                <div className="text-gray-300 space-y-4">
                  <p className="leading-relaxed">
                    All prices are in Indian Rupees (₹) and are subject to change without notice. We accept payment through:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Credit/Debit cards</li>
                    <li>UPI payments</li>
                    <li>Net banking</li>
                    <li>Cash (for on-site bookings only)</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    All transactions are processed securely through our payment gateway partners. We do not store your complete 
                    payment card information on our servers.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Liability and Waiver</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  By participating in activities at Fury Road RC Club, you acknowledge and agree that:
                </p>
                <ul className="list-disc list-inside ml-4 text-gray-300 space-y-2">
                  <li>RC car racing involves inherent risks of injury</li>
                  <li>You participate at your own risk</li>
                  <li>Fury Road RC Club is not liable for any injuries, damages, or losses incurred during participation</li>
                  <li>You will sign a liability waiver before participating in activities</li>
                  <li>You are responsible for any damage caused to equipment due to negligence or misuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Intellectual Property</h2>
                <p className="text-gray-300 leading-relaxed">
                  All content on this website, including text, graphics, logos, images, and software, is the property of Fury Road 
                  RC Club and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, 
                  or create derivative works from any content without our express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">8. Account Responsibilities</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you create an account with us, you are responsible for:
                </p>
                <ul className="list-disc list-inside ml-4 text-gray-300 space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and up-to-date information</li>
                  <li>Notifying us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">9. Prohibited Activities</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside ml-4 text-gray-300 space-y-2">
                  <li>Use the service for any illegal purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the service</li>
                  <li>Use automated systems to access the website without permission</li>
                  <li>Share your account credentials with others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">10. Modifications to Terms</h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes by posting 
                  the updated terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the service after 
                  such modifications constitutes acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">11. Governing Law</h2>
                <p className="text-gray-300 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes 
                  arising from these terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">12. Contact Information</h2>
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="mt-4 text-gray-300 space-y-2">
                  <p><strong className="text-white">Email:</strong> furyroadrcclub@gmail.com</p>
                  <p><strong className="text-white">Phone:</strong> +91 99455 76007</p>
                  <p><strong className="text-white">Address:</strong> Bangalore, Karnataka, India</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

