# App-Like UX System Design - Foundation-First Approach

**Date:** 2026-02-27
**Status:** Approved
**Author:** Claude Code with s-tier shadcn/iOS UX specialist guidance
**Estimated Effort:** 3 weeks (15 days)

## Executive Summary

Transform The Bean Route from generic website to premium app-like experience while fixing critical performance bottlenecks. Foundation-first strategy builds reusable component system once, then applies consistently across all 4 user flows.

**Key Improvements:**
- Mobile tab bar navigation (5 tabs, floating pill, scroll-aware)
- Hybrid animation system (CSS for 90%, Framer Motion for premium moments)
- Toast notifications + confetti celebrations + optimistic UI
- Performance layer: React.cache(), TanStack Query, dynamic imports
- Component architecture refactoring (compound components, form consolidation)

**Bundle Impact:** +32KB gzipped net (strategic additions offset by optimizations)
**Performance Gain:** 15-25% LCP improvement, zero async waterfalls
**UX Impact:** Mobile bounce rate ↓10-15%, form completion ↑20%, engagement ↑25%

---

## 1. Architecture Overview

### Technology Decisions

**Animations:**
- **Hybrid approach** - CSS/Tailwind for 90% of interactions, Framer Motion only for page transitions and celebration moments
- Rationale: Balance premium feel with bundle size (Framer Motion: 40KB gzipped, used strategically)

**State Management:**
- **TanStack Query** for client-side data caching and deduplication (12KB gzipped)
- Replaces raw Supabase calls, provides automatic refetching and cache invalidation
- **React Hook Form** for form state management (reduce re-renders)

**UI Library:**
- shadcn/ui + Radix UI (existing foundation)
- Add: Sonner for toasts (5KB gzipped)
- Add: Sheet component for mobile bottom drawers

**Performance:**
- React.cache() for server component deduplication
- Dynamic imports for modals (lazy load 15-20KB per modal)
- Promise.all() for parallel fetches
- Remove dynamic imports from useEffect

### Core Additions (Net New Components)

1. **TabBar** - Bottom floating pill with 5 tabs (Browse, Jobs, Create Job, Home, Analytics)
2. **Toast System** - Sonner for success/error feedback
3. **Skeleton System** - Branded loading states with brown/gold palette
4. **Page Transition Wrapper** - Framer Motion AnimatePresence for route changes
5. **API Client Layer** - Centralized fetch wrapper with React Query integration
6. **Sheet Component** - Mobile bottom drawer for forms/filters
7. **Error Boundaries** - Graceful error handling per route

### Bundle Impact Analysis

**Additions:**
- Framer Motion: +40KB gzipped (strategic use only)
- Sonner: +5KB gzipped
- TanStack Query: +12KB gzipped
- **Total added:** ~57KB gzipped

**Savings:**
- Dynamic imports for modals: -30KB (2 modals × 15KB each)
- Tree shaking unused variants: -5KB
- **Total savings:** ~35KB gzipped

**Net increase:** ~22KB gzipped (acceptable for premium UX)

---

## 2. Component System Design

### 2.1 Mobile Tab Bar Navigation

**Component:** `src/components/navigation/TabBar.tsx`

**Structure:**
```tsx
<motion.nav
  className="fixed bottom-4 left-4 right-4 z-50 lg:hidden"
  animate={{ y: isVisible ? 0 : 120 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  <div className="mx-auto max-w-md rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-brown-200">
    <div className="flex items-center justify-around px-4 py-2">
      {tabs.map((tab) => (
        <TabButton key={tab.href} {...tab} isActive={pathname === tab.href} />
      ))}
    </div>
  </div>
</motion.nav>
```

**Tabs:**
1. **Browse** (`/app`) - Marketplace icon, discover vendors
2. **Jobs** (`/jobs`) - Briefcase icon, job board
3. **Create Job** (`/jobs/create`) - Plus icon, post requirement
4. **Home** (`/`) - Home icon, landing page
5. **Analytics** (`/dashboard` or sign-up modal) - Chart icon, locked if not logged in

**Touch Targets:**
- Each tab button: 56px height (exceeds 44px iOS minimum)
- Icon: 24px, Label: 12px font size
- Padding ensures comfortable tap zones

**Animations:**
- Tab switch: Scale active icon 1.1x, fade inactive to 60% opacity
- Auto-hide: Scroll down hides tab bar, scroll up shows it (iOS Safari pattern)
- Active indicator: Golden background pill or animated underline

**Analytics Tab Special Behavior:**
- If user not logged in: Lock icon + "Sign up" label
- On tap: Opens sign-up modal instead of navigating
- If logged in: "Analytics" label, navigates to dashboard

### 2.2 Button System Overhaul

**Component:** `src/components/ui/button.tsx` (refactor existing)

**Key Changes:**

1. **Add `fullWidthMobile` variant:**
```typescript
const buttonVariants = cva(
  "transition-all duration-150 active:scale-95 min-h-[44px]", // Base
  {
    variants: {
      // Keep existing: primary, default, outline, ghost, link, etc.

      // Add new mobile behavior
      width: {
        auto: "w-auto",
        full: "w-full",
        fullMobile: "w-full lg:w-auto", // NEW - full on mobile, auto on desktop
      },

      // Loading state styling
      loading: {
        true: "opacity-75 cursor-wait pointer-events-none",
      }
    },
    defaultVariants: {
      width: "fullMobile", // Mobile-first default
    }
  }
)
```

2. **Consistent touch feedback - All variants get:**
- `active:scale-95` - Press down animation
- `transition-all duration-150` - Smooth spring feel
- `focus-visible:ring-2 ring-offset-2` - Keyboard accessibility

3. **Loading states:**
```tsx
<Button loading={isSubmitting}>
  {isSubmitting ? <Spinner /> : 'Submit'}
</Button>
```

**Usage Patterns:**
```tsx
// Standalone buttons on mobile auto-expand
<Button>Book Now</Button> // Full width on mobile, auto on desktop

// Override when needed
<Button width="auto">Cancel</Button> // Auto width everywhere

// Loading state
<Button loading={isSubmitting}>Submit</Button> // Shows spinner + disabled
```

