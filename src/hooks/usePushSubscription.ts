'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

// Utility to convert Base64 URL to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export function usePushSubscription(userId: string | undefined) {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            // Setup the service worker
            navigator.serviceWorker.register('/sw.js').then((reg) => {
                setRegistration(reg)
                reg.pushManager.getSubscription().then((sub) => {
                    if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
                        setSubscription(sub)
                        setIsSubscribed(true)
                    }
                })
            })
        }
    }, [])

    const subscribeButtonOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (!userId || !registration) return

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidKey) {
            console.error('No VAPID public key configured.')
            return
        }

        try {
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey),
            })

            setSubscription(sub)
            setIsSubscribed(true)

            // Save to Supabase
            const supabase = createClient()
            const p256dh = sub.getKey('p256dh')
            const auth = sub.getKey('auth')

            if (p256dh && auth) {
                await supabase.from('push_subscriptions').upsert({
                    user_id: userId,
                    endpoint: sub.endpoint,
                    p256dh_key: Buffer.from(p256dh).toString('base64'),
                    auth_key: Buffer.from(auth).toString('base64'),
                }, { onConflict: 'endpoint' })
            }

            console.log('Web push subscribed and saved to DB')

        } catch (err) {
            console.error('Failed to subscribe to web push:', err)
        }
    }

    const unsubscribeButtonOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (!subscription || !userId) return

        try {
            await subscription.unsubscribe()
            setSubscription(null)
            setIsSubscribed(false)

            // Remove from DB
            const supabase = createClient()
            await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint)

            console.log('Web push unsubscribed and removed from DB')
        } catch (err) {
            console.error('Failed to unsubscribe from web push:', err)
        }
    }

    return { isSubscribed, subscribeButtonOnClick, unsubscribeButtonOnClick }
}
