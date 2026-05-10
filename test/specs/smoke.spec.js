import { test, expect } from '@playwright/test'
import { authenticate } from '../utils/auth.js'
import { clearApplicationState } from '../utils/backend.js'
import { AutocompleteField } from '../page-objects/autocomplete-field.js'
import { DatePartsField } from '../page-objects/date-parts-field.js'
import { MonthYearField } from '../page-objects/month-year-field.js'

const CRN = '1100957269'
const SBI = '107593059'

test.describe('Smoke test', () => {
  test.beforeEach(async () => {
    await clearApplicationState(CRN, SBI)
  })

  test('completes a full example-grant-with-auth journey to submission', async ({ page }) => {
    await test.step('start', async () => {
      await page.goto('/example-grant-with-auth/start')
      await authenticate(page, CRN)
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Example Grant')
      await page.getByRole('button', { name: 'Start now' }).click()
    })

    await test.step('yes-no-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/yes-no-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('YesNoField Example')
      await page.getByRole('radio', { name: 'Yes' }).click()
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('autocomplete-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/autocomplete-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('AutocompleteField Example')
      const autocomplete = new AutocompleteField(page, 'Country')
      await autocomplete.clear()
      await autocomplete.select('England')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('radios-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/radios-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('RadiosField Example')
      await page.getByRole('radio', { name: 'Option two' }).click()
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('checkboxes-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/checkboxes-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('CheckboxesField Example')
      await page.getByRole('checkbox', { name: 'Option one' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('number-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/number-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('NumberField Example')
      await page.getByLabel('Enter amount').fill('100000')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('date-parts-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/date-parts-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('DatePartsField Example')
      const date = new Date()
      date.setDate(date.getDate() + 7)
      const dateField = new DatePartsField(page, 'datePartsField')
      await dateField.setDateUTC(date)
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('month-year-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/month-year-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('MonthYearField Example')
      const monthYearField = new MonthYearField(page, 'monthYearField')
      await monthYearField.set('08', '2025')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('select-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/select-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('SelectField Example')
      await page.getByLabel('Select option').selectOption('Option three')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('multiline-text-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/multiline-text-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('MultilineTextField Example')
      await page.getByLabel('MultilineTextField Example').fill('Lorem ipsum')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('select-land-parcel', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/select-land-parcel')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Select all the eligible land parcels for the location of your woodland')
      await page.getByRole('checkbox', { name: 'SD6351 8781' }).check()
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('multi-field-form', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/multi-field-form')
      await expect(page.getByRole('heading', { name: 'Multi Field Form Example' })).toBeVisible()
      await page.getByLabel('Name').fill('James Test-Farmer')
      await page.getByLabel('Email address').fill('cl-defra-gae-test-applicant-email@equalexperts.com')
      await page.getByLabel('Mobile number').fill('07777 123456')
      await page.getByLabel('Address line 1').fill('Test Farm')
      await page.getByLabel('Address line 2 (optional)').fill('Cogenhoe')
      await page.getByLabel('Town').fill('Northampton')
      await page.getByLabel('County (optional)').fill('Northamptonshire')
      await page.getByLabel('Postcode').fill('NN7 1NN')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('check-details', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/check-details')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Check your details')
      await page.getByRole('radio', { name: 'Yes' }).click()
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('summary', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/summary')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Check your answers')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('declaration', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/declaration')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Confirm and send')
      await page.getByRole('button', { name: 'Confirm and send' }).click()
    })

    await test.step('confirmation', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/confirmation')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Details submitted')
      await expect(page.locator('h1 ~ div strong, .govuk-panel__body strong')).toContainText('EGWA')
    })
  })
})
