import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { PushNotificationSettings } from './PushNotificationSettings'

export default async function VendorProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) redirect('/auth/login')

    const { data: vendor } = await supabase
        .from('vendors')
        .select('*')
        .ilike('contact_email', user.email)
        .single()

    if (!vendor) {
        redirect('/vendor/dashboard')
    }

    // Server action to update profile
    async function updateProfile(formData: FormData) {
        'use server'

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !user.email) return

        const { data: currentVendor } = await supabase
            .from('vendors')
            .select('id, social_links')
            .ilike('contact_email', user.email)
            .single()

        if (!currentVendor) return

        const updates = {
            description: formData.get('description') as string,
            contact_phone: formData.get('contact_phone') as string,
            website: formData.get('website') as string,
            instagram_handle: formData.get('instagram_handle') as string,
            facebook_url: formData.get('facebook_url') as string,
            social_links: {
                ...(currentVendor.social_links as Record<string, string> || {}),
                linkedin: formData.get('linkedin_url') as string || undefined,
                tiktok: formData.get('tiktok_url') as string || undefined,
            }
        }

        await supabase
            .from('vendors')
            .update(updates)
            .eq('id', currentVendor.id)

        revalidatePath('/vendor/profile')
        revalidatePath(`/vendors/${vendor?.slug}`)
    }

    const socialLinksParams = (vendor.social_links as Record<string, string>) || {}

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Update your public listing details and social links.
                </p>
            </div>

            <PushNotificationSettings vendorId={vendor.id} />

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <form action={updateProfile} className="space-y-8 divide-y divide-gray-200">

                        <div className="space-y-6 sm:space-y-5">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Business Information</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500 border-b-0 pb-2">
                                    To change core details like your specific business name or specialty, please contact support.
                                </p>
                            </div>

                            <div className="space-y-6 sm:space-y-5">
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Business Name
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="text"
                                            id="businessName"
                                            disabled
                                            defaultValue={vendor.business_name}
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:max-w-xs sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        About / Bio
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                            defaultValue={vendor.description || ''}
                                        />
                                        <p className="mt-2 text-sm text-gray-500">Brief description of your offering.</p>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                    <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Phone Number
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="text"
                                            name="contact_phone"
                                            id="contact_phone"
                                            defaultValue={vendor.contact_phone || ''}
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:max-w-xs sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Web & Social Links</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500 border-b-0 pb-2">
                                    Enhance your SEO by adding your social profiles.
                                </p>
                            </div>
                            <div className="space-y-6 sm:space-y-5">
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Website URL
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="url"
                                            name="website"
                                            id="website"
                                            defaultValue={vendor.website || ''}
                                            placeholder="https://example.com"
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                    <label htmlFor="instagram_handle" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Instagram Handle
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0 flex">
                                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                            @
                                        </span>
                                        <input
                                            type="text"
                                            name="instagram_handle"
                                            id="instagram_handle"
                                            defaultValue={vendor.instagram_handle || ''}
                                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                    <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Facebook URL
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="url"
                                            name="facebook_url"
                                            id="facebook_url"
                                            defaultValue={vendor.facebook_url || ''}
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                    <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        LinkedIn URL
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="url"
                                            name="linkedin_url"
                                            id="linkedin_url"
                                            defaultValue={socialLinksParams.linkedin || ''}
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                                    <label htmlFor="tiktok_url" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        TikTok URL
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="url"
                                            name="tiktok_url"
                                            id="tiktok_url"
                                            defaultValue={socialLinksParams.tiktok || ''}
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="pt-5">
                            <div className="flex justify-end gap-3">
                                <Link
                                    href="/vendor/dashboard"
                                    className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-amber-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                >
                                    Save Profile
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
