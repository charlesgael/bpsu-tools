import type { UserModule } from './types'
import { setupLayouts } from 'virtual:generated-layouts'
import { ViteSSG } from 'vite-ssg'
import { createWebHashHistory, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import './polyfills'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import './styles/main.css'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes: setupLayouts(routes),
    base: import.meta.env.BASE_URL,
    history: import.meta.env.MODE === 'development' ? createWebHistory() : createWebHashHistory('/bpsu-tools/'),
  },
  async (ctx) => {
    // install all modules under `modules/`
    for (const i of Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))) {
      await i.install?.(ctx)
    }
    // ctx.app.use(Previewer)
  },
)
