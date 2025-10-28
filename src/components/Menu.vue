<script setup lang="ts">
const router = useRouter()
const route = useRoute()

class Item {
  constructor(public page: string, public label: string, public color?: string, public dev = false) { }
}

const dev = import.meta.env.MODE === 'development'

const items: Item[] = [
  new Item('/', 'Dashboard', 'var(--green-100)'),
  new Item('/components', 'Components', 'var(--purple-800)'),
  new Item('/wishlist', 'Wish list', 'var(--cyan-800)'),
  new Item('/recipe-maker', 'Recipe maker', 'var(--orange-300)', true),
].filter(it => dev || !it.dev)
</script>

<template>
  <nav class="select-none">
    <menu>
      <li v-for="item in items" :key="item.page" class="mb-2" :style="{ '--route-color': item.color || 'var(--blue-800)' }">
        <button class="route relative w-full p-1 pl-4 text-left text-lg" :class="{ active: route.path === item.page }" @click="router.push(item.page)">
          <span>{{ item.label }}</span>
        </button>
      </li>
    </menu>
  </nav>
</template>

<style lang="scss" scoped>
@use '~/styles/mixins.scss' as *;

.route {
  &::before {
    @apply content-empty absolute left-0 top-50% h-1/2 -translate-y-1/2 w-1 rounded-l-1 rounded-r-2 transition-all transition-ease-in-out duration-300 bg-[var(--route-color)];
  }

  &:hover::before {
    @apply top-default h-full;
  }

  &.active {
    span {
      @include color-contrast(var(--route-color));
    }

    &::before {
      @apply top-default h-full w-full;
    }
  }
}
</style>