**Press States:**
```css
/* Primary buttons */
active:bg-primary-600 active:shadow-inner

/* Outline buttons */
active:bg-brown-50 active:border-brown-400

/* Ghost buttons */
active:bg-brown-100
```

---

## 3. Animation & Microinteraction System

### 3.1 Animation Primitives (CSS/Tailwind)

**Component:** `src/lib/animations.ts` (new utility file)

**Core Animations (No JS required):**
```typescript
export const animations = {
  // Card entrance
  cardEnter: "animate-in fade-in-0 slide-in-from-bottom-4 duration-300",

  // Staggered list items (use with delay utilities)
  listItem: "animate-in fade-in-0 slide-in-from-left-2 duration-200",

  // Button press feedback
  press: "active:scale-95 transition-transform duration-150",

  // Hover lift
  lift: "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200",

  // Spinner (existing, but branded)
  spinner: "animate-spin border-2 border-brown-600 border-t-transparent rounded-full",

  // Success pulse
  successPulse: "animate-pulse text-green-600",
}
```

**Staggered List Animation:**
```tsx
// Vendor cards fade in with 50ms stagger
<div className="grid gap-6">
  {vendors.map((vendor, i) => (
    <VendorCard
      key={vendor.id}
      className={cn(
        animations.cardEnter,
        `[animation-delay:${i * 50}ms]`
      )}
    />
  ))}
</div>
```

**Form Input Focus:**
```tsx
<Input
  className="focus:ring-2 ring-primary-500 ring-offset-2 transition-all duration-200"
/>
<Label className="peer-focus:text-primary-600 transition-colors" />
```

### 3.2 Framer Motion (Strategic Use)

**Used ONLY for:**
1. **Page transitions** - Between routes (fade + slide)
2. **Modal animations** - Sheet slide-up on mobile, swipe to dismiss
3. **Confetti celebrations** - Booking confirmed, quote submitted
4. **Carousel swipe** - Drag gesture on vendor carousel

**Page Transition Wrapper:**
```tsx
// src/components/animations/PageTransition.tsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

**Bottom Sheet Modal (Mobile):**
```tsx
// Use in InquiryModal, QuoteModal
<motion.div
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{ type: "spring", damping: 30, stiffness: 300 }}
  drag="y"
  dragConstraints={{ top: 0 }}
  onDragEnd={(e, { offset, velocity }) => {
    if (offset.y > 100) onClose() // Swipe down to dismiss
  }}
  className="rounded-t-3xl"
>
  <div className="w-12 h-1.5 bg-brown-300 rounded-full mx-auto mt-2" /> {/* Handle */}
  {children}
</motion.div>
```

**Confetti Trigger Points:**
```typescript
import confetti from 'canvas-confetti'

export const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#D4A574', '#8B4513', '#FFD700'], // Brown/gold palette
  })
}

// Use on:
// - Booking inquiry submitted successfully
// - Vendor quote submitted successfully
// - Vendor application approved (admin view)
// - First-time user completes profile (analytics)
```

**Carousel Swipe Gesture:**
```tsx
<motion.div
  ref={scrollContainerRef}
  drag="x"
  dragConstraints={{ left: -maxScroll, right: 0 }}
  dragElastic={0.2}
  onDragEnd={(e, { offset }) => {
    // Snap to nearest card
    const cardWidth = 320
    const snapIndex = Math.round(-offset.x / cardWidth)
    // Animate to snap position
  }}
>
  {/* Vendor cards */}
</motion.div>
```

---

## 4. Feedback & State Management

### 4.1 Toast Notification System

**Library:** Sonner (shadcn-recommended, 5KB gzipped)

**Component:** `src/components/ui/sonner.tsx` (new)

**Toast Types & Usage:**
```typescript
import { toast } from 'sonner'

// Success with confetti
toast.success('Booking inquiry sent!', {
  description: 'The vendor will respond within 24 hours',
  action: { label: 'View', onClick: () => router.push('/dashboard') },
  onAutoClose: () => triggerConfetti() // Confetti on close
})

// Error with retry action
toast.error('Failed to submit quote', {
  description: 'Please check your connection and try again',
  action: { label: 'Retry', onClick: () => retrySubmit() }
})

// Loading state
const toastId = toast.loading('Submitting...')
// Later: toast.success('Done!', { id: toastId })
```

**Styling (Branded):**
- Position: top-center on mobile, top-right on desktop
- Colors: Success uses green-600, error uses red-600, primary uses golden
- Duration: 4s default, 6s for errors, persistent for loading
- Max visible: 3 toasts stacked
- Swipe to dismiss on mobile

**Setup:**
```tsx
// app/layout.tsx
import { Toaster } from '@/components/ui/sonner'

<body>
  {children}
  <Toaster position="top-center" />
</body>
```

### 4.2 Skeleton Loader System

**Component:** `src/components/ui/skeleton.tsx` (enhance existing)

**Branded Skeletons:**
```tsx
// Base skeleton uses brown palette
<Skeleton className="animate-pulse bg-brown-100" />

// Specific skeleton components
export function VendorCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" /> {/* Image */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" /> {/* Title */}
        <Skeleton className="h-4 w-1/2" /> {/* Subtitle */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" /> {/* Badge */}
          <Skeleton className="h-6 w-16" /> {/* Badge */}
        </div>
        <Skeleton className="h-10 w-full" /> {/* Button */}
      </div>
    </Card>
  )
}

