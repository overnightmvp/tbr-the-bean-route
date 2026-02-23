import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function VendorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                        Vendor Portal
                    </span>
                </div>
                <nav className="p-4 space-y-1">
                    <Link
                        href="/vendor/dashboard"
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-amber-50 text-amber-700"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/vendor/inquiries"
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Inquiries
                    </Link>
                    <Link
                        href="/vendor/profile"
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        My Profile
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
                    <h1 className="text-sm font-medium text-gray-500">Welcome, {user.email}</h1>
                    <form action="/auth/signout" method="POST">
                        <button className="text-sm font-medium text-gray-700 hover:text-amber-600">
                            Sign out
                        </button>
                    </form>
                </header>
                <div className="flex-1 overflow-auto p-8">{children}</div>
            </main>
        </div>
    )
}
