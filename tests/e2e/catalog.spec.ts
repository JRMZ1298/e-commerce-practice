import { test, expect } from '@playwright/test'

test.describe('Catalog browsing', () => {
  test('should load products page and display products', async ({ page }) => {
    await page.goto('/products')
    await expect(page.getByRole('heading', { name: /colección/i })).toBeVisible()
    await page.waitForSelector('[class*="grid"]', { timeout: 10000 })
  })

  test('should navigate to product detail', async ({ page }) => {
    await page.goto('/products')
    const productLink = page.locator('a[href^="/products/"]').first()
    await productLink.waitFor({ timeout: 10000 })
    await productLink.click()
    await expect(page).toHaveURL(/\/products\//)
  })

  test('should filter by search query', async ({ page }) => {
    await page.goto('/products')
    const searchInput = page.getByPlaceholder(/buscar/i)
    await searchInput.fill('ropa')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(/q=ropa/)
  })
})
