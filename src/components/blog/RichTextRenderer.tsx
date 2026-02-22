import React from 'react'

interface RichTextRendererProps {
  content: any
  className?: string
}

/**
 * Renders Payload Lexical editor content as HTML
 *
 * This is a simplified renderer. For production, consider using:
 * - @payloadcms/richtext-lexical/react package
 * - Custom serializers for advanced node types
 */
export default function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  if (!content) return null

  // Handle Lexical editor format
  if (content.root && content.root.children) {
    return (
      <div className={className}>
        {renderNodes(content.root.children)}
      </div>
    )
  }

  // Fallback for other formats
  return (
    <div className={className}>
      <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  )
}

function renderNodes(nodes: any[]): React.ReactNode {
  return nodes.map((node, index) => renderNode(node, index))
}

function renderNode(node: any, key: number): React.ReactNode {
  // Text node
  if (node.type === 'text') {
    let text = node.text
    let element: React.ReactNode = text

    // Apply formatting
    if (node.format) {
      if (node.format & 1) element = <strong key={key}>{element}</strong> // Bold
      if (node.format & 2) element = <em key={key}>{element}</em> // Italic
      if (node.format & 8) element = <code key={key} className="bg-gray-100 px-1 rounded">{element}</code> // Code
      if (node.format & 16) element = <u key={key}>{element}</u> // Underline
    }

    return element
  }

  // Paragraph
  if (node.type === 'paragraph') {
    return (
      <p key={key} className="mb-4">
        {node.children && renderNodes(node.children)}
      </p>
    )
  }

  // Headings
  if (node.type === 'heading') {
    const tag = node.tag || 'h2'
    const Component = tag as keyof JSX.IntrinsicElements

    return (
      <Component key={key} id={createAnchorId(node.children)}>
        {node.children && renderNodes(node.children)}
      </Component>
    )
  }

  // List
  if (node.type === 'list') {
    const ListComponent = node.listType === 'number' ? 'ol' : 'ul'
    return (
      <ListComponent key={key} className="mb-4 ml-6 list-disc">
        {node.children && renderNodes(node.children)}
      </ListComponent>
    )
  }

  // List item
  if (node.type === 'listitem') {
    return (
      <li key={key} className="mb-2">
        {node.children && renderNodes(node.children)}
      </li>
    )
  }

  // Link
  if (node.type === 'link') {
    const isExternal = node.fields?.url?.startsWith('http')
    return (
      <a
        key={key}
        href={node.fields?.url || '#'}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-primary hover:underline"
      >
        {node.children && renderNodes(node.children)}
      </a>
    )
  }

  // Quote
  if (node.type === 'quote') {
    return (
      <blockquote key={key} className="border-l-4 border-primary pl-4 italic my-6 text-gray-700">
        {node.children && renderNodes(node.children)}
      </blockquote>
    )
  }

  // Code block
  if (node.type === 'code') {
    return (
      <pre key={key} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
        <code>{node.children && renderNodes(node.children)}</code>
      </pre>
    )
  }

  // Line break
  if (node.type === 'linebreak') {
    return <br key={key} />
  }

  // Horizontal rule
  if (node.type === 'horizontalrule') {
    return <hr key={key} className="my-8 border-gray-300" />
  }

  // Unknown node type - render children or fallback
  if (node.children) {
    return <div key={key}>{renderNodes(node.children)}</div>
  }

  return null
}

/**
 * Create URL-friendly anchor ID from heading text
 */
function createAnchorId(children: any[]): string {
  if (!children) return ''

  const text = children
    .map(child => (child.type === 'text' ? child.text : ''))
    .join('')

  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
