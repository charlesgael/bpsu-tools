<script setup lang="ts">
import materials from '~/data/materials'

const { t } = useI18n()
const scrollEl = ref<HTMLElement>()
const search = ref('')

const filteredMats = computed(() => {
  if (!search.value) {
    return materials
  }

  return materials.filter(material => t(`item.${material.id}`).toLowerCase().includes(search.value.toLowerCase()))
})

const { data, reset } = useInfinitePage(scrollEl, {
  pageSize: 50,
  dataRef: filteredMats,
})
watch(filteredMats, reset)
</script>

<template>
  <div class="h-full flex flex-col pt-8">
    <input
      v-model="search"
      class="mx-auto block w-200 border border-white border-op-40 rounded bg-white bg-op-40 p-4 text-2xl"
      type="text"
      placeholder="Find an item..."
    />
    <div ref="scrollEl" class="grid grid-cols-1 mt-8 gap-8 overflow-y-auto p-4 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="mat in data"
        :key="mat.id"
        class="rarity select-none border border-op-20 rounded p-4"
        :class="`rarity-${mat.rarity}`"
      >
        <div class="flex">
          <div class="h-16 w-16 flex-shrink-0 rounded bg-white bg-op-20">
            <img :src="mat.icon" :alt="mat.name" class="h-full w-full object-contain" />
          </div>
          <div class="ml-4 flex-1 color-white">
            <div class="text-lg">
              {{ t(`item.${mat.id}`) }}
            </div>
            <div>
              {{ mat.profession }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rarity {
  border-color: var(--rarity-color);
  background: var(--rarity-color);
  background-image: linear-gradient(to bottom, #202020 0%, var(--rarity-color) 100%);
}
[class^='rarity-'] {
  @extend .rarity;
}

.rarity-common {
  --rarity-color: #8a939b;
}
.rarity-uncommon {
  --rarity-color: #649b9b;
}
.rarity-rare {
  --rarity-color: #7793b6;
}
.rarity-epic {
  --rarity-color: #9989bb;
}
.rarity-legendary {
  --rarity-color: #c7ab6b;
}
</style>
