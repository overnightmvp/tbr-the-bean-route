# Vendor Registration Flow

## Overview

The vendor registration flow allows coffee cart operators, coffee shops, and independent baristas to self-register for The Bean Route marketplace. This document analyzes the current mobile experience and proposes optimizations using shadcn/ui components.

## Current State Analysis

### User Journey

```mermaid
graph TD
    A[Landing Page] --> B[Click "Get Listed" CTA]
    B --> C[/vendors/register]
    C --> D[Step 1: Business Details]
    D --> E[Step 2: Service Details]
    E --> F[Step 3: Contact Info + Preview]
    F --> G{Validation}
    G -->|Pass| H[Submit to API]
    G -->|Fail| I[Show Inline Errors]
    I --> D
    H --> J[Success Screen]
    J --> K[Browse Marketplace]
```

### Current Implementation

**Components:**
- Multi-step form with `<StepIndicator>` (3 steps)
- Standard HTML inputs with custom styling
- Image upload with preview (Supabase storage)
- Vendor type selection (mobile cart, coffee shop, barista)
- Marketplace preview card on Step 3

**Current Styling:**
- Custom Tailwind classes with hardcoded colors (`#F5C842`, `#1A1A1A`)
- Input height: `py-2` (~40px) - below 48px mobile touch target
- Grid layouts: Single column on mobile, 2-column on desktop

### Mobile Pain Points

**Critical Issues:**

1. **Touch Target Violations** (WCAG 2.1 Level AA)
   - Input fields: `py-2` = ~40px height (need 48px minimum)
   - Checkbox labels: 4px checkboxes too small for accurate tapping
   - "Back" and "Continue" buttons: Standard height, no explicit min-height

2. **Form Layout Issues**
   - Suburb checkboxes: 3-column grid on mobile creates cramped tap areas
   - Event type checkboxes: 2-column grid, labels truncate on small screens
   - Price/capacity range inputs: Side-by-side layout difficult to tap accurately

3. **Validation Feedback**
   - Error messages display below fields, but keyboard can obscure them
   - No scroll-to-error on validation failure (user must manually find errors)
   - Multi-field errors (Step 2: 6+ checkboxes) require excessive scrolling

4. **Image Upload UX**
   - Preview thumbnail: 80px × 80px (w-20 h-20) - too small to evaluate quality
   - File input hidden, label acts as button - unclear affordance
   - No loading state during upload (only at final submit)

5. **Step Navigation**
   - No visual indication of form completeness before clicking "Continue"
   - Validation only fires on "Continue" click (no progressive validation)
   - Back button placement inconsistent (left vs right alignment across steps)

**Non-Critical Issues:**

- Success screen uses confetti animation (fun but not essential)
- No "Save Draft" functionality (vendors must complete in one session)
- No inline help text for complex fields (e.g., "What makes you special?")

---

## Optimized Design (shadcn/ui + Mobile-First)

### Design Principles

1. **Touch-First Inputs**: All interactive elements ≥48px height
2. **Progressive Validation**: Validate fields on blur, not just on submit
3. **Error Visibility**: Ensure errors remain visible when keyboard opens
4. **Reduced Cognitive Load**: Group related fields, add contextual help

### Component Mapping

| Current Component | shadcn/ui Replacement | Customization |
|-------------------|----------------------|---------------|
| `<input>` | `<Input>` | Height: `h-12` (48px), primary-400 focus ring |
| `<select>` | `<Select>` (new) | Mobile-friendly dropdown, native on mobile |
| Checkbox grid | `<Checkbox>` (new) | Larger touch targets (24px), label padding |
| `<button>` | `<Button>` | Variant="primary" (TBR yellow), size="lg" |
| `<Card>` | `<Card>` | Already using, add subtle shadows |
| Error text | `<Label>` + `<FormMessage>` | Red text, aria-invalid attributes |

### Optimized Flow Diagram

