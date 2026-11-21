import { useEffect, useRef } from "react"
import { useInView, useReducedMotion, type MotionValue } from "motion/react"

type Point = { x: number; y: number; z: number; hue: number }

function fibonacciSphere(count: number): Point[] {
  const points: Point[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = golden * i
    // Blue at the top, violet through the middle, pink at the bottom.
    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      hue: 212 + (1 - (y + 1) / 2) * 110,
    })
  }
  return points
}

/**
 * A rotating globe of dots drawn on a canvas. Optional pointer motion values
 * (-0.5..0.5) nudge its rotation. Pauses off-screen; static for reduced motion.
 */
export function DotSphere({
  className,
  pointerX,
  pointerY,
}: {
  className?: string
  pointerX?: MotionValue<number>
  pointerY?: MotionValue<number>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inView = useInView(canvasRef)
  const reduceMotion = useReducedMotion()
  const rotation = useRef(0.6)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const points = fibonacciSphere(720)
    let size = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      size = rect.width
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const dark = () => document.documentElement.classList.contains("dark")

    const draw = () => {
      const radius = size * 0.42
      const center = size / 2
      const spin = rotation.current + (pointerX?.get() ?? 0) * 0.8
      const tilt = 0.38 + (pointerY?.get() ?? 0) * 0.5
      const sinA = Math.sin(spin)
      const cosA = Math.cos(spin)
      const sinB = Math.sin(tilt)
      const cosB = Math.cos(tilt)
      const lightness = dark() ? 66 : 54

      ctx.clearRect(0, 0, size, size)
      const projected = points.map((p) => {
        const x1 = p.x * cosA + p.z * sinA
        const z1 = -p.x * sinA + p.z * cosA
        const y2 = p.y * cosB - z1 * sinB
        const z2 = p.y * sinB + z1 * cosB
        const perspective = 2.6 / (2.6 - z2)
        return {
          x: center + x1 * radius * perspective,
          y: center + y2 * radius * perspective,
          z: z2,
          hue: p.hue,
        }
      })
      projected.sort((a, b) => a.z - b.z)
      for (const p of projected) {
        const depth = (p.z + 1) / 2
        ctx.globalAlpha = 0.12 + depth * 0.88
        ctx.fillStyle = `hsl(${p.hue} 90% ${lightness}%)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 0.6 + depth * 2.1 * (size / 480), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    if (reduceMotion || !inView) {
      draw()
      return () => observer.disconnect()
    }

    let frame = 0
    let last = performance.now()
    const loop = (now: number) => {
      rotation.current += Math.min(0.05, (now - last) / 1000) * 0.22
      last = now
      draw()
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [inView, reduceMotion, pointerX, pointerY])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
