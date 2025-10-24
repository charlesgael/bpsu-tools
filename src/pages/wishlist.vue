<script setup lang="ts">
import materials from '~/data/materials'
import { useWishlistStore } from '~/stores/wishlist'

const { t } = useI18n()
const scrollEl = ref<HTMLElement>()
const {
  wishes,
  clear: clearWishes,
  add: addWish,
  remove: removeWish,
  updateQty,
} = useWishlistStore()

const wishedMats = computed(() => wishes.map(it => ({ ...it, icon: findMat(it.material).icon })))

const search = ref('')
const solution = ref<ReturnType<typeof findSolution> | null>(null)

const filteredMats = computed(() => {
  if (!search.value) {
    return materials
  }

  return materials
    .filter(material => t(`item.${material.id}`).toLowerCase().includes(search.value.toLowerCase()))
})

const { data, reset } = useInfinitePage(scrollEl, {
  pageSize: 50,
  dataRef: filteredMats,
})
watch(filteredMats, reset)

function makeAWish() {
  solution.value = findSolution(wishes)
}
</script>

<template>
  <main class="h-full flex flex-col p-2">
    <h1 class="my-2 select-none border-b text-2xl color-white font-bold">
      Wish list
    </h1>
    <div class="grid grid-cols-2 h-full gap-lg overflow-hidden">
      <div class="flex flex-col gap-sm overflow-hidden">
        <div class="flex flex-items-center">
          <label class="w-50 select-none text-white">Item to add</label>
          <input
            v-model="search" class="text-mg flex-1 border-white border-op-40 rounded bg-white bg-op-40 p-1"
            @click="autoselect"
          />
        </div>
        <div ref="scrollEl" class="selectable-items overflow-y-auto rounded bg-white bg-op-5 pl-1 pt-1 text-white shadow-inner">
          <MaterialDisplay
            v-for="mat in data" :id="mat.id"
            :key="mat.id"
            class="float-left mb-1 mr-1 w-50 cursor-pointer select-none rounded-sm bg-white bg-op-0 transition-all hover-bg-op-40"
            @click="addWish(mat.id)"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <div class="mats-list flex-1">
          <div v-for="wish in wishedMats" :key="wish.material" class="mb-1 flex gap-1 flex-items-center rounded px-1 color-white">
            <MaterialDisplay :id="wish.material" />
            <input
              v-model="wish.qty" class="mx-1 w-15 flex-1 border-none bg-transparent p-1 text-right outline-none" @input="updateQty(wish.material, ($event.target as any).value)"
              @click="autoselect"
            />
            <material-symbols:close class="shrink-0 cursor-pointer text-red hover:bg-red hover:bg-op-20 hover:text-red-600" title="Remove" @click="removeWish(wish.material)" />
          </div>
        </div>
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

<style lang="scss" scoped>
.mats-list {
  & > * {
    @apply bg-white bg-op-10;

    &:nth-child(even) {
      @apply bg-white bg-op-5;
    }
  }
}

.backdrop {
  backdrop-filter: blur(10px);
}
</style>