export function JobCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" /> {/* Icon */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" /> {/* Title */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </Card>
  )
}
```

**Usage Pattern:**
```tsx
// In browse page
{isLoading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array(6).fill(0).map((_, i) => <VendorCardSkeleton key={i} />)}
  </div>
) : (
  <VendorGrid vendors={vendors} />
)}
```

**Animation:**
- Pulse from brown-100 to brown-50
- Smooth 2s loop
- Optional shimmer effect with gradient overlay

### 4.3 Optimistic UI Updates

**Pattern:** Update UI immediately, revert on API failure

**Implementation Example (Quote Submission):**
```typescript
const { mutate: submitQuote } = useMutation({
  mutationFn: api.submitQuote,

  onMutate: async (newQuote) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['quotes', jobId] })

    // Snapshot previous value
    const previousQuotes = queryClient.getQueryData(['quotes', jobId])

    // Optimistically update cache
    queryClient.setQueryData(['quotes', jobId], (old: Quote[]) => [
      ...old,
      { ...newQuote, id: crypto.randomUUID(), status: 'pending' }
    ])

    // Close modal immediately
    setIsOpen(false)

    // Show success feedback
    toast.success('Quote submitted!')
    triggerConfetti()

    // Return context for rollback
    return { previousQuotes }
  },

  onError: (err, newQuote, context) => {
    // Rollback to previous state
    queryClient.setQueryData(['quotes', jobId], context.previousQuotes)

    toast.error('Failed to submit quote', {
      action: { label: 'Retry', onClick: () => submitQuote(newQuote) }
    })
  },

  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['quotes', jobId] })
  },
})
```

**Applied To:**
- Quote submissions
- Booking inquiries
- Vendor application submissions
- Status updates in admin dashboard (InquiriesTab, ApplicationsTab)

---

## 5. Performance Optimization Layer

### 5.1 Critical Fixes (Vercel Anti-Patterns)

**Fix 1: Add React.cache() for Server Component Deduplication**

**File:** `src/lib/data/vendors.ts` (new)
```typescript
import { cache } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Dedupe vendor queries across generateMetadata + page component
export const getVendorBySlug = cache(async (slug: string) => {
  const { data, error } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .eq('verified', true)
    .single()

  if (error) throw error
  return data
})

// Dedupe vendor list queries
export const getAllVendors = cache(async (filters?: VendorFilters) => {
  let query = supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('verified', true)
    .order('business_name')

  if (filters?.vendor_type) {
    query = query.eq('vendor_type', filters.vendor_type)
  }
  if (filters?.suburbs?.length) {
    query = query.overlaps('suburbs', filters.suburbs)
  }

  const { data, error } = await query
  if (error) throw error
  return data
})

// Similar for jobs
export const getJobById = cache(async (id: string) => {
  // ... implementation
})

export const getAllJobs = cache(async () => {
  // ... implementation
})
```

**Replace Usage:**
```tsx
// Before (duplicate queries):
// In vendors/[slug]/page.tsx lines 9-14
export async function generateMetadata({ params }) {
  const vendor = await supabaseAdmin.from('vendors').select('*').eq('slug', slug)...
}

// In vendors/[slug]/page.tsx lines 66-71
export default async function VendorPage({ params }) {
  const vendor = await supabaseAdmin.from('vendors').select('*').eq('slug', slug)...
}

// After (single query, cached):
import { getVendorBySlug } from '@/lib/data/vendors'

export async function generateMetadata({ params }) {
  const vendor = await getVendorBySlug(params.slug)
}

export default async function VendorPage({ params }) {
  const vendor = await getVendorBySlug(params.slug) // Cache hit!
}
```

**Impact:** Eliminates duplicate database queries on vendor detail pages

**Fix 2: Dynamic Imports for Modals**

**Files:** `src/app/(main)/app/page.tsx`, `src/app/(main)/jobs/page.tsx`

```typescript
// Before (eager load):
import InquiryModal from '@/components/booking/SimpleBookingModal'

// After (lazy load):
import dynamic from 'next/dynamic'

const InquiryModal = dynamic(
  () => import('@/components/booking/SimpleBookingModal'),
  {
    loading: () => <div className="animate-pulse">Loading...</div>,
    ssr: false, // Modal only needed on client
  }
)
```

**Apply to:**
- `SimpleBookingModal.tsx` (inquiry form)
- `QuoteModal.tsx` (quote submission)
- Filter modal on browse page (future)

**Savings:** 15-20KB gzipped per modal not loaded until opened

**Fix 3: Parallelize Async Fetches**

**File:** `src/app/(main)/jobs/page.tsx` lines 24-30

```typescript
// Before (waterfall):
const { data: jobs } = await supabase
  .from('jobs')
  .select('*')
  .eq('status', 'open')

if (jobs?.length) {
  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .in('job_id', jobs.map(j => j.id))
}

// After (parallel):
const [jobsResult, quotesResult] = await Promise.all([
  supabase.from('jobs').select('*').eq('status', 'open'),
  supabase.from('quotes').select('*'), // Fetch all quotes, filter client-side
])

const jobs = jobsResult.data || []
const quotes = quotesResult.data || []
```

**Impact:** Reduces page load time by eliminating sequential waterfall

**Fix 4: Remove Dynamic Imports from useEffect**

**File:** `src/app/(main)/app/page.tsx` line 27

```typescript
// Before (delays render):
useEffect(() => {
  import('@/lib/analytics').then((mod) => {
    mod.trackPageView()
  })
}, [])

// After (top-level, conditional execution):
import { trackPageView } from '@/lib/analytics'

useEffect(() => {
  trackPageView() // Import resolved at build time
}, [])
```

**Impact:** Faster initial render, better static analysis

### 5.2 Client-Side Data Layer

**Add TanStack Query for Client Fetches**

**Setup:** `src/lib/query-client.ts` (new)
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute - data considered fresh
      gcTime: 5 * 60 * 1000, // 5 minutes - cache garbage collection
      refetchOnWindowFocus: false, // Don't refetch on tab focus
      retry: 1, // Retry failed requests once
    },
  },
})
```

**Provider:** `src/app/layout.tsx`
```tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

**Usage Pattern (Replace Raw Fetches):**
```typescript
// Before (no caching, no deduplication):
const [vendors, setVendors] = useState([])
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  supabase
    .from('vendors')
    .select('*')
    .then(({ data }) => {
      setVendors(data)
      setIsLoading(false)
    })
}, [])

// After (automatic caching, deduplication, refetching):
import { useQuery } from '@tanstack/react-query'
import { getAllVendors } from '@/lib/data/vendors'

const { data: vendors, isLoading } = useQuery({
  queryKey: ['vendors', filters],
  queryFn: () => getAllVendors(filters),
})
```

**Benefits:**
- Automatic deduplication (multiple components fetching same data = 1 request)
- Background refetching when data goes stale
- Cache invalidation after mutations
- Loading/error states handled automatically
- Optimistic updates built-in

**Apply to:**
- Browse page vendor fetching
- Jobs page jobs/quotes fetching
- Carousel vendor fetching
- Admin dashboard data (inquiries, applications, jobs)

### 5.3 API Client Abstraction

**File:** `src/lib/api.ts` (new)

```typescript
class ApiClient {
  private async request(url: string, options?: RequestInit) {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(error || `HTTP ${res.status}`)
    }

