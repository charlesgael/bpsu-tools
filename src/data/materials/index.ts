import rawMaterials from './materials.yaml'

export interface Material {
  id: string
  icon?: string
  rarity: string
  profession?: string
}

const materials: (Material & { ignored: boolean })[] = rawMaterials
  .map((it: any) => {
    const {
      id,
      icon,
      rarity = 'common',
      profession,
      ignored = false,
    } = it ?? {}

    if (!id) {
      console.warn('Invalid material', it)
      return null
    }

    return { id, icon, rarity, profession, ignored }
  })
  .filter((it: Material | null) => it !== null)
  .toSorted((a: Material, b: Material) => a.id.localeCompare(b.id))

export const index = {
  id: materials
    .reduce((acc, it) => ({ [it.id]: it, ...acc }), {}) as Record<string, Material>,
}

export default materials
  .filter(it => !it.ignored) as Material[]
