# Event Organizer Inquiry Flow

## Overview

The event organizer inquiry flow allows users to request quotes from coffee vendors by submitting booking inquiries through a modal form. This document analyzes the current mobile experience and proposes optimizations using shadcn/ui components.

## Current State Analysis

### User Journey

```mermaid
graph TD
    A[Landing Page / Vendor Directory] --> B[Browse Vendor Cards]
    B --> C[Click Vendor Card]
    C --> D[Vendor Detail Page]
    D --> E[Click "Request Quote" Button]
    E --> F[Inquiry Modal Opens]
    F --> G[Fill Contact Details<br/>Name, Email, Phone]
    G --> H[Fill Event Details<br/>Type, Date, Duration, Guests, Location]
    H --> I[Review Estimated Cost]
    I --> J{Validation}
    J -->|Pass| K[Submit to API]
    J -->|Fail| L[Show Inline Errors]
    L --> G
    K --> M[Success State in Modal]
    M --> N[Close Modal]
    N --> O[Return to Vendor Detail Page]
```

### Current Implementation

**Component:** `src/components/booking/SimpleBookingModal.tsx`

**Structure:**
- Fixed overlay with backdrop blur
- Modal card (max-w-xl = 576px)
- Sticky header with vendor info
- Scrollable form content
- Two sections: "Your details" + "Event details"
- Estimated cost display (read-only, auto-calculated)
- Trust elements ("Free to inquire", "No commitment")
- Submit button with loading state

**Current Styling:**
- Hardcoded colors: `#F5C842` (primary), `#1A1A1A` (text), `#3B2A1A` (brown)
- Input height: `py-2` (~40px) - below 48px mobile touch target
- Grid layouts: Single column on mobile, 2-column on tablet (sm:grid-cols-2)
- Modal width: max-w-xl (576px) on desktop, full-width minus padding on mobile

### Mobile Pain Points

**Critical Issues:**

1. **Touch Target Violations** (WCAG 2.1 Level AA)
   - Input fields: `py-2` = ~40px height (need 48px minimum)
   - Select dropdowns: Standard height, no explicit min-height
   - Submit button: `min-h-[48px]` defined but size="lg" overrides it inconsistently

2. **Modal Sizing Issues**
   - Modal width: `max-w-xl` (576px) too wide on tablet landscape (iPad Mini)
   - Horizontal scroll appears on small tablets (768px width)
   - Modal content: `max-h-[90vh]` can cause footer buttons to be cut off by keyboard

3. **Keyboard Obscuring Content**
   - Error messages display below fields, hidden when keyboard opens
   - Estimated cost section (important context) hidden during form filling on mobile
   - No auto-scroll to active field when keyboard opens
   - iOS Safari: Address bar collapse causes modal to jump

4. **Form Layout Issues**
   - Contact info grid: 2-column on tablet (sm:grid-cols-2) cramped on small tablets
   - Date picker: Native `type="date"` inconsistent across devices (iOS vs Android)
   - Location field: Text input instead of autocomplete (no Google Places integration)
   - Special requests textarea: Only 2 rows, requires scrolling for longer text

5. **Validation Feedback**
   - Validation only fires on submit (no progressive validation)
   - Error messages: `text-xs` (12px) hard to read on mobile
   - No error summary banner (users must scroll to find errors)
   - Red border on invalid fields subtle, not obvious enough

**Non-Critical Issues:**

- Success state: Uses inline styles instead of Tailwind classes
- Modal close: Click outside to close, but no swipe-to-dismiss on mobile
- Trust elements: Icons SVG inline, could use lucide-react
- Loading state: Custom spinner SVG, could use shadcn/ui Button loading prop

---

## Optimized Design (shadcn/ui + Mobile-First)

### Design Principles

1. **Touch-First Inputs**: All interactive elements ≥48px height
2. **Keyboard-Aware Layout**: Ensure errors/context remain visible when keyboard opens
3. **Progressive Validation**: Validate fields on blur, not just on submit
4. **Modal Sizing**: Responsive max-width (max-w-md on mobile, max-w-lg on desktop)
5. **Native Inputs Where Appropriate**: Use native date/time pickers on mobile, custom on desktop

