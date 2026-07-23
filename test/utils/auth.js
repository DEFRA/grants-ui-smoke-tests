import { expect } from '@playwright/test'

// DEFRA_ID_USER_PASSWORD: the Defra ID OIDC stub accepts any password, so this is always 'x'.
const DEFRA_ID_USER_PASSWORD = 'x'

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
    await page.locator('input#password').fill(DEFRA_ID_USER_PASSWORD)
    await page.locator('button[type="submit"]').click()

    await expect(page).toHaveURL(/\/example-grant-with-auth/, { timeout: 30_000 })
  }
}
