import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function VendorDashboardPage() {
    const supabase = await createClient()

    // Get current user session
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
        redirect('/auth/login')
    }

    // Find the vendor associated with this user
    const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('*')
        .ilike('contact_email', user.email)
        .single()

    if (vendorError || !vendor) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">No linked vendor profile found</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    We couldn't find a vendor profile associated with the email address <strong>{user.email}</strong>.
                                    If you believe this is an error, please contact support or ensure you're using the email address you registered with.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Fetch performance metrics
    // Get latest inquiries
    const { data: inquiries } = await supabase
        .from('inquiries')
        .select('*')
        .eq('vendor_id', vendor.id)
        .order('created_at', { ascending: false })

    const totalInquiries = inquiries?.length || 0
    const pendingInquiries = inquiries?.filter(i => i.status === 'pending').length || 0
    const recentInquiries = inquiries?.slice(0, 5) || []

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Overview of your performance and recent activity for {vendor.business_name}.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Inquiries Metric Card */}
                <div className="overflow-hidden rounded-lg bg-white shadow p-5">
                    <dt className="truncate text-sm font-medium text-gray-500">Total Inquiries</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalInquiries}</dd>
                </div>

                {/* Pending Inquiries Metric Card */}
                <div className="overflow-hidden rounded-lg bg-white shadow p-5">
                    <dt className="truncate text-sm font-medium text-gray-500">Pending Actions</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-amber-600">{pendingInquiries}</dd>
                </div>

                {/* Profile Status Card */}
                <div className="overflow-hidden rounded-lg bg-white shadow p-5">
                    <dt className="truncate text-sm font-medium text-gray-500">Profile Status</dt>
                    <dd className="mt-1 text-lg font-semibold tracking-tight text-gray-900 flex items-center h-9">
                        {vendor.verified ? (
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Verified & Live
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                Pending Approval
                            </span>
                        )}
                    </dd>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Recent Inquiries Panel */}
                <section className="bg-white shadow rounded-lg">
                    <div className="border-b border-gray-200 px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Recent Inquiries</h2>
                        <Link href="/vendor/inquiries" className="text-sm font-medium text-amber-600 hover:text-amber-500">
                            View all
                        </Link>
                    </div>
                    <div className="px-4 py-5 sm:p-0">
                        {recentInquiries.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {recentInquiries.map((inquiry) => (
                                    <li key={inquiry.id} className="py-4 px-6 flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {inquiry.contact_name} - {inquiry.event_type || 'Event'}
                                            </p>
                                            <p className="truncate text-sm text-gray-500">
                                                {new Date(inquiry.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${inquiry.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-sm text-gray-500">No inquiries yet.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Actions Panel */}
                <section className="bg-white shadow rounded-lg">
                    <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/vendor/profile" className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2 hover:border-gray-400 pl-4 pr-4">
                                <div className="min-w-0 flex-1">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    <p className="text-sm font-medium text-gray-900">Update Profile</p>
                                    <p className="text-sm text-gray-500 line-clamp-2">Edit your photos, bio, and pricing</p>
                                </div>
                            </Link>
                            <Link href="/vendor/inquiries" className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2 hover:border-gray-400 pl-4 pr-4">
                                <div className="min-w-0 flex-1">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    <p className="text-sm font-medium text-gray-900">Manage Inquiries</p>
                                    <p className="text-sm text-gray-500 line-clamp-2">Respond to your customer quotes</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    )
}
