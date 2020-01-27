/**
 * NOTICE
 * This file has been modified from the source in
 * https://github.com/marcodejongh/chai-webdriverio
 */

export default async function assertElementExists(
  client,
  selector,
  defaultWait = 0,
  reverse
) {
  try {
    const el = await client.$(selector)
    await el.waitForExist(defaultWait, reverse)
  } catch (error) {
    if (reverse) {
      throw new Error(
        `Element with selector <${selector}> still exists after ${defaultWait}ms (while waiting for it not to).`
      )
    } else {
      throw new Error(
        `Could not find element with selector <${selector}> within ${defaultWait}ms`
      )
    }
  }
}
