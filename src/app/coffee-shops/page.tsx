import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'
import CoffeeShopsClient from './CoffeeShopsClient'
import JsonLd from '@/components/seo/JsonLd'

const baseUrl = 'https://thebeanroute.com.au'

export const metadata: Metadata = {
  title: 'Melbourne Coffee Shops | Specialty Cafes & Roasters | The Bean Route',
  description: 'Discover the best specialty coffee shops and cafes in Melbourne. Filter by suburb, rating, price range, and amenities. Find your perfect local cafe with opening hours, reviews, and directions.',
  openGraph: {
    title: 'Melbourne Coffee Shops | The Bean Route',
    description: 'Discover specialty coffee shops and cafes across Melbourne. Filter by location, rating, and price range.',
    type: 'website',
    url: `${baseUrl}/coffee-shops`,
  },
}

export default async function CoffeeShopsPage() {
  // Fetch coffee shops from Supabase (server-side for SEO)
  const { data: coffeeShops } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('vendor_type', 'coffee_shop')
    .eq('verified', true)
    .order('average_rating', { ascending: false, nullsFirst: false })

  // Get unique suburbs for local SEO
  const suburbs = coffeeShops
    ? Array.from(new Set(coffeeShops.flatMap(shop => shop.suburbs))).sort()
    : []

  // Structured data for the page
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Melbourne Coffee Shops',
    description: 'Curated list of specialty coffee shops and cafes in Melbourne',
    numberOfItems: coffeeShops?.length || 0,
    itemListElement: coffeeShops?.slice(0, 10).map((shop, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CafeOrCoffeeShop',
        name: shop.business_name,
        url: `${baseUrl}/vendors/${shop.slug}`,
        description: shop.specialty,
        address: shop.physical_address
          ? {
              '@type': 'PostalAddress',
              streetAddress: shop.physical_address,
              addressLocality: shop.suburbs[0] || 'Melbourne',
              addressRegion: 'Victoria',
              addressCountry: 'Australia',
            }
          : undefined,
        aggregateRating: shop.average_rating && shop.review_count > 0
          ? {
              '@type': 'AggregateRating',
              ratingValue: shop.average_rating.toString(),
              ratingCount: shop.review_count.toString(),
            }
          : undefined,
        priceRange: shop.price_range || '$$',
      },
    })) || [],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Coffee Shops' },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the best coffee shops in Melbourne?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Melbourne is home to ${coffeeShops?.length || 'many'} specialty coffee shops. Our directory features verified cafes across ${suburbs.length} suburbs, rated by customers and offering everything from single-origin espresso to specialty pour-overs. Filter by suburb, rating, and amenities to find your perfect local cafe.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How do I find coffee shops near me in Melbourne?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use our suburb filter to find coffee shops in your local area. We cover ${suburbs.length} Melbourne suburbs including CBD, Fitzroy, Carlton, South Melbourne, and more. Each listing includes the full address, opening hours, and directions via Google Maps.',
        },
      },
      {
        '@type': 'Question',
        name: 'What information is available for each coffee shop?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Each coffee shop listing includes: opening hours (with live "Open Now" status), physical address with map, customer ratings and reviews, price range, amenities (WiFi, parking, outdoor seating, wheelchair access), menu links, and social media profiles. This helps you find the perfect cafe for your needs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I filter coffee shops by specific features?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Filter coffee shops by suburb, rating, price range ($ to $$$$), and amenities like WiFi availability, parking, outdoor seating, and wheelchair accessibility. You can also filter by specialty tags to find cafes that match your coffee preferences.',
        },
      },
    ],
  }

  return (
    <>
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <CoffeeShopsClient initialCoffeeShops={coffeeShops || []} suburbs={suburbs} />
    </>
  )
}