    return res.json()
  }

  // Inquiries
  async submitInquiry(data: InquiryData) {
    return this.request('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateInquiryStatus(id: string, status: string) {
    return this.request(`/api/dashboard/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  // Quotes
  async submitQuote(data: QuoteData) {
    return this.request('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Vendor applications
  async submitVendorApplication(data: ApplicationData) {
    return this.request('/api/vendors/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateApplicationStatus(id: string, status: 'approved' | 'rejected') {
    return this.request(`/api/dashboard/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  // Jobs
  async createJob(data: JobData) {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const api = new ApiClient()
```

**Integration with React Query:**
```typescript
// In components
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

const queryClient = useQueryClient()

const { mutate: submitInquiry, isPending } = useMutation({
  mutationFn: api.submitInquiry,

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['inquiries'] })
    toast.success('Inquiry sent!')
    triggerConfetti()
    setIsOpen(false)
  },

  onError: (error) => {
    toast.error('Failed to send inquiry', {
      description: error.message,
      action: { label: 'Retry', onClick: () => submitInquiry(data) }
    })
  },
})

// Usage
<Button loading={isPending} onClick={() => submitInquiry(formData)}>
  Submit Inquiry
</Button>
```

**Benefits:**
- Centralized error handling
- Type-safe API calls
- Easy to mock for testing
- Global interceptors (auth tokens, logging)
- Consistent request/response handling

---

## 6. Mobile-First Interaction Patterns

### 6.1 Bottom Sheet Modals (Mobile)

**Pattern:** Modals slide up from bottom on mobile, center dialog on desktop

**Component:** `src/components/ui/sheet.tsx` (new shadcn component)

**Installation:**
```bash
npx shadcn-ui@latest add sheet
```

**Implementation:**
```tsx
// src/components/booking/BookingSheet.tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export function BookingModal({ vendor, isOpen, onClose }) {
  const isMobile = useMediaQuery('(max-width: 1024px)')

  const content = (
    <>
      <Header>
        <Title>Book {vendor.business_name}</Title>
      </Header>
      <BookingForm vendor={vendor} onSuccess={onClose} />
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto">
          <div className="w-12 h-1.5 bg-brown-300 rounded-full mx-auto mb-4" />
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {content}
      </DialogContent>
    </Dialog>
  )
}
```

**Mobile Sheet Features:**
- Swipe down to dismiss (built into shadcn Sheet)
- Handle indicator at top (visual affordance)
- Max height: 90vh with internal scroll
- Rounded top corners: 24px
- Backdrop blur: `backdrop-blur-sm bg-black/20`

**Apply To:**
- `SimpleBookingModal.tsx` → `BookingSheet`
- `QuoteModal.tsx` → `QuoteSheet`
- Filter modal on browse page → `FilterSheet` (future)

### 6.2 Scroll-Aware Tab Bar

**Behavior:** Auto-hide tab bar on scroll down, show on scroll up (iOS Safari pattern)

**Component:** `src/components/navigation/TabBar.tsx`

**Implementation:**
```typescript
const [isVisible, setIsVisible] = useState(true)
const lastScrollY = useRef(0)
const ticking = useRef(false)

useEffect(() => {
  const handleScroll = () => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY

        if (currentScrollY < 50) {
          // Always show near top
          setIsVisible(true)
        } else if (currentScrollY > lastScrollY.current + 10) {
          // Scrolling down significantly - hide
          setIsVisible(false)
        } else if (currentScrollY < lastScrollY.current - 10) {
          // Scrolling up significantly - show
          setIsVisible(true)
        }

        lastScrollY.current = currentScrollY
        ticking.current = false
      })

      ticking.current = true
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

return (
  <motion.nav
    animate={{ y: isVisible ? 0 : 120 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="fixed bottom-4 left-4 right-4 z-50 lg:hidden"
  >
    {/* Tab bar content */}
  </motion.nav>
)
```

**Threshold Logic:**
- Scroll < 50px: Always show (user at top of page)
- Scroll down > 10px: Hide (user browsing downward)
- Scroll up > 10px: Show (user going back)
- Uses requestAnimationFrame for performance

### 6.3 Swipe Gestures on Carousel

**File:** `src/components/experiences/HorizontalExperiences.tsx` (enhance existing)

**Add Framer Motion Drag:**
```tsx
import { motion, useMotionValue, useTransform } from 'framer-motion'

export function HorizontalExperiences({ vendors }) {
  const x = useMotionValue(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const maxScroll = -(vendors.length - 1) * 320 // Card width

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-4"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: maxScroll, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          // Snap to nearest card
          const cardWidth = 320
          const swipeThreshold = 50

          if (Math.abs(offset.x) > swipeThreshold) {
            const direction = offset.x < 0 ? 1 : -1
            const newIndex = Math.max(
              0,
              Math.min(vendors.length - 1, currentIndex + direction)
            )
            setCurrentIndex(newIndex)

            // Animate to snap position
            animate(x, -newIndex * cardWidth, {
              type: 'spring',
              stiffness: 300,
              damping: 30,
            })
          } else {
            // Snap back to current position
            animate(x, -currentIndex * cardWidth, {
              type: 'spring',
              stiffness: 300,
              damping: 30,
            })
          }
        }}
      >
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </motion.div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-4">
        {vendors.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentIndex(i)
              animate(x, -i * 320)
            }}
            className={cn(
              'h-2 rounded-full transition-all',
              i === currentIndex
                ? 'w-8 bg-primary-600'
                : 'w-2 bg-brown-300'
            )}
          />
        ))}
      </div>
    </div>
  )
}
```

**Touch Feedback:**
- Momentum scroll continues after release
- Snap to card boundaries (no half-cards visible)
- Visual indicator (dots) showing position
- Arrow buttons remain for desktop users

### 6.4 Pull-to-Refresh (Optional - Phase 3)

**Pattern:** Pull down on browse/jobs pages to refresh data

**Implementation (React Query + Framer):**
```typescript
const { refetch, isRefetching } = useQuery(['vendors'])
const [pullDistance, setPullDistance] = useState(0)

