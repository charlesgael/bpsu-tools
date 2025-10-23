<script setup lang="ts">
interface Props {
  solution: ReturnType<typeof findSolution>
}
const { solution } = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()
const { t } = useI18n()

const dropsRegular = computed(() => {
  return solution.dropsRegular.groupBy(it => it.source ?? 'unknown')
})

const dropsFocused = computed(() => {
  return solution.dropsFocused.groupBy(it => it.source ?? 'unknown')
})

const recipes = computed(() => {
  return solution.recipes.groupBy(it => it.profession ?? 'unknown')
})
</script>

<template lang="html">
  <div class="backdrop absolute bottom-0 left-0 right-0 top-0 z-1" @click="emit('close')">
    <div class="absolute left-50% top-50% select-none shadow-2xl -translate-1/2" @click.stop>
      <material-symbols:close class="absolute right-2 top-2 cursor-pointer text-red hover:bg-red hover:bg-op-20 hover:text-red-600" title="Close" @click="emit('close')" />
      <div class="mt-1px max-h-90vh w-250 overflow-y-auto bg-white px-4 pb-4">
        <!-- Drops block -->
        <template v-if="Object.entries(dropsRegular).length || Object.entries(dropsFocused).length">
          <h1 class="my-4 text-xl">
            Drops
          </h1>
          <template v-for="[group, drops] in Object.entries(dropsRegular)" :key="group">
            <h2 class="my-2 text-lg">
              {{ t(`drop.regular.${group}`) }}
            </h2>
            <div class="grid cols-3 gap-2 even-grid even-grid-flow-dense">
              <div v-for="drop in drops" :key="drop.material" class="flex flex-col rounded-t bg-gray-100 p-1 pb-0 shadow">
                <div class="mb-1 flex shrink-0 gap-1">
                  <img :src="findMat(drop.material).icon" width="16" />
                  <div class="flex-1">
                    {{ t(`item.${drop.material}`) }}
                  </div>
                </div>
                <div class="flex-1 rounded-t bg-gray-200 py-1 shadow-inner">
                  <div v-for="provided in drop.provides" :key="provided.material" class="flex items-center gap-1 px-2 hover:bg-gray-300">
                    <img :src="findMat(provided.material).icon" width="16" />
                    <div class="flex-1" :class="{ italic: provided.multiple }">
                      {{ t(`item.${provided.material}`) }}
                    </div>
                    <div class="text-xs font-mono">
                      x{{ provided.qty }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-for="[group, drops] in Object.entries(dropsFocused)" :key="group">
            <h2 class="my-2 text-lg">
              {{ t(`drop.focused.${group}`) }}
            </h2>
            <div class="grid cols-3 gap-2 even-grid even-grid-flow-dense">
              <div v-for="drop in drops" :key="drop.material" class="flex flex-col rounded bg-gray-100 p-2 pb-0 shadow">
                <div class="mb-1 flex shrink-0 gap-1">
                  <img :src="findMat(drop.material).icon" width="16" />
                  <div class="flex-1">
                    {{ t(`item.${drop.material}`) }}
                  </div>
                </div>
                <div class="flex-1 rounded-t bg-gray-200 py-1 shadow-inner">
                  <div v-for="provided in drop.provides" :key="provided.material" class="flex items-center gap-1 px-2 hover:bg-gray-300">
                    <img :src="findMat(provided.material).icon" width="16" />
                    <div class="flex-1" :class="{ italic: provided.multiple }">
                      {{ t(`item.${provided.material}`) }}
                    </div>
                    <div class="text-xs font-mono">
                      x{{ provided.qty }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <!-- Recipes block -->
        <template v-if="Object.entries(recipes).length">
          <h1 class="my-4 text-xl">
            Recipes
          </h1>
          <template v-for="[group, recipeGroup] in Object.entries(recipes)" :key="group">
            <h2 class="my-2 text-lg">
              {{ t(`profession.${group}`) }}
            </h2>
            <div class="grid cols-3 gap-2 even-grid even-grid-flow-dense">
              <div v-for="recipe in recipeGroup.toReversed()" :key="recipe.material.id" class="relative flex flex-col rounded bg-gray-100 p-2 pb-0 shadow">
                <div class="absolute right-4 top-1 rotate-20 text-xl font-mono">
                  x{{ recipe.times }}
                </div>
                <div v-for="product in recipe.material.products" :key="product.itemId" class="mb-1 flex shrink-0 gap-1">
                  <img :src="findMat(product.itemId).icon" width="16" />
                  <div class="flex-1">
                    {{ t(`item.${product.itemId}`) }}
                  </div>
                </div>
                <div class="flex-1 rounded-t bg-gray-200 py-1 shadow-inner">
                  <div v-for="provided in recipe.material.ingredients" :key="provided.itemId" class="flex items-center gap-1 px-2 hover:bg-gray-300">
                    <img :src="findMat(provided.itemId).icon" width="16" />
                    <div class="flex-1">
                      {{ t(`item.${provided.itemId}`) }}
                    </div>
                    <div class="text-xs font-mono">
                      x{{ provided.qty ?? 1 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <!-- Unknown solutions -->
        <template v-if="solution.unknown.length">
          <h1 class="my-4 text-xl">
            Unknown
          </h1>
          <ul class="pl-4">
            <li v-for="it in solution.unknown" :key="it.material" class="flex gap-1">
              <img :src="findMat(it.material).icon" width="16" />
              <div>{{ t(`item.${it.material}`) }}</div>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>
