<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'

  interface Particle {
    x: number
    y: number
    baseVx: number
    baseVy: number
    vx: number
    vy: number
    z: number // 3D depth layer: 0.25 (distant) to 1.0 (foreground)
    radius: number
    alpha: number
    baseAlpha: number
    color: string
    pulseOffset: number
    pulseSpeed: number
    waveFreq: number
  }

  interface Shockwave {
    x: number
    y: number
    radius: number
    maxRadius: number
    alpha: number
    lineWidth: number
    color: string
  }

  interface Spark {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    alpha: number
    color: string
    decay: number
  }

  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let animationFrameId: number | null = null
  let ctx: CanvasRenderingContext2D | null = null

  let width = 0
  let height = 0
  let dpr = 1
  let particles: Particle[] = []
  let shockwaves: Shockwave[] = []
  let sparks: Spark[] = []

  // Parallax Camera State (Mouse Offset + Scroll Offset)
  const camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    scrollY: 0,
    targetScrollY: 0,
  }

  // Mouse cursor tracking
  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    radius: 170,
  }

  const colors = [
    'rgba(226, 241, 97, ', // Lime glow
    'rgba(56, 189, 248, ', // Cyan glow
    'rgba(248, 250, 252, ', // White star
    'rgba(148, 163, 184, ', // Slate dust
  ]

  const sparkColors = ['rgba(226, 241, 97, ', 'rgba(56, 189, 248, ', 'rgba(255, 255, 255, ']

  function initParticles() {
    const isMobile = width < 768
    const particleCount = isMobile ? 40 : 85
    particles = []

    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      const z = Math.pow(Math.random(), 1.4) * 0.75 + 0.25
      const baseAlpha = z * 0.5 + 0.2
      const baseRadius = (z * 1.9 + 0.6) * (isMobile ? 0.85 : 1.0)

      // Continuous ambient drifting velocities (noticeable, elegant fluid movement)
      const angle = Math.random() * Math.PI * 2
      const speed = (0.25 + z * 0.45) * (isMobile ? 0.8 : 1.0)
      const baseVx = Math.cos(angle) * speed
      const baseVy = Math.sin(angle) * speed

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx,
        baseVy,
        vx: baseVx,
        vy: baseVy,
        z,
        radius: baseRadius,
        alpha: baseAlpha,
        baseAlpha,
        color,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        waveFreq: Math.random() * 0.0015 + 0.0008,
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

    // Tangible 3D mouse parallax offset relative to screen center
    const normalizedX = (e.clientX - width / 2) / (width / 2)
    const normalizedY = (e.clientY - height / 2) / (height / 2)

    camera.targetX = normalizedX * 50
    camera.targetY = normalizedY * 40
  }

  function handleMouseLeave() {
    mouse.targetX = -1000
    mouse.targetY = -1000
    camera.targetX = 0
    camera.targetY = 0
  }

  function handleScroll() {
    camera.targetScrollY = window.scrollY * 0.35
  }

  // Interactive Click: Triggers Supernova Shockwave & Spark Burst
  function handleClick(e: MouseEvent) {
    const clickX = e.clientX
    const clickY = e.clientY

    // 1. Add expanding dual shockwave rings
    shockwaves.push({
      x: clickX,
      y: clickY,
      radius: 5,
      maxRadius: 210,
      alpha: 0.9,
      lineWidth: 2.5,
      color: '226, 241, 97', // Lime
    })

    shockwaves.push({
      x: clickX,
      y: clickY,
      radius: 2,
      maxRadius: 160,
      alpha: 0.75,
      lineWidth: 1.5,
      color: '56, 189, 248', // Cyan
    })

    // 2. Spawn explosive spark particles
    const sparkCount = width < 768 ? 14 : 26
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 6.5 + 2.5
      const color = sparkColors[Math.floor(Math.random() * sparkColors.length)]

      sparks.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2.2 + 0.8,
        alpha: 1,
        color,
        decay: Math.random() * 0.025 + 0.015,
      })
    }

    // 3. Gravitational impulse push to nearby ambient particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const dx = p.x - clickX
      const dy = p.y - clickY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 260 && dist > 1) {
        const force = (1 - dist / 260) * 7.5 * p.z
        p.vx += (dx / dist) * force
        p.vy += (dy / dist) * force
      }
    }
  }

  function render(time: number) {
    if (!ctx) return

    // Smooth camera & mouse coordinates dampening
    camera.x += (camera.targetX - camera.x) * 0.05
    camera.y += (camera.targetY - camera.y) * 0.05
    camera.scrollY += (camera.targetScrollY - camera.scrollY) * 0.08

    mouse.x += (mouse.targetX - mouse.x) * 0.1
    mouse.y += (mouse.targetY - mouse.y) * 0.1

    // Clear frame with transparent background
    ctx.clearRect(0, 0, width, height)

    const isMobile = width < 768
    const connectionDist = isMobile ? 90 : 130
    const connectionDistSq = connectionDist * connectionDist

    // Calculate computed render positions for all particles based on 3D Parallax & Organic Wave
    const projected: Array<{ rx: number; ry: number; p: Particle }> = []

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Organic fluid wave oscillation added to continuous movement
      const waveX = Math.sin(time * p.waveFreq + p.pulseOffset) * (0.3 * p.z)
      const waveY = Math.cos(time * p.waveFreq * 1.1 + p.pulseOffset) * (0.25 * p.z)

      // Position update
      p.x += p.vx + waveX
      p.y += p.vy + waveY

      // Smooth recovery back to base drift velocity after mouse/click impulse
      p.vx += (p.baseVx - p.vx) * 0.02
      p.vy += (p.baseVy - p.vy) * 0.02

      // Screen wrapping for base positions
      if (p.x < -20) p.x = width + 20
      else if (p.x > width + 20) p.x = -20

      if (p.y < -20) p.y = height + 20
      else if (p.y > height + 20) p.y = -20

      // Calculate projected 3D coordinates based on depth (z), mouse shift, and scroll drift
      let rx = p.x + camera.x * p.z * 1.6
      let ry = p.y + camera.y * p.z * 1.6 - ((camera.scrollY * p.z * 0.6) % height)

      if (ry < -20) ry += height + 40
      if (ry > height + 20) ry -= height + 40
      if (rx < -20) rx += width + 40
      if (rx > width + 20) rx -= width + 40

      projected.push({ rx, ry, p })
    }

    // 1. Draw Constellation lines using projected positions
    for (let i = 0; i < projected.length; i++) {
      const p1 = projected[i]
      for (let j = i + 1; j < projected.length; j++) {
        const p2 = projected[j]

        // Connect particles on nearby depth layers
        if (Math.abs(p1.p.z - p2.p.z) > 0.45) continue

        const dx = p1.rx - p2.rx
        const dy = p1.ry - p2.ry
        const distSq = dx * dx + dy * dy

        if (distSq < connectionDistSq) {
          const dist = Math.sqrt(distSq)
          const depthAlpha = Math.min(p1.p.z, p2.p.z)
          const opacity = (1 - dist / connectionDist) * 0.18 * depthAlpha

          ctx.beginPath()
          ctx.moveTo(p1.rx, p1.ry)
          ctx.lineTo(p2.rx, p2.ry)
          ctx.strokeStyle = `rgba(226, 241, 97, ${opacity})`
          ctx.lineWidth = 0.5 + depthAlpha * 0.4
          ctx.stroke()
        }
      }

      // Mouse interactive beam connection
      if (mouse.x > 0) {
        const dx = p1.rx - mouse.x
        const dy = p1.ry - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < mouse.radius) {
          const opacity = (1 - dist / mouse.radius) * 0.35 * p1.p.z
          ctx.beginPath()
          ctx.moveTo(p1.rx, p1.ry)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`
          ctx.lineWidth = 0.9
          ctx.stroke()
        }
      }
    }

    // 2. Draw Stars/Particles using projected 3D positions
    for (let i = 0; i < projected.length; i++) {
      const { rx, ry, p } = projected[i]

      // Soft twinkle pulsing
      p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed + p.pulseOffset) * (p.baseAlpha * 0.35)

      ctx.beginPath()
      ctx.arc(rx, ry, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `${p.color}${Math.max(0.05, p.alpha)})`
      ctx.fill()
    }

    // 3. Update & Draw Click Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i]
      sw.radius += (sw.maxRadius - sw.radius) * 0.09
      sw.alpha *= 0.94

      if (sw.alpha <= 0.01 || sw.radius >= sw.maxRadius - 2) {
        shockwaves.splice(i, 1)
        continue
      }

      ctx.beginPath()
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${sw.color}, ${sw.alpha})`
      ctx.lineWidth = sw.lineWidth * (sw.alpha / 0.9)
      ctx.stroke()
    }

    // 4. Update & Draw Click Sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]
      s.x += s.vx
      s.y += s.vy
      s.vx *= 0.96
      s.vy *= 0.96
      s.alpha -= s.decay

      if (s.alpha <= 0) {
        sparks.splice(i, 1)
        continue
      }

      ctx.beginPath()
      ctx.arc(s.x, s.y, s.radius * s.alpha, 0, Math.PI * 2)
      ctx.fillStyle = `${s.color}${s.alpha})`
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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    if (canvasRef.value) {
      ctx = canvasRef.value.getContext('2d', { alpha: true })
      resizeCanvas()

      window.addEventListener('resize', resizeCanvas, { passive: true })
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      window.addEventListener('mouseleave', handleMouseLeave, { passive: true })
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('click', handleClick, { passive: true })
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
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('click', handleClick)
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
