import { getVendorBySlug, formatPriceRange } from '@/lib/vendors'
import VendorPageClient from './VendorPageClient'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const vendor = getVendorBySlug(params.slug)
  if (!vendor) return { title: 'Vendor Not Found | The Bean Route' }
  return {
    title: `${vendor.businessName} — Mobile Coffee Cart | The Bean Route`,
    description: `${vendor.description} Serving ${vendor.suburbs.join(', ')}. ${formatPriceRange(vendor)} per hour.`,
    openGraph: {
      title: `${vendor.businessName} — Mobile Coffee Cart | The Bean Route`,
      description: vendor.description,
      type: 'website' as const,
    },
  }
}

export default function VendorPage({ params }: { params: { slug: string } }) {
  return <VendorPageClient slug={params.slug} />
}
