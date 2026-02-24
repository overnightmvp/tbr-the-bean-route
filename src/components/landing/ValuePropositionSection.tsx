import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ValuePropositionSection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4">
            Why Choose The Bean Route?
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Melbourne's premier marketplace connecting event organizers with coffee cart vendors.
            Quality coffee experiences for every occasion.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* For Event Organizers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">For Event Organizers</CardTitle>
              <CardDescription>Stress-free coffee catering</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>✓ Curated list of verified vendors</li>
                <li>✓ Compare prices and availability</li>
                <li>✓ Direct quote requests</li>
                <li>✓ Transparent pricing (AUD/hr)</li>
                <li>✓ Reviews and ratings</li>
              </ul>
            </CardContent>
          </Card>

          {/* For Coffee Vendors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">For Coffee Vendors</CardTitle>
              <CardDescription>Grow your business</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>✓ Free vendor listing</li>
                <li>✓ Direct inquiry notifications</li>
                <li>✓ Build your reputation</li>
                <li>✓ Access to event market</li>
                <li>✓ Simple registration process</li>
              </ul>
            </CardContent>
          </Card>

          {/* Our Promise */}
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Our Promise</CardTitle>
              <CardDescription>Quality and trust</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>✓ Verified vendors only</li>
                <li>✓ Transparent reviews</li>
                <li>✓ No booking fees</li>
                <li>✓ Local Melbourne focus</li>
                <li>✓ Responsive support</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
