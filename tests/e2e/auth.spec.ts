import { test, expect } from '@playwright/test'

test.describe('Authentication flows', () => {
  test('should show login page and navigate to register', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /ingresa/i })).toBeVisible()
    await page.getByText(/crear cuenta/i).click()
    await expect(page).toHaveURL(/\/register/)
    await expect(page.getByRole('heading', { name: /registro/i })).toBeVisible()
  })

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /ingresar/i }).click()
    await expect(page.getByText(/obligatorio/i).or(page.getByText(/requerido/i))).toBeVisible()
  })
})
