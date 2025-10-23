interface consumable {
  itemId: string
  qty?: number
}

export interface Recipe {
  id: string
  products: consumable[]
  ingredients: consumable[]
  profession?: string
  actionType?: string
  focus?: number
}

const recipes: Recipe[]
export default recipes
