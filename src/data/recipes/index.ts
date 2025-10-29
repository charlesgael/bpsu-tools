import rawDrops from './recipes.yaml'

interface consumable {
  id: string
  qty?: number
}

export interface Recipe {
  id: string
  products: consumable[]
  ingredients: consumable[]
  profession?: string
  focus: number
}

function parseConsumable(rawIngredient: Partial<consumable> | string) {
  if (typeof rawIngredient === 'string') {
    if (!rawIngredient.length)
      throw new Error('itemId must not be empty')

    return { id: rawIngredient, qty: 1 }
  }
  else {
    const {
      id,
      qty = 1,
    } = rawIngredient

    if (!id)
      throw new Error('no itemId in ingredient')

    return { id, qty }
  }
}

const recipes: Recipe[] = rawDrops
  .map((it: Partial<Recipe>) => {
    const {
      id,
      products: rawProducts,
      ingredients: rawIngredients,
      profession,
      focus = 0,
    } = it

    try {
      if (!id)
        throw new Error('no id')
      if (!rawProducts?.length)
        throw new Error('no products')
      if (!rawIngredients?.length)
        throw new Error('no ingredients')

      const ingredients = rawIngredients!.map(parseConsumable)
      const products = rawProducts!.map(parseConsumable)

      return { id, products, ingredients, profession, focus }
    }
    catch (e: any) {
      console.warn('Invalid recipe', it, e)
      return null
    }
  })
  .filter((it: Recipe | null) => it !== null)

export default recipes
