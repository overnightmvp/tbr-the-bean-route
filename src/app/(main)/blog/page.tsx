import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@/payload-config-promise'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Coffee Cart Hire Blog | Melbourne Event Planning & Vendor Guides',
  description: 'Expert guides on hiring coffee carts in Melbourne, event planning tips, and vendor resources. Learn about pricing, permits, and best practices.',
}

export default async function BlogPage() {
  let posts: any[] = []
  let error: string | null = null

  // Check if Payload CMS is configured before attempting to connect
  if (!process.env.DATABASE_URI) {
    error = 'Blog is currently unavailable. Please check back soon.'
  } else {
    try {
      const payload = await getPayload({ config: await configPromise })

      const { docs } = await payload.find({
        collection: 'posts',
        where: {
          status: {
            equals: 'published',
          },
        },
        sort: '-publishedAt',
        limit: 50,
      })

      posts = docs
    } catch (err) {
      console.error('Blog database error:', err)
      error = 'Blog is currently unavailable. Please check back soon.'
    }
  }

  // Show error state if database fails
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Coffee Cart Hire Blog
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Expert guides for event organizers and coffee cart vendors in Melbourne
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-gray-700 mb-2">{error}</p>
            <p className="text-sm text-gray-500">
              We're working to restore blog access. In the meantime, browse our{' '}
              <Link href="/" className="text-primary underline">vendor directory</Link>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Group posts by category
  const eventPosts = posts.filter(p => p.category === 'event-focused')
  const educationPosts = posts.filter(p => p.category === 'coffee-education')

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Coffee Cart Hire Blog
        </h1>
        <p className="text-xl text-gray-600">
          Expert guides for event organizers and coffee cart vendors in Melbourne
        </p>
      </div>

      {/* Event-Focused Posts */}
      {eventPosts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold">Event Planning Guides</h2>
            <Badge variant="default">For Organizers</Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Coffee Education Posts */}
      {educationPosts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold">Coffee Education</h2>
            <Badge variant="outline">For Vendors</Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {educationPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* No posts state */}
      {posts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No blog posts published yet.</p>
        </div>
      )}
    </div>
  )
}

function BlogCard({ post }: { post: any }) {
  const priorityColors = {
    'quick-win': 'bg-green-100 text-green-800',
    'authority': 'bg-blue-100 text-blue-800',
    'conversion': 'bg-purple-100 text-purple-800',
    'specialized': 'bg-orange-100 text-orange-800',
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
    >
      {/* Featured Image */}
      {post.featuredImage && typeof post.featuredImage === 'object' && (
        <div className="aspect-video bg-gray-200 overflow-hidden relative">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Priority Badge */}
        {post.editorial?.priority && (
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[post.editorial.priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800'}`}>
              {post.editorial.priority === 'quick-win' ? '🔥 Quick Win' :
                post.editorial.priority === 'authority' ? '💡 Authority' :
                  post.editorial.priority === 'conversion' ? '🎯 Conversion' :
                    '📚 Specialized'}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {new Date(post.publishedAt).toLocaleDateString('en-AU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="text-primary font-semibold group-hover:underline">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  )
}
