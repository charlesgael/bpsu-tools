<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

interface LightRayProps extends /* @vue-ignore */ HTMLAttributes {
  count?: number
  color?: string
  blur?: number
  speed?: number
  length?: string
}

interface LightRay {
  id: string
  left: number
  rotate: number
  width: number
  swing: number
  delay: number
  duration: number
  intensity: number
}

const {
  count = 7,
  color = 'rgba(160, 210, 255, 0.2)',
  blur = 34,
  speed = 7,
  length = '100vh',
  class: className,
  prefix,
  ...props
} = defineProps<LightRayProps>()

function createRays(count: number, cycle: number): LightRay[] {
  if (count <= 0) {
    return []
  }

  return Array.from({ length: count }, (_, index) => {
    const left = 8 + Math.random() * 84
    const rotate = -28 + Math.random() * 56
    const width = 160 + Math.random() * 160
    const swing = 0.8 + Math.random() * 1.8
    const delay = Math.random() * cycle
    const duration = cycle * (0.75 + Math.random() * 0.5) * 2
    const intensity = 0.6 + Math.random() * 0.5

    return {
      id: `${index}-${Math.round(left * 10)}`,
      left,
      rotate,
      width,
      swing,
      delay,
      duration,
      intensity,
    }
  })
}

const rays = ref<LightRay[]>([])
const cycleDuration = Math.max(speed, 0.1)

watchEffect(() => {
  rays.value = createRays(count, cycleDuration)
})

const timestamp = useTimestamp()

function easeInOutT(duration: number, pauseStart: number = 0, pauseEnd: number = 0): number {
  const cycleMs = (duration + pauseStart + pauseEnd) * 1000
  // const tMs = timestamp.value % cycleMs
  // Make it go back and forth
  const tMs = Math.abs((timestamp.value % cycleMs) * 2 - cycleMs)
  const tSec = tMs / 1000

  if (tSec < pauseStart) {
    return easeInOutSine(0)
  }
  if (tSec > duration + pauseStart) {
    return easeInOutSine(1)
  }

  const activeTime = tSec - pauseStart
  const progress = activeTime / duration

  return easeInOutSine(progress)
}
function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2
}
</script>

<template>
  <div
    v-bind="props" class="main pointer-events-none absolute inset-0 isolate overflow-hidden rounded-[inherit]" :class="className" :style="{
      '--light-rays-color': color,
      '--light-rays-blur': `${blur}px`,
      '--light-rays-length': length,
    }"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div class="light-1" aria-hidden />
      <div class="light-2" aria-hidden />
      <!-- Rays -->
      <div
        v-for="({ left, rotate, width, delay, swing, duration, intensity }, key) in rays" :key="key"
        class="pointer-events-none absolute left-[var(--ray-left)] h-[var(--light-rays-length)] w-[var(--ray-width)] origin-top rounded-full from-[color-mix(in_srgb,var(--light-rays-color)_70%,transparent)] to-transparent bg-gradient-to-b mix-blend-screen blur-[var(--light-rays-blur)] -top-[20%] -translate-x-1/2"
        :style="{
          '--ray-left': `${left}%`,
          '--ray-width': `${width}px`,
          'opacity': intensity * easeInOutT(duration, delay, delay),
          'rotate': `${rotate + swing * easeInOutT(duration, delay, delay)}deg`,
        }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  [class^='light-'] {
  position: absolute;
  inset: 0;
  opacity: 60;
}

.light-1 {
  background: radial-gradient(
    circle at 20% 15%,
    color-mix(in srgb, var(--light-rays-color) 45%, transparent),
    transparent 70%
  );
}

.light-2 {
  background: radial-gradient(
    circle at 80% 10%,
    color-mix(in srgb, var(--light-rays-color) 35%, transparent),
    transparent 75%
  );
}
</style>
