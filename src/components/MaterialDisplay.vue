<script setup lang="ts">
const { id, qty } = defineProps<{ id: string, qty?: number }>()
const { t } = useI18n()

const icon = computed(() => findMat(id).icon)
</script>

<template>
  <div class="flex items-center gap-1">
    <img :src="icon" width="16" height="16" />
    <div class="flex-1 overflow-hidden text-ellipsis text-nowrap">
      {{ t(`item.${id}`) }}
    </div>
    <div v-if="qty" class="text-xs font-mono">
      x{{ qty }}
    </div>
  </div>
</template>
