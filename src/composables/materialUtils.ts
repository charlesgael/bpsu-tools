import type { Material } from '~/data/materials'
import { index as materialsIndexed } from '~/data/materials'

const unknownMat = (id?: string): Material => ({ id: `unknown[${id}]`, rarity: 'error' })
export const findMat = (id: string): Material => materialsIndexed.id[id] ?? unknownMat(id)
