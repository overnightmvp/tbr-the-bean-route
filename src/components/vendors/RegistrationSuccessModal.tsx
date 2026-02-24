import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface RegistrationSuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  businessName?: string
}

export function RegistrationSuccessModal({ open, onOpenChange, businessName }: RegistrationSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-green-600">
            🎉 Registration Submitted!
          </DialogTitle>
          <DialogDescription className="text-center">
            Thank you for applying to The Bean Route
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Confirmation message */}
          <div className="text-center">
            <p className="text-neutral-700 mb-2">
              We've received your application{businessName ? ` for ${businessName}` : ''}.
            </p>
            <p className="text-sm text-neutral-600">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>

          {/* What happens next */}
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-neutral-800 mb-3">What Happens Next?</h3>
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

          {/* Tips while waiting */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-neutral-800 mb-3">Tips While You Wait</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li>✓ Prepare high-quality photos of your setup and coffee</li>
                <li>✓ Draft descriptions of your services and specialties</li>
                <li>✓ Review your pricing and availability</li>
                <li>✓ Check your email for our approval notification</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Return Home
              </Button>
            </Link>
            <Link href="/app" className="flex-1">
              <Button variant="primary" className="w-full">
                Browse Vendors
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
