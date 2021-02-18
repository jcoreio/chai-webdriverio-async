export default async function getElements(selectorOrPromise, client) {
  if (selectorOrPromise instanceof Promise) {
    const resolved = await selectorOrPromise
    const selector = selectorOrPromise.selector || String(resolved)
    if (typeof resolved === 'string') selectorOrPromise = resolved
    else if (Array.isArray(resolved)) return [resolved, selector]
    else if (resolved) return [[resolved], selector]
  }

  return typeof selectorOrPromise === 'string'
    ? [await client.$$(selectorOrPromise), selectorOrPromise]
    : [[], selectorOrPromise]
}
