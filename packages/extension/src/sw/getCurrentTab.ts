/**
 * Returns current Chrome tab
 *
 * https://developer.chrome.com/docs/extensions/reference/tabs/#get-the-current-tab
 * @returns
 */
export async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
  return tab as chrome.tabs.Tab | undefined
}