```mermaid
graph TD
    A[Landing Page] --> B[Clear Value Prop Section]
    B --> C[Prominent "Get Listed" CTA<br/>48px height, primary-400]
    C --> D[/vendors/register]
    D --> E[Step 1: Business Details<br/>Mobile: Single column, 16px spacing]
    E --> E1{Field Blur}
    E1 -->|Invalid| E2[Show Inline Error<br/>Scroll field into view]
    E1 -->|Valid| E3[Clear Error]
    E --> F[Validate Step 1]
    F -->|Pass| G[Step 2: Service Details<br/>Mobile: Single column checkboxes]
    F -->|Fail| H[Scroll to First Error<br/>Show error summary banner]
    G --> G1{Field Blur}
    G1 -->|Invalid| G2[Show Inline Error]
    G1 -->|Valid| G3[Clear Error]
    G --> I[Validate Step 2]
    I -->|Pass| J[Step 3: Contact + Preview]
    I -->|Fail| K[Scroll to First Error]
    J --> L[Show Marketplace Preview Card]
    L --> M{Final Validation}
    M -->|Pass| N[Submit with Loading State<br/>Disable form, show spinner]
    M -->|Fail| O[Scroll to First Error]
    N --> P{API Response}
    P -->|Success| Q[Success Modal<br/>Clear next steps, approval timeline]
    P -->|Error| R[Show Error Banner<br/>Preserve form data]
    Q --> S[CTA: Browse Marketplace]
```

### Mobile-Specific Fixes

**1. Input Fields (Step 1: Business Details)**

```tsx
// OLD (40px height, custom styling)
<input
  type="text"
  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
/>

// NEW (48px height, shadcn/ui Input)
<Input
  id="businessName"
  type="text"
  className="h-12 text-base" // 48px height, larger text on mobile
  aria-invalid={!!errors.businessName}
  aria-describedby="businessName-error"
/>
<FormMessage id="businessName-error">{errors.businessName}</FormMessage>
```

**Key Changes:**
- Height: `h-12` (48px) for WCAG compliance
- Text size: `text-base` (16px) to prevent iOS zoom on focus
- ARIA attributes for screen reader accessibility
- Error message linked via `aria-describedby`

**2. Checkbox Groups (Step 2: Suburbs, Event Types)**

```tsx
// OLD (3-column grid, 4px checkboxes)
<div className="grid grid-cols-3 gap-2">
  <label className="flex items-center gap-2">
    <input type="checkbox" className="w-4 h-4 rounded" />
    <span className="text-xs">Carlton</span>
  </label>
</div>

// NEW (Single column on mobile, larger touch targets)
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
  <div className="flex items-center space-x-3">
    <Checkbox
      id="suburb-carlton"
      className="h-6 w-6" // 24px checkbox
      checked={formData.suburbs.includes('Carlton')}
      onCheckedChange={() => toggleSuburb('Carlton')}
    />
    <Label
      htmlFor="suburb-carlton"
      className="text-sm font-medium cursor-pointer py-2 flex-1"
    >
      Carlton
    </Label>
  </div>
</div>
```

**Key Changes:**
- Checkbox size: 24px (6x larger tap area than 4px)
- Single column on mobile (no cramped 3-column grid)
- Label padding: `py-2` increases tappable area
- Full label acts as tap target (not just checkbox)

**3. Range Inputs (Step 2: Price, Capacity)**

```tsx
// OLD (Side-by-side on mobile, hard to tap)
<div className="flex items-center gap-3">
  <input type="number" placeholder="150" className="flex-1" />
  <span>–</span>
  <input type="number" placeholder="350" className="flex-1" />
</div>

// NEW (Stacked on mobile, side-by-side on tablet+)
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div>
    <Label htmlFor="priceMin">Minimum Price ($/hr)</Label>
    <Input
      id="priceMin"
      type="number"
      className="h-12 text-base"
      placeholder="150"
    />
    {errors.priceMin && <FormMessage>{errors.priceMin}</FormMessage>}
  </div>
  <div>
    <Label htmlFor="priceMax">Maximum Price ($/hr)</Label>
    <Input
      id="priceMax"
      type="number"
      className="h-12 text-base"
      placeholder="350"
    />
    {errors.priceMax && <FormMessage>{errors.priceMax}</FormMessage>}
  </div>
</div>
```

**Key Changes:**
- Stacked layout on mobile (grid-cols-1) for easier tapping
- Individual labels for each field (clearer context)
- Error messages display immediately below each field
- Side-by-side on tablet+ (sm:grid-cols-2)

**4. Image Upload**

```tsx
// OLD (Hidden file input, small preview)
<div className="w-20 h-20 rounded-2xl bg-neutral-100 border-2 border-dashed">
  {imagePreview && <img src={imagePreview} />}
</div>
<input type="file" className="hidden" id="photo-upload" />
<label htmlFor="photo-upload" className="inline-block px-4 py-2 border">
  Upload Photo
</label>

// NEW (Larger preview, clear upload button)
<div className="space-y-4">
  <div className="w-full h-48 rounded-lg bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden">
    {imagePreview ? (
      <img src={imagePreview} alt="Vendor preview" className="w-full h-full object-cover" />
    ) : (
      <div className="text-center p-4">
        <ImageIcon className="mx-auto h-12 w-12 text-neutral-400" />
        <p className="mt-2 text-sm text-neutral-500">Click to upload or drag image</p>
      </div>
    )}
  </div>
  <input
    type="file"
    className="hidden"
    id="photo-upload"
    onChange={handleImageChange}
  />
  <Button
    type="button"
    variant="outline"
    size="lg"
    asChild
    className="w-full h-12"
  >
    <label htmlFor="photo-upload" className="cursor-pointer">
      {imagePreview ? 'Change Photo' : 'Upload Photo'}
    </label>
  </Button>
</div>
```

