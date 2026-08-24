<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'

  interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    alpha: number
    baseAlpha: number
    color: string
    pulseOffset: number
    pulseSpeed: number
  }

  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let animationFrameId: number | null = null
  let ctx: CanvasRenderingContext2D | null = null

  let width = 0
  let height = 0
  let dpr = 1
  let particles: Particle[] = []

  // Mouse interaction state
  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    radius: 140,
  }

  const colors = [
    'rgba(226, 241, 97, ', // Lime glow
    'rgba(56, 189, 248, ', // Cyan glow
    'rgba(248, 250, 252, ', // White star
    'rgba(148, 163, 184, ', // Slate dust
  ]

  function initParticles() {
    const isMobile = width < 768
    const particleCount = isMobile ? 35 : 75
    particles = []

    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      const baseAlpha = Math.random() * 0.45 + 0.15
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.6 + 0.6,
        alpha: baseAlpha,
        baseAlpha,
        color,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
      })
    }
  }

  function resizeCanvas() {
    if (!canvasRef.value) return
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight

    canvasRef.value.width = width * dpr
    canvasRef.value.height = height * dpr
    canvasRef.value.style.width = `${width}px`
    canvasRef.value.style.height = `${height}px`

    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    initParticles()
  }

  function handleMouseMove(e: MouseEvent) {
    mouse.targetX = e.clientX
    mouse.targetY = e.clientY
  }

  function handleMouseLeave() {
    mouse.targetX = -1000
    mouse.targetY = -1000
  }

  function render(time: number) {
    if (!ctx) return

    // Smooth mouse coordinates dampening
    mouse.x += (mouse.targetX - mouse.x) * 0.1
    mouse.y += (mouse.targetY - mouse.y) * 0.1

    // Clear frame with transparent background
    ctx.clearRect(0, 0, width, height)

    const isMobile = width < 768
    const connectionDist = isMobile ? 85 : 120
    const connectionDistSq = connectionDist * connectionDist

    // 1. Draw connecting constellation lines
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i]
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const distSq = dx * dx + dy * dy

        if (distSq < connectionDistSq) {
          const dist = Math.sqrt(distSq)
          const opacity = (1 - dist / connectionDist) * 0.12

          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(226, 241, 97, ${opacity})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      // Mouse interactive link
      if (mouse.x > 0) {
        const dx = p1.x - mouse.x
        const dy = p1.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouse.radius) {
          const opacity = (1 - dist / mouse.radius) * 0.25
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }
    }

    // 2. Update & Draw Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Position update
      p.x += p.vx
      p.y += p.vy

      // Screen wrapping
      if (p.x < -10) p.x = width + 10
      else if (p.x > width + 10) p.x = -10

      if (p.y < -10) p.y = height + 10
      else if (p.y > height + 10) p.y = -10

      // Soft twinkle pulsing
      p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed + p.pulseOffset) * (p.baseAlpha * 0.4)

      // Render star glow
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `${p.color}${Math.max(0.05, p.alpha)})`
      ctx.fill()
    }

    animationFrameId = requestAnimationFrame(render)
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    } else {
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(render)
      }
    }
  }

  onMounted(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    if (canvasRef.value) {
      ctx = canvasRef.value.getContext('2d', { alpha: true })
      resizeCanvas()

      window.addEventListener('resize', resizeCanvas, { passive: true })
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      window.addEventListener('mouseleave', handleMouseLeave, { passive: true })
      document.addEventListener('visibilitychange', handleVisibilityChange)

      animationFrameId = requestAnimationFrame(render)
    }
  })

  onUnmounted(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
    window.removeEventListener('resize', resizeCanvas)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
</script>

<template>
  <canvas
    ref="canvasRef"
    aria-hidden="true"
    class="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden"
  />
</template>
