<script setup lang="ts">
import { useWishlistStore } from '~/stores/wishlist'

const {
  wishes,
  clear: clearWishes,
  add: addWish,
  remove: removeWish,
  updateQty,
} = useWishlistStore()

// const wishedMats = computed(() => wishes.map(it => ({ ...it, icon: findMat(it.material).icon })))
const solution = ref<ReturnType<typeof findSolution> | null>(null)

function makeAWish() {
  if (wishes.length)
    solution.value = findSolution(wishes)
}

function presetsWeeklyJob() {
  clearWishes()
  const preset = [
    { material: 'flour', qty: 45 },
    { material: 'refined_cotton', qty: 20 },
    { material: 'hay', qty: 80 },
    { material: 'tartberry_juice', qty: 80 },
    { material: 'base_soil', qty: 80 },
    { material: 'resin', qty: 80 },
    { material: 'enigmite_powder', qty: 40 },
    { material: 'sandstone_polishers', qty: 40 },
    { material: 'clay', qty: 160 },
    { material: 'fine_sand', qty: 160 },
    { material: 'limpid_azure_water', qty: 160 },
    { material: 'rock_salt', qty: 80 },
    { material: 'pig_iron_ingot', qty: 40 },
    { material: 'pine_lumber', qty: 40 },
    { material: 'fine_metal_sand', qty: 80 },
  ]
  preset.forEach(({ material, qty }) => addWish(material, qty))
}
</script>

<template>
  <main class="h-full flex flex-col p-2">
    <h1 class="my-2 select-none border-b text-2xl color-white font-bold">
      Wish list
    </h1>
    <div class="grid grid-cols-2 h-full gap-lg overflow-hidden">
      <ItemSelector @click="addWish" />
      <div class="flex flex-col gap-2">
        <InputItemQty
          v-model="wishes"
          class="flex-1"
          @input="updateQty"
          @remove="removeWish"
        />
        <div class="flex gap-2">
          <button class="h-12 flex-1 border-white border-op-40 rounded bg-white bg-op-40 text-xl" @click="makeAWish">
            Make a wish
          </button>
          <button class="h-12 border-white border-op-40 rounded bg-red-300 bg-op-40 px-4 text-xl" @click="clearWishes">
            Clear
          </button>
        </div>
        <div class="flex">
          <button class="rounded bg-white bg-op-40 px-1" @click="presetsWeeklyJob">
            Weekly Life Skill
          </button>
        </div>
      </div>
    </div>
  </main>
  <DisplayWishlist v-if="solution" :solution="solution" @close="solution = null" />
</template>
