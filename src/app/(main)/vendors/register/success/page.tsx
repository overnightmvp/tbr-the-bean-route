import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8' }}>
      <Header variant="app" />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Registration Submitted!
          </h1>
          <p className="text-neutral-600">
            Thank you for applying to The Bean Route
          </p>
        </div>

        {/* Same content as modal (what happens next, tips, actions) */}
        <div className="space-y-6">
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="pt-6">
              <h2 className="font-semibold text-neutral-800 mb-3">What Happens Next?</h2>
              <ol className="space-y-3 text-sm text-neutral-700">
                <li className="flex gap-2">
                  <span className="font-semibold text-primary-600">1.</span>
                  <span>
                    <strong>Review (24-48 hours):</strong> Our team will review your application
                    to ensure it meets our quality standards.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary-600">2.</span>
                  <span>
                    <strong>Approval Email:</strong> You'll receive an email with your approval
                    status and next steps.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary-600">3.</span>
                  <span>
                    <strong>Go Live:</strong> Once approved, your profile will be visible to
                    event organizers across Melbourne.
                  </span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-semibold text-neutral-800 mb-3">Tips While You Wait</h2>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li>✓ Prepare high-quality photos of your setup and coffee</li>
                <li>✓ Draft descriptions of your services and specialties</li>
                <li>✓ Review your pricing and availability</li>
                <li>✓ Check your email for our approval notification</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">Return Home</Button>
            </Link>
            <Link href="/app" className="flex-1">
              <Button variant="primary" className="w-full">Browse Vendors</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
