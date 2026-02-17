import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Group Fun & Events - Birthday Parties & Corporate Team Building",
  description:
    "Host unforgettable birthday parties, corporate team building events, and group outings at Fury Road RC Club, Bangalore. Custom packages for groups of all sizes.",
  keywords: [
    "birthday party venue Bangalore",
    "corporate team building Bangalore",
    "group activities Bangalore",
    "RC racing group events",
    "kids birthday party Bangalore",
    "team outing Bangalore",
  ],
  alternates: {
    canonical: "/why/group-fun",
  },
}

export default function GroupFunLayout({ children }: { children: React.ReactNode }) {
  return children
}
