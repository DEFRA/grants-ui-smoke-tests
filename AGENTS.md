# Repository Guidelines

## Project Structure & Module Organization

Playwright specs live in `test/specs/`, page objects in `test/page-objects/`, and shared helpers in `test/utils/`. CDP and local execution are selected through `playwright.cdp.config.js` and `playwright.local.config.js`. Report publishing is handled by `bin/publish-tests.sh`.

## Build, Test, and Development Commands

- `npm install`: install dependencies.
- `npx playwright install chromium`: install the browser for local runs.
- `npm test`: run CDP-oriented smoke tests.
- `npm run test:local`: run smoke tests against local services.
- `npm run report:publish`: publish the Playwright HTML report.

## Coding Style & Naming Conventions

Use ES modules and the local Playwright style. Keep page objects named after the page or component they model and specs focused on fast deployment gates.

## Domain Language

Use `CONTEXT.md` as the source of truth for Grants UI smoke-test language. Prefer those terms in specs, helpers, docs, and generated changes.

## Developer Addenda

Developers can add their own `AGENTS.local.md` and should be read as an addendum to this file. Keep that file local to your machine and do not commit it.

## Testing Guidelines

These are smoke tests, not a regression suite. Preserve fast happy-path coverage and avoid adding broad edge-case scenarios that belong in Grants UI acceptance tests.
