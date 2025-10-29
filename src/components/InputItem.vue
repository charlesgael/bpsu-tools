<script setup lang="ts">
import materials from '~/data/materials'

interface Props {
  staticMode?: boolean
}

const {
  staticMode = false,
} = defineProps<Props>()

const emit = defineEmits<{
  select: [string]
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

const openBtn = ref(staticMode)

const inputRef = ref<HTMLInputElement>()

function select(id: string) {
  if (!staticMode)
    openBtn.value = false
  search.value = ''
  emit('select', id)
  focusField()
}

function focusField() {
  if (inputRef.value) {
    setTimeout(() => {
      inputRef.value!.focus()
    })
  }
}

const open = computed(() => openBtn.value || search.value.length > 0)
watchDebounced(filteredMats, reset, { debounce: 100 })
</script>

<template>
  <div
    class="relative"
    :class="{
      'flex-min flex-col': staticMode,
    }"
  >
    <div
      class="flex items-center rounded bg-white bg-op-20"
      :class="{
        'rounded-b-0': open || staticMode,
      }"
    >
      <input
        ref="inputRef"
        v-model="search"
        class="flex-1 border-0 bg-white bg-op-0 p-1 color-white outline-0"
        placeholder="Filter items"
        @click="autoselect"
      />
      <button v-if="!staticMode" class="px-2">
        <material-symbols:arrow-drop-down v-if="!openBtn" @click="openBtn = true" />
        <material-symbols:arrow-drop-up v-if="openBtn" @click="openBtn = false" />
      </button>
    </div>
    <div
      ref="scrollEl"
      class="z-1 overflow-y-auto rounded-b bg-white pl-1 pt-1 shadow-inner transition-all"
      :class="{
        'absolute top-100% left-0 max-h-150 w-full': !staticMode,
        'flex-1 bg-op-5': staticMode,
        'opacity-0 pointer-events-none': !open,
        'opacity-100 pointer-events-auto': open,
      }"
    >
      <MaterialDisplay
        v-for="mat in data"
        :id="mat.id"
        :key="mat.id"
        class="mb-1 mr-1 cursor-pointer select-none rounded-sm bg-black bg-op-0 transition-all hover-bg-op-40"
        @click="select(mat.id)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.display-list {
  opacity: 0;
  pointer-events: none;

  input:focus + & {
    opacity: 1;
    pointer-events: all;
  }
}
</style>