### Component Mapping

| Current Component | shadcn/ui Replacement | Customization |
|-------------------|----------------------|---------------|
| `<input>` | `<Input>` | Height: `h-12` (48px), primary-400 focus ring |
| `<select>` | `<Select>` (new) | Native on mobile, custom dropdown on desktop |
| `<textarea>` | `<Textarea>` (new) | Min-height: 96px (4 rows), auto-resize |
| `<button>` | `<Button>` | Variant="primary" (TBR yellow), size="lg" |
| `<Card>` | `<Dialog>` (new) | Modal container with responsive sizing |
| Error text | `<Label>` + `<FormMessage>` | Red text, `text-sm` (14px), aria-invalid |
| Loading spinner | `<Button loading>` | Built-in loading state |

### Optimized Flow Diagram

```mermaid
graph TD
    A[Vendor Detail Page] --> B[Prominent "Request Quote" Button<br/>48px height, primary-400, full-width on mobile]
    B --> C[Dialog Opens<br/>max-w-md mobile, max-w-lg desktop]
    C --> D[Step Indicator<br/>1/2: Contact Info]
    D --> E[Contact Form Fields<br/>Single column, h-12 inputs]
    E --> E1{Field Blur}
    E1 -->|Invalid| E2[Show Inline Error<br/>Scroll field into view]
    E1 -->|Valid| E3[Clear Error]
    E --> F["Continue" Button Enabled<br/>After all required fields filled]
    F --> G[Step 2/2: Event Details]
    G --> G1{Field Blur}
    G1 -->|Invalid| G2[Show Inline Error]
    G1 -->|Valid| G3[Clear Error]
    G --> H[Estimated Cost Section<br/>Sticky at bottom, always visible]
    H --> I["Submit" Button<br/>48px, loading state]
    I --> J{Validation}
    J -->|Pass| K[Submit to API<br/>Disable form, show spinner]
    J -->|Fail| L[Scroll to First Error<br/>Show error summary banner]
    K --> M{API Response}
    M -->|Success| N[Success State in Modal<br/>Clear timeline, next steps]
    M -->|Error| O[Error Banner<br/>Preserve form data, allow retry]
    N --> P["Done" Button<br/>48px, primary variant]
    P --> Q[Close Dialog]
    Q --> R[Return to Vendor Detail Page]
```

### Mobile-Specific Fixes

**1. Dialog Sizing**

```tsx
// OLD (max-w-xl = 576px, too wide on tablets)
<Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
  {/* Form content */}
</Card>

// NEW (max-w-md = 448px on mobile, max-w-lg = 512px on desktop)
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg max-h-[85vh]">
    <DialogHeader>
      <DialogTitle>Get a quote from {vendor.businessName}</DialogTitle>
      <DialogDescription>
        {vendor.specialty} • {formatPriceRange(vendor)}/hr
      </DialogDescription>
    </DialogHeader>

    {/* Scrollable form content */}
    <div className="overflow-y-auto px-1">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Form fields */}
      </form>
    </div>

    {/* Sticky footer (estimated cost + submit) */}
    <DialogFooter className="sticky bottom-0 bg-white border-t pt-4">
      {/* Estimated cost + submit button */}
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Key Changes:**
- Width: `w-[calc(100%-2rem)]` (16px margin on mobile), max-w-md (448px)
- Height: `max-h-[85vh]` (leave room for iOS Safari address bar)
- Scrollable content: `overflow-y-auto` only on form area, not header/footer
- Sticky footer: Estimated cost + submit button always visible

**2. Multi-Step Form (Progressive Disclosure)**

Instead of showing all fields at once, split into 2 steps to reduce cognitive load:

**Step 1: Contact Info (3 required fields)**

```tsx
<div className="space-y-4">
  <div>
    <Label htmlFor="contactName">Your Name *</Label>
    <Input
      id="contactName"
      type="text"
      className="h-12 text-base"
      placeholder="Jane Smith"
      value={formData.contactName}
      onChange={(e) => updateField('contactName', e.target.value)}
      onBlur={() => validateField('contactName')}
      aria-invalid={!!errors.contactName}
    />
    {errors.contactName && <FormMessage>{errors.contactName}</FormMessage>}
  </div>

  <div>
    <Label htmlFor="contactEmail">Email Address *</Label>
    <Input
      id="contactEmail"
      type="email"
      className="h-12 text-base"
      placeholder="jane@company.com"
      value={formData.contactEmail}
      onChange={(e) => updateField('contactEmail', e.target.value)}
      onBlur={() => validateField('contactEmail')}
      aria-invalid={!!errors.contactEmail}
    />
    {errors.contactEmail && <FormMessage>{errors.contactEmail}</FormMessage>}
  </div>

  <div>
    <Label htmlFor="contactPhone">Phone Number (optional)</Label>
    <Input
      id="contactPhone"
      type="tel"
      className="h-12 text-base"
      placeholder="+61 4XX XXX XXX"
      value={formData.contactPhone}
      onChange={(e) => updateField('contactPhone', e.target.value)}
    />
    <p className="text-xs text-neutral-500 mt-1">For faster response times</p>
  </div>

  <Button
    type="button"
    variant="primary"
    size="lg"
    onClick={handleNext}
    disabled={!isStep1Valid}
    className="w-full h-12"
  >
    Continue to Event Details
  </Button>
