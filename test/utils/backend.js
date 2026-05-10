import { getAuthorizationHeader } from './backend-auth-helper.js'
import { mintLockToken } from './lock-token.js'

const GRANT_CODE = 'example-grant-with-auth'
const BASE_URL = process.env.BASE_BACKEND_URL

/**
 * Clears application state for a given user before a test run.
 * Both 200 (deleted) and 404 (not found) are acceptable responses.
 *
 * @param {string} crn
 * @param {string} sbi
 */
export async function clearApplicationState(crn, sbi) {
  const response = await fetch(`${BASE_URL}/state?sbi=${sbi}&grantCode=${GRANT_CODE}`, {
    method: 'DELETE',
    headers: {
      Authorization: getAuthorizationHeader(),
      'x-application-lock-owner': mintLockToken(crn, sbi, GRANT_CODE)
    }
  })
  if (![200, 404].includes(response.status)) {
    throw new Error(`Failed to delete application state: ${response.status}`)
  }
}
