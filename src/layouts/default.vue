<template lang="pug">
  .app
    .app-header
    .app-body
      .app-menu
        Menu
      .app-content
        RouterView
    .app-footer
      p App Footer
</template>

<style lang="scss" scoped>
.app {
  @apply flex flex-col font-sans h-screen;

  &-header {
    @extend .lined, .lined-bottom;
    @apply color-white p-4 text-center h-15;
    /* color: white;
    padding: 1rem;
    text-align: center;
    height: 60px; */
  }

  &-body {
    @apply flex flex-1 overflow-hidden;
  }

  &-menu {
    @apply p-4 w-80;
    background: linear-gradient(
      160deg,
      rgba(116, 137, 158, 100) 0%,
      rgba(96, 117, 138, 100) 30%,
      rgba(96, 117, 138, 100) 70%,
      rgba(116, 137, 158, 100) 100%
    );
  }

  &-content {
    @apply flex-1 min-h-50;
  }

  &-footer {
    @extend .lined, .lined-top;
    @apply relative p-4 text-center;

    order: 3;
  }
}
.lined {
  @apply relative;

  &::before {
    @apply absolute block content-empty left-0 w-full h-1px;
    background: #7389a2;
    background: linear-gradient(to right, rgba(116, 137, 158, 100), rgba(116, 137, 158, 100), rgba(116, 137, 158, 0));
  }

  &-top {
    &::before {
      @apply top-0;
    }
  }

  &-bottom {
    &::before {
      @apply bottom-0;
    }
  }
}
</style>
