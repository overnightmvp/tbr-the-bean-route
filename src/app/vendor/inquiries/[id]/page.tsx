import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ChatWindow from './ChatWindow'

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) redirect('/auth/login')

    const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .ilike('contact_email', user.email)
        .single()

    if (!vendor) redirect('/vendor/dashboard')

    const { id } = await params;

    const { data: inquiry, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .eq('vendor_id', vendor.id)
        .single()

    if (error || !inquiry) {
        return (
            <div className="max-w-3xl mx-auto py-12 text-center">
                <h2 className="text-xl font-semibold text-gray-900">Inquiry not found</h2>
                <p className="mt-2 text-gray-500">This request may have been deleted or doesn't belong to your account.</p>
                <Link href="/vendor/inquiries" className="mt-4 inline-block text-amber-600 hover:text-amber-500">
                    Return to inquiries
                </Link>
            </div>
        )
    }

    // Handle status update
    async function updateStatus(formData: FormData) {
        'use server'
        const newStatus = formData.get('status') as string
        if (!newStatus) return

        const { id } = await params;
        await supabase.from('inquiries').update({ status: newStatus }).eq('id', id)
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/vendor/inquiries" className="text-sm font-medium text-amber-600 hover:text-amber-500">
                        &larr; Back to Inquiries
                    </Link>
                    <span className="text-gray-300">|</span>
                    <h1 className="text-2xl font-semibold text-gray-900">Inquiry Details</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Details & Status */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Status Update</h3>
                        </div>
                        <div className="p-6">
                            <form action={updateStatus} className="space-y-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        Current Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                                        defaultValue={inquiry.status}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="converted">Confirmed/Booked</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                >
                                    Update Status
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Event Information</h3>
                        </div>
                        <div className="px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Client Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{inquiry.contact_name}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <a href={`mailto:${inquiry.contact_email}`} className="text-amber-600">{inquiry.contact_email}</a>
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Event Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {inquiry.event_date ? new Date(inquiry.event_date).toLocaleDateString() : 'Not specified'}
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Guests</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{inquiry.guest_count || 'Unknown'}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Requests</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                                        {inquiry.special_requests || 'No special requests.'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Right Column: Chat Window */}
                <div className="lg:col-span-2 space-y-6">
                    <ChatWindow inquiry={inquiry} vendorId={vendor.id} />
                </div>

            </div>
        </div>
    )
}
