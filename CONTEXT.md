# grants-ui-smoke-tests

Fast Playwright deployment smoke tests for Grants UI and Grants UI Backend on CDP.

## Language

**Smoke test**
A fast go/no-go deployment check for the main happy path and CDP-only behaviour.
_Avoid_: Regression test, Acceptance test, Full journey suite

**Happy path**
The expected successful end-to-end route through a grant application.
_Avoid_: Edge case, Exhaustive coverage, Negative path

**CDP Dev**
The CDP development environment where deployment smoke tests run automatically.
_Avoid_: Local stack, Perf-Test, Production

**Grants UI**
The service under test that renders grant journeys.
_Avoid_: Grants UI Backend, Config broker, Smoke test repo

**Grants UI Backend**
The persistence API used during the smoke-tested journey.
_Avoid_: GAS, Config API, Playwright backend helper

**Playwright report**
The HTML test report published to S3 after CDP runs.
_Avoid_: Allure report, k6 report, Test log

**FAILED file**
The marker file used by the entrypoint to signal failed tests.
_Avoid_: Test result, Report, Exit code when the marker file is meant
