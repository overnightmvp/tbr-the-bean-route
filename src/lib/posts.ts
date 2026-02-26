import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface Post {
  slug: string
  title: string
  publishedAt: string
  status: 'published' | 'draft'
  category?: string
  excerpt?: string
  content: string
}

export function getAllPosts(): Post[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug: data.slug || slug,
        title: data.title || 'Untitled',
        publishedAt: data.publishedAt || new Date().toISOString(),
        status: data.status || 'draft',
        category: data.category,
        excerpt: data.excerpt,
        content,
      } as Post
    })
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return posts
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)

    // Try direct slug match first
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug: data.slug || slug,
        title: data.title || 'Untitled',
        publishedAt: data.publishedAt || new Date().toISOString(),
        status: data.status || 'draft',
        category: data.category,
        excerpt: data.excerpt,
        content,
      }
    }

    // Fallback: search all posts for matching frontmatter slug
    const posts = getAllPosts()
    return posts.find(post => post.slug === slug) || null
  } catch {
    return null
  }
}
