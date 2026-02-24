import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-16 sm:py-20">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-800 mb-4">
          Melbourne's Coffee Cart Marketplace
        </h1>
        <p className="text-lg sm:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
          Find the perfect coffee experience for your event, or grow your coffee business
          with direct access to Melbourne's event market.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary CTA - Event Organizers */}
          <Link href="/app">
            <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
              Find Coffee Vendors
            </Button>
          </Link>

          {/* Secondary CTA - Vendors */}
          <Link href="/vendors/register">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
              List Your Business
            </Button>
          </Link>
        </div>

        {/* Subtext */}
        <p className="text-sm text-neutral-500 mt-6">
          Free for event organizers • Free vendor listings
        </p>
      </div>
    </section>
  )
}
