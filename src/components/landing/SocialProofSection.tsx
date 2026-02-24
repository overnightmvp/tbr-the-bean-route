import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function SocialProofSection() {
  return (
    <section className="bg-neutral-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-neutral-800">
          Trusted by Melbourne's Coffee Community
        </h2>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-4xl font-bold text-primary-400 mb-2">10+</div>
              <p className="text-neutral-600">Verified Vendors</p>
              <p className="text-sm text-neutral-500 mt-2">
                Mobile carts, coffee shops, baristas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-8">
              <div className="text-4xl font-bold text-primary-400 mb-2">50+</div>
              <p className="text-neutral-600">Events Serviced</p>
              <p className="text-sm text-neutral-500 mt-2">
                Weddings, corporate, private events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-8">
              <div className="text-4xl font-bold text-primary-400 mb-2">23</div>
              <p className="text-neutral-600">Melbourne Suburbs</p>
              <p className="text-sm text-neutral-500 mt-2">
                Chadstone, Carlton, Fitzroy, and more
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials (placeholder - can be populated from CMS later) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardContent className="py-6">
              <p className="text-neutral-600 italic mb-4">
                "The Bean Route made it so easy to find a mobile coffee cart for our wedding.
                Professional service, amazing coffee!"
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="verified">Verified Event</Badge>
                <span className="text-sm text-neutral-500">— Sarah M., Wedding Client</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <p className="text-neutral-600 italic mb-4">
                "As a vendor, getting listed on The Bean Route increased my bookings by 30%.
                Highly recommend!"
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="verified">Verified Vendor</Badge>
                <span className="text-sm text-neutral-500">— Mobile Cart Specialist</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
