import { test, expect } from '@playwright/test'
import { authenticate } from '../utils/auth.js'
import { clearApplicationState } from '../utils/backend.js'

const CRN = '1300000002'
const SBI = '300000002'

test.describe.configure({ mode: 'serial' })

test.describe('Google Analytics', () => {
  test.beforeEach(async () => {
    await clearApplicationState(CRN, SBI)
  })

  test('does not fire GA collect before consent, fires after accepting analytics cookies', async ({ page }) => {
    const collectRequests = []

    page.on('request', (req) => {
      if (/google-analytics\.com\/g\/collect/.test(req.url())) {
        collectRequests.push(req.url())
      }
    })

    await test.step('start journey — no collect calls before consent', async () => {
      await page.goto('/example-grant-with-auth/start')
      await authenticate(page, CRN)
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Example Grant')
      // Asserting absence — give GA time to fire before concluding it didn't
      await page.waitForTimeout(5_000)
      expect(collectRequests).toHaveLength(0)
    })

    await test.step('accept analytics cookies', async () => {
      await page.getByRole('button', { name: 'Accept analytics cookies' }).click()
      await expect(page.getByText("You've accepted analytics cookies")).toBeVisible()
    })

    await test.step('collect call fires on current page', async () => {
      await expect.poll(() => collectRequests.length, { timeout: 5_000 }).toBeGreaterThan(0)
    })
  })

  test('fires GA ns.html request when JavaScript is disabled and analytics cookies are accepted', async ({ browser, baseURL }) => {
    const nsHtmlRequests = []

    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL
    })

    context.on('request', (req) => {
      if (req.url().includes('googletagmanager.com/ns.html')) {
        nsHtmlRequests.push(req.url())
      }
    })

    const page = await context.newPage()

    try {
      await test.step('log in', async () => {
        await page.goto('/example-grant-with-auth/start')
        await authenticate(page, CRN)
      })

      await test.step('accept analytics cookies via form POST', async () => {
        await page.getByRole('button', { name: 'Accept analytics cookies' }).click()
        await page.waitForLoadState('load')
      })

      await test.step('ns.html fires on next page load', async () => {
        await page.goto('/example-grant-with-auth/start')
        await page.waitForLoadState('load')
        expect(nsHtmlRequests.length).toBeGreaterThan(0)
      })
    } finally {
      await context.close()
    }
  })
})
