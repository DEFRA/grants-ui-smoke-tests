import { getAuthorizationHeader } from './backend-auth-helper.js'

const BASE_URL = process.env.BASE_BACKEND_URL

/**
 * Wipes all state, submissions, and locks for a given SBI/grant before a test
 * run, via the backend's test-only bulk cleardown endpoint.
 *
 * @param {string} sbi
 * @param {string} grantCode
 */
export async function clearApplicationData(sbi, grantCode) {
  const response = await fetch(`${BASE_URL}/admin/test-data?sbi=${sbi}&grantCode=${grantCode}`, {
    method: 'DELETE',
    headers: { Authorization: getAuthorizationHeader() }
  })
  if (response.status !== 200) {
    throw new Error(`Failed to clear test data: ${response.status}`)
  }
}
