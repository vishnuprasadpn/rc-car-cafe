import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Valentine's Day Offer - RC Racing Special from ₹199",
  description:
    "Celebrate Valentine's Day at Fury Road RC Club, Bangalore! Special offer: 4 tracks for 1 hour from ₹599 or Trial Pack from ₹199. Valid till 28th February. Book now!",
  keywords: [
    "Valentine's Day offer Bangalore",
    "RC racing Valentine offer",
    "Valentine's Day activities Bangalore",
    "things to do Valentine's Day Bangalore",
    "couples activities Bangalore",
    "Valentine's Day 2026 Bangalore",
    "Fury Road Valentine offer",
  ],
  openGraph: {
    title: "Valentine's Day Special - Fury Road RC Club",
    description:
      "Special Valentine's offer: 4 tracks, 1 hour from ₹599 or Trial Pack from ₹199. Valid till 28th Feb!",
    images: [
      {
        url: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_2.jpg",
        width: 1200,
        height: 630,
        alt: "Valentine's Day Special at Fury Road RC Club",
      },
    ],
  },
  alternates: {
    canonical: "/valentines-offer",
  },
}

export default function ValentinesOfferLayout({ children }: { children: React.ReactNode }) {
  return children
}
