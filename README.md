grants-ui-smoke-tests
=====================

Playwright smoke tests for the grants-ui service, running on the CDP platform.

- [Local](#local-development)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Running local tests](#running-local-tests)
- [CDP](#cdp)
- [Licence](#licence)

## Local Development

### Requirements

Node.js `>= v22`. Use [nvm](https://github.com/creationix/nvm) to manage versions:

```bash
nvm use
```

### Setup

Install dependencies:

```bash
npm install
```

Install Playwright browsers (first time only):

```bash
npx playwright install chromium
```

### Running local tests

Start grants-ui and grants-ui-backend locally, then:

```bash
npm run test:local
```

## CDP

Tests are run from the CDP Portal under the Test Suites section. A new image is built automatically when a pull request is merged into `main`. The results are published to S3 and made available in the portal.

The `entrypoint.sh` script runs `npm test`, publishes the Playwright HTML report to S3, and exits with code 1 if any tests failed (signalled via a `FAILED` file).

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
