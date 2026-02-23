import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function VendorInquiriesPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) redirect('/auth/login')

    const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .ilike('contact_email', user.email)
        .single()

    if (!vendor) {
        redirect('/vendor/dashboard')
    }

    const { data: inquiries } = await supabase
        .from('inquiries')
        .select('*')
        .eq('vendor_id', vendor.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Inquiries</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        A list of all incoming requests for quotes and bookings.
                    </p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Client & Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Event Details
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {inquiries && inquiries.length > 0 ? (
                                inquiries.map((inquiry) => (
                                    <tr key={inquiry.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{inquiry.contact_name}</div>
                                            <div className="text-sm text-gray-500">{new Date(inquiry.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{inquiry.event_type || 'Event'}</div>
                                            <div className="text-sm text-gray-500">
                                                {inquiry.event_date ? new Date(inquiry.event_date).toLocaleDateString() : 'TBD'} • {inquiry.guest_count} guests
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{inquiry.contact_email}</div>
                                            <div className="text-sm text-gray-500">{inquiry.contact_phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${inquiry.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/vendor/inquiries/${inquiry.id}`} className="text-amber-600 hover:text-amber-900 mr-4">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                        No inquiries found. Check back later!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
