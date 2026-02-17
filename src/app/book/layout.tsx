import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book Your RC Racing Session - Online Booking",
  description:
    "Book your RC car racing session at Fury Road RC Club, Bangalore. Choose your track, pick a time, and reserve your slot online. Fast Track, Sand Track, Crawler & Mud Track available.",
  keywords: [
    "book RC car racing Bangalore",
    "RC racing online booking",
    "Fury Road RC Club booking",
    "reserve RC racing slot",
    "RC car racing session booking",
  ],
  openGraph: {
    title: "Book Your RC Racing Session - Fury Road RC Club",
    description:
      "Reserve your RC car racing slot online. Choose from 4 professional tracks at Fury Road RC Club, Bangalore.",
  },
  alternates: {
    canonical: "/book",
  },
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children
}
