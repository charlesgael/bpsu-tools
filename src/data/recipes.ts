import rawDrops from './recipes.yaml'

interface consumable {
  itemId: string
  qty?: number
}

export interface Recipe {
  id: string
  products: consumable[]
  ingredients: consumable[]
  profession?: string
  focus?: number
}

const recipes: Recipe[] = rawDrops
  .map((it: Partial<Recipe>) => {
    const {
      id,
      products,
      ingredients,
      profession,
      focus = 0,
    } = it

    if (!id || !products?.length || !ingredients?.length) {
      console.warn('Invalid recipe', it)
      return null
    }

    return { id, products, ingredients, profession, focus }
  })
  .filter((it: Recipe | null) => it !== null)

export default recipes
