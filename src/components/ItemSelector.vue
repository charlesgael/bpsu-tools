<script setup lang="ts">
import materials from '~/data/materials'

const emit = defineEmits<{
  click: [string]
}>()

const { t } = useI18n()
const scrollEl = ref<HTMLElement>()
const search = ref('')
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
</script>

<template>
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
        @click="emit('click', mat.id)"
      />
    </div>
  </div>
</template>
