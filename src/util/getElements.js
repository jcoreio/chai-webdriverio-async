export default async function getElements(obj, client) {
  if (
    obj &&
    (typeof obj.isClickable === 'function' || typeof obj.then === 'function')
  ) {
    const resolved = typeof obj.isClickable === 'function' ? obj : await obj
    const selector = obj.selector || String(resolved)
    if (typeof resolved === 'string') obj = resolved
    else if (Array.isArray(resolved)) return [resolved, selector]
    else if (resolved) return [[resolved], selector]
  }
  if (Array.isArray(obj)) return [obj, obj.join(', ')]
  if (typeof obj === 'string') return [await client.$$(obj), obj]
  if (obj) return [[obj], String(obj)]
  return [[], String(obj)]
}
