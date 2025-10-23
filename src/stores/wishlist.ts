import type { Wish } from '~/composables/findSolution'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useWishlistStore = defineStore('Wishlist', () => {
  const wishes = ref<Wish[]>([])
  const clear = () => wishes.value.length = 0
  const add = (material: string) => {
    if (wishes.value.every(it => it.material !== material)) {
      wishes.value.push({
        material,
        qty: 1,
      })
    }
  }
  const updateQty = (material: string, qty: number) => {
    const idx = wishes.value.findIndex(it => it.material === material)
    if (idx >= 0) {
      wishes.value.splice(idx, 1, { material, qty })
    }
  }
  const remove = (material: string) => {
    const idx = wishes.value.findIndex(it => it.material === material)
    if (idx >= 0) {
      wishes.value.splice(idx, 1)
    }
  }

  return {
    wishes,
    clear,
    add,
    updateQty,
    remove,
  }
}, {
  persist: true,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWishlistStore as any, import.meta.hot))
