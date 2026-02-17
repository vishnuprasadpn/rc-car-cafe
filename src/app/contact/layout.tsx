import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with Fury Road RC Club",
  description:
    "Contact Fury Road RC Club in Bangalore. Visit us at Yelenahalli Main Rd, Akshayanagar or reach out via phone, email, or WhatsApp. Book your RC racing session today!",
  keywords: [
    "contact Fury Road RC Club",
    "RC racing Bangalore address",
    "Fury Road RC Club location",
    "RC car racing Akshayanagar",
    "Fury Road RC Club phone number",
  ],
  openGraph: {
    title: "Contact Us - Fury Road RC Club",
    description:
      "Get in touch with Fury Road RC Club, Bangalore. Visit us, call us, or book your session online.",
  },
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
