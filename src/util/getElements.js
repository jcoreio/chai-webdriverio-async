export default async function getElements(obj, client) {
  if (obj instanceof Promise) {
    const resolved = await obj
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
