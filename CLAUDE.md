# grants-ui-smoke-tests

Playwright smoke test suite for `grants-ui`, designed to run on the Defra CDP platform.

## Tech stack

- **Test framework**: Playwright (`@playwright/test`) — JavaScript only, no TypeScript
- **Node version**: 22.13.1 (see `.nvmrc`)

## Project policies

- **Smoke tests only** — this suite is a deployment gate, not a regression suite. It runs on CDP Dev on each deploy of `grants-ui` or `grants-ui-backend`. Keep tests focused on the happy path and features that can only be tested in CDP Dev. Conditional journey branches belong in the `grants-ui` acceptance suite.
- **JavaScript only** — no TypeScript. Defra policy.
- **No assertions in page objects** — page objects encapsulate navigation and interaction only. Assertions belong in the spec.

## Source material

This repo contains a single smoke test that is a cut-down version of the full acceptance journey in `grants-ui`. When updating the smoke test, refer to these sources:

| Source | Purpose |
|---|---|
| `c:\Defra\src\grants-ui\acceptance\test\features\reusable-components.feature` | The full acceptance scenario this smoke test tracks — the canonical reference for page order, field values, and URL slugs |
| `c:\Defra\src\grants-ui\acceptance\` | The full WebdriverIO/Cucumber acceptance test suite (Cucumber feature files, step definitions, page objects) |
| `c:\Defra\src\woodland-grant-journey-tests\` | Structural reference for Playwright conventions used in this repo (config patterns, auth helper, test organisation) |

### What the smoke test covers vs the full acceptance journey

The smoke test (`test/specs/smoke.spec.js`) follows the `example-grant-with-auth` grant and exercises the happy path through all pages to submission. Compared to `reusable-components.feature` it deliberately omits:

- Accessibility (`axe`) analysis on every page
- The `check-details → update-details` back-navigation detour
- `conditional-page` (only reached when RadiosField selects "Option one"; smoke picks "Option two")
- `checkboxes-follow-up` (conditional on "Option three"; smoke uses "Option one")
- Summary change-answer flow and print submitted application page
- The `@ci`-only tag (this suite runs on CDP, not in grants-ui CI)

### Non-obvious locators

Some pages render the field title only as a page heading, with no `<label>` element associated to the input. Use element-type selectors for these:

- `multiline-text-field` — `page.locator('textarea')`
- `email-address-field` — `page.locator('input[type="email"]')`
- `telephone-number-field` — `page.locator('input[type="tel"]')`

The `repeat-page` URL includes a UUID suffix — use a regex matcher: `expect(page).toHaveURL(/\/repeat-page/)`. The page requires two Continue clicks: one to submit the item, one to confirm the list summary.

When `reusable-components.feature` gains new pages or changes field values, review `smoke.spec.js` and update it to stay in sync with the happy-path route.

## Modes of running

### Local — `npm run test:local`

Runs against a local instance of `grants-ui` at `http://localhost:3000` and `grants-ui-backend` at `http://localhost:3001`. Uses a headed browser. Config: `playwright.local.config.js`.

Default values for all required env vars are set directly in `playwright.local.config.js` — no `.env` file needed.

### CDP — `npm test`

Runs against a CDP-deployed instance of `grants-ui`. The base URL is built from the `ENVIRONMENT` env var:

```
https://grants-ui.${ENVIRONMENT}.cdp-int.defra.cloud
```

The backend URL is similarly derived:

```
https://grants-ui-backend.${ENVIRONMENT}.cdp-int.defra.cloud
```

Triggered via the CDP Portal. The HTML report is published to S3 after the run. Config: `playwright.config.js`.

## npm scripts

| Script | What it does |
|---|---|
| `npm test` | CDP mode (requires `ENVIRONMENT` env var) |
| `npm run test:local` | Local mode against localhost:3000 |
| `npm run report:publish` | Push `playwright-report/` to S3 via `RESULTS_OUTPUT_S3_PATH` |

## Test structure

```
test/
  utils/
    auth.js                    # authenticate() helper — handles Defra ID OIDC stub flow
    backend.js                 # clearApplicationState() — DELETE /state before each test
    backend-auth-helper.js     # Authorization header generation for backend calls
    lock-token.js              # mintLockToken() — JWT for x-application-lock-owner header
  page-objects/
    autocomplete-field.js      # AutocompleteField — wraps the accessible-autocomplete widget
    date-parts-field.js        # DatePartsField — day/month/year input group
    month-year-field.js        # MonthYearField — month/year input group
  specs/
    smoke.spec.js              # Single smoke test — full example-grant-with-auth happy path
```

## Authentication

The smoke test authenticates via the Defra ID OIDC stub (`fct-defra-id-stub`). The `authenticate()` helper in `test/utils/auth.js` handles the full flow:

1. Navigate to a protected URL → app redirects to stub login page
2. Fill in CRN + password and submit
3. Stub redirects back via OIDC to `/auth/sign-in-oidc`

**Password:** controlled by `DEFRA_ID_USER_PASSWORD` env var (default: `x`)

### Test users

Each spec uses a dedicated user to avoid state collisions between tests running concurrently or in sequence. When adding a new spec, pick a user that is present in `grants-ui/fcp-defra-id-stub/users.json` and not already used in any of the journey test repos (`grants-ui` acceptance, `woodland-grant-journey-tests`, `land-grants-journey-tests`).

| Spec | CRN | SBI | Name |
|---|---|---|---|
| `smoke.spec.js` | `1100957269` | `107593059` | Grace Davies / Davies Livestock |
| `google-analytics.spec.js` | `1300000002` | `300000002` | Benjamin Carter / Oak Farm |

## Backend state management

Before each test, `clearApplicationState()` calls `DELETE /state` on `grants-ui-backend` to wipe any prior session for the test CRN/SBI. This ensures a clean journey start regardless of previous runs.

## Docker

The `Dockerfile` installs Playwright's Chromium with system dependencies. The `entrypoint.sh` runs `npm test` by default.

## GitHub Actions

- `.github/workflows/check-pull-request.yml` — installs dependencies on PRs
- `.github/workflows/journey-tests.yml` — runs the test suite (workflow call / dispatch)
- `.github/workflows/publish.yml` — builds and publishes the Docker image on merge to main
