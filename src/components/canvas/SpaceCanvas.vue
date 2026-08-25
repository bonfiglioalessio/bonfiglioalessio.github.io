<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useAudioSynth } from '../../composables/useAudioSynth'

  interface Star3D {
    x: number // -width/2 to width/2
    y: number // -height/2 to height/2
    z: number // 10 to 1000 depth
    vz: number // slow drift through depth
    vx: number
    vy: number
    radius: number
    baseAlpha: number
    color: string
    pulseOffset: number
    pulseSpeed: number
  }

  interface Shockwave3D {
    x: number
    y: number
    z: number
    radius: number
    maxRadius: number
    alpha: number
    color: string
  }

  interface Spark3D {
    x: number
    y: number
    z: number
    vx: number
    vy: number
    vz: number
    radius: number
    alpha: number
    color: string
    decay: number
  }

  interface MeteorStreak {
    x: number
    y: number
    length: number
    speed: number
    angle: number
    vx: number
    vy: number
    alpha: number
    color: string
    tailColor: string
    decay: number
    width: number
  }

  const bgCanvasRef = ref<HTMLCanvasElement | null>(null)
  const fgCanvasRef = ref<HTMLCanvasElement | null>(null)
  let animationFrameId: number | null = null
  let ctxBg: CanvasRenderingContext2D | null = null
  let ctxFg: CanvasRenderingContext2D | null = null

  let width = 0
  let height = 0
  let dpr = 1
  const fov = 450
  const maxDepth = 1000

  let stars: Star3D[] = []
  let shockwaves: Shockwave3D[] = []
  let sparks: Spark3D[] = []
  const meteors: MeteorStreak[] = []
  let nextMeteorTime = performance.now() + 2500

  // 3D Camera Orbit & Perspective Angles
  const camera = {
    rotX: 0,
    rotY: 0,
    targetRotX: 0,
    targetRotY: 0,
    panX: 0,
    panY: 0,
    targetPanX: 0,
    targetPanY: 0,
    scrollY: 0,
    targetScrollY: 0,
  }

  // Mouse screen coordinates
  const mouse = {
    screenX: -1000,
    screenY: -1000,
    targetX: -1000,
    targetY: -1000,
    radius: 160,
  }

  const colors = [
    'rgba(226, 241, 97, ', // Vivid Lime
    'rgba(56, 189, 248, ', // Vivid Cyan
    'rgba(255, 255, 255, ', // Crisp White
    'rgba(203, 213, 225, ', // Slate Dust
  ]

  const sparkColors = ['rgba(226, 241, 97, ', 'rgba(56, 189, 248, ', 'rgba(255, 255, 255, ']

  function initStars() {
    const isMobile = width < 768
    const starCount = isMobile ? 55 : 110
    stars = []

    for (let i = 0; i < starCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      const z = Math.random() * (maxDepth - 50) + 50
      const baseAlpha = Math.random() * 0.4 + 0.55

      // Natural gentle 3D drift
      stars.push({
        x: (Math.random() - 0.5) * (width * 1.5),
        y: (Math.random() - 0.5) * (height * 1.5),
        z,
        vz: -(Math.random() * 0.25 + 0.1), // Slow forward cruise through space
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        radius: Math.random() * 1.4 + 0.8,
        baseAlpha,
        color,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      })
    }
  }

  function resizeCanvas() {
    if (!bgCanvasRef.value) return
    width = window.innerWidth
    height = window.innerHeight
    dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Resize Background Canvas
    bgCanvasRef.value.width = width * dpr
    bgCanvasRef.value.height = height * dpr
    bgCanvasRef.value.style.width = `${width}px`
    bgCanvasRef.value.style.height = `${height}px`
    if (ctxBg) {
      ctxBg.setTransform(1, 0, 0, 1, 0, 0)
      ctxBg.scale(dpr, dpr)
    }

    // Resize Foreground Comet Canvas
    if (fgCanvasRef.value) {
      fgCanvasRef.value.width = width * dpr
      fgCanvasRef.value.height = height * dpr
      fgCanvasRef.value.style.width = `${width}px`
      fgCanvasRef.value.style.height = `${height}px`
      if (ctxFg) {
        ctxFg.setTransform(1, 0, 0, 1, 0, 0)
        ctxFg.scale(dpr, dpr)
      }
    }

    if (stars.length === 0) {
      initStars()
    }
  }

  function handleMouseMove(e: MouseEvent) {
    mouse.targetX = e.clientX
    mouse.targetY = e.clientY

    // Convert mouse to normalized [-1, 1] for 3D camera parallax tilt
    const normX = (e.clientX / width - 0.5) * 2
    const normY = (e.clientY / height - 0.5) * 2

    camera.targetRotY = normX * 0.07 // subtle horizontal tilt
    camera.targetRotX = -normY * 0.07 // subtle vertical tilt
    camera.targetPanX = -normX * 45 // 3D camera panning
    camera.targetPanY = -normY * 45
  }

  function handleMouseLeave() {
    mouse.targetX = -1000
    mouse.targetY = -1000
    camera.targetRotX = 0
    camera.targetRotY = 0
    camera.targetPanX = 0
    camera.targetPanY = 0
  }

  function handleScroll() {
    camera.targetScrollY = window.scrollY
  }

  function triggerShockwave(
    screenX: number,
    screenY: number,
    intensity = 1,
    color = '226, 241, 97',
  ) {
    // Unproject screen coordinate into 3D world space at medium depth (z = 400)
    const z = 350
    const scale = fov / (fov + z)
    const centerX = width / 2
    const centerY = height / 2

    const worldX = (screenX - centerX - camera.panX * scale) / scale
    const worldY = (screenY - centerY - camera.panY * scale) / scale

    shockwaves.push({
      x: worldX,
      y: worldY,
      z,
      radius: 5,
      maxRadius: 180 * intensity,
      alpha: 0.9,
      color,
    })

    // Spawn 3D directional sparks
    const sparkCount = Math.floor(18 * intensity)
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 5 + 2
      const c = sparkColors[Math.floor(Math.random() * sparkColors.length)]

      sparks.push({
        x: worldX,
        y: worldY,
        z,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: (Math.random() - 0.5) * 4,
        radius: Math.random() * 2 + 1,
        alpha: 1,
        color: c,
        decay: Math.random() * 0.02 + 0.015,
      })
    }
  }

  const { playSupernova } = useAudioSynth()

  function handleClick(e: MouseEvent) {
    // Only trigger if not clicking interactive UI buttons or links
    const target = e.target as HTMLElement
    if (target.closest('button, a, input, textarea, select, [role="button"], pre')) {
      return
    }

    triggerShockwave(e.clientX, e.clientY, 1, '226, 241, 97')
    playSupernova()
  }

  function handleCustomSupernova(e: Event) {
    const custom = e as CustomEvent<{
      x: number
      y: number
      intensity?: number
      color?: string
    }>
    if (custom.detail) {
      triggerShockwave(
        custom.detail.x,
        custom.detail.y,
        custom.detail.intensity || 1.5,
        custom.detail.color || '56, 189, 248',
      )
    }
  }

  function render(time: number) {
    if (!ctxBg) return

    // 1. Smooth Camera Dampening (Inertial Easing)
    camera.rotX += (camera.targetRotX - camera.rotX) * 0.05
    camera.rotY += (camera.targetRotY - camera.rotY) * 0.05
    camera.panX += (camera.targetPanX - camera.panX) * 0.05
    camera.panY += (camera.targetPanY - camera.panY) * 0.05
    camera.scrollY += (camera.targetScrollY - camera.scrollY) * 0.08
    mouse.screenX += (mouse.targetX - mouse.screenX) * 0.12
    mouse.screenY += (mouse.targetY - mouse.screenY) * 0.12

    // Clear Background Layer Canvas (z-0)
    ctxBg.clearRect(0, 0, width, height)

    // Clear Foreground Comet Canvas (z-30)
    if (ctxFg) {
      ctxFg.clearRect(0, 0, width, height)
    }

    const centerX = width / 2
    const centerY = height / 2
    const cosY = Math.cos(camera.rotY)
    const sinY = Math.sin(camera.rotY)
    const cosX = Math.cos(camera.rotX)
    const sinX = Math.sin(camera.rotX)

    // Dynamic scroll warp factor (speed up forward drift on rapid scroll)
    const scrollDelta = Math.abs(camera.targetScrollY - camera.scrollY)
    const warpBoost = Math.min(scrollDelta * 0.06, 6)

    // 2. Update & Draw 3D Stars with Perspective Projection on Background Layer
    const projectedStars: {
      sx: number
      sy: number
      size: number
      alpha: number
      color: string
      z: number
    }[] = []

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i]

      // Natural forward drift + scroll warp
      star.z += star.vz - warpBoost
      star.x += star.vx
      star.y += star.vy

      // Depth boundary recycling
      if (star.z < 10) {
        star.z = maxDepth
        star.x = (Math.random() - 0.5) * (width * 1.5)
        star.y = (Math.random() - 0.5) * (height * 1.5)
      } else if (star.z > maxDepth) {
        star.z = 10
      }

      // 3D Camera Rotation Matrix (Pitch & Yaw)
      let x1 = star.x * cosY - star.z * sinY
      let z1 = star.z * cosY + star.x * sinY
      let y1 = star.y * cosX - z1 * sinX
      let z2 = z1 * cosX + star.y * sinX

      if (z2 <= 5) continue

      // Perspective Projection
      const scale = fov / (fov + z2)
      const screenX = centerX + x1 * scale + camera.panX * scale
      const screenY = centerY + y1 * scale + camera.panY * scale

      // Mouse Gravitational Repulsion Field
      const dx = mouse.screenX - screenX
      const dy = mouse.screenY - screenY
      const dist = Math.sqrt(dx * dx + dy * dy)
      let mouseShiftX = 0
      let mouseShiftY = 0
      let mouseGlowBoost = 0

      if (dist < mouse.radius && dist > 0) {
        const force = (1 - dist / mouse.radius) * 35 * scale
        mouseShiftX = -(dx / dist) * force
        mouseShiftY = -(dy / dist) * force
        mouseGlowBoost = (1 - dist / mouse.radius) * 0.5
      }

      const finalX = screenX + mouseShiftX
      const finalY = screenY + mouseShiftY

      if (finalX < -50 || finalX > width + 50 || finalY < -50 || finalY > height + 50) continue

      // Depth fading + Harmonic Twinkle Pulse
      const depthAlpha = Math.max(0, 1 - z2 / maxDepth)
      const twinkle = Math.sin(time * star.pulseSpeed + star.pulseOffset) * 0.25 + 0.75
      const finalAlpha = Math.min(
        1,
        (star.baseAlpha * depthAlpha * twinkle + mouseGlowBoost) * scale * 1.4,
      )
      const finalRadius = Math.max(0.5, star.radius * scale * (1 + mouseGlowBoost * 0.5))

      projectedStars.push({
        sx: finalX,
        sy: finalY,
        size: finalRadius,
        alpha: finalAlpha,
        color: star.color,
        z: z2,
      })

      // Draw Star Body on Background Layer
      ctxBg.beginPath()
      ctxBg.arc(finalX, finalY, finalRadius, 0, Math.PI * 2)
      ctxBg.fillStyle = `${star.color}${finalAlpha})`
      ctxBg.fill()

      // High-intensity foreground stars get atmospheric lens glow
      if (z2 < 220 && finalAlpha > 0.6) {
        ctxBg.beginPath()
        ctxBg.arc(finalX, finalY, finalRadius * 3.5, 0, Math.PI * 2)
        ctxBg.fillStyle = `${star.color}${finalAlpha * 0.15})`
        ctxBg.fill()
      }
    }

    // 3. Constellation Micro-Lines Between Neighboring Stars (Depth-Matched)
    const maxLinkDist = width < 768 ? 65 : 85
    const linkLimit = width < 768 ? 1 : 2

    for (let i = 0; i < projectedStars.length; i++) {
      let connections = 0
      const p1 = projectedStars[i]

      for (let j = i + 1; j < projectedStars.length && connections < linkLimit; j++) {
        const p2 = projectedStars[j]
        const zDiff = Math.abs(p1.z - p2.z)

        if (zDiff > 140) continue

        const ldx = p1.sx - p2.sx
        const ldy = p1.sy - p2.sy
        const ldist = Math.sqrt(ldx * ldx + ldy * ldy)

        if (ldist < maxLinkDist) {
          const lineAlpha =
            (1 - ldist / maxLinkDist) * Math.min(p1.alpha, p2.alpha) * 0.22 * (1 - zDiff / 140)

          if (lineAlpha > 0.02) {
            ctxBg.beginPath()
            ctxBg.moveTo(p1.sx, p1.sy)
            ctxBg.lineTo(p2.sx, p2.sy)
            ctxBg.strokeStyle = `rgba(226, 241, 97, ${lineAlpha})`
            ctxBg.lineWidth = 0.6
            ctxBg.stroke()
            connections++
          }
        }
      }
    }

    // 4. Update & Draw 3D Celestial Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i]
      sw.radius += 4.5
      sw.alpha -= 0.02

      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(i, 1)
        continue
      }

      const scale = fov / (fov + sw.z)
      const sx = centerX + sw.x * scale + camera.panX * scale
      const sy = centerY + sw.y * scale + camera.panY * scale
      const r = sw.radius * scale

      ctxBg.beginPath()
      ctxBg.arc(sx, sy, r, 0, Math.PI * 2)
      ctxBg.strokeStyle = `rgba(${sw.color}, ${sw.alpha * scale})`
      ctxBg.lineWidth = Math.max(0.8, 2.5 * scale * (sw.alpha / 0.9))
      ctxBg.stroke()
    }

    // 5. Update & Draw 3D Click Sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]
      s.x += s.vx
      s.y += s.vy
      s.z += s.vz
      s.vx *= 0.96
      s.vy *= 0.96
      s.vz *= 0.96
      s.alpha -= s.decay

      if (s.alpha <= 0 || s.z <= 10) {
        sparks.splice(i, 1)
        continue
      }

      const scale = fov / (fov + s.z)
      const sx = centerX + s.x * scale + camera.panX * scale
      const sy = centerY + s.y * scale + camera.panY * scale

      ctxBg.beginPath()
      ctxBg.arc(sx, sy, Math.max(0.5, s.radius * scale * s.alpha), 0, Math.PI * 2)
      ctxBg.fillStyle = `${s.color}${s.alpha * scale})`
      ctxBg.fill()
    }

    // --- Dynamic Shooting Stars & Meteor Trails on Foreground Layer (z-30) ---
    const now = performance.now()
    if (now > nextMeteorTime) {
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.35 // ~45 deg diagonal flight
      const speed = 12 + Math.random() * 8
      const length = 120 + Math.random() * 140
      const colors = [
        { head: '#ffffff', tail: 'rgba(226, 241, 97, 0.85)' }, // Lime
        { head: '#ffffff', tail: 'rgba(52, 211, 153, 0.85)' }, // Emerald
        { head: '#ffffff', tail: 'rgba(56, 189, 248, 0.85)' }, // Cyan
        { head: '#ffffff', tail: 'rgba(255, 255, 255, 0.95)' }, // White
      ]
      const colorPair = colors[Math.floor(Math.random() * colors.length)]

      meteors.push({
        x: Math.random() * (width * 0.9) - width * 0.05,
        y: Math.random() * (height * 0.4) - height * 0.1,
        length,
        speed,
        angle,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 0.95,
        color: colorPair.head,
        tailColor: colorPair.tail,
        decay: 0.012 + Math.random() * 0.008,
        width: 1.5 + Math.random() * 1.2,
      })

      nextMeteorTime = now + (6000 + Math.random() * 8000) // Next meteor in 6-14 seconds
    }

    if (ctxFg) {
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.x += m.vx
        m.y += m.vy
        m.alpha -= m.decay

        if (m.alpha <= 0 || m.x > width + 250 || m.y > height + 250) {
          meteors.splice(i, 1)
          continue
        }

        const tailX = m.x - Math.cos(m.angle) * m.length
        const tailY = m.y - Math.sin(m.angle) * m.length

        const gradient = ctxFg.createLinearGradient(tailX, tailY, m.x, m.y)
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
        gradient.addColorStop(0.7, m.tailColor.replace('0.85', (m.alpha * 0.75).toString()))
        gradient.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`)

        ctxFg.save()
        ctxFg.strokeStyle = gradient
        ctxFg.lineWidth = m.width
        ctxFg.lineCap = 'round'
        ctxFg.beginPath()
        ctxFg.moveTo(tailX, tailY)
        ctxFg.lineTo(m.x, m.y)
        ctxFg.stroke()

        // High-intensity head light orb
        ctxFg.fillStyle = `rgba(255, 255, 255, ${m.alpha})`
        ctxFg.shadowColor = m.tailColor
        ctxFg.shadowBlur = 12
        ctxFg.beginPath()
        ctxFg.arc(m.x, m.y, m.width * 0.9, 0, Math.PI * 2)
        ctxFg.fill()
        ctxFg.restore()
      }
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

    if (bgCanvasRef.value && fgCanvasRef.value) {
      ctxBg = bgCanvasRef.value.getContext('2d', { alpha: true })
      ctxFg = fgCanvasRef.value.getContext('2d', { alpha: true })
      resizeCanvas()

      window.addEventListener('resize', resizeCanvas, { passive: true })
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      window.addEventListener('mouseleave', handleMouseLeave, {
        passive: true,
      })
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('click', handleClick, { passive: true })
      window.addEventListener('space-supernova-event', handleCustomSupernova)
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
    window.removeEventListener('space-supernova-event', handleCustomSupernova)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
</script>

<template>
  <!-- Background Deep Starfield & 3D Celestial Shockwaves Layer (z-0) -->
  <canvas
    ref="bgCanvasRef"
    aria-hidden="true"
    class="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden"
  />

  <!-- Foreground Cosmic Meteor Showers & Shooting Stars Layer (z-30, in front of content cards, below navbar z-50) -->
  <canvas
    ref="fgCanvasRef"
    aria-hidden="true"
    class="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden"
  />
</template>
