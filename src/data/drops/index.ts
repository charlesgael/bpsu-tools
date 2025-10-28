import rawDrops from './drops.yaml'

export interface Drop {
  materialId: string
  source?: string
  regular?: string[]
  focused?: string[]
}

const drops: Drop[] = rawDrops
  .map((it: Partial<Drop>) => {
    const {
      materialId,
      source,
      regular = [],
      focused = [],
    } = it

    if (!materialId) {
      console.warn('Invalid drop', it)
      return null
    }

    return { materialId, source, regular, focused }
  })
  .filter((it: Drop | null) => it !== null)

export default drops
