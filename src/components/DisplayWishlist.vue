<script setup lang="ts">
interface Props {
  solution: ReturnType<typeof findSolution>
}
const { solution } = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()
const { t } = useI18n()

const displayFinished = ref(false)

const done = ref<Record<string, boolean>>({})
function toggleDone(...materials: string[]) {
  for (const material of materials) {
    done.value[material] = !done.value[material]
  }
}

const { escape } = useMagicKeys()
watch(escape, (v) => {
  if (v)
    emit('close')
})

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
  <div class="absolute bottom-0 left-0 right-0 top-0 z-1 backdrop-blur-4">
    <div class="absolute left-50vw top-5vh select-none shadow-2xl -translate-x-1/2" @click.stop>
      <material-symbols:close
        class="absolute right-2 top-2 cursor-pointer text-red hover:bg-red hover:bg-op-20 hover:text-red-600"
        title="Close"
        @click="emit('close')"
      />
      <material-symbols:view-in-ar
        v-if="displayFinished"
        class="absolute right-8 top-2 cursor-pointer text-gray-500 hover:bg-gray hover:bg-op-20 hover:text-gray-800"
        title="Display finished"
        @click="displayFinished = false"
      />
      <material-symbols:view-in-ar-off
        v-if="!displayFinished"
        class="absolute right-8 top-2 cursor-pointer text-gray-500 hover:bg-gray hover:bg-op-20 hover:text-gray-800"
        title="Hide finished"
        @click="displayFinished = true"
      />
      <div class="mt-1px max-h-90vh min-h-10vh w-250 overflow-y-auto bg-white px-4 pb-4">
        <!-- Unknown solutions -->
        <template v-if="solution.unknown.length">
          <h1 class="my-4 text-xl">
            Unknown
          </h1>
          <ul class="ml-4 w-80">
            <li v-for="it in solution.unknown" :key="it.material">
              <MaterialDisplay
                :id="it.material" :qty="it.qty" class="rounded px-2"
                :class="{
                  'bg-green bg-op-10 hover:bg-op-20': done[it.material],
                  'bg-black bg-op-0 hover:bg-op-5': !done[it.material],
                }"
                :style="done[it.material] && !displayFinished ? 'display: none' : ''"
                @click="toggleDone(it.material)"
              />
            </li>
          </ul>
        </template>
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
              <div
                v-for="drop in drops" :key="drop.material" class="flex flex-col rounded-t bg-gray-100 p-1 pb-0 shadow"
                :class="{ 'bg-green-50': drop.provides.every(it => done[it.material]) }"
              >
                <MaterialDisplay :id="drop.material" class="mb-1 shrink-0" />
                <div class="flex-1 rounded-t bg-gray-200 py-1 shadow-inner">
                  <MaterialDisplay
                    v-for="provided in drop.provides" :id="provided.material" :key="provided.material" :qty="provided.qty"
                    class="px-2"
                    :class="{
                      'bg-green bg-op-10 hover:bg-op-20': done[provided.material],
                      'bg-black bg-op-0 hover:bg-op-5': !done[provided.material],
                      'italic': provided.multiple,
                    }"
                    :style="done[provided.material] && !displayFinished ? 'display: none' : ''"
                    @click="toggleDone(provided.material)"
                  />
                </div>
              </div>
            </div>
          </template>

          <template v-for="[group, drops] in Object.entries(dropsFocused)" :key="group">
            <h2 class="my-2 text-lg">
              {{ t(`drop.focused.${group}`) }}
            </h2>
            <div class="grid cols-3 gap-2 even-grid even-grid-flow-dense">
              <div
                v-for="drop in drops" :key="drop.material" class="flex flex-col rounded bg-gray-100 p-2 pb-0 shadow"
                :class="{ 'bg-green-100': drop.provides.every(it => done[it.material]) }"
              >
                <MaterialDisplay :id="drop.material" class="mb-1 shrink-0" />
                <div class="flex-1 rounded-t bg-gray-200 py-1 shadow-inner">
                  <MaterialDisplay
                    v-for="provided in drop.provides" :id="provided.material" :key="provided.material" :qty="provided.qty" class="px-2"
                    :class="{
                      'bg-green bg-op-10 hover:bg-op-20': done[provided.material],
                      'bg-black bg-op-0 hover:bg-op-5': !done[provided.material],
                      'italic': provided.multiple,
                    }"
                    :style="done[provided.material] && !displayFinished ? 'display: none' : ''"
                    @click="toggleDone(provided.material)"
                  />
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
              <div
                v-for="recipe in recipeGroup.toReversed()" :key="recipe.material.id" class="relative flex flex-col rounded p-2 pb-0 shadow"
                :class="{
                  'bg-green-50': done[recipe.material.id],
                  'bg-yellow-50': !done[recipe.material.id] && recipe.material.ingredients.every(it => done[it.id]),
                  'bg-gray-100': !done[recipe.material.id] && !recipe.material.ingredients.every(it => done[it.id]),
                }"
                @click="toggleDone(recipe.material.id, ...recipe.material.products.map(it => it.id))"
              >
                <div class="absolute right-4 top-1 rotate-20 text-xl font-mono">
                  x{{ recipe.times }}
                </div>
                <MaterialDisplay v-for="product in recipe.material.products" :id="product.id" :key="product.id" class="mb-1 shrink-0" />
                <div class="flex-1 rounded-t bg-gray-200 py-1 shadow-inner">
                  <MaterialDisplay
                    v-for="provided in recipe.material.ingredients" :id="provided.id" :key="provided.id" :qty="provided.qty ?? 1" class="px-2"
                    :class="{
                      'bg-green bg-op-10 hover:bg-op-20': done[provided.id],
                      'bg-black bg-op-0 hover:bg-op-5': !done[provided.id],
                    }"
                    :style="done[provided.id] && !displayFinished ? 'display: none' : ''"
                  />
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
