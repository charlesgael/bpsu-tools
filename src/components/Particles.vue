<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

interface ParticlesProps extends /* @vue-ignore */ HTMLAttributes {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  refresh?: boolean
  color?: string
  vx?: number
  vy?: number
}

interface Circle {
  x: number
  y: number
  translateX: number
  translateY: number
  size: number
  alpha: number
  targetAlpha: number
  dx: number
  dy: number
  magnetism: number
}

const {
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = '#ffffff',
  vx = 0,
  vy = 0,
  class: className,
  prefix,
  ...props
} = defineProps<ParticlesProps>()

function hexToRgb(hex: string): number[] {
  hex = hex.replace('#', '')

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => char + char)
      .join('')
  }

  const hexInt = Number.parseInt(hex, 16)
  const red = (hexInt >> 16) & 255
  const green = (hexInt >> 8) & 255
  const blue = hexInt & 255
  return [red, green, blue]
}

const canvasContainerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const context = ref<CanvasRenderingContext2D | null>(null)
const circles = ref<Circle[]>([])
const canvasSize = ref<{ w: number, h: number }>({ w: 0, h: 0 })
const dpr = window.devicePixelRatio || 1
const rafID = ref<number>()

watch([canvasRef], () => {
  if (canvasRef.value) {
    context.value = canvasRef.value.getContext('2d')
  }
  initCanvas()
  animate()
})

onBeforeUnmount(() => {
  if (rafID.value != null) {
    window.cancelAnimationFrame(rafID.value)
  }
})
useResizeObserver(canvasContainerRef, initCanvas)

watchEffect(() => {
  if (refresh) {
    initCanvas()
  }
})

function initCanvas() {
  resizeCanvas()
  drawParticles()
}

function resizeCanvas() {
  if (canvasContainerRef.value && canvasRef.value && context.value) {
    canvasSize.value.w = canvasContainerRef.value.offsetWidth
    canvasSize.value.h = canvasContainerRef.value.offsetHeight

    canvasRef.value.width = canvasSize.value.w * dpr
    canvasRef.value.height = canvasSize.value.h * dpr
    canvasRef.value.style.width = `${canvasSize.value.w}px`
    canvasRef.value.style.height = `${canvasSize.value.h}px`
    context.value.scale(dpr, dpr)

    // Clear existing particles and create new ones with exact quantity
    circles.value = []
    for (let i = 0; i < quantity; i++) {
      const circle = circleParams()
      drawCircle(circle)
    }
  }
}

function circleParams(): Circle {
  const x = Math.floor(Math.random() * canvasSize.value.w)
  const y = Math.floor(Math.random() * canvasSize.value.h)
  const translateX = 0
  const translateY = 0
  const pSize = Math.floor(Math.random() * 2) + size
  const alpha = 0
  const targetAlpha = Number.parseFloat((Math.random() * 0.6 + 0.1).toFixed(1))
  const dx = (Math.random() - 0.5) * 0.1
  const dy = (Math.random() - 0.5) * 0.1
  const magnetism = 0.1 + Math.random() * 4
  return {
    x,
    y,
    translateX,
    translateY,
    size: pSize,
    alpha,
    targetAlpha,
    dx,
    dy,
    magnetism,
  }
}

const rgb = hexToRgb(color)

function drawCircle(circle: Circle, update = false) {
  if (context.value) {
    const { x, y, translateX, translateY, size, alpha } = circle
    context.value.translate(translateX, translateY)
    context.value.beginPath()
    context.value.arc(x, y, size, 0, 2 * Math.PI)
    context.value.fillStyle = `rgba(${rgb.join(', ')}, ${alpha})`
    context.value.fill()
    context.value.setTransform(dpr, 0, 0, dpr, 0, 0)

    if (!update) {
      circles.value.push(circle)
    }
  }
}

function clearContext() {
  if (context.value) {
    context.value.clearRect(0, 0, canvasSize.value.w, canvasSize.value.h)
  }
}

function drawParticles() {
  clearContext()
  const particleCount = quantity
  for (let i = 0; i < particleCount; i++) {
    const circle = circleParams()
    drawCircle(circle)
  }
}

function remapValue(value: number, start1: number, end1: number, start2: number, end2: number): number {
  const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
  return remapped > 0 ? remapped : 0
}

function animate() {
  clearContext()
  circles.value.forEach((circle: Circle, i: number) => {
    // Handle the alpha value
    const edge = [
      circle.x + circle.translateX - circle.size, // distance from left edge
      canvasSize.value.w - circle.x - circle.translateX - circle.size, // distance from right edge
      circle.y + circle.translateY - circle.size, // distance from top edge
      canvasSize.value.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
    ]
    const closestEdge = edge.reduce((a, b) => Math.min(a, b))
    const remapClosestEdge = Number.parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2))
    if (remapClosestEdge > 1) {
      circle.alpha += 0.02
      if (circle.alpha > circle.targetAlpha) {
        circle.alpha = circle.targetAlpha
      }
    }
    else {
      circle.alpha = circle.targetAlpha * remapClosestEdge
    }
    circle.x += circle.dx + vx
    circle.y += circle.dy + vy
    circle.translateX += /* mouse.value.x */ (0 / (staticity / circle.magnetism) - circle.translateX) / ease
    circle.translateY += /* mouse.value.y */ (0 / (staticity / circle.magnetism) - circle.translateY) / ease

    drawCircle(circle, true)

    // circle gets out of the canvas
    if (
      circle.x < -circle.size
      || circle.x > canvasSize.value.w + circle.size
      || circle.y < -circle.size
      || circle.y > canvasSize.value.h + circle.size
    ) {
      // remove the circle from the array
      circles.value.splice(i, 1)
      // create a new circle
      const newCircle = circleParams()
      drawCircle(newCircle)
    }
  })
  rafID.value = window.requestAnimationFrame(animate)
}
</script>

<template>
  <div v-bind="props" ref="canvasContainerRef" class="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden" :class="className" aria-hidden>
    <canvas ref="canvasRef" class="block h-full w-full" />
  </div>
</template>
