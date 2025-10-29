<script setup lang="ts">
const store = useDailiesStore()

const { t } = useI18n()
</script>

<template>
  <Timeline class="mx-auto my-4 w-200" :dailies="store.dbDaily" :weeklies="store.dbWeekly" />

  <div class="flex gap-4 p-4">
    <div class="flex-1 border rounded bg-white bg-op-10 p-4 shadow">
      <h1 class="mb-2 border-b text-xl color-white">
        Dailies
      </h1>

      <div v-for="[id, checked] in Object.entries(store.dailies)" :key="id" class="flex items-center gap-1">
        <input :id="id" type="checkbox" :checked="checked" @change="store.toggleDaily(id)" />
        <label :for="id">{{ t(`quest.${id}`) }}</label>
      </div>
    </div>
    <div class="flex-1 border rounded bg-white bg-op-10 p-4 shadow">
      <h1 class="mb-2 border-b text-xl color-white">
        Weeklies
      </h1>

      <div v-for="[id, checked] in Object.entries(store.weeklies)" :key="id" class="flex items-center gap-1">
        <input :id="id" type="checkbox" :checked="checked" @change="store.toggleWeekly(id)" />
        <label :for="id">{{ t(`quest.${id}`) }}</label>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/styles/mixins.scss' as *;

.cal-progress {
  background: var(--cell-color, rgb(156 163 175 / var(--un-bg-opacity)));
  & > * {
    @include color-contrast(var(--cell-color, rgb(156 163 175)));
  }
}

.cal-progress-0 {
  --cell-color: rgb(244 67 54);
}
.cal-progress-1 {
  --cell-color: rgb(227 78 57);
}
.cal-progress-2 {
  --cell-color: rgb(210 89 59);
}
.cal-progress-3 {
  --cell-color: rgb(194 99 62);
}
.cal-progress-4 {
  --cell-color: rgb(177 110 64);
}
.cal-progress-5 {
  --cell-color: rgb(160 121 67);
}
.cal-progress-6 {
  --cell-color: rgb(143 132 70);
}
.cal-progress-7 {
  --cell-color: rgb(126 143 72);
}
.cal-progress-8 {
  --cell-color: rgb(110 153 75);
}
.cal-progress-9 {
  --cell-color: rgb(93 164 77);
}
.cal-progress-10 {
  --cell-color: rgb(76 175 80);
}
</style>