<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 100 }}
  dragElastic={0.5}
  onDrag={(e, info) => {
    if (window.scrollY === 0) {
      setPullDistance(Math.max(0, info.offset.y))
    }
  }}
  onDragEnd={(e, { offset }) => {
    if (offset.y > 80) {
      refetch()
      toast.info('Refreshing vendors...')
    }
    setPullDistance(0)
  }}
>
  {pullDistance > 0 && (
    <div className="flex justify-center py-4">
      <div className={cn(
        "transition-transform",
        pullDistance > 80 && "rotate-180"
      )}>
        ↓ {pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
      </div>
    </div>
  )}

  {/* Page content */}
</motion.div>
```

**Priority:** Skip for MVP - Nice to have but lower priority than core features

---

## 7. Component Architecture Refactoring

### 7.1 VendorCard Composition Pattern

**Current Issue:** Boolean prop proliferation (`showActions`, `actionLabel`, variant logic) in `src/components/vendors/VendorCard.tsx`

**Refactor to Compound Components:**

**Before (boolean props):**
```tsx
<VendorCard
  vendor={vendor}
  showActions={true}
  actionLabel="Book Now"
  variant="default"
/>
```

**After (composition):**
```tsx
<VendorCard vendor={vendor}>
  <VendorCard.Image />
  <VendorCard.Header>
    <VendorCard.Title />
    <VendorCard.Badges />
  </VendorCard.Header>
  <VendorCard.Content />
  <VendorCard.Actions>
    <Button onClick={onBook}>Book Now</Button>
  </VendorCard.Actions>
</VendorCard>
```

**Implementation (Compound Component Pattern):**
```typescript
// src/components/vendors/VendorCard/index.tsx
import { createContext, useContext } from 'react'

interface VendorCardContextValue {
  vendor: Vendor
}

const VendorCardContext = createContext<VendorCardContextValue | null>(null)

function useVendorCard() {
  const context = useContext(VendorCardContext)
  if (!context) throw new Error('VendorCard.* must be used within VendorCard')
  return context
}

// Root component
export function VendorCard({
  vendor,
  children
}: {
  vendor: Vendor
  children: React.ReactNode
}) {
  return (
    <VendorCardContext.Provider value={{ vendor }}>
      <div className="rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all">
        {children}
      </div>
    </VendorCardContext.Provider>
  )
}

// Subcomponents
VendorCard.Image = function VendorCardImage() {
  const { vendor } = useVendorCard()
  return (
    <div className="aspect-video relative overflow-hidden bg-brown-100">
      {vendor.image_url ? (
        <img
          src={vendor.image_url}
          alt={vendor.business_name}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-4xl">☕</span>
        </div>
      )}
    </div>
  )
}

VendorCard.Header = function VendorCardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 pb-2">{children}</div>
}

VendorCard.Title = function VendorCardTitle() {
  const { vendor } = useVendorCard()
  return (
    <h3 className="text-lg font-semibold text-brown-900">
      {vendor.business_name}
    </h3>
  )
}

VendorCard.Badges = function VendorCardBadges() {
  const { vendor } = useVendorCard()
  return (
    <div className="flex gap-2 mt-2">
      <Badge variant="secondary">
        ${vendor.price_min}-${vendor.price_max}/hr
      </Badge>
      {vendor.verified && (
        <Badge variant="success">✓ Verified</Badge>
      )}
    </div>
  )
}

