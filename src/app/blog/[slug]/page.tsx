import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@/payload-config-promise'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import JsonLd from '@/components/seo/JsonLd'
import RichTextRenderer from '@/components/blog/RichTextRenderer'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: await configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const post = docs[0]
  if (!post) return {}

  const metaDescription = post.seo?.metaDescription || post.excerpt
  const ogImage = post.seo?.ogImage || post.featuredImage
  const ogImageUrl = typeof ogImage === 'object' ? ogImage?.url : undefined

  return {
    title: `${post.title} | The Bean Route`,
    description: metaDescription,
    keywords: post.seo?.targetKeywords?.map((k: any) => k.keyword).join(', '),
    openGraph: {
      title: post.title,
      description: metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: metaDescription,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: await configPromise })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    limit: 100,
  })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: await configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const post = docs[0]
  if (!post || post.status !== 'published') {
    notFound()
  }

  // Fetch related posts
  const { docs: relatedPosts } = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
      category: { equals: post.category },
      id: { not_equals: post.id },
    },
    limit: 3,
    sort: '-publishedAt',
  })

  // Conversion CTA based on goal
  const conversionCTA = {
    job_posting: {
      text: 'Post Your Event',
      href: '/jobs/create',
      description: 'Looking for a coffee cart? Post your event and get quotes from vendors.',
    },
    vendor_signup: {
      text: 'Become a Vendor',
      href: '/vendors/register',
      description: 'Ready to grow your coffee cart business? Join The Bean Route.',
    },
    inquiry: {
      text: 'Browse Vendors',
      href: '/',
      description: 'Find the perfect coffee cart for your event.',
    },
  }

  const cta = conversionCTA[post.conversionGoal as keyof typeof conversionCTA]

  return (
    <>
      {/* JSON-LD Schema */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: {
            '@type': 'Organization',
            name: 'The Bean Route',
            url: 'https://thebeanroute.com.au',
          },
          publisher: {
            '@type': 'Organization',
            name: 'The Bean Route',
            url: 'https://thebeanroute.com.au',
          },
          image: typeof post.featuredImage === 'object' ? post.featuredImage?.url : undefined,
          keywords: post.seo?.targetKeywords?.map((k: any) => k.keyword).join(', '),
        }}
      />

      <article className="container mx-auto px-4 py-16">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          <span className="mx-2">/</span>
          <span>{post.title}</span>
        </nav>

        {/* Header */}
        <header className="max-w-4xl mx-auto mb-12">
          {/* Category & Priority Badges */}
          <div className="flex gap-2 mb-4">
            <Badge variant="default">
              {post.category === 'event-focused' ? 'Event Planning' : 'Coffee Education'}
            </Badge>
            {post.editorial?.priority && (
              <Badge variant="outline">
                {post.editorial.priority === 'quick-win' ? '🔥 Quick Win' :
                 post.editorial.priority === 'authority' ? '💡 Authority' :
                 post.editorial.priority === 'conversion' ? '🎯 Conversion' :
                 '📚 Specialized'}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {post.seo?.targetKeywords && post.seo.targetKeywords.length > 0 && (
              <>
                <span>•</span>
                <span>{post.seo.targetKeywords.length} keywords</span>
              </>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && typeof post.featuredImage === 'object' && (
          <div className="max-w-5xl mx-auto mb-12">
            <img
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <RichTextRenderer
            content={post.content}
            className="prose prose-lg prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none"
          />
        </div>

        {/* Conversion CTA */}
        {cta && (
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 mb-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{cta.description}</h2>
              <Button asChild size="lg" className="mt-4">
                <Link href={cta.href}>{cta.text}</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
                >
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {relatedPost.excerpt}
                  </p>
                  <span className="text-primary text-sm font-semibold group-hover:underline">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  )
}
