import { Metadata } from 'next'
import Link from 'next/link'
import { VendorLoginForm } from '@/components/vendors/auth/VendorLoginForm'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/navigation/Footer'

export const metadata: Metadata = {
  title: 'Vendor Login - The Bean Route',
  description: 'Login to your vendor account',
}

export default function VendorLoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="app" />

      <main className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Vendor Login</h1>
            <p className="text-gray-600 mt-2">
              Enter your email to receive a verification code
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <VendorLoginForm />
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            New vendor?{' '}
            <Link href="/vendors/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