**Key Changes:**
- Preview size: 48px tall (w-full h-48) - 3x larger, easier to evaluate quality
- Full-width upload button (h-12 = 48px, easy to tap)
- Drag-and-drop affordance (visual cue with icon)
- Loading state during upload (show spinner in button)

**5. Navigation Buttons**

```tsx
// OLD (Variable sizing, inconsistent alignment)
<div className={`flex gap-3 mt-8 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
  {step > 1 && <button className="px-5 py-2">Back</button>}
  <button className="px-6 py-2">Continue</button>
</div>

// NEW (Consistent sizing, always full-width on mobile)
<div className="flex flex-col sm:flex-row gap-3 mt-8">
  {step > 1 && (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleBack}
      className="w-full sm:w-auto h-12"
    >
      Back
    </Button>
  )}
  <Button
    type="button"
    variant="primary"
    size="lg"
    onClick={step < 3 ? handleNext : handleSubmit}
    disabled={isSubmitting}
    className="w-full sm:flex-1 h-12"
  >
    {isSubmitting ? 'Submitting...' : step < 3 ? 'Continue' : 'Submit Application'}
  </Button>
</div>
```

**Key Changes:**
- Full-width buttons on mobile (w-full), side-by-side on tablet+ (sm:flex-row)
- Consistent height: h-12 (48px) for all buttons
- Primary variant uses TBR yellow (bg-primary-400)
- Loading state disables button and shows spinner

**6. Success Screen**

```tsx
// OLD (Generic success message, no next steps)
<div className="text-center">
  <h2>Your application is in</h2>
  <p>We'll review your details and get back to you within 24 hours.</p>
</div>

// NEW (Clear timeline, actionable next steps)
<Card className="w-full max-w-md mx-auto">
  <CardContent className="p-8 text-center">
    <CheckCircleIcon className="w-16 h-16 text-primary-400 mx-auto mb-4" />
    <CardTitle className="text-2xl mb-3">Application Submitted</CardTitle>
    <CardDescription className="text-base mb-6">
      We'll review your application and respond within 48-72 hours.
    </CardDescription>

    <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
      <h3 className="text-sm font-semibold mb-2">What Happens Next?</h3>
      <ul className="space-y-2 text-sm text-neutral-600">
        <li className="flex items-start gap-2">
          <span className="text-primary-400">1.</span>
          <span>We review your profile for completeness</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary-400">2.</span>
          <span>You'll receive an approval email within 2-3 days</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary-400">3.</span>
          <span>Once approved, your profile goes live on the marketplace</span>
        </li>
      </ul>
    </div>

    <div className="space-y-3">
      <Button variant="primary" size="lg" asChild className="w-full h-12">
        <Link href="/app">Browse Marketplace</Link>
      </Button>
      <Button variant="outline" size="lg" asChild className="w-full h-12">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  </CardContent>
