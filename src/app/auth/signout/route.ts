import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
    const supabase = await createClient()

    // Check if we have a session
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
        await supabase.auth.signOut()
    }

    // Clear cache and redirect
    revalidatePath('/', 'layout')
    return NextResponse.redirect(new URL('/auth/login', request.url), {
        status: 302,
    })
}
