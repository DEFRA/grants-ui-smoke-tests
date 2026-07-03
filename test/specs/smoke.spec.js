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

    await test.step('check-details', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/check-details')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Check your details')
      await page.getByRole('radio', { name: 'Yes' }).click()
      await page.getByRole('button', { name: 'Continue' }).click()
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

    await test.step('number-field-validation', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/number-field-validation')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('NumberField with validation')
      await page.getByLabel('Enter amount').fill('100000')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('number-field-routing', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/number-field-routing')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('NumberField with conditional routing')
      await page.getByLabel('Enter amount that may divert the journey').fill('50000')
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
      await page.locator('textarea').fill('Lorem ipsum')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('email-address-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/email-address-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('EmailAddressField Example')
      await page.locator('input[type="email"]').fill('test@example.com')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('telephone-number-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/telephone-number-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('TelephoneNumberField Example')
      await page.locator('input[type="tel"]').fill('01234 567890')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('uk-address-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/uk-address-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('UkAddressField Example')
      await page.getByLabel('Address line 1').fill('1 Example Street')
      await page.getByLabel('Town or city').fill('Exampleton')
      await page.getByLabel('Postcode').fill('EX1 1EX')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('location-components', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/location-components')
      await page.getByLabel('Easting').fill('530000')
      await page.getByLabel('Northing').fill('180000')
      await page.getByLabel('OS national grid reference').fill('ST 678 678')
      await page.getByLabel('National Grid field number').fill('NG 1234 5678')
      await page.getByLabel('Latitude').fill('51.519450')
      await page.getByLabel('Longitude').fill('-0.127758')
      await page.getByLabel('GeospatialField').fill('[{"type":"Feature","properties":{"description":"Example location","coordinateGridReference":"ST 00001","centroidGridReference":"ST 00001"},"geometry":{"coordinates":[-2.5723699109417737,53.2380485215034],"type":"Point"},"id":"a"}]')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('hidden-field', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/hidden-field')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('HiddenField Example')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('multi-field-form', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/multi-field-form')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Multi Field Form Example')
      await page.getByLabel('Project name').fill('Test project')
      await page.getByLabel('Project description').fill('Project description')
      await page.getByLabel('Project budget').fill('50000')
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('repeat-page', async () => {
      await expect(page).toHaveURL(/\/example-grant-with-auth\/repeat-page/)
      await expect(page.getByRole('heading', { level: 1 })).toContainText('RepeatPage Example')
      await page.getByLabel('Item name').fill('Repeat item example')
      await page.getByLabel('Amount').fill('12000')
      await page.getByRole('button', { name: 'Continue' }).click()
      await page.getByRole('button', { name: 'Continue' }).click()
    })

    await test.step('select-land-parcel', async () => {
      await expect(page).toHaveURL('/example-grant-with-auth/select-land-parcel')
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Select all the eligible land parcels for the location of your woodland')
      await page.getByRole('checkbox', { name: 'SD6351 8781' }).check()
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
