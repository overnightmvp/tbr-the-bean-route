import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import { getAllPosts, getPostBySlug } from '@/lib/posts'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Blog Post | The Bean Route',
      description: 'Coffee cart hire guides for Melbourne event organizers and vendors',
    }
  }

  return {
    title: `${post.title} | The Bean Route`,
    description: post.excerpt || 'Coffee cart hire guides for Melbourne',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.publishedAt,
    },
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-16">
      {/* Back button */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="gap-2">
            ← Back to Blog
          </Button>
        </Link>
      </div>

      {/* Article header */}
      <header className="max-w-4xl mx-auto mb-12">
        {/* Category badge */}
        {post.category && (
          <div className="mb-4">
            <Badge variant="outline" className="capitalize">
              {post.category}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-AU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </header>

      {/* Article content */}
      <div className="max-w-4xl mx-auto prose prose-lg">
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
            h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
            h3: ({ ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
            p: ({ ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
            ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
            ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
            a: ({ ...props }) => <a className="text-primary underline hover:no-underline" {...props} />,
            blockquote: ({ ...props }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* CTA section */}
      <div className="max-w-4xl mx-auto mt-16 bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Book a Coffee Cart?</h3>
        <p className="text-gray-600 mb-6">
          Browse Melbourne's top coffee cart vendors and get quotes for your event
        </p>
        <Link href="/">
          <Button size="lg">View Vendor Directory</Button>
        </Link>
      </div>
    </article>
  )
}