VendorCard.Content = function VendorCardContent() {
  const { vendor } = useVendorCard()
  return (
    <div className="px-4 py-2">
      <p className="text-sm text-muted-foreground line-clamp-2">
        {vendor.specialty}
      </p>
      <div className="flex flex-wrap gap-1 mt-2">
        {vendor.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs text-brown-600">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}

VendorCard.Actions = function VendorCardActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 p-4 pt-0">
      {children}
    </div>
  )
}
```

**Usage Examples:**
```tsx
// Browse page - show booking action
<VendorCard vendor={vendor}>
  <VendorCard.Image />
  <VendorCard.Header>
    <VendorCard.Title />
    <VendorCard.Badges />
  </VendorCard.Header>
  <VendorCard.Content />
  <VendorCard.Actions>
    <Button onClick={() => openBookingModal(vendor)}>Book Now</Button>
  </VendorCard.Actions>
</VendorCard>

// Carousel - minimal version, no actions
<VendorCard vendor={vendor}>
  <VendorCard.Image />
  <VendorCard.Header>
    <VendorCard.Title />
  </VendorCard.Header>
</VendorCard>

// Admin view - different actions
<VendorCard vendor={vendor}>
  <VendorCard.Image />
  <VendorCard.Header>
    <VendorCard.Title />
    <VendorCard.Badges />
  </VendorCard.Header>
  <VendorCard.Content />
  <VendorCard.Actions>
    <Button variant="outline" onClick={onEdit}>Edit</Button>
    <Button variant="danger" onClick={onDelete}>Delete</Button>
  </VendorCard.Actions>
</VendorCard>
```

**Benefits:**
- No boolean props determining behavior
- Parent controls layout and actions
- Easier to add variants without modifying component
- Better tree-shaking (unused subcomponents not bundled)
- More flexible for different contexts

### 7.2 Form State Consolidation

**Current Issue:** 8 separate useState calls in `SimpleBookingModal.tsx` (lines 39-52)

**Option A: useReducer Pattern**
```typescript
// Define form state type
type FormData = {
  eventType: string
  eventDate: string
  durationHours: string
  guestCount: string
  location: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

// Reducer
const formReducer = (
  state: FormData,
  action: { field: keyof FormData; value: string }
) => ({
  ...state,
  [action.field]: action.value,
})

// Component
const [formData, updateField] = useReducer(formReducer, {
  eventType: '',
  eventDate: '',
  durationHours: '',
  guestCount: '',
  location: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
})

// Usage
<Input
  value={formData.eventType}
  onChange={(e) => updateField({ field: 'eventType', value: e.target.value })}
/>
```

**Option B: React Hook Form (Recommended)**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Reuse existing Zod schema from API route
const inquirySchema = z.object({
  eventType: z.string().min(1, 'Event type is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  durationHours: z.coerce.number().min(1).max(12),
  guestCount: z.coerce.number().min(1),
  location: z.string().min(1),
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1),
})

type InquiryFormData = z.infer<typeof inquirySchema>

// Component
const form = useForm<InquiryFormData>({
  resolver: zodResolver(inquirySchema),
  defaultValues: {
    eventType: '',
    eventDate: '',
    durationHours: 2,
    guestCount: 50,
    location: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  },
})

const { mutate: submitInquiry, isPending } = useMutation({
  mutationFn: api.submitInquiry,
  onSuccess: () => {
    toast.success('Inquiry sent!')
    triggerConfetti()
    onClose()
    form.reset()
  },
})

// Usage
<Form {...form}>
  <form onSubmit={form.handleSubmit(submitInquiry)}>
    <FormField
      control={form.control}
      name="eventType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Type</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Repeat for other fields */}

    <Button type="submit" loading={isPending}>
      Submit Inquiry
    </Button>
  </form>
</Form>
```

**Benefits:**
- Single re-render on form submission (not per keystroke)
- Built-in validation with Zod (reuse API schemas)
- Better error handling and display
- Automatic dirty/touched tracking
- Smaller component code (~455 lines → ~250 lines)

**Apply to:**
- `SimpleBookingModal.tsx` (8 fields)
- `QuoteModal.tsx` (4 fields)
- `vendors/register/page.tsx` (12+ fields)

### 7.3 Error Boundary Implementation

**Pattern:** Add error.tsx files to each route for graceful error handling

**Component:** `src/app/(main)/app/error.tsx` (new)
```tsx
'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Browse page error:', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-brown-900">
          Oops! Something went wrong
        </h2>
        <p className="text-muted-foreground max-w-md">
          We couldn't load the vendors. This might be a temporary issue.
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={reset}>
          Try again
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Go home
        </Button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 max-w-2xl">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            Error details
          </summary>
          <pre className="mt-2 text-xs bg-brown-50 p-4 rounded overflow-auto">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  )
}
```

**Create for:**
- `app/(main)/app/error.tsx` - Browse page errors
- `app/(main)/jobs/error.tsx` - Jobs page errors
- `app/(main)/vendors/[slug]/error.tsx` - Vendor detail errors
- `app/(main)/dashboard/error.tsx` - Admin dashboard errors

**Loading States:** Create `loading.tsx` files with branded skeletons

**Example:** `src/app/(main)/app/loading.tsx`
```tsx
import { VendorCardSkeleton } from '@/components/ui/skeleton'

export default function BrowseLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4 mb-8">
        <div className="h-8 w-48 bg-brown-100 animate-pulse rounded" />
        <div className="h-4 w-96 bg-brown-100 animate-pulse rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <VendorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
```

---

## 8. Implementation Roadmap

### Phase 1: Foundation System (Week 1 - Days 1-5)

**Goal:** Build reusable components and performance layer

#### Day 1-2: Core Infrastructure

**Tasks:**
1. Install dependencies
   ```bash
   npm install framer-motion sonner @tanstack/react-query react-hook-form @hookform/resolvers/zod
   npx shadcn-ui@latest add sheet
   ```

2. Set up QueryClientProvider
   - Create `src/lib/query-client.ts`
   - Wrap app in `src/app/layout.tsx`

3. Create API client abstraction
   - Create `src/lib/api.ts`
   - Implement methods for inquiries, quotes, applications, jobs

4. Add React.cache() wrappers
   - Create `src/lib/data/vendors.ts`
   - Create `src/lib/data/jobs.ts`
   - Migrate `vendors/[slug]/page.tsx` to use cached queries

5. Fix critical waterfalls
   - Parallelize jobs/quotes fetch in `jobs/page.tsx`
   - Remove dynamic imports from useEffect in `app/page.tsx`

**Deliverables:**
- ✅ Dependencies installed
- ✅ React Query configured
- ✅ API client abstraction ready
- ✅ Server component caching active
- ✅ Async waterfalls eliminated

#### Day 3-4: Component System

**Tasks:**
1. TabBar component
   - Create `src/components/navigation/TabBar.tsx`
   - Implement 5 tabs (Browse, Jobs, Create, Home, Analytics)
   - Add scroll-aware hide/show logic
   - Test on mobile devices

2. Button system refactor
   - Update `src/components/ui/button.tsx`
   - Add `fullWidthMobile` width variant
   - Add `loading` state integration
   - Update all button usages across app

3. Toast system
   - Add Sonner to `src/app/layout.tsx`
   - Create toast utility functions
   - Test success/error/loading patterns

4. Skeleton loaders
   - Enhance `src/components/ui/skeleton.tsx`
   - Create `VendorCardSkeleton`
   - Create `JobCardSkeleton`
   - Create `FormSkeleton`

5. Sheet component
   - Install shadcn Sheet
   - Create mobile/desktop wrapper utility
   - Test swipe-to-dismiss behavior

**Deliverables:**
- ✅ TabBar component functional
- ✅ Button system upgraded
- ✅ Toast notifications working
- ✅ Skeleton loaders created
- ✅ Sheet component ready

#### Day 5: Animation Primitives

**Tasks:**
1. Animation utility file
   - Create `src/lib/animations.ts`
   - Define CSS animation classes
   - Document usage patterns

2. PageTransition wrapper
   - Create `src/components/animations/PageTransition.tsx`
   - Implement fade + slide transitions
   - Test route changes

3. Confetti utility
   - Create `src/lib/confetti.ts`
   - Configure brown/gold color palette
   - Test trigger function

4. Dynamic imports for modals
   - Update `app/page.tsx` (InquiryModal)
   - Update `jobs/page.tsx` (QuoteModal)
   - Verify bundle size reduction

**Deliverables:**
- ✅ Animation system documented
- ✅ Page transitions working
- ✅ Confetti integration ready
- ✅ Modals lazy-loaded
- ✅ Bundle size reduced by ~25KB

---

### Phase 2: Apply to Priority Flows (Week 2 - Days 6-12)

#### Flow 1: Browse → Vendor → Booking (Days 6-8)

**Tasks:**
1. Refactor VendorCard
   - Convert to compound component pattern
   - Update all usages (browse page, carousel, vendor detail)
   - Add entrance animations

2. Vendor grid animations
   - Add staggered fade-in to vendor cards
   - Test performance with 50+ cards

3. Convert InquiryModal to Sheet
   - Implement mobile/desktop responsive pattern
   - Add swipe-to-dismiss on mobile
   - Test on iOS Safari, Chrome Android

4. Booking form optimization
   - Convert to React Hook Form
   - Integrate with React Query mutation
   - Implement optimistic UI

5. Success celebration
   - Add confetti on successful booking
   - Show toast notification
   - Close modal smoothly

6. Error boundaries
   - Create `app/error.tsx`
   - Create `app/loading.tsx`
   - Create `vendors/[slug]/error.tsx`

**Deliverables:**
- ✅ VendorCard refactored to compound components
- ✅ Grid animations smooth and performant
- ✅ Booking modal responsive (Sheet on mobile, Dialog on desktop)
- ✅ Form uses React Hook Form with Zod validation
- ✅ Optimistic UI + confetti working
- ✅ Error boundaries catching failures

#### Flow 2: Jobs → Quote Submission (Days 9-10)

**Tasks:**
1. Jobs page data fetching
   - Migrate to React Query
   - Implement parallel jobs/quotes fetch
   - Add loading skeletons

2. Job card animations
   - Add staggered entrance animations
   - Test with 20+ job cards

3. Convert QuoteModal to Sheet
   - Implement mobile/desktop pattern
   - Add swipe-to-dismiss

4. Quote form optimization
   - Convert to React Hook Form
   - Integrate with React Query mutation
   - Implement optimistic UI

5. Success celebration
   - Add confetti on quote submission
   - Show toast notification
   - Update job card UI optimistically

6. Error boundaries
   - Create `jobs/error.tsx`
   - Create `jobs/loading.tsx`

**Deliverables:**
- ✅ Jobs page using React Query
- ✅ Job cards with animations
- ✅ Quote modal responsive
- ✅ Quote form optimized
- ✅ Optimistic UI + confetti working
- ✅ Error handling complete

#### Flow 3: Vendor Registration (Days 11-12)

**Tasks:**
1. Multi-step form setup
   - Create step indicator component
   - Implement progress tracking
   - Add step navigation

2. Form state management
   - Convert to React Hook Form
   - Split into logical sections
   - Implement validation per step

3. Mobile optimization
   - Use Sheet for each form section
   - Full-width buttons
   - Touch-friendly inputs

4. Submission flow
   - Integrate with React Query mutation
   - Implement optimistic UI
   - Add confetti celebration

5. Success state
   - Show confirmation page
   - Toast notification
   - Clear form state

**Deliverables:**
- ✅ Multi-step form with progress indicator
- ✅ React Hook Form managing state
- ✅ Mobile-optimized with Sheet
- ✅ Optimistic submission + confetti
- ✅ Success confirmation working

---

### Phase 3: Polish & Analytics Flow (Week 3 - Days 13-15)

#### Flow 4: Analytics/Auth (Days 13-14)

**Tasks:**
1. Analytics tab implementation
   - Detect logged-in state
   - Show lock icon if not authenticated
   - Open sign-up modal on tap

2. Sign-up modal
   - Create responsive Sheet/Dialog
   - Use React Hook Form
   - Integrate with auth flow

3. Auth flow animations
   - Page transitions for login/signup
   - Success celebration after signup
   - Toast notifications for errors

4. Dashboard enhancements
   - Add loading skeletons to all tabs
   - Implement optimistic updates for status changes
   - Add confetti on vendor approval

**Deliverables:**
- ✅ Analytics tab with locked/unlocked states
- ✅ Sign-up modal responsive
- ✅ Auth flow with animations
- ✅ Dashboard optimistic updates working

#### Final Polish (Day 15)

**Tasks:**
1. Carousel swipe gestures
   - Add Framer Motion drag to carousel
   - Implement snap-to-card behavior
   - Add progress dots

2. Cross-browser testing
   - Test on iOS Safari (mobile tab bar, sheets)
   - Test on Chrome Android (touch targets, animations)
   - Test on Firefox (compatibility)
   - Test on desktop Chrome/Safari/Firefox

3. Performance audit
   - Run Lighthouse on all key pages
   - Check LCP, FID, CLS scores
   - Optimize any remaining issues

4. Accessibility review
   - Test keyboard navigation
   - Verify ARIA labels on interactive elements
   - Test with VoiceOver/TalkBack
   - Ensure focus indicators visible

5. SEO validation
   - Verify structured data intact
   - Check meta tags on all pages
   - Validate OpenGraph/Twitter cards
   - Test Google Search Console

**Deliverables:**
- ✅ Carousel with swipe gestures
- ✅ Cross-browser compatibility verified
- ✅ Performance metrics improved (Lighthouse 90+)
- ✅ Accessibility compliant
- ✅ SEO/GEO optimization intact

---

## 9. Success Metrics

### Performance Targets

**Lighthouse Scores (Mobile):**
- Performance: 90+ (current: ~70-80)
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

**Core Web Vitals:**
- LCP (Largest Contentful Paint): <2.5s (15-25% improvement)
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

**Bundle Size:**
- Initial bundle: Net +32KB gzipped
- Modals lazy-loaded: -30KB not loaded upfront
- Time to Interactive: <3s on 4G

### UX Targets

**User Engagement:**
- Mobile bounce rate: Reduce by 10-15%
- Form completion rate: Increase by 20%
- Average session duration: Increase by 25%
- Pages per session: Increase by 15%

**Conversion Metrics:**
- Inquiry submission rate: Increase by 15%
- Quote submission rate: Increase by 20%
- Vendor application completion: Increase by 25%

### Technical Metrics

**Code Quality:**
- Zero async waterfalls in critical paths
- All modals lazy-loaded with dynamic imports
- Server component deduplication active (React.cache())
- Client-side cache hit rate >80% (React Query)
- Error boundaries covering all routes
- Loading states for all async operations

**Developer Experience:**
- Component reusability: 90% of UI uses design system
- Form code reduction: 40% fewer lines with React Hook Form
- API calls centralized: 100% through api client
- Type safety: 100% TypeScript coverage

---

## 10. Post-Launch Monitoring

### Week 1 After Launch

**Monitor:**
- Real User Monitoring (RUM) metrics via PostHog/Vercel Analytics
- Error rates in Sentry/LogRocket
- User feedback via support channels
- A/B test: New UX vs old (if staged rollout)

**Action Items:**
- Fix any critical bugs within 24 hours
- Adjust animation timings based on user feedback
- Optimize any pages with LCP >2.5s

### Week 2-4 After Launch

**Analyze:**
- Conversion funnel changes (Browse → Inquiry, Jobs → Quote)
- Mobile vs desktop engagement differences
- Most popular tab in bottom navigation
- Drop-off points in multi-step forms

**Iterate:**
- Add missing microinteractions based on user behavior
- Optimize slow pages identified in analytics
- A/B test confetti vs subtle success animations
- Consider adding pull-to-refresh if users frequently refresh

---

## 11. Future Enhancements (Post-MVP)

### Phase 4 Candidates (Priority TBD)

**Advanced Animations:**
- Shared element transitions between pages (vendor card → detail page)
- Page stack navigation with depth animations
- Gesture-based navigation (swipe right to go back)

**PWA Features:**
- Install prompt for "Add to Home Screen"
- Offline mode with service worker
- Push notifications for booking confirmations
- Haptic feedback on iOS/Android

**Performance:**
- Image optimization with next/image (vendor photos)
- Route prefetching on hover/focus
- Partial hydration for faster TTI

**UX Polish:**
- Dark mode support
- Advanced filters with bottom sheet on mobile
- Map view for vendor locations
- Calendar view for job postings

---

## Appendix A: File Structure

```
src/
├── app/
│   ├── layout.tsx (add QueryClientProvider, Toaster)
│   └── (main)/
│       ├── app/
│       │   ├── page.tsx (convert to React Query, add TabBar)
│       │   ├── loading.tsx (NEW - VendorCardSkeleton grid)
│       │   └── error.tsx (NEW - error boundary)
│       ├── jobs/
│       │   ├── page.tsx (parallel fetches, React Query)
│       │   ├── loading.tsx (NEW - JobCardSkeleton grid)
│       │   └── error.tsx (NEW - error boundary)
│       ├── vendors/
│       │   └── [slug]/
│       │       ├── page.tsx (use React.cache)
│       │       └── error.tsx (NEW)
│       └── dashboard/
│           └── error.tsx (NEW)
├── components/
│   ├── animations/
│   │   └── PageTransition.tsx (NEW - Framer Motion wrapper)
│   ├── booking/
│   │   └── SimpleBookingModal.tsx (refactor to Sheet + React Hook Form)
│   ├── jobs/
│   │   └── QuoteModal.tsx (refactor to Sheet + React Hook Form)
│   ├── navigation/
│   │   └── TabBar.tsx (NEW - mobile bottom navigation)
│   ├── ui/
│   │   ├── button.tsx (refactor - add fullWidthMobile, loading)
│   │   ├── skeleton.tsx (enhance - add VendorCardSkeleton, JobCardSkeleton)
│   │   ├── sonner.tsx (NEW - toast component)
│   │   └── sheet.tsx (NEW - shadcn Sheet)
│   └── vendors/
│       └── VendorCard/ (refactor to compound components)
│           ├── index.tsx (root + subcomponents)
│           └── types.ts
├── lib/
│   ├── animations.ts (NEW - animation utility classes)
│   ├── api.ts (NEW - API client abstraction)
│   ├── confetti.ts (NEW - confetti trigger utility)
│   ├── query-client.ts (NEW - TanStack Query config)
│   └── data/
│       ├── vendors.ts (NEW - React.cache wrappers)
│       └── jobs.ts (NEW - React.cache wrappers)
└── hooks/
    └── useMediaQuery.ts (NEW - responsive breakpoint detection)
```

---

## Appendix B: Dependencies

### New Dependencies
```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "sonner": "^1.4.0",
    "@tanstack/react-query": "^5.28.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.4"
  }
}
```

### Existing (Keep)
- next: 15.4
- react: 19.2
- tailwindcss: 3.x
- canvas-confetti (already installed)
- @radix-ui/* (shadcn dependencies)

---

## Appendix C: Vercel Anti-Patterns Fixed

| Issue | File | Impact | Fix |
|-------|------|--------|-----|
| Async waterfall (sequential awaits) | `jobs/page.tsx` L24-30 | Latency | Promise.all() |
| Duplicate queries (no React.cache) | `vendors/[slug]/page.tsx` L9-14, 66-71 | Extra DB hits | React.cache() wrapper |
| No dynamic imports for modals | `app/page.tsx`, `jobs/page.tsx` | +30KB bundle | next/dynamic |
| Dynamic import in useEffect | `app/page.tsx` L27 | Load delay | Top-level import |
| No client-side cache | All client fetches | Duplicate requests | React Query |
| Unstable event listeners | `HorizontalExperiences.tsx` L66-73 | Memory leak | Memoize callback |
| Form state proliferation | `SimpleBookingModal.tsx` L39-52 | Re-renders | React Hook Form |
| Scattered fetch calls | Multiple files | Maintainability | API client |
| No error boundaries | All routes | Poor error UX | error.tsx files |

**Total Impact:**
- Bundle: -30KB lazy loading + 32KB new features = +2KB net
- Performance: 15-25% LCP improvement
- Reliability: 100% error coverage

---

## Appendix D: Design System Tokens

### Colors (Existing - Keep)
```css
--primary: #D4A574 (golden)
--brown-600: #8B4513 (coffee brown)
--brown-100: #F5F0EB (light brown)
--green-600: #059669 (success)
--red-600: #DC2626 (error)
```

### Animations (New)
```css
/* Duration tokens */
--duration-fast: 150ms
--duration-normal: 300ms
--duration-slow: 500ms

/* Easing tokens */
--ease-spring: cubic-bezier(0.25, 0.1, 0.25, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
```

### Spacing (Mobile Touch Targets)
```css
--touch-target-min: 44px (iOS minimum)
--touch-target-comfortable: 56px (tab bar height)
```

---

**End of Design Document**