</div>
```

**Step 2: Event Details (5 required fields + estimated cost)**

```tsx
<div className="space-y-4">
  <div>
    <Label htmlFor="eventType">Event Type *</Label>
    <Select
      value={formData.eventType}
      onValueChange={(val) => updateField('eventType', val)}
    >
      <SelectTrigger id="eventType" className="h-12 text-base">
        <SelectValue placeholder="Select event type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Corporate event">Corporate event</SelectItem>
        <SelectItem value="Wedding">Wedding</SelectItem>
        <SelectItem value="Festival">Festival</SelectItem>
        <SelectItem value="Birthday party">Birthday party</SelectItem>
        <SelectItem value="Conference">Conference</SelectItem>
        <SelectItem value="Private gathering">Private gathering</SelectItem>
      </SelectContent>
    </Select>
    {errors.eventType && <FormMessage>{errors.eventType}</FormMessage>}
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="eventDate">Event Date *</Label>
      <Input
        id="eventDate"
        type="date"
        className="h-12 text-base"
        value={formData.eventDate}
        onChange={(e) => updateField('eventDate', e.target.value)}
        onBlur={() => validateField('eventDate')}
        min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
      />
      {errors.eventDate && <FormMessage>{errors.eventDate}</FormMessage>}
    </div>

    <div>
      <Label htmlFor="durationHours">Duration (hours)</Label>
      <Select
        value={String(formData.durationHours)}
        onValueChange={(val) => updateField('durationHours', parseInt(val))}
      >
        <SelectTrigger id="durationHours" className="h-12 text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 6, 8].map(h => (
            <SelectItem key={h} value={String(h)}>{h} hour{h > 1 ? 's' : ''}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="guestCount">Number of Guests</Label>
      <Select
        value={String(formData.guestCount)}
        onValueChange={(val) => updateField('guestCount', parseInt(val))}
      >
        <SelectTrigger id="guestCount" className="h-12 text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[20, 30, 50, 75, 100, 150, 200, 300].map(n => (
            <SelectItem key={n} value={String(n)}>{n} guests</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="location">Event Location *</Label>
      <Input
        id="location"
        type="text"
        className="h-12 text-base"
        placeholder="e.g. Fitzroy Gardens, VIC"
        value={formData.location}
        onChange={(e) => updateField('location', e.target.value)}
        onBlur={() => validateField('location')}
      />
      {errors.location && <FormMessage>{errors.location}</FormMessage>}
    </div>
  </div>

  <div>
    <Label htmlFor="specialRequests">Special Requests (optional)</Label>
    <Textarea
      id="specialRequests"
      className="min-h-[96px] text-base"
      placeholder="Dietary requirements, specific setup needs, etc."
      value={formData.specialRequests}
      onChange={(e) => updateField('specialRequests', e.target.value)}
      rows={4}
    />
  </div>
