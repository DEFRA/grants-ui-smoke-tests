import { expect } from '@playwright/test'

/**
 * Log in via the Defra ID OIDC provider.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} crn
 */
export async function authenticate(page, crn) {
  const crnInput = page.locator('input#crn')
  if (await crnInput.isVisible({ timeout: 30_000 }).catch(() => false)) {
    await crnInput.fill(crn)
    await page.locator('input#password').fill(process.env.DEFRA_ID_USER_PASSWORD ?? 'x')
    await page.locator('button[type="submit"]').click()

    await expect(page).toHaveURL(/\/example-grant-with-auth/, { timeout: 30_000 })
  }
}
