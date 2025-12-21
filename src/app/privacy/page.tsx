import Navigation from "@/components/navigation"
import { Shield, Lock, Eye, FileText } from "lucide-react"

export const metadata = {
  title: "Privacy Policy - Fury Road RC Club",
  description: "Privacy Policy for Fury Road RC Club",
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 md:p-12">
            <div className="flex items-center mb-8">
              <Shield className="h-8 w-8 text-fury-orange mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
            </div>
            
            <p className="text-gray-400 text-sm mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-fury-orange" />
                  1. Introduction
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Welcome to Fury Road RC Club. We are committed to protecting your personal information and your right to privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
                  and use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-fury-orange" />
                  2. Information We Collect
                </h2>
                <div className="text-gray-300 space-y-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Personal Information</h3>
                    <p className="leading-relaxed">
                      We collect information that you provide directly to us, including:
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>Name and contact information (email address, phone number)</li>
                      <li>Account credentials (when you create an account)</li>
                      <li>Booking information and preferences</li>
                      <li>Payment information (processed securely through third-party payment processors)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Automatically Collected Information</h3>
                    <p className="leading-relaxed">
                      When you visit our website, we automatically collect certain information about your device, including:
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>IP address and browser type</li>
                      <li>Pages you visit and time spent on pages</li>
                      <li>Referring website addresses</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside ml-4 text-gray-300 space-y-2">
                  <li>Process and manage your bookings and reservations</li>
                  <li>Send you booking confirmations and updates</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Improve our website and services</li>
                  <li>Send you promotional communications (with your consent)</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside ml-4 text-gray-300 space-y-2">
                  <li>With service providers who assist us in operating our website and conducting our business</li>
                  <li>With payment processors to complete transactions</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Data Security</h2>
                <p className="text-gray-300 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information. 
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to 
                  use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside ml-4 text-gray-300 space-y-2">
                  <li>Access and receive a copy of your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Cookies and Tracking Technologies</h2>
                <p className="text-gray-300 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. 
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you 
                  do not accept cookies, you may not be able to use some portions of our website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">8. Third-Party Links</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these 
                  external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">9. Children&apos;s Privacy</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information 
                  from children. If you become aware that a child has provided us with personal information, please contact us, and 
                  we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy 
                  Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically 
                  for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">11. Contact Us</h2>
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
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
    </>
  )
}

