<script setup lang="ts">
interface Line {
  material: string
  qty: number
}

const emit = defineEmits<{
  input: [string, number]
  remove: [string]
}>()

const list = defineModel<Line[]>()
</script>

<template>
  <div>
    <div
      v-for="(line, idx) in list" :key="line.material"
      class="mb-1 flex gap-1 flex-items-center rounded bg-white px-1 color-white"
      :class="idx % 2 ? 'bg-op-10' : 'bg-op-5'"
    >
      <MaterialDisplay :id="line.material" />
      <input
        v-model="line.qty"
        class="mx-1 w-15 flex-1 border-none bg-transparent p-1 text-right outline-none"
        @input="emit('input', line.material, ($event.target as any).value)"
        @click="autoselect"
      />
      <material-symbols:close
        class="shrink-0 cursor-pointer text-red hover:bg-red hover:bg-op-20 hover:text-red-600"
        title="Remove"
        @click="emit('remove', line.material)"
      />
    </div>
  </div>
</template>
