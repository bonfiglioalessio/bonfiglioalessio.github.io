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

  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let animationFrameId: number | null = null
  let ctx: CanvasRenderingContext2D | null = null

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
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.8 + 1.2,
        baseAlpha,
        color,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.008,
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

    initStars()
  }

  const { playSupernova, playParticleShimmer } = useAudioSynth()

  function handleMouseMove(e: MouseEvent) {
    playParticleShimmer()
    mouse.targetX = e.clientX
    mouse.targetY = e.clientY

    // 3D Camera Orbit: Tilts angular perspective in space
    const normX = (e.clientX - width / 2) / (width / 2)
    const normY = (e.clientY - height / 2) / (height / 2)

    camera.targetRotY = normX * 0.18 // Yaw rotation in radians
    camera.targetRotX = -normY * 0.14 // Pitch rotation in radians

    camera.targetPanX = -normX * 40
    camera.targetPanY = -normY * 30
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
    camera.targetScrollY = window.scrollY * 0.35
  }

  function triggerSupernovaExplosion(worldX = 0, worldY = 0, clickZ = 250) {
    // 1. Expanding 3D Shockwave rings
    shockwaves.push({
      x: worldX,
      y: worldY,
      z: clickZ,
      radius: 10,
      maxRadius: 320,
      alpha: 0.95,
      color: '226, 241, 97',
    })

    shockwaves.push({
      x: worldX,
      y: worldY,
      z: clickZ,
      radius: 5,
      maxRadius: 240,
      alpha: 0.8,
      color: '56, 189, 248',
    })

    // 2. 3D Explosive Sparks in spherical directions
    const count = width < 768 ? 18 : 34
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const speed = Math.random() * 7.5 + 2.5
      const color = sparkColors[Math.floor(Math.random() * sparkColors.length)]

      sparks.push({
        x: worldX,
        y: worldY,
        z: clickZ,
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.sin(phi) * Math.sin(theta) * speed,
        vz: Math.cos(phi) * speed * 0.8,
        radius: Math.random() * 2.4 + 1.0,
        alpha: 1,
        color,
        decay: Math.random() * 0.022 + 0.012,
      })
    }

    // 3. Volumetric 3D impulse push to nearby stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]
      const dx = s.x - worldX
      const dy = s.y - worldY
      const dz = s.z - clickZ
      const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (dist3D < 380 && dist3D > 1) {
        const force = (1 - dist3D / 380) * 10.0
        s.vx += (dx / dist3D) * force
        s.vy += (dy / dist3D) * force
        s.vz += (dz / dist3D) * force * 0.6
      }
    }
  }

  // 3D Supernova Click Event
  function handleClick(e: MouseEvent) {
    playSupernova()
    const clickScreenX = e.clientX - width / 2
    const clickScreenY = e.clientY - height / 2

    // Unproject to a 3D mid-plane (z = 250)
    const clickZ = 250
    const scale = (fov + clickZ) / fov
    const worldX = clickScreenX * scale
    const worldY = clickScreenY * scale

    triggerSupernovaExplosion(worldX, worldY, clickZ)
  }

  function handleCustomSupernova() {
    triggerSupernovaExplosion((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, 200)
  }

  function render(time: number) {
    if (!ctx) return

    // Smooth camera rotation & position dampening
    camera.rotX += (camera.targetRotX - camera.rotX) * 0.04
    camera.rotY += (camera.targetRotY - camera.rotY) * 0.04
    camera.panX += (camera.targetPanX - camera.panX) * 0.05
    camera.panY += (camera.targetPanY - camera.panY) * 0.05
    camera.scrollY += (camera.targetScrollY - camera.scrollY) * 0.06

    mouse.screenX += (mouse.targetX - mouse.screenX) * 0.08
    mouse.screenY += (mouse.targetY - mouse.screenY) * 0.08

    ctx.clearRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2

    const cosY = Math.cos(camera.rotY)
    const sinY = Math.sin(camera.rotY)
    const cosX = Math.cos(camera.rotX)
    const sinX = Math.sin(camera.rotX)

    interface ProjectedStar {
      sx: number
      sy: number
      scale: number
      alpha: number
      radius: number
      color: string
      worldZ: number
      s: Star3D
    }

    const projected: ProjectedStar[] = []

    // 1. Update 3D Stars & Project to 2D Screen with 3D Rotation Matrix
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]

      // Natural continuous 3D drift + friction recovery
      s.x += s.vx
      s.y += s.vy
      s.z += s.vz
      s.vx *= 0.985
      s.vy *= 0.985
      s.vz = s.vz * 0.985 - 0.05 // Maintain slow forward drift

      // Screen/Depth 3D Wrapping
      const boundaryX = width * 0.9
      const boundaryY = height * 0.9

      if (s.z < 20) {
        s.z = maxDepth
        s.x = (Math.random() - 0.5) * boundaryX * 2
        s.y = (Math.random() - 0.5) * boundaryY * 2
      } else if (s.z > maxDepth) {
        s.z = 20
      }

      if (s.x < -boundaryX) s.x = boundaryX
      else if (s.x > boundaryX) s.x = -boundaryX

      if (s.y < -boundaryY) s.y = boundaryY
      else if (s.y > boundaryY) s.y = -boundaryY

      // Apply 3D Scroll vertical offset
      const adjustedY = s.y - ((camera.scrollY * 0.5) % (boundaryY * 2))

      // Apply 3D Camera Rotation (Yaw around Y-axis, Pitch around X-axis)
      // 1. Rotate Y (yaw)
      const x1 = s.x * cosY + s.z * sinY
      const z1 = -s.x * sinY + s.z * cosY

      // 2. Rotate X (pitch)
      const y2 = adjustedY * cosX - z1 * sinX
      const z2 = adjustedY * sinX + z1 * cosX

      // Check if star is in front of camera
      if (z2 <= 5) continue

      // True 3D Perspective Projection
      const scale = fov / (fov + z2)
      const sx = centerX + (x1 + camera.panX) * scale
      const sy = centerY + (y2 + camera.panY) * scale

      // Depth-based fade & sizing
      const depthFactor = Math.max(0, 1 - z2 / maxDepth)
      const pulse = Math.sin(time * s.pulseSpeed + s.pulseOffset) * (s.baseAlpha * 0.25)
      const alpha = Math.min(1, Math.max(0.08, (s.baseAlpha + pulse) * (0.3 + depthFactor * 0.7)))
      const renderedRadius = Math.max(0.6, s.radius * scale * 1.6)

      projected.push({
        sx,
        sy,
        scale,
        alpha,
        radius: renderedRadius,
        color: s.color,
        worldZ: z2,
        s,
      })
    }

    // 2. Draw 3D Volumetric Constellation Lines with Smooth Fade-In/Out
    const isMobile = width < 768
    const connectionDist3D = isMobile ? 130 : 180
    const connectionDist3DSq = connectionDist3D * connectionDist3D

    for (let i = 0; i < projected.length; i++) {
      const p1 = projected[i]
      for (let j = i + 1; j < projected.length; j++) {
        const p2 = projected[j]

        // Check TRUE 3D Euclidean distance between stars in world space
        const dx = p1.s.x - p2.s.x
        const dy = p1.s.y - p2.s.y
        const dz = p1.s.z - p2.s.z
        const distSq3D = dx * dx + dy * dy + dz * dz

        if (distSq3D < connectionDist3DSq) {
          const dist3D = Math.sqrt(distSq3D)
          const normDist = dist3D / connectionDist3D
          // Smooth cosine fade-in and fade-out
          const smoothFade = (Math.cos(normDist * Math.PI) + 1) * 0.5
          const avgScale = (p1.scale + p2.scale) * 0.5
          const opacity = smoothFade * 0.08 * avgScale

          if (opacity > 0.003) {
            ctx.beginPath()
            ctx.moveTo(p1.sx, p1.sy)
            ctx.lineTo(p2.sx, p2.sy)
            ctx.strokeStyle = `rgba(226, 241, 97, ${opacity})`
            ctx.lineWidth = Math.max(0.3, 0.6 * avgScale)
            ctx.stroke()
          }
        }
      }

      // Mouse interactive 3D beam connection with soft fade
      if (mouse.screenX > 0) {
        const dx = p1.sx - mouse.screenX
        const dy = p1.sy - mouse.screenY
        const dist2D = Math.sqrt(dx * dx + dy * dy)

        if (dist2D < mouse.radius) {
          const normDist = dist2D / mouse.radius
          const smoothFade = (Math.cos(normDist * Math.PI) + 1) * 0.5
          const opacity = smoothFade * 0.14 * p1.scale

          if (opacity > 0.004) {
            ctx.beginPath()
            ctx.moveTo(p1.sx, p1.sy)
            ctx.lineTo(mouse.screenX, mouse.screenY)
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`
            ctx.lineWidth = Math.max(0.4, 0.7 * p1.scale)
            ctx.stroke()
          }
        }
      }
    }

    // 3. Draw 3D Stars
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i]

      ctx.beginPath()
      ctx.arc(p.sx, p.sy, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `${p.color}${p.alpha})`
      ctx.fill()
    }

    // 4. Update & Draw 3D Click Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i]
      sw.radius += (sw.maxRadius - sw.radius) * 0.09
      sw.alpha *= 0.94

      if (sw.alpha <= 0.01 || sw.radius >= sw.maxRadius - 2) {
        shockwaves.splice(i, 1)
        continue
      }

      const scale = fov / (fov + sw.z)
      const sx = centerX + sw.x * scale + camera.panX * scale
      const sy = centerY + sw.y * scale + camera.panY * scale
      const r = sw.radius * scale

      ctx.beginPath()
      ctx.arc(sx, sy, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${sw.color}, ${sw.alpha * scale})`
      ctx.lineWidth = Math.max(0.8, 2.5 * scale * (sw.alpha / 0.9))
      ctx.stroke()
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

      ctx.beginPath()
      ctx.arc(sx, sy, Math.max(0.5, s.radius * scale * s.alpha), 0, Math.PI * 2)
      ctx.fillStyle = `${s.color}${s.alpha * scale})`
      ctx.fill()
    }

    // --- Dynamic Shooting Stars & Meteor Trails ---
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

      const gradient = ctx.createLinearGradient(tailX, tailY, m.x, m.y)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      gradient.addColorStop(0.7, m.tailColor.replace('0.85', (m.alpha * 0.75).toString()))
      gradient.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`)

      ctx.save()
      ctx.strokeStyle = gradient
      ctx.lineWidth = m.width
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(m.x, m.y)
      ctx.stroke()

      // High-intensity head light orb
      ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`
      ctx.shadowColor = m.tailColor
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(m.x, m.y, m.width * 0.9, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
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
  <canvas
    ref="canvasRef"
    aria-hidden="true"
    class="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden"
  />
</template>
