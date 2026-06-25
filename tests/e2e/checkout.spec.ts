import { test, expect } from '@playwright/test'

test.describe('Checkout flow', () => {
  test('should show empty cart state', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.getByText(/vacío/i).or(page.getByText(/empty/i))).toBeVisible()
  })

  test('should show checkout page with shipping form', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: /envío/i }).or(page.getByRole('heading', { name: /checkout/i }))).toBeVisible()
  })
})
