'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2 } from 'lucide-react'
import type { Job } from '@/lib/supabase'

interface QuoteModalProps {
  jobId: string
  job: Job | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function QuoteModal({ jobId, job, isOpen, onClose, onSuccess }: QuoteModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    vendorName: '',
    pricePerHour: '',
    message: '',
    contactEmail: '',
  })

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!formData.vendorName.trim()) errs.vendorName = 'Vendor name is required'
    if (!formData.pricePerHour) errs.pricePerHour = 'Price is required'
    else if (Number(formData.pricePerHour) <= 0) errs.pricePerHour = 'Price must be positive'
    if (!formData.contactEmail.trim()) errs.contactEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) errs.contactEmail = 'Enter a valid email'
    if (formData.message.length > 300) errs.message = 'Message must be under 300 characters'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setIsSubmitting(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      const id = `qte_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      const { error } = await supabase.from('quotes').insert({
        id,
        job_id: jobId,
        vendor_name: formData.vendorName.trim(),
        price_per_hour: Number(formData.pricePerHour),
        message: formData.message.trim() || null,
        contact_email: formData.contactEmail.trim(),
      })

      if (error) {
        console.error('Quote submission error:', error)
        setErrors({ submit: 'Something went wrong. Please try again.' })
        return
      }

      // Send email notifications to owner and vendor
      if (job) {
        try {
          await fetch('/api/notify/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ownerEmail: job.contact_email,
              ownerName: job.contact_name,
              jobTitle: job.event_title,
              vendor: {
                name: formData.vendorName.trim(),
                email: formData.contactEmail.trim()
              },
              quote: {
                pricePerHour: Number(formData.pricePerHour),
                message: formData.message.trim() || null
              },
              event: {
                type: job.event_type,
                date: job.event_date,
                duration: job.duration_hours,
                guests: job.guest_count,
                location: job.location
              }
            })
          })
        } catch (emailError) {
          // Don't block submission if email fails
          console.error('Failed to send email notification:', emailError)
        }
      }

      setSubmitted(true)
    } catch (err) {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (submitted) {
      onSuccess()
      setSubmitted(false)
      setFormData({ vendorName: '', pricePerHour: '', message: '', contactEmail: '' })
      setErrors({})
    }
    onClose()
  }

  // Success state
  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-20 h-20 rounded-full bg-primary-400 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-brown-700" />
            </div>

            <DialogTitle className="text-2xl mb-3">Quote Submitted Successfully</DialogTitle>
            <DialogDescription className="text-base mb-6">
              Your quote has been sent to the event organizer.
            </DialogDescription>

            <div className="w-full bg-neutral-50 rounded-lg p-5 mb-6 text-left">
              <h3 className="text-sm font-semibold mb-3 text-brown-700">What Happens Next?</h3>
              <ul className="space-y-2.5 text-sm text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
                    1
                  </span>
                  <span>
                    The event organizer will review your quote
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
                    2
                  </span>
                  <span>
                    If interested, they'll contact you directly within <strong>24-48 hours</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
                    3
                  </span>
                  <span>
                    You can discuss booking details and finalize the arrangement
                  </span>
                </li>
              </ul>
            </div>

            <div className="w-full space-y-3">
              <p className="text-xs text-neutral-500 mb-3">
                A confirmation has been sent to <strong>{formData.contactEmail}</strong>
              </p>

              <Button
                variant="primary"
                size="lg"
                onClick={handleClose}
                className="w-full h-12"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg max-h-[85vh] p-0">
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b z-10">
          <DialogTitle className="text-xl">Submit a Quote</DialogTitle>
          <DialogDescription className="text-sm mt-1">
            Share your pricing and availability for this event
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="vendorName" className="text-sm font-medium text-neutral-700">
                Vendor name *
              </Label>
              <Input
                id="vendorName"
                type="text"
                placeholder="e.g. The Bean Cart"
                value={formData.vendorName}
                onChange={e => updateField('vendorName', e.target.value)}
                className={`w-full mt-1 ${errors.vendorName ? 'border-red-300' : ''}`}
              />
              {errors.vendorName && <p className="text-red-600 text-sm mt-1">{errors.vendorName}</p>}
            </div>

            <div>
              <Label htmlFor="pricePerHour" className="text-sm font-medium text-neutral-700">
                Your price ($/hr) *
              </Label>
              <Input
                id="pricePerHour"
                type="number"
                placeholder="250"
                value={formData.pricePerHour}
                onChange={e => updateField('pricePerHour', e.target.value)}
                className={`w-full mt-1 ${errors.pricePerHour ? 'border-red-300' : ''}`}
              />
              {errors.pricePerHour && <p className="text-red-600 text-sm mt-1">{errors.pricePerHour}</p>}
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium text-neutral-700">
                A message <span className="text-neutral-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Tell the event owner about your cart, availability, and what's included…"
                value={formData.message}
                onChange={e => updateField('message', e.target.value)}
                rows={3}
                className={`w-full mt-1 min-h-[96px] ${errors.message ? 'border-red-300' : ''}`}
              />
              <div className="flex justify-between mt-1">
                {errors.message ? <p className="text-red-600 text-sm">{errors.message}</p> : <span />}
                <span className="text-xs text-neutral-400">{formData.message.length}/300</span>
              </div>
            </div>

            <div>
              <Label htmlFor="contactEmail" className="text-sm font-medium text-neutral-700">
                Your email *
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="your@email.com"
                value={formData.contactEmail}
                onChange={e => updateField('contactEmail', e.target.value)}
                className={`w-full mt-1 ${errors.contactEmail ? 'border-red-300' : ''}`}
              />
              {errors.contactEmail && <p className="text-red-600 text-sm mt-1">{errors.contactEmail}</p>}
            </div>

            {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <div className="space-y-3">
            {/* Trust Elements */}
            <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                Free to quote
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                Direct contact
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full h-12"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-brown-700 border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Quote'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
