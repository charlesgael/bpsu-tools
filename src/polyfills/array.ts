/* eslint-disable no-extend-native */

type InferObject<T> = T extends Iterable<readonly [PropertyKey, infer V]> ? V : any

// eslint-disable-next-line unused-imports/no-unused-vars
interface Array<T> {
  groupBy: (fn: (element: T) => any) => { [s: string]: Array<T> }
  countBy: (fn: (element: T) => any) => { [s: string]: number }
  toObj: () => InferObject<T>
}

Array.prototype.groupBy = function groupBy(fn) {
  return this.reduce((acc, el) => {
    const key = String(fn(el))
    return {
      ...acc,
      [key]: [...(acc[key] ?? []), el],
    }
  }, {})
}

Array.prototype.countBy = function countBy(fn) {
  return this.reduce((acc, el) => {
    const key = String(fn(el))
    return {
      ...acc,
      [key]: (acc[key] ?? 0) + 1,
    }
  }, {})
}

Array.prototype.toObj = function toObj() {
  return Object.fromEntries(this)
}
