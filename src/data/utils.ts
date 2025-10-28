export function asCollection(unk: unknown): unknown[] {
  if (Array.isArray(unk)) {
    return unk
  }
  console.warn('Invalid collection', unk)
  return []
}

export function warnExceptions<A extends any[], T>(fn: (...args: A) => T, info = ''): ((...args: A) => T) {
  return function (...args): T {
    try {
      return fn(...args)
    }
    catch (e: any) {
      console.warn(`Invalid ${info}`, args, e)
    }
    return null as any
  }
}