</Card>
```

**Key Changes:**
- Clear approval timeline (48-72 hours)
- Step-by-step "What Happens Next" section
- Two CTAs: Browse marketplace (primary) and Home (secondary)
- Both buttons h-12 (48px) for easy tapping

---

## Validation & Error Handling

### Progressive Validation Strategy

**OLD:** Validation only on "Continue" click

**NEW:** Multi-stage validation

1. **On Blur (Field-Level)**
   - Validate individual field when user leaves it
   - Show inline error immediately if invalid
   - Clear error when user corrects the field

2. **On Submit (Step-Level)**
   - Validate all fields in current step
   - If errors exist, scroll to first invalid field
   - Show error summary banner at top of form

3. **Before API Call (Final Validation)**
   - Re-validate all fields across all steps
   - Prevent submission if any field invalid
   - Show loading state during API call

**Example Implementation:**

```tsx
const handleFieldBlur = (field: keyof FormData) => {
  const validators: Record<keyof FormData, () => string | null> = {
    businessName: () => !formData.businessName.trim() ? 'Business name is required' : null,
    specialty: () => !formData.specialty.trim() ? 'Specialty is required' : null,
    description: () => {
      if (!formData.description.trim()) return 'Description is required'
      if (formData.description.length < 30) return 'Description must be at least 30 characters'
      return null
    },
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

// Scroll to first error on step validation failure
const scrollToFirstError = (fieldName: string) => {
  const element = document.getElementById(fieldName)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element.focus()
  }
}
```

---

## Acceptance Criteria

### Step 1: Business Details

- [ ] All input fields have `h-12` (48px) height
- [ ] Text inputs use `text-base` (16px) to prevent iOS zoom
- [ ] Vendor type selection buttons have 48px min-height
- [ ] Image upload button is full-width, h-12 (48px)
- [ ] Image preview is 192px tall (h-48), easily viewable
- [ ] Progressive validation on field blur
- [ ] Errors display below fields, remain visible with keyboard open

### Step 2: Service Details

- [ ] Checkbox groups use single column on mobile (grid-cols-1)
- [ ] Checkboxes are 24px × 24px (h-6 w-6)
- [ ] Full label acts as tap target (not just checkbox)
- [ ] Price/capacity inputs stack vertically on mobile
- [ ] All inputs have 48px min-height
- [ ] Error messages display immediately below each field

### Step 3: Contact + Preview

- [ ] Contact inputs have 48px min-height
- [ ] Preview card displays full vendor details
- [ ] Navigation buttons are full-width on mobile
- [ ] "Submit" button shows loading spinner when submitting
- [ ] Form disabled during submission (prevent double-submit)

### Success Screen

- [ ] Clear approval timeline (48-72 hours)
- [ ] "What Happens Next" section with 3 steps
- [ ] Two CTAs: "Browse Marketplace" (primary), "Back to Home" (outline)
- [ ] Both CTAs are h-12 (48px), full-width on mobile

### Validation & Errors

- [ ] Progressive validation on field blur (not just on submit)
- [ ] Scroll to first error when validation fails
- [ ] Error messages remain visible when keyboard opens
- [ ] ARIA attributes for screen reader accessibility

---

## Implementation Checklist

**Phase 1: shadcn/ui Migration (This Plan - 02-01)**
- [x] Install shadcn/ui CLI
- [x] Add Input component with h-12 customization
- [x] Add Button component with "primary" variant
- [x] Add Card component for success screen
- [x] Add Label component for form accessibility
- [x] Document flow diagram (this file)

**Phase 2: Component Migration (Plan 02-02)**
- [ ] Replace all `<input>` with `<Input>` (h-12)
- [ ] Add Checkbox component for suburb/event type selection
- [ ] Add Select component for dropdown fields
- [ ] Add FormMessage component for error display
- [ ] Update navigation buttons to use Button component

**Phase 3: Progressive Validation (Plan 02-03)**
- [ ] Implement on-blur validation for all fields
- [ ] Add scrollToFirstError utility function
- [ ] Add error summary banner at top of form
- [ ] Add loading state during image upload

**Phase 4: Success Screen Redesign (Plan 02-04)**
- [ ] Redesign success modal with Card + CardContent
- [ ] Add "What Happens Next" section
- [ ] Update CTAs to use Button component (primary + outline)
- [ ] Add approval timeline (48-72 hours)

**Phase 5: Testing (Plan 02-05)**
- [ ] E2E tests for full registration flow (Playwright)
- [ ] Mobile viewport tests (375px, 414px)
- [ ] Validation error tests (all fields)
- [ ] Accessibility audit (WCAG 2.1 Level AA)

---

## Related Components

- `src/app/(main)/vendors/register/page.tsx` - Main registration form
- `src/components/shared/StepIndicator.tsx` - Multi-step progress indicator
- `src/components/vendors/VendorCard.tsx` - Preview card on Step 3
- `src/components/shared/LocationAutocomplete.tsx` - Google Places API integration
- `src/components/ui/input.tsx` - shadcn/ui Input (NEW)
- `src/components/ui/button.tsx` - shadcn/ui Button with "primary" variant (NEW)
- `src/components/ui/checkbox.tsx` - shadcn/ui Checkbox (TO BE ADDED)
- `src/components/ui/select.tsx` - shadcn/ui Select (TO BE ADDED)

---

## References

- [WCAG 2.1 Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) - 44×44 CSS pixels minimum
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/buttons) - 44pt minimum touch targets
- [Material Design Touch Targets](https://m3.material.io/foundations/layout/applying-layout/touch-targets) - 48dp minimum
- [shadcn/ui Documentation](https://ui.shadcn.com/docs) - Component API reference
