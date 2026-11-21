import { useEffect, useRef } from "react"
import { useInView, useReducedMotion } from "motion/react"

type Star = { x: number; y: number; z: number }
type Enemy = { x: number; y: number; vx: number; vy: number; r: number; hue: number }
type Bullet = { x: number; y: number }
type Particle = { x: number; y: number; vx: number; vy: number; life: number; hue: number }

/**
 * A tiny self-playing top-down shooter rendered on a canvas.
 * Pauses when off-screen and renders a single still frame for reduced motion.
 */
export function MiniGame({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inView = useInView(canvasRef, { margin: "100px" })
  const reduceMotion = useReducedMotion()
  const state = useRef({
    stars: [] as Star[],
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    ship: { x: 0.5, target: 0.5 },
    score: 0,
    spawnIn: 0,
    fireIn: 0,
    time: 0,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const s = state.current

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      s.width = rect.width
      s.height = rect.height
      if (s.stars.length === 0) {
        s.stars = Array.from({ length: 70 }, () => ({
          x: Math.random(),
          y: Math.random(),
          z: Math.random() * 0.8 + 0.2,
        }))
      }
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const explode = (x: number, y: number, hue: number) => {
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 40 + Math.random() * 120
        s.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, hue })
      }
    }

    const update = (dt: number) => {
      const { width: w, height: h } = s
      s.time += dt

      for (const star of s.stars) {
        star.y += star.z * dt * 0.25
        if (star.y > 1) {
          star.y = 0
          star.x = Math.random()
        }
      }

      s.spawnIn -= dt
      if (s.spawnIn <= 0) {
        s.spawnIn = 0.55 + Math.random() * 0.5
        s.enemies.push({
          x: 20 + Math.random() * (w - 40),
          y: -20,
          vx: (Math.random() - 0.5) * 40,
          vy: 45 + Math.random() * 35,
          r: 7 + Math.random() * 5,
          hue: [330, 280, 25, 190][Math.floor(Math.random() * 4)],
        })
      }

      // Autopilot: chase the lowest enemy, with a gentle weave.
      const target = s.enemies.reduce<Enemy | null>((best, e) => (!best || e.y > best.y ? e : best), null)
      s.ship.target = target ? target.x / w : 0.5 + Math.sin(s.time * 0.8) * 0.25
      s.ship.x += (s.ship.target - s.ship.x) * Math.min(1, dt * 3)
      const shipX = s.ship.x * w
      const shipY = h - 34

      s.fireIn -= dt
      if (s.fireIn <= 0) {
        s.fireIn = 0.22
        s.bullets.push({ x: shipX, y: shipY - 14 })
      }

      for (const b of s.bullets) b.y -= 420 * dt
      s.bullets = s.bullets.filter((b) => b.y > -10)

      for (const e of s.enemies) {
        e.x += e.vx * dt
        e.y += e.vy * dt
        if (e.x < e.r || e.x > w - e.r) e.vx *= -1
      }

      s.enemies = s.enemies.filter((e) => {
        const hit = s.bullets.findIndex((b) => Math.hypot(b.x - e.x, b.y - e.y) < e.r + 3)
        if (hit !== -1) {
          s.bullets.splice(hit, 1)
          explode(e.x, e.y, e.hue)
          s.score += 100
          return false
        }
        return e.y < h + 20
      })

      for (const p of s.particles) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vx *= 0.96
        p.vy *= 0.96
        p.life -= dt * 1.6
      }
      s.particles = s.particles.filter((p) => p.life > 0)
    }

    const draw = () => {
      const { width: w, height: h } = s
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, "#05060f")
      bg.addColorStop(1, "#0b1030")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      for (const star of s.stars) {
        ctx.fillStyle = `rgba(255,255,255,${star.z * 0.8})`
        ctx.fillRect(star.x * w, star.y * h, star.z * 1.8, star.z * 1.8)
      }

      for (const e of s.enemies) {
        ctx.save()
        ctx.translate(e.x, e.y)
        ctx.rotate(s.time * 2)
        ctx.shadowColor = `hsl(${e.hue} 95% 60%)`
        ctx.shadowBlur = 14
        ctx.fillStyle = `hsl(${e.hue} 95% 62%)`
        ctx.beginPath()
        ctx.moveTo(0, -e.r)
        ctx.lineTo(e.r, 0)
        ctx.lineTo(0, e.r)
        ctx.lineTo(-e.r, 0)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      ctx.shadowColor = "#7dd3fc"
      ctx.shadowBlur = 10
      ctx.fillStyle = "#e0f2fe"
      for (const b of s.bullets) ctx.fillRect(b.x - 1.5, b.y - 6, 3, 10)

      for (const p of s.particles) {
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle = `hsl(${p.hue} 95% 65%)`
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3)
      }
      ctx.globalAlpha = 1

      const x = s.ship.x * w
      const y = h - 34
      const tilt = (s.ship.target - s.ship.x) * 2
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(Math.max(-0.35, Math.min(0.35, tilt)))
      const hull = ctx.createLinearGradient(0, -16, 0, 14)
      hull.addColorStop(0, "#60a5fa")
      hull.addColorStop(1, "#2563eb")
      ctx.shadowColor = "#3b82f6"
      ctx.shadowBlur = 18
      ctx.fillStyle = hull
      ctx.beginPath()
      ctx.moveTo(0, -16)
      ctx.lineTo(12, 12)
      ctx.lineTo(0, 6)
      ctx.lineTo(-12, 12)
      ctx.closePath()
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.fillStyle = `rgba(251,146,60,${0.6 + Math.sin(s.time * 40) * 0.3})`
      ctx.beginPath()
      ctx.moveTo(-4, 9)
      ctx.lineTo(0, 18 + Math.random() * 5)
      ctx.lineTo(4, 9)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      ctx.shadowBlur = 0

      ctx.fillStyle = "rgba(255,255,255,0.85)"
      ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
      ctx.fillText(`SCORE ${String(s.score).padStart(6, "0")}`, 14, 22)
      ctx.fillStyle = "rgba(255,255,255,0.45)"
      ctx.fillText("AUTOPILOT", w - 80, 22)
    }

    if (reduceMotion || !inView) {
      // Warm up a few seconds of simulation so the still frame looks alive.
      if (s.time === 0) for (let i = 0; i < 240; i++) update(1 / 60)
      draw()
      return () => observer.disconnect()
    }

    let frame = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      update(dt)
      draw()
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [inView, reduceMotion])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