</div>
```

**Key Changes:**
- Split into 2 steps (Step 1: Contact, Step 2: Event)
- All inputs h-12 (48px) for WCAG compliance
- Text size: text-base (16px) to prevent iOS zoom
- Select component: Native dropdown on mobile, custom on desktop
- Progressive validation on field blur
- "Continue" button disabled until required fields filled

**3. Estimated Cost (Sticky Footer)**

```tsx
// OLD (Inline in form, hidden by keyboard)
<div className="rounded-lg p-4" style={{ backgroundColor: '#FAF5F0' }}>
  <div className="flex justify-between items-center">
    <div>
      <div className="text-xs font-semibold uppercase">Estimated cost</div>
      <div className="text-xs text-neutral-500">Based on avg rate • {duration}hr</div>
    </div>
    <div className="text-2xl font-bold">${estimatedCost.toLocaleString()}</div>
  </div>
</div>

// NEW (Sticky footer, always visible)
<DialogFooter className="sticky bottom-0 bg-white border-t pt-4 mt-6">
  <div className="w-full space-y-4">
    {/* Estimated Cost Section */}
    <div className="bg-primary-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-brown-700">
            Estimated Cost
          </div>
          <div className="text-xs text-neutral-600 mt-0.5">
            Based on average rate • {formData.durationHours} hour{formData.durationHours > 1 ? 's' : ''}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">
            Final price confirmed by vendor
          </div>
        </div>
        <div className="text-3xl font-bold text-brown-700">
          ${estimatedCost.toLocaleString('en-AU')}
        </div>
      </div>
    </div>

    {/* Trust Elements */}
    <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
      <span className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
        Free to inquire
      </span>
      <span className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
        No commitment
      </span>
      <span className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
        Direct contact
      </span>
    </div>

    {/* Submit Button */}
    <div className="flex gap-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleBack}
        className="h-12"
      >
        Back
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="flex-1 h-12"
      >
        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
      </Button>
    </div>
  </div>
</DialogFooter>
```

**Key Changes:**
- Sticky footer: `sticky bottom-0` keeps cost + submit visible
- Background: `bg-white` prevents content from showing through
- Estimated cost: Larger text (text-3xl = 30px) for emphasis
- Trust elements: Use lucide-react CheckCircle2 icon
- Navigation: Back button (outline) + Submit button (primary)
- Both buttons h-12 (48px), Submit is flex-1 (takes remaining space)

**4. Success State**

```tsx
// OLD (Inline styles, generic message)
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
  <Card className="w-full max-w-md text-center">
    <CardContent className="p-8">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5C842' }}>
        <svg className="w-8 h-8" fill="none" stroke="#1A1A1A" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2">Inquiry sent</h2>
      <p className="text-sm text-neutral-600 mb-6">
        {vendor.businessName} will be in touch shortly.
      </p>
      <Button onClick={handleClose} fullWidth>Done</Button>
    </CardContent>
  </Card>
</div>

// NEW (Dialog with clear next steps, timeline)
<DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg">
  <div className="flex flex-col items-center text-center p-6">
    <div className="w-20 h-20 rounded-full bg-primary-400 flex items-center justify-center mb-6">
      <CheckCircle2 className="w-10 h-10 text-brown-700" />
    </div>

    <DialogTitle className="text-2xl mb-3">Inquiry Sent Successfully</DialogTitle>
    <DialogDescription className="text-base mb-6">
      Your quote request has been sent to <strong>{vendor.businessName}</strong>.
    </DialogDescription>

    <div className="w-full bg-neutral-50 rounded-lg p-5 mb-6 text-left">
      <h3 className="text-sm font-semibold mb-3 text-brown-700">What Happens Next?</h3>
      <ul className="space-y-2.5 text-sm text-neutral-700">
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
            1
          </span>
          <span>
            <strong>{vendor.businessName}</strong> will review your event details
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
            2
          </span>
          <span>
            You'll receive a quote via email within <strong>24-48 hours</strong>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-400 flex items-center justify-center text-xs font-bold text-brown-700">
            3
          </span>
          <span>
            You can discuss details directly with the vendor
          </span>
        </li>
      </ul>
    </div>

    <div className="w-full space-y-3">
      <p className="text-xs text-neutral-500 mb-3">
        A confirmation email has been sent to <strong>{formData.contactEmail}</strong>
      </p>

      <Button
        variant="primary"
        size="lg"
        onClick={handleClose}
        className="w-full h-12"
      >
        Done
      </Button>

      <Button
        variant="outline"
        size="lg"
        asChild
        className="w-full h-12"
      >
        <Link href="/app">Browse More Vendors</Link>
      </Button>
    </div>
  </div>
