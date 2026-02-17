import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import Navigation from "@/components/navigation"
import { getBlogPost, getAllBlogPosts } from "@/data/blog-posts"
import { Clock, Calendar, ArrowLeft, User, Share2, Tag } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: "Post Not Found" }

  return {
    title: `${post.title} - Fury Road RC Club Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

function renderContent(content: string) {
  const paragraphs = content.split("\n\n")

  return paragraphs.map((paragraph, index) => {
    const trimmed = paragraph.trim()
    if (!trimmed) return null

    // Handle blockquotes (lines starting with >)
    if (trimmed.startsWith(">")) {
      const quoteText = trimmed.replace(/^>\s*/, "").replace(/"/g, "")
      return (
        <blockquote
          key={index}
          className="border-l-4 border-secondary-yellow/60 pl-6 py-3 my-8 bg-secondary-yellow/5 rounded-r-lg"
        >
          <p className="text-gray-200 italic text-lg leading-relaxed">
            &ldquo;{quoteText}&rdquo;
          </p>
        </blockquote>
      )
    }

    // Handle italic text wrapped in *...*
    const parts = trimmed.split(/(\*[^*]+\*)/)
    const rendered = parts.map((part, i) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={i} className="text-gray-200">
            {part.slice(1, -1)}
          </em>
        )
      }
      return part
    })

    return (
      <p key={index} className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
        {rendered}
      </p>
    )
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const allPosts = getAllBlogPosts()
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navigation />

      {/* Hero Cover Image */}
      <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/50 to-black/30"></div>

        {/* Back button */}
        <div className="absolute top-20 md:top-28 left-4 sm:left-8 z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-sm hover:bg-black/70 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-40 pb-20">
        {/* Article Header */}
        <div className="mb-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-yellow/15 border border-secondary-yellow/30 text-secondary-yellow text-xs font-medium"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white uppercase leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-400 pb-8 border-b border-white/10">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4 text-secondary-yellow" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-secondary-yellow" />
              {new Date(post.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary-yellow" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Article Body */}
        <article className="prose-custom">{renderContent(post.content)}</article>

        {/* Share & CTA Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="bg-gradient-to-r from-fury-orange/10 to-secondary-yellow/10 border border-fury-orange/20 rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="font-heading text-xl sm:text-2xl text-white uppercase mb-3">
              Ready to Experience the Thrill?
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-6 max-w-xl mx-auto">
              Visit Fury Road RC Club and discover the excitement of RC car racing for yourself.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/book"
                className="bg-fury-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-fury-orange/90 transition-all shadow-lg hover:shadow-fury-orange/25 whitespace-nowrap"
              >
                Book Now
              </Link>
              <Link
                href="/tracks"
                className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all whitespace-nowrap"
              >
                View Tracks
              </Link>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-heading text-xl sm:text-2xl text-white uppercase mb-6">
              More Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-secondary-yellow/30 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={related.coverImage}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-semibold text-sm group-hover:text-secondary-yellow transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-gray-500 text-xs mt-2">{related.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
