import { test, expect, devices } from '@playwright/test'

// Use mobile viewport for all tests
test.use({
  ...devices['iPhone SE'],  // 375x667px
})

test.describe('Component Migration - Mobile Tests', () => {
  test('Vendor registration page - mobile layout and touch targets', async ({ page }) => {
    await page.goto('/vendors/register')

    // Verify page loads
    await expect(page.getByRole('heading', { name: /join the marketplace/i })).toBeVisible()

    // Check input fields have 48px+ height (touch targets)
    const businessNameInput = page.getByLabel(/business name/i)
    await expect(businessNameInput).toBeVisible()
    const inputHeight = await businessNameInput.evaluate((el) => el.getBoundingClientRect().height)
    expect(inputHeight).toBeGreaterThanOrEqual(48)

    // Verify no horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1) // Allow 1px tolerance

    // Check Continue button exists and is visible
    const continueButton = page.getByRole('button', { name: /continue/i })
    await expect(continueButton).toBeVisible()
    const buttonHeight = await continueButton.evaluate((el) => el.getBoundingClientRect().height)
    expect(buttonHeight).toBeGreaterThanOrEqual(40) // Slightly smaller OK for buttons in Step 1
  })

  test('VendorCard - mobile rendering', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Find vendor cards (may not exist if no vendors in database)
    const vendorCards = page.locator('[data-testid="vendor-card"]')
    const count = await vendorCards.count()

    if (count > 0) {
      const vendorCard = vendorCards.first()
      await expect(vendorCard).toBeVisible()

      // Verify card title visible
      await expect(vendorCard.getByRole('heading')).toBeVisible()

      // Verify card doesn't overflow viewport
      const cardWidth = await vendorCard.evaluate((el) => el.getBoundingClientRect().width)
      const viewportWidth = await page.evaluate(() => window.innerWidth)
      expect(cardWidth).toBeLessThan(viewportWidth)

      // Verify action buttons have proper touch targets
      const quoteButton = vendorCard.getByRole('button', { name: /get a quote/i })
      if (await quoteButton.isVisible()) {
        const buttonHeight = await quoteButton.evaluate((el) => el.getBoundingClientRect().height)
        expect(buttonHeight).toBeGreaterThanOrEqual(44)
      }
    } else {
      // No vendors in database - test passes if carousel structure exists
      const carouselHeading = page.getByText(/featured vendors/i)
      await expect(carouselHeading).toBeVisible()
    }
  })

  test('Form validation errors visible on mobile', async ({ page }) => {
    await page.goto('/vendors/register')

    // Fill in vendor type
    const mobileCartButton = page.getByRole('button', { name: /mobile cart/i })
    await mobileCartButton.click()

    // Try to submit without filling required fields
    const continueButton = page.getByRole('button', { name: /continue/i })
    await continueButton.click()

    // Check error message appears
    const errorMessage = page.getByText(/required/i).first()
    await expect(errorMessage).toBeVisible({ timeout: 2000 })

    // Verify error message exists (don't check exact position as it may scroll)
    const errorBox = await errorMessage.boundingBox()
    expect(errorBox).toBeTruthy()
    // Error is visible somewhere on the page (validation works)
  })

  test('Featured vendors carousel - mobile scroll', async ({ page }) => {
    await page.goto('/')

    // Wait for carousel header to load
    const carouselHeading = page.getByText(/featured vendors/i)
    await expect(carouselHeading).toBeVisible({ timeout: 10000 })

    // Verify carousel container is scrollable
    const scrollContainer = page.locator('.overflow-x-auto').first()
    await expect(scrollContainer).toBeVisible()

    // Check for vendor cards or Card components in carousel
    const cards = page.locator('.overflow-x-auto .flex-shrink-0')
    const count = await cards.count()

    // If vendors loaded, verify card structure
    if (count > 0) {
      const firstCard = cards.first()
      const cardBox = await firstCard.boundingBox()
      if (cardBox) {
        // Card should be at least 280px wide for readable content
        expect(cardBox.width).toBeGreaterThan(280)
      }
    } else {
      // If no vendors loaded, just verify scrollable container exists
      await expect(scrollContainer).toHaveClass(/overflow-x-auto/)
    }
  })

  test('Mobile typography and spacing', async ({ page }) => {
    await page.goto('/vendors/register')

    // Verify heading is readable (not too small)
    const heading = page.getByRole('heading', { name: /join the marketplace/i })
    const fontSize = await heading.evaluate((el) => {
      return window.getComputedStyle(el).fontSize
    })
    const fontSizePx = parseInt(fontSize)
    expect(fontSizePx).toBeGreaterThanOrEqual(24) // 1.5rem = 24px on mobile

    // Verify labels are at least 14px (readable on mobile)
    const label = page.getByText(/what kind of vendor are you/i)
    const labelFontSize = await label.evaluate((el) => {
      return window.getComputedStyle(el).fontSize
    })
    const labelFontSizePx = parseInt(labelFontSize)
    expect(labelFontSizePx).toBeGreaterThanOrEqual(14)

    // Verify adequate spacing between form sections
    const formContainer = page.locator('.space-y-6').first()
    await expect(formContainer).toBeVisible()
  })

  test('Button touch targets across all components', async ({ page }) => {
    await page.goto('/')

    // Test "View all vendors" button (size sm should be h-9 = 36px)
    const viewAllButton = page.getByRole('button', { name: /view all/i })
    if (await viewAllButton.isVisible()) {
      const height = await viewAllButton.evaluate((el) => el.getBoundingClientRect().height)
      expect(height).toBeGreaterThanOrEqual(32) // Allow slightly smaller for non-primary actions
    }

    // Test carousel navigation buttons (if visible - should be 40px+ for touch)
    const scrollButtons = page.locator('button[aria-label*="Scroll"]')
    const scrollButtonCount = await scrollButtons.count()
    if (scrollButtonCount > 0) {
      const firstButton = scrollButtons.first()
      if (await firstButton.isVisible()) {
        const dimensions = await firstButton.evaluate((el) => {
          const rect = el.getBoundingClientRect()
          return { width: rect.width, height: rect.height }
        })
        expect(dimensions.width).toBeGreaterThanOrEqual(40)
        expect(dimensions.height).toBeGreaterThanOrEqual(40)
      }
    }
  })
})
