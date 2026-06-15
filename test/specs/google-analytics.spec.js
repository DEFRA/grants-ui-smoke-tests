import { test, expect } from '@playwright/test'
import { authenticate } from '../utils/auth.js'
import { clearApplicationState } from '../utils/backend.js'

const CRN = '1300000002'
const SBI = '300000002'

const browserProxyOptions = {
  ...(process.env.CDP_HTTPS_PROXY && { proxy: { server: process.env.CDP_HTTPS_PROXY } })
}

test.describe.configure({ mode: 'serial' })

test.describe('Google Analytics', () => {
  test.beforeEach(async () => {
    await clearApplicationState(CRN, SBI)
  })

  test('does not fire GA collect before consent, fires after accepting analytics cookies', async ({ browser, baseURL }) => {
    const collectRequests = []

    const context = await browser.newContext({
      javaScriptEnabled: true,
      baseURL,
      storageState: { cookies: [], origins: [] },
      ...browserProxyOptions
    })

    const allRequests = []

    await context.route(/google-analytics\.com\/g\/collect/, (route) => {
      collectRequests.push(route.request().url())
      route.fulfill({ status: 204, body: '' })
    })

    context.on('request', (req) => {
      if (req.url().includes('googletagmanager.com') || req.url().includes('google-analytics.com')) {
        allRequests.push(`REQ: ${req.url()}`)
      }
    })

    context.on('requestfailed', (req) => {
      allRequests.push(`FAIL: ${req.url()} — ${req.failure()?.errorText}`)
    })

    const page = await context.newPage()

    page.on('console', (msg) => console.log('BROWSER:', msg.type(), msg.text()))
    page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message))

    try {
      await test.step('start journey — no collect calls before consent', async () => {
        await page.goto('/example-grant-with-auth/start')
        await authenticate(page, CRN)
        await expect(page.getByRole('heading', { level: 1 })).toContainText('Example Grant')
        // Asserting absence — give GA time to fire before concluding it didn't
        await page.waitForTimeout(5_000)
        console.log('GA/GTM requests before consent:', allRequests)
        expect(collectRequests).toHaveLength(0)
      })

      await test.step('accept analytics cookies', async () => {
        await page.getByRole('button', { name: 'Accept analytics cookies' }).click()
        await expect(page.getByText("You've accepted analytics cookies")).toBeVisible()
      })

      await test.step('collect call fires on current page', async () => {
        await expect.poll(() => {
          console.log('GA/GTM requests so far:', allRequests)
          console.log('collect requests so far:', collectRequests)
          return collectRequests.length
        }, { timeout: 5_000 }).toBeGreaterThan(0)
      })
    } finally {
      await context.close()
    }
  })

  test('fires GA ns.html request when JavaScript is disabled and analytics cookies are accepted', async ({ browser, baseURL }) => {
    const nsHtmlRequests = []

    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
      storageState: { cookies: [], origins: [] },
      ...browserProxyOptions
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
