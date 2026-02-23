'use client'

import { usePushSubscription } from '@/hooks/usePushSubscription'
import { useState } from 'react'

export function PushNotificationSettings({ vendorId }: { vendorId: string }) {
    const { isSubscribed, subscribeButtonOnClick, unsubscribeButtonOnClick } = usePushSubscription(vendorId)
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true)
        await subscribeButtonOnClick(e)
        setLoading(false)
    }

    const handleUnsubscribe = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true)
        await unsubscribeButtonOnClick(e)
        setLoading(false)
    }

    return (
        <div className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Notifications</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Get notified instantly when a client sends you a direct message.</p>
                </div>
                <div className="mt-5">
                    {isSubscribed ? (
                        <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Enabled
                            </span>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                                onClick={handleUnsubscribe}
                                disabled={loading}
                            >
                                {loading ? 'Disabling...' : 'Disable Notifications'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Disabled
                            </span>
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-amber-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-700 disabled:opacity-50"
                                onClick={handleSubscribe}
                                disabled={loading}
                            >
                                {loading ? 'Enabling...' : 'Enable Notifications'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