</DialogContent>
```

**Key Changes:**
- Clear timeline: "24-48 hours" response time
- Step-by-step "What Happens Next" (3 numbered steps)
- Visual hierarchy: Numbered circles (1, 2, 3) with bold key phrases
- Two CTAs: "Done" (primary, closes modal) + "Browse More Vendors" (outline, navigates to directory)
- Confirmation email address shown: "{formData.contactEmail}"

**5. Error Handling & Validation**

```tsx
// Progressive validation on field blur
const validateField = (field: keyof InquiryFormData) => {
  const validators: Record<keyof InquiryFormData, () => string | null> = {
    contactName: () => !formData.contactName.trim() ? 'Your name is required' : null,
    contactEmail: () => {
      if (!formData.contactEmail.trim()) return 'Email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        return 'Please enter a valid email address'
      }
      return null
    },
    eventType: () => !formData.eventType ? 'Please select an event type' : null,
    eventDate: () => !formData.eventDate ? 'Event date is required' : null,
    location: () => !formData.location.trim() ? 'Event location is required' : null,
    // ... other fields
  }

  const error = validators[field]?.()
  if (error) {
    setErrors(prev => ({ ...prev, [field]: error }))
  } else {
    setErrors(prev => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }
}

// Scroll to first error on submit validation failure
const scrollToFirstError = (fieldName: string) => {
  const element = document.getElementById(fieldName)
  if (element) {
    // Scroll field to center of viewport
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element.focus()
  }
}

