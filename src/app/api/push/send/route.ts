import webpush from 'web-push'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
    try {
        // Configure web-push inside handler to prevent build-time errors if keys are missing
        if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
            webpush.setVapidDetails(
                'mailto:your-email@example.com',
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                process.env.VAPID_PRIVATE_KEY
            )
        }

        const { title, body, url, targetUserId } = await request.json()

        // Validate request
        if (!title || !body || !targetUserId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const supabase = await createClient()

        // Get subscriptions for target user
        const { data: subscriptions } = await supabase
            .from('push_subscriptions')
            .select('*')
            .eq('user_id', targetUserId)

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({ message: 'No subscriptions found for user' })
        }

        const notificationPayload = JSON.stringify({ title, body, url })

        // Send to all subscriptions for that user
        const sendPromises = subscriptions.map((sub) => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth_key,
                    p256dh: sub.p256dh_key
                }
            }

            return webpush.sendNotification(pushSubscription, notificationPayload)
                .catch(err => {
                    if (err.statusCode === 404 || err.statusCode === 410) {
                        // Subscription expired or unsubscribed, remove it
                        console.log('Subscription expired, removing from DB', sub.endpoint)
                        return supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
                    }
                    console.error('Error sending push notification', err)
                })
        })

        await Promise.all(sendPromises)

        return NextResponse.json({ success: true, count: subscriptions.length })

    } catch (error) {
        console.error('Push notification error:', error)
        return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
    }
}
