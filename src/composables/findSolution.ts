import type { Drop } from '~/data/drops'
import type { Recipe } from '~/data/recipes'
import { deepUnref } from 'vue-deepunref'
import dbDrops from '~/data/drops'
import dbRecipes from '~/data/recipes'

const e = Object.entries

export interface Wish {
  material: string
  qty: number
}

interface SatisfactionRegular { regular: Drop, type: 'regular' }
interface SatisfactionFocused { focused: Drop, type: 'focused' }
interface SatisfactionRecipe { recipe: Recipe, times?: number, type: 'recipe' }
type Satisfaction = SatisfactionRegular | SatisfactionFocused | SatisfactionRecipe

interface WishProcessed extends Wish {
  satisfied?: Satisfaction
  impossible?: boolean
}

interface WishFulfilled extends Wish {
  multiple?: boolean
}

function buildDb(wishlist: Wish[]) {
  // Build recursive DB of recipes needed to gather all
  const db: Record<string, { drops: { focused: Drop[], regular: Drop[] }, recipes: Recipe[], solution?: Satisfaction, final: boolean }> = {}
  const searchItems = wishlist.map(it => it.material)
  for (let i = 0; i < searchItems.length; i++) {
    const materialId = searchItems[i]

    // Find focused drops that loots this item
    const drops = {
      focused: dbDrops.filter(it => it.focused?.includes(materialId)),
      regular: dbDrops.filter(it => it.regular?.includes(materialId)),
    }

    // Find recipes that at least produces this item
    const recipes = dbRecipes.filter(it => it.products.some(prod => prod.itemId === materialId))

    // We look if we have unique solution
    const countSolutions = drops.regular.length + drops.focused.length + recipes.length
    const final = countSolutions === 0
    let solution: Satisfaction | undefined
    if (drops.regular.length)
      solution = { regular: drops.regular[0], type: 'regular' }
    else if (recipes.length)
      solution = { recipe: recipes[0], type: 'recipe' }
    else if (drops.focused.length)
      solution = { focused: drops.focused[0], type: 'focused' }

    db[materialId] = {
      drops,
      recipes,
      final,
      solution,
    }

    // Add items we dont already know to searchItems
    Array.prototype.push.apply(searchItems, recipes
      .flatMap(it => it.ingredients)
      .map(it => it.itemId)
      .sort()
    // uniq
      .filter((it, idx, arr) => arr.indexOf(it) === idx)
      .filter(it => !db[it]))
  }

  return db
}

export function findSolution(wishlist: Wish[]) {
  const dropsRegular: Record<string, {
    material: string
    provides: WishFulfilled[]
    source?: string
  }> = {}

  const dropsFocused: Record<string, {
    material: string
    provides: WishFulfilled[]
    source?: string
  }> = {}
  const recipes: Record<string, {
    material: Recipe
    provides: WishFulfilled[]
    profession?: string
    times?: number
  }> = {}
  // cleaning Refs
  const _wishlist: WishProcessed[] = deepUnref(wishlist).filter(it => it.qty > 0)
  _wishlist.forEach((it) => {
    if (typeof it.qty === 'string')
      it.qty = Number.parseInt(it.qty)
  })
  const db = buildDb(wishlist)

  // Pass to see satisfied directly
  for (let i = 0; i < _wishlist.length; ++i) {
    const curr = _wishlist[i]
    const data = db[curr.material]

    curr.impossible = data.final
    curr.satisfied = data.solution

    // if (curr.satisfied)
    //   farmed.push(curr.satisfied)

    // If its a recipe, we need to add its ingredients to wishes(existing or not)
    if (curr.satisfied?.type === 'recipe') {
      const recipe = curr.satisfied.recipe
      const numPerRecipe = recipe.products.find(it => it.itemId === curr.material)!.qty ?? 1
      const numExec = Math.ceil(curr.qty / numPerRecipe)
      curr.satisfied.times = numExec

      Array.prototype.push.apply(_wishlist, recipe.ingredients.map(it => ({
        material: it.itemId,
        qty: (it.qty ?? 1) * numExec,
      })))
    }
  }

  const consolidated = _wishlist.reduce((acc, { material, qty, ...rest }) => {
    if (acc[material]) {
      acc[material].qty += qty
    }
    else {
      acc[material] = { material, qty, ...rest }
    }
    return acc
  }, {} as Record<string, WishProcessed>)

  Object.values(consolidated)
    .forEach((it) => {
      if (it.satisfied) {
        switch (it.satisfied.type) {
          case 'regular':
            dropsRegular[it.satisfied.regular.materialId] = {
              material: it.satisfied.regular.materialId,
              source: it.satisfied.regular.source,
              provides: it.satisfied.regular.regular!
                .map(material => ({ material, qty: consolidated[material]?.qty ?? 0 }))
                .filter(({ qty }) => qty !== 0),
            }
            break
          case 'focused':
            dropsFocused[it.satisfied.focused.materialId] = {
              material: it.satisfied.focused.materialId,
              source: it.satisfied.focused.source,
              provides: it.satisfied.focused.regular!
                .map(material => ({ material, qty: consolidated[material].qty ?? 0 }))
                .filter(({ qty }) => qty !== 0),
            }
            break
          case 'recipe':
            recipes[it.satisfied.recipe.id] = {
              material: it.satisfied.recipe,
              profession: it.satisfied.recipe.profession,
              times: it.satisfied.times,
              provides: it.satisfied.recipe.products
                .map(it => it.itemId)
                .map(material => ({ material, qty: consolidated[material].qty ?? 0 }))
                .filter(({ qty }) => qty !== 0),
            }
        }
      }
    })

  execMultiples(dropsRegular)
  execMultiples(dropsFocused)

  const farmed = [
    ...Object.values(dropsRegular).flatMap(it => it.provides.map(p => p.material)),
    ...Object.values(dropsFocused).flatMap(it => it.provides.map(p => p.material)),
    ...Object.values(recipes).flatMap(it => it.provides.map(p => p.material)),
  ]

  // not farmed
  const notEasy = Object.values(consolidated)
    .filter(it => !farmed.includes(it.material))
    .filter(it => !it.impossible)
  if (notEasy.length) {
    console.error('No easy solution', notEasy)
  }

  return {
    unknown: _wishlist.filter(it => it.impossible) as Wish[],
    dropsRegular: Object.values(dropsRegular),
    dropsFocused: Object.values(dropsFocused),
    recipes: Object.values(recipes),
  }
}

function execMultiples(drops: Record<string, { material: string, provides: WishFulfilled[], source?: string }>) {
  computeMultiples(drops)
  removeOnlyMultiples(drops)
  resetMultiples(drops)
  computeMultiples(drops)
}

function computeMultiples(drops: Record<string, { material: string, provides: WishFulfilled[], source?: string }>) {
  const provides = Object.values(drops)
    .flatMap(it => it.provides)

  const dups = e(provides
    .map(it => it.material)
    .countBy(it => it))
    .filter(([,nb]) => nb > 1)
    .map(([key]) => key)

  provides
    .filter(it => dups.includes(it.material))
    .forEach(it => it.multiple = true)
}

function removeOnlyMultiples(drops: Record<string, { material: string, provides: WishFulfilled[], source?: string }>) {
  Object.entries(drops)
    .filter(([, value]) => value.provides.every(it => it.multiple))
    .map(([key]) => key)
    .forEach(it => delete drops[it])
}

function resetMultiples(drops: Record<string, { material: string, provides: WishFulfilled[], source?: string }>) {
  Object.values(drops)
    .flatMap(it => it.provides)
    .forEach(it => it.multiple = false)
}
