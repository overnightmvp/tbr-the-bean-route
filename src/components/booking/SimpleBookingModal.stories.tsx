import type { Meta, StoryObj } from '@storybook/nextjs'
import { InquiryModal } from './SimpleBookingModal'
import { Button } from '@/components/ui'
import { useState } from 'react'

const mockVendor = {
  id: '1',
  slug: 'the-bean-cart',
  businessName: 'The Bean Cart',
  specialty: 'Single Origin Espresso & Pour-Over',
  suburbs: ['Fitzroy', 'Collingwood', 'Richmond', 'Brunswick'],
  priceMin: 180,
  priceMax: 320,
  capacityMin: 30,
  capacityMax: 150,
  description: 'Melbourne\'s favourite mobile espresso cart. Sourcing single origin beans from Victorian roasters and serving them with care at your event.',
  contactEmail: 'hello@thebeancart.com.au',
  contactPhone: '0400 123 456',
  website: 'https://thebeancart.com.au',
  tags: ['corporate', 'morning-tea', 'pastries', 'inner-east'],
  imageUrl: null
}

const meta: Meta<typeof InquiryModal> = {
  title: 'Business Components/InquiryModal',
  component: InquiryModal,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-neutral-100 p-4">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof meta>

function InquiryModalWrapper({ vendor }: { vendor: typeof mockVendor | null }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Button
          onClick={() => setIsOpen(true)}
          variant="primary"
          size="lg"
        >
          Get a Quote
        </Button>
        <p className="text-sm text-neutral-600 mt-2">
          Opens the vendor inquiry modal
        </p>
      </div>

      <InquiryModal
        vendor={vendor}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false)
          alert('Inquiry submitted!')
        }}
      />
    </div>
  )
}

export const Default: Story = {
  name: 'Inquiry Modal',
  render: () => <InquiryModalWrapper vendor={mockVendor} />,
}

export const MobileView: Story = {
  name: 'Mobile View',
  render: () => <InquiryModalWrapper vendor={mockVendor} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile'
    }
  }
}