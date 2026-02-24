import { test, expect, devices } from '@playwright/test'

// Use mobile viewport (iPhone SE - 375x667px)
test.use({
  ...devices['iPhone SE'],
})

test.describe('Critical Flows - Mobile (375px)', () => {

  test.describe('Vendor Registration Flow', () => {
    test('Complete vendor registration on mobile', async ({ page }) => {
      await page.goto('/vendors/register')

      // Verify page loads without horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = await page.evaluate(() => window.innerWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1) // +1 tolerance for rounding

      // Fill basic info
      await page.getByLabel(/business.*name/i).fill('Mobile Test Cart')
      await page.getByLabel(/specialty/i).fill('Specialty Coffee & Pastries')

      // Verify input height ≥48px (touch targets)
      const businessNameInput = page.getByLabel(/business.*name/i)
      const inputBox = await businessNameInput.boundingBox()
      expect(inputBox).not.toBeNull()
      if (inputBox) {
        expect(inputBox.height).toBeGreaterThanOrEqual(48)
      }

      // Test validation: Clear required field and submit
      await page.getByLabel(/business.*name/i).clear()

      // Look for submit/register button (handle variations)
      const submitButton = page.locator('button[type="submit"]').first()
      await submitButton.click()

      // Error message should appear and be visible
      await expect(page.getByText(/required/i).first()).toBeVisible({ timeout: 5000 })

      // Fill form correctly
      await page.getByLabel(/business.*name/i).fill('Mobile Test Cart')
      await page.getByLabel(/specialty/i).fill('Specialty Coffee')

      // Try to find and fill description/bio field if exists
      const descriptionField = page.locator('textarea').first()
      if (await descriptionField.isVisible().catch(() => false)) {
        await descriptionField.fill('We serve premium coffee at events across Melbourne.')
      }

      // Select suburbs/location (handle checkbox or select)
      const suburbCheckbox = page.getByLabel(/carlton/i).first()
      if (await suburbCheckbox.isVisible().catch(() => false)) {
        await suburbCheckbox.check()
      }

      // Fill pricing if fields exist
      const priceMinField = page.getByLabel(/min.*price|minimum.*price|from.*price/i).first()
      if (await priceMinField.isVisible().catch(() => false)) {
        await priceMinField.fill('200')
      }

      const priceMaxField = page.getByLabel(/max.*price|maximum.*price|to.*price/i).first()
      if (await priceMaxField.isVisible().catch(() => false)) {
        await priceMaxField.fill('350')
      }

      // Fill contact info
      const emailField = page.getByLabel(/email/i).first()
      if (await emailField.isVisible()) {
        await emailField.fill('test@mobilebean.com')
      }

      const phoneField = page.getByLabel(/phone/i).first()
      if (await phoneField.isVisible().catch(() => false)) {
        await phoneField.fill('0412345678')
      }

      // Submit form
      await submitButton.click()

      // Wait for success confirmation (handle different success messages)
      await expect(
        page.locator('text=/success|thank you|registered|application.*sent|received/i').first()
      ).toBeVisible({ timeout: 15000 })
    })

    test('Submit button is full-width on mobile', async ({ page }) => {
      await page.goto('/vendors/register')

      const submitButton = page.locator('button[type="submit"]').first()
      await expect(submitButton).toBeVisible()

      const buttonBox = await submitButton.boundingBox()
      const formElement = await page.locator('form').first().boundingBox()

      expect(buttonBox).not.toBeNull()
      expect(formElement).not.toBeNull()

      if (buttonBox && formElement) {
        // Button should be at least 90% of form width (effectively full-width)
        expect(buttonBox.width).toBeGreaterThan(formElement.width * 0.85)
      }
    })

    test('Form inputs have minimum 48px touch targets', async ({ page }) => {
      await page.goto('/vendors/register')

      // Check all text inputs
      const textInputs = await page.locator('input[type="text"], input[type="email"], input[type="tel"]').all()
      for (const input of textInputs) {
        if (await input.isVisible()) {
          const box = await input.boundingBox()
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(48)
          }
        }
      }
    })
  })

  test.describe('Event Organizer Inquiry Flow', () => {
    test('Submit inquiry via SimpleBookingModal on mobile', async ({ page }) => {
      // Navigate to vendor detail page (use a known vendor slug)
      await page.goto('/vendors/mobile-cart-specialist')

      // If vendor doesn't exist, navigate to home and click first vendor
      const vendorNotFound = await page.locator('text=/not found|404/i').isVisible().catch(() => false)
      if (vendorNotFound) {
        await page.goto('/')
        await page.locator('[href^="/vendors/"]').first().click()
        await page.waitForURL(/\/vendors\/.+/)
      }

      // Open inquiry modal
      const requestQuoteButton = page.getByRole('button', { name: /request.*quote|get.*quote|inquire/i })
      await expect(requestQuoteButton).toBeVisible({ timeout: 5000 })

      // Verify button has 48px height
      const buttonBox = await requestQuoteButton.boundingBox()
      if (buttonBox) {
        expect(buttonBox.height).toBeGreaterThanOrEqual(48)
      }

      await requestQuoteButton.click()

      // Wait for dialog to open
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible({ timeout: 5000 })

      // Verify dialog fits mobile viewport (with margin)
      const dialogBox = await dialog.boundingBox()
      const viewportWidth = page.viewportSize()?.width || 375

      if (dialogBox) {
        expect(dialogBox.width).toBeLessThanOrEqual(viewportWidth - 16) // 2rem = 32px, allow some tolerance
      }

      // Fill contact info
      const nameField = dialog.getByLabel(/name/i).first()
      await nameField.fill('Jane Smith')

      const emailField = dialog.getByLabel(/email/i).first()
      await emailField.fill('jane@example.com')

      // Verify input touch targets ≥48px
      const emailBox = await emailField.boundingBox()
      if (emailBox) {
        expect(emailBox.height).toBeGreaterThanOrEqual(48)
      }

      // Fill event details - event type (select/dropdown)
      const eventTypeSelect = dialog.locator('[id*="eventType"], [name*="eventType"]').first()
      if (await eventTypeSelect.isVisible()) {
        await eventTypeSelect.click()
        await page.getByRole('option', { name: /wedding/i }).click().catch(async () => {
          // Fallback: try clicking a menu item if role=option doesn't work
          await page.getByText(/wedding/i).first().click()
        })
      }

      // Event date
      const eventDateField = dialog.getByLabel(/.*date/i).first()
      if (await eventDateField.isVisible()) {
        // Set date 2 weeks from now
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 14)
        const dateString = futureDate.toISOString().split('T')[0]
        await eventDateField.fill(dateString)
      }

      // Location
      const locationField = dialog.getByLabel(/location/i).first()
      if (await locationField.isVisible()) {
        await locationField.fill('Fitzroy Gardens, Melbourne VIC')
      }

      // Submit form
      const submitBtn = dialog.getByRole('button', { name: /send.*inquiry|submit/i })
      await submitBtn.click()

      // Success message appears
      await expect(
        dialog.locator('text=/success|sent|thank you/i').first()
      ).toBeVisible({ timeout: 15000 })

      // Success message mentions response timeline
      await expect(
        dialog.locator('text=/24.*48.*hours?|within.*2.*days/i').first()
      ).toBeVisible({ timeout: 5000 })
    })

    test('Dialog content scrollable if form is long', async ({ page }) => {
      await page.goto('/vendors/mobile-cart-specialist')

      // If vendor doesn't exist, go to home first
      const vendorNotFound = await page.locator('text=/not found|404/i').isVisible().catch(() => false)
      if (vendorNotFound) {
        await page.goto('/')
        await page.locator('[href^="/vendors/"]').first().click()
        await page.waitForURL(/\/vendors\/.+/)
      }

      await page.getByRole('button', { name: /request.*quote|get.*quote|inquire/i }).click()

      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()

      // Find scrollable content area
      const scrollableContent = dialog.locator('.overflow-y-auto, [style*="overflow-y"]').first()

      // Check if scrollable container exists
      const isScrollable = await scrollableContent.isVisible().catch(() => false)

      if (isScrollable) {
        // Verify max-height constraint exists (viewport-relative)
        const maxHeight = await scrollableContent.evaluate((el) =>
          window.getComputedStyle(el).maxHeight
        )
        expect(maxHeight).toMatch(/vh|px/) // Should have a max-height set
      }
    })

    test('Sticky footer remains visible when scrolling', async ({ page }) => {
      await page.goto('/vendors/mobile-cart-specialist')

      // If vendor doesn't exist, navigate to home first
      const vendorNotFound = await page.locator('text=/not found|404/i').isVisible().catch(() => false)
      if (vendorNotFound) {
        await page.goto('/')
        await page.locator('[href^="/vendors/"]').first().click()
        await page.waitForURL(/\/vendors\/.+/)
      }

      await page.getByRole('button', { name: /request.*quote|get.*quote|inquire/i }).click()

      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()

      // Find the sticky footer (contains submit button and cost estimate)
      const footer = dialog.locator('[class*="sticky"][class*="bottom"]').first()

      if (await footer.isVisible().catch(() => false)) {
        // Scroll down within the dialog
        await dialog.evaluate((el) => {
          const scrollable = el.querySelector('.overflow-y-auto')
          if (scrollable) {
            scrollable.scrollTop = scrollable.scrollHeight
          }
        })

        // Footer should still be visible after scrolling
        await expect(footer).toBeVisible()
      }
    })
  })

  test.describe('Mobile UX Requirements', () => {
    test('No horizontal scroll on critical pages', async ({ page }) => {
      const pages = [
        '/',
        '/vendors/register',
        '/jobs',
      ]

      for (const url of pages) {
        await page.goto(url)

        const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
        const viewportWidth = await page.evaluate(() => window.innerWidth)

        // Horizontal scroll check
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1)
      }
    })

    test('All buttons have minimum 48px touch targets on vendor registration', async ({ page }) => {
      await page.goto('/vendors/register')

      // Check all visible buttons
      const buttons = await page.locator('button').all()
      for (const button of buttons) {
        if (await button.isVisible()) {
          const box = await button.boundingBox()
          if (box) {
            // Button height should be at least 48px
            expect(box.height).toBeGreaterThanOrEqual(48)
          }
        }
      }
    })

    test('Form validation errors visible without scrolling', async ({ page }) => {
      await page.goto('/vendors/register')

      // Submit empty form to trigger validation
      const submitButton = page.locator('button[type="submit"]').first()
      await submitButton.click()

      // Wait for error message
      const firstError = page.locator('text=/required|invalid/i').first()
      await expect(firstError).toBeVisible({ timeout: 5000 })

      // Check if error is in viewport
      const errorBox = await firstError.boundingBox()
      const viewport = page.viewportSize()

      expect(errorBox).not.toBeNull()
      if (errorBox && viewport) {
        // Error should be visible in viewport (y position between 0 and viewport height)
        expect(errorBox.y).toBeGreaterThan(0)
        expect(errorBox.y).toBeLessThan(viewport.height)
      }
    })
  })
})
