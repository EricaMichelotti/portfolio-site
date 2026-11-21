import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import { useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type Star = { x: number; y: number; z: number }
type Enemy = { x: number; y: number; vx: number; vy: number; r: number; hue: number }
type Bullet = { x: number; y: number }
type Particle = { x: number; y: number; vx: number; vy: number; life: number; hue: number }

export type GameMode = "auto" | "player"

/** Seconds without input before the autopilot takes back over. */
const IDLE_TIMEOUT = 2.5
const KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "a", "d", "w", "s"])

/**
 * A tiny top-down shooter on a canvas. It flies itself until someone points at it:
 * then the ship follows the mouse (or finger, or arrow keys) and enemies can hit you.
 * Pauses when off-screen and renders a single still frame for reduced motion.
 */
export function MiniGame({
  className,
  onModeChange,
}: {
  className?: string
  onModeChange?: (mode: GameMode) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inView = useInView(canvasRef, { margin: "100px" })
  const reduceMotion = useReducedMotion()
  const [mode, setMode] = useState<GameMode>("auto")
  const state = useRef({
    stars: [] as Star[],
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    ship: { x: 0.5, y: 0.85, targetX: 0.5, targetY: 0.85 },
    mode: "auto" as GameMode,
    idle: 0,
    keys: new Set<string>(),
    invulnerable: 0,
    flash: 0,
    score: 0,
    best: 0,
    spawnIn: 0,
    fireIn: 0,
    time: 0,
    width: 0,
    height: 0,
  })

  const changeMode = (next: GameMode) => {
    const s = state.current
    if (s.mode === next) return
    s.mode = next
    if (next === "player") {
      s.score = 0
      s.invulnerable = 1
    }
    setMode(next)
    onModeChange?.(next)
  }

  const steer = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const s = state.current
    s.ship.targetX = (event.clientX - rect.left) / rect.width
    s.ship.targetY = (event.clientY - rect.top) / rect.height
    s.idle = 0
    changeMode("player")
  }

  const onKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (!KEYS.has(event.key)) return
    event.preventDefault()
    state.current.keys.add(event.key)
    state.current.idle = 0
    changeMode("player")
  }

  const onKeyUp = (event: KeyboardEvent<HTMLCanvasElement>) => {
    state.current.keys.delete(event.key)
  }

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

    const explode = (x: number, y: number, hue: number, count = 14) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 40 + Math.random() * 140
        s.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, hue })
      }
    }

    const update = (dt: number) => {
      const { width: w, height: h } = s
      s.time += dt
      s.invulnerable = Math.max(0, s.invulnerable - dt)
      s.flash = Math.max(0, s.flash - dt * 2)

      if (s.mode === "player") {
        s.idle += dt
        if (s.idle > IDLE_TIMEOUT) changeMode("auto")
      }

      for (const star of s.stars) {
        star.y += star.z * dt * 0.25
        if (star.y > 1) {
          star.y = 0
          star.x = Math.random()
        }
      }

      // Enemies come a little faster as your score climbs.
      const pressure = s.mode === "player" ? Math.min(0.35, s.score / 20000) : 0
      s.spawnIn -= dt
      if (s.spawnIn <= 0) {
        s.spawnIn = 0.55 - pressure + Math.random() * 0.5
        s.enemies.push({
          x: 20 + Math.random() * (w - 40),
          y: -20,
          vx: (Math.random() - 0.5) * 40,
          vy: 45 + Math.random() * 35 + pressure * 120,
          r: 7 + Math.random() * 5,
          hue: [330, 280, 25, 190][Math.floor(Math.random() * 4)],
        })
      }

      if (s.mode === "auto") {
        // Autopilot: chase the lowest enemy, with a gentle weave.
        const target = s.enemies.reduce<Enemy | null>((best, e) => (!best || e.y > best.y ? e : best), null)
        s.ship.targetX = target ? target.x / w : 0.5 + Math.sin(s.time * 0.8) * 0.25
        s.ship.targetY = 0.85
      } else if (s.keys.size > 0) {
        const k = s.keys
        const speed = 0.9 * dt
        if (k.has("ArrowLeft") || k.has("a")) s.ship.targetX = s.ship.x - speed * 4
        if (k.has("ArrowRight") || k.has("d")) s.ship.targetX = s.ship.x + speed * 4
        if (k.has("ArrowUp") || k.has("w")) s.ship.targetY = s.ship.y - speed * 4
        if (k.has("ArrowDown") || k.has("s")) s.ship.targetY = s.ship.y + speed * 4
        s.idle = 0
      }

      const minX = 16 / w
      const minY = 0.3
      const maxY = (h - 20) / h
      s.ship.targetX = Math.min(1 - minX, Math.max(minX, s.ship.targetX))
      s.ship.targetY = Math.min(maxY, Math.max(minY, s.ship.targetY))
      const follow = Math.min(1, dt * (s.mode === "player" ? 14 : 3))
      s.ship.x += (s.ship.targetX - s.ship.x) * follow
      s.ship.y += (s.ship.targetY - s.ship.y) * follow
      const shipX = s.ship.x * w
      const shipY = s.ship.y * h

      s.fireIn -= dt
      if (s.fireIn <= 0) {
        s.fireIn = s.mode === "player" ? 0.16 : 0.22
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
          if (s.mode === "player") s.best = Math.max(s.best, s.score)
          return false
        }
        // Only a human pilot can crash.
        if (s.mode === "player" && s.invulnerable === 0 && Math.hypot(shipX - e.x, shipY - e.y) < e.r + 10) {
          explode(e.x, e.y, e.hue)
          explode(shipX, shipY, 215, 28)
          s.score = 0
          s.invulnerable = 1.5
          s.flash = 1
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

      if (s.flash > 0) {
        ctx.fillStyle = `rgba(244,63,94,${s.flash * 0.25})`
        ctx.fillRect(0, 0, w, h)
      }

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

      // Blink while invulnerable after a crash.
      const visible = s.invulnerable === 0 || s.mode === "auto" || Math.floor(s.time * 12) % 2 === 0
      if (visible) {
        const x = s.ship.x * w
        const y = s.ship.y * h
        const tilt = (s.ship.targetX - s.ship.x) * 2
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
      }
      ctx.shadowBlur = 0

      ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
      ctx.fillStyle = "rgba(255,255,255,0.85)"
      ctx.fillText(`SCORE ${String(s.score).padStart(6, "0")}`, 14, 22)
      if (s.best > 0) {
        ctx.fillStyle = "rgba(255,255,255,0.45)"
        ctx.fillText(`BEST ${String(s.best).padStart(6, "0")}`, 14, 38)
      }
      const label = s.mode === "player" ? "PLAYER 1" : "AUTOPILOT"
      ctx.fillStyle = s.mode === "player" ? "rgba(74,222,128,0.9)" : "rgba(255,255,255,0.45)"
      ctx.fillText(label, w - ctx.measureText(label).width - 14, 22)
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
    // changeMode only touches refs and stable state setters, so it is safe to omit.
  }, [inView, reduceMotion])

  const interactive = !reduceMotion

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "touch-pan-y outline-none focus-visible:ring-3 focus-visible:ring-brand/60 focus-visible:ring-inset",
        mode === "player" ? "cursor-none" : "cursor-crosshair",
        className,
      )}
      tabIndex={interactive ? 0 : -1}
      role="application"
      aria-label="Mini space shooter. Move the mouse over it, drag, or use the arrow keys to fly the ship. It fires automatically."
      onPointerMove={interactive ? steer : undefined}
      onPointerDown={interactive ? steer : undefined}
      onKeyDown={interactive ? onKeyDown : undefined}
      onKeyUp={interactive ? onKeyUp : undefined}
      onBlur={() => state.current.keys.clear()}
    />
  )
}
