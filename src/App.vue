<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'BPSU - Tools',
  meta: [
    {
      name: 'description',
      content: 'Collection of Blue Protocol: Star Resonnance tools',
    },
    {
      name: 'theme-color',
      content: () => '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: import.meta.env.MODE === 'development' ? '/favicon.svg' : './favicon.svg',
    },
  ],
})
</script>

<template lang="pug">
  RouterView
  LightRays
  Particles.opacity-20(:size="1")
</template>
