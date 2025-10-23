import type { Material } from '~/data/materials'
import materials from '~/data/materials'

const unknownMat = (id?: string): Material => ({ id: `unknown[${id}]`, rarity: 'error' })
export const findMat = (id: string): Material => materials.find(it => it.id === id) ?? unknownMat(id)
