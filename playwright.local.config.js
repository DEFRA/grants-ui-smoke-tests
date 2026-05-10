import { defineConfig, devices } from '@playwright/test'
import { loadEnvFile } from 'node:process'

try { loadEnvFile('.env') } catch { /* no .env file */ }

process.env.DEFRA_ID_USER_PASSWORD ??= 'x'
process.env.GRANTS_UI_BACKEND_AUTH_TOKEN ??= 'auth_token'
process.env.GRANTS_UI_BACKEND_ENCRYPTION_KEY ??= 'encryption_key'
process.env.APPLICATION_LOCK_TOKEN_SECRET ??= 'dev-lock-secret'
process.env.BASE_BACKEND_URL ??= 'http://localhost:3001'

export default defineConfig({
  testDir: './test/specs',
  testMatch: '**/*.spec.js',
  timeout: 120_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['html', { open: 'on-failure', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