// Error summary banner (displayed at top of form if validation fails)
{Object.keys(errors).length > 0 && (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Please fix the following errors:</AlertTitle>
    <AlertDescription>
      <ul className="list-disc list-inside text-sm">
        {Object.entries(errors).map(([field, message]) => (
          <li key={field}>{message}</li>
        ))}
      </ul>
    </AlertDescription>
  </Alert>
)}
```

**Key Changes:**
- Validate on field blur (not just on submit)
- Scroll to first error when validation fails
- Error summary banner at top of form
- Error messages: `text-sm` (14px) instead of `text-xs` (12px) for readability
- ARIA attributes for screen reader accessibility

---

## Acceptance Criteria

### Dialog Component

- [ ] Modal width: `w-[calc(100%-2rem)]` on mobile (16px margin), `max-w-md` (448px)
- [ ] Modal height: `max-h-[85vh]` (leave room for iOS address bar)
- [ ] Scrollable content: Overflow only on form area, not header/footer
- [ ] Backdrop: `backdrop-blur-sm` for visual depth

### Step 1: Contact Info

- [ ] All inputs have `h-12` (48px) height
- [ ] Text size: `text-base` (16px) to prevent iOS zoom
- [ ] Progressive validation on field blur
- [ ] Error messages: `text-sm` (14px), red text, display below fields
- [ ] "Continue" button disabled until all required fields filled

### Step 2: Event Details

- [ ] All inputs and selects have `h-12` (48px) height
- [ ] Date picker: Native `type="date"` input (consistent across devices)
- [ ] Select dropdowns: shadcn/ui Select component
- [ ] Textarea: `min-h-[96px]` (4 rows), auto-resize as user types
- [ ] Single-column layout on mobile, 2-column on tablet (sm:grid-cols-2)

### Estimated Cost (Sticky Footer)

- [ ] Sticky footer: `sticky bottom-0` keeps cost + submit visible
- [ ] Background: `bg-white` prevents content from showing through
- [ ] Cost display: Large text (text-3xl = 30px), bold, brown-700 color
- [ ] Trust elements: Use lucide-react CheckCircle2 icon
- [ ] Navigation: Back (outline) + Submit (primary), both h-12 (48px)

### Success State

- [ ] Clear timeline: "24-48 hours" response time
- [ ] "What Happens Next" section with 3 numbered steps
- [ ] Numbered circles: 24px (w-6 h-6), primary-400 background
- [ ] Two CTAs: "Done" (primary), "Browse More Vendors" (outline)
- [ ] Confirmation email shown: "{formData.contactEmail}"

### Validation & Errors

- [ ] Progressive validation on field blur (not just on submit)
- [ ] Scroll to first error when validation fails
- [ ] Error summary banner at top of form if >1 error
- [ ] Error messages remain visible when keyboard opens
- [ ] ARIA attributes: `aria-invalid`, `aria-describedby` for screen readers

---

## Implementation Checklist

**Phase 1: shadcn/ui Migration (This Plan - 02-01)**
- [x] Install shadcn/ui CLI
- [x] Add Input component with h-12 customization
- [x] Add Button component with "primary" variant
- [x] Add Label component for form accessibility
- [x] Document flow diagram (this file)

**Phase 2: Component Migration (Plan 02-02)**
- [ ] Add Dialog component (replace fixed overlay + Card)
- [ ] Add Select component for dropdowns
- [ ] Add Textarea component for special requests
- [ ] Add Alert component for error summary banner
- [ ] Replace all inputs with shadcn/ui components

**Phase 3: Multi-Step Form (Plan 02-03)**
- [ ] Split form into 2 steps (Contact Info + Event Details)
- [ ] Add step indicator (1/2, 2/2)
- [ ] Add "Continue" button (disabled until Step 1 valid)
- [ ] Add "Back" button on Step 2
- [ ] Implement progressive validation (on blur)

**Phase 4: Sticky Footer (Plan 02-04)**
- [ ] Move estimated cost to sticky footer
- [ ] Add trust elements to footer
- [ ] Update navigation buttons (Back + Submit)
- [ ] Ensure footer remains visible when scrolling

**Phase 5: Success State Redesign (Plan 02-04)**
- [ ] Redesign success modal with Dialog
- [ ] Add "What Happens Next" section (3 numbered steps)
- [ ] Update CTAs: "Done" (primary) + "Browse More Vendors" (outline)
- [ ] Add confirmation email display

**Phase 6: Testing (Plan 02-05)**
- [ ] E2E tests for full inquiry flow (Playwright)
- [ ] Mobile viewport tests (375px, 414px, 768px)
- [ ] Keyboard obscuring tests (iOS Safari, Chrome Mobile)
- [ ] Validation error tests (all fields)
- [ ] Accessibility audit (WCAG 2.1 Level AA)

---

## Related Components

- `src/components/booking/SimpleBookingModal.tsx` - Main inquiry modal (to be refactored)
- `src/components/vendors/VendorCard.tsx` - Vendor card with "Request Quote" button
- `src/app/(main)/vendors/[slug]/page.tsx` - Vendor detail page
- `src/components/ui/input.tsx` - shadcn/ui Input (NEW)
- `src/components/ui/button.tsx` - shadcn/ui Button with "primary" variant (NEW)
- `src/components/ui/dialog.tsx` - shadcn/ui Dialog (TO BE ADDED)
- `src/components/ui/select.tsx` - shadcn/ui Select (TO BE ADDED)
- `src/components/ui/textarea.tsx` - shadcn/ui Textarea (TO BE ADDED)
- `src/components/ui/alert.tsx` - shadcn/ui Alert for error summary (TO BE ADDED)

---

## References

- [WCAG 2.1 Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) - 44×44 CSS pixels minimum
- [iOS Safari Keyboard Behavior](https://developer.apple.com/forums/thread/713454) - Viewport units change when keyboard opens
- [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) - Accessible modal component
- [shadcn/ui Documentation](https://ui.shadcn.com/docs) - Component API reference
- [Material Design Touch Targets](https://m3.material.io/foundations/layout/applying-layout/touch-targets) - 48dp minimum
