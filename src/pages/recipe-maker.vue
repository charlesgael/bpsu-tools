<script setup lang="ts">
import type { Recipe } from '~/data/recipes'

const { t } = useI18n()

const ingredients = ref<Wish[]>([])
const products = ref<Wish[]>([])
const profession = ref('')
const recipes = ref<Recipe[]>([])

function addIngredient(material: string) {
  if (ingredients.value.every(it => it.material !== material)) {
    ingredients.value.push({
      material,
      qty: 1,
    })
  }
}
function removeIngredient(id: string) {
  const idx = ingredients.value.findIndex(it => it.material === id)
  if (idx >= 0)
    ingredients.value.splice(idx, 1)
}
function addProduct(material: string) {
  if (products.value.every(it => it.material !== material)) {
    products.value.push({
      material,
      qty: 1,
    })
  }
}
function removeProduct(id: string) {
  const idx = products.value.findIndex(it => it.material === id)
  if (idx >= 0)
    products.value.splice(idx, 1)
}

function clearRecipe() {
  ingredients.value.length = 0
  products.value.length = 0
}
function clearRecipes() {
  recipes.value.length = 0
}

function addRecipe() {
  const id = products.value
    .map(({ material, qty }) => `${material}_${qty}`)
    .join('_')

  recipes.value
    .push({
      id,
      products: products.value.map(({ material, qty }) => ({ id: material, qty })),
      ingredients: ingredients.value.map(({ material, qty }) => ({ id: material, qty })),
      profession: profession.value,
      focus: 0,
    })
  clearRecipe()
}
</script>

<template>
  <div class="relative h-full">
    <div class="flex-min absolute bottom-0 left-0 right-0 top-0 m-2 gap-2">
      <div class="flex-min flex-1 flex-col select-none gap-2">
        <div class="relative grid grid-cols-2 min-h-0 flex-1 gap-2">
          <InputItem class="min-h-0" static-mode @select="addIngredient" />
          <InputItemQty
            v-model="ingredients"
            @remove="removeIngredient"
          />
        </div>
        <div class="flex shrink-0 items-center justify-center">
          <material-symbols:arrow-downward class="text-2xl color-white" />
        </div>
        <div class="relative grid grid-cols-2 min-h-0 flex-1 gap-2">
          <InputItem class="min-h-0" static-mode @select="addProduct" />
          <InputItemQty
            v-model="products"
            @remove="removeProduct"
          />
        </div>
        <div class="grid grid-cols-2 shrink-0 gap-2">
          <select v-model="profession" class="w-full select-none border border-white border-op-20 rounded bg-white bg-op-20 p-1">
            <option value="">
              Select an profession
            </option>
            <option value="botany">
              {{ t('profession.botany') }}
            </option>
            <option value="mineralogy">
              {{ t('profession.mineralogy') }}
            </option>
            <option value="gemology">
              {{ t('profession.gemology') }}
            </option>
            <option value="culinary">
              {{ t('profession.culinary') }}
            </option>
            <option value="alchemy">
              {{ t('profession.alchemy') }}
            </option>
            <option value="smelting">
              {{ t('profession.smelting') }}
            </option>
            <option value="gemcrafting">
              {{ t('profession.gemcrafting') }}
            </option>
            <option value="artisanry">
              {{ t('profession.artisanry') }}
            </option>
            <option value="weaving">
              {{ t('profession.weaving') }}
            </option>
          </select>
          <div class="flex gap-2">
            <button class="flex-1 rounded bg-white bg-op-20 p-2" @click="addRecipe">
              Add recipe
            </button>
            <button class="shrink-0 rounded bg-red bg-op-20 p-2" @click="clearRecipe">
              Clear ingredients
            </button>
          </div>
        </div>
      </div>
      <div class="w-100 flex shrink-0 flex-col">
        <div class="flex-1 text-sm font-mono">
          <template v-for="recipe in recipes" :key="recipe.id">
            - id: {{ recipe.id }}<br />
            &nbsp;&nbsp;profession: {{ recipe.profession }}<br />
            &nbsp;&nbsp;ingredients:<br />
            <template v-for="ingredient in recipe.ingredients" :key="ingredient.id">
              &nbsp;&nbsp;&nbsp;&nbsp;- id: {{ ingredient.id }}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;qty: {{ ingredient.qty }}<br />
            </template>
            &nbsp;&nbsp;products:<br />
            <template v-for="product in recipe.products" :key="product.id">
              &nbsp;&nbsp;&nbsp;&nbsp;- id: {{ product.id }}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;qty: {{ product.qty }}<br />
            </template>
            <br />
          </template>
        </div>
        <button class="shrink-0 select-none rounded bg-red bg-op-20 p-2" @click="clearRecipes">
          Clear recipes
        </button>
      </div>
    </div>
  </div>
</template>
