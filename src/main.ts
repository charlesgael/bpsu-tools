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

// export function createWebHashHistory(base?: string): RouterHistory {
//   // Make sure this implementation is fine in terms of encoding, specially for IE11
//   // for `file://`, directly use the pathname and ignore the base
//   // location.pathname contains an initial `/` even at the root: `https://example.com`
//   base = location && location.host ? base || location.pathname + location.search : ''
//   // allow the user to provide a `#` in the middle: `/base/#/app`
//   if (!base.includes('#'))
//     base += '#'

//   return createWebHistory(base)
// }

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes: setupLayouts(routes),
    base: import.meta.env.BASE_URL,
    history: import.meta.env.MODE === 'dev' ? createWebHistory() : createWebHashHistory(),
  },
  async (ctx) => {
    // install all modules under `modules/`
    for (const i of Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))) {
      await i.install?.(ctx)
    }
    // ctx.app.use(Previewer)
  },
)
