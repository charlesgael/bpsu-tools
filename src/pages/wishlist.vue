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
</script>

<template>
  <main class="h-full flex flex-col p-2">
    <h1 class="my-2 select-none border-b text-2xl color-white font-bold">
      Wish list
    </h1>
    <div class="grid grid-cols-2 h-full gap-lg overflow-hidden">
      <ItemSelector @click="addWish" />
      <div class="flex flex-col">
        <InputItemQty
          v-model="wishes"
          class="flex-1"
          @input="updateQty"
          @remove="removeWish"
        />
        <div class="flex">
          <button class="h-12 flex-1 border-white border-op-40 rounded bg-white bg-op-40 text-xl" @click="makeAWish">
            Make a wish
          </button>
          <button class="ml-2 h-12 border-white border-op-40 rounded bg-red-300 bg-op-40 px-4 text-xl" @click="clearWishes">
            Clear
          </button>
        </div>
      </div>
    </div>
  </main>
  <DisplayWishlist v-if="solution" :solution="solution" @close="solution = null" />
</template>
