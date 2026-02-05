import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Melbourne Coffee Cart Jobs | The Bean Route',
  description: 'Find mobile coffee cart opportunities in Melbourne. Event organizers post jobs, vendors submit quotes. Free to join.',
  openGraph: {
    title: 'Melbourne Coffee Cart Jobs | The Bean Route',
    description: 'Find mobile coffee cart opportunities in Melbourne. Event organizers post jobs, vendors submit quotes. Free to join.',
    type: 'website',
    url: 'https://thebeanroute.com.au/jobs',
  },
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
