import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { getAllBlogPosts } from "@/data/blog-posts"
import { Clock, Calendar, ArrowRight, BookOpen } from "lucide-react"

export const metadata = {
  title: "Blog - Fury Road RC Club",
  description: "Stories, tips, and insights from the world of RC car racing in Bangalore.",
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_0.jpg"
            alt="Blog Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-black/90 to-gray-950"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto pt-28 md:pt-36 pb-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary-yellow/10 border border-secondary-yellow/30 mb-6">
            <BookOpen className="h-4 w-4 text-secondary-yellow mr-2" />
            <span className="text-secondary-yellow/90 text-sm font-medium">Our Blog</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white uppercase mb-4">
            Stories from the{" "}
            <span className="bg-gradient-to-r from-secondary-yellow to-secondary-yellow bg-clip-text text-transparent">
              Track
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
            Insights, experiences, and tips from the world of RC car racing in Bangalore
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-secondary-yellow/30 hover:bg-white/10 transition-all duration-500 flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-secondary-yellow/20 border border-secondary-yellow/30 text-secondary-yellow text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="font-heading text-lg sm:text-xl text-white uppercase mb-3 group-hover:text-secondary-yellow transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center text-secondary-yellow text-sm font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                  Read Article
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* If no posts */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No posts yet</h3>
            <p className="text-gray-400">Check back soon for exciting content!</p>
          </div>
        )}
      </div>
    </div>
  )
}
