import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://furyroadclub.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/staff/",
          "/dashboard/",
          "/profile/",
          "/bookings/",
          "/points/",
          "/membership-dashboard/",
          "/auth/",
          "/booking-success/",
          "/timer-display/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
