import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Melbourne Coffee Cart Vendors | The Bean Route',
  description: 'Compare 10+ verified coffee cart vendors across Melbourne. Filter by suburb, event type, and price. Free quotes from trusted mobile baristas.',
  openGraph: {
    title: 'Browse Melbourne Coffee Cart Vendors | The Bean Route',
    description: 'Compare 10+ verified coffee cart vendors across Melbourne. Filter by suburb, event type, and price. Free quotes from trusted mobile baristas.',
    type: 'website',
    url: 'https://thebeanroute.com.au/app',
  },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
