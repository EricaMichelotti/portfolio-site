import { useRef, type PointerEvent } from "react"
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import { Cpu, Database, Gamepad2, Globe, Server, Smartphone, Terminal, type LucideIcon } from "lucide-react"

import { DotSphere } from "@/components/hero/dot-sphere"
import { cn } from "@/lib/utils"

type Orbit = { rx: number; ry: number; tilt: number; speed: number }

const outer: Orbit = { rx: 47, ry: 17, tilt: -0.32, speed: 0.32 }
const inner: Orbit = { rx: 37, ry: 11, tilt: 0.42, speed: -0.45 }

/** Order matches `profile.builds`: web apps, APIs, games, dev tools. */
const primary: { icon: LucideIcon; label: string; gradient: string }[] = [
  { icon: Globe, label: "Web apps", gradient: "from-sky-400 to-blue-600" },
  { icon: Server, label: "APIs", gradient: "from-emerald-400 to-teal-600" },
  { icon: Gamepad2, label: "Games", gradient: "from-pink-400 to-fuchsia-600" },
  { icon: Terminal, label: "Dev tools", gradient: "from-amber-400 to-orange-600" },
]

const secondary: { icon: LucideIcon; gradient: string }[] = [
  { icon: Database, gradient: "from-violet-400 to-indigo-600" },
  { icon: Smartphone, gradient: "from-zinc-500 to-zinc-800" },
  { icon: Cpu, gradient: "from-cyan-400 to-sky-600" },
]

function useOrbitPosition(time: MotionValue<number>, orbit: Orbit, phase: number) {
  const angle = useTransform(time, (t) => t * orbit.speed + phase)
  const point = (a: number) => {
    const ex = Math.cos(a) * orbit.rx
    const ey = Math.sin(a) * orbit.ry
    return {
      x: ex * Math.cos(orbit.tilt) - ey * Math.sin(orbit.tilt),
      y: ex * Math.sin(orbit.tilt) + ey * Math.cos(orbit.tilt),
    }
  }
  const left = useTransform(angle, (a) => `${50 + point(a).x}%`)
  const top = useTransform(angle, (a) => `${50 + point(a).y}%`)
  // Front half of the ellipse (sin > 0) passes in front of the sphere.
  const depth = useTransform(angle, (a) => (Math.sin(a) + 1) / 2)
  const scale = useTransform(depth, (d) => 0.72 + d * 0.32)
  const opacity = useTransform(depth, (d) => 0.45 + d * 0.55)
  const zIndex = useTransform(depth, (d) => (d > 0.5 ? 30 : 5))
  return { left, top, scale, opacity, zIndex }
}

function AppIcon({
  time,
  orbit,
  phase,
  icon: Icon,
  gradient,
  size,
  label,
  active,
}: {
  time: MotionValue<number>
  orbit: Orbit
  phase: number
  icon: LucideIcon
  gradient: string
  size: "lg" | "sm"
  label?: string
  active?: boolean
}) {
  const style = useOrbitPosition(time, orbit, phase)
  return (
    <motion.div
      // The highlighted icon always sits fully visible in front of the globe.
      style={active ? { ...style, opacity: 1, zIndex: 40 } : style}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        animate={{ scale: active ? 1.18 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative flex flex-col items-center"
      >
        <div
          className={cn(
            "relative flex items-center justify-center bg-linear-to-br text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] ring-1 ring-white/25 transition-shadow duration-500",
            gradient,
            size === "lg"
              ? "size-12 rounded-[0.9rem] md:size-14 md:rounded-2xl"
              : "size-9 rounded-[0.65rem] md:size-10 md:rounded-xl",
            active &&
              "shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_35%,transparent),0_14px_36px_-8px_rgba(0,0,0,0.5)]",
          )}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-[inherit] bg-linear-to-b from-white/35 via-white/5 to-transparent"
          />
          <Icon
            className={cn("relative", size === "lg" ? "size-6 md:size-7" : "size-4 md:size-5")}
            strokeWidth={1.75}
          />
        </div>
        {label ? (
          <motion.span
            initial={false}
            animate={{ opacity: active ? 1 : 0, y: active ? 0 : -4 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full mt-2 rounded-full bg-foreground px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-background shadow-md"
          >
            {label}
          </motion.span>
        ) : null}
      </motion.div>
    </motion.div>
  )
}

function Ring({ orbit }: { orbit: Orbit }) {
  return (
    <ellipse
      cx="50"
      cy="50"
      rx={orbit.rx}
      ry={orbit.ry}
      transform={`rotate(${(orbit.tilt * 180) / Math.PI} 50 50)`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.25"
      strokeDasharray="0.8 1.2"
      vectorEffect="non-scaling-stroke"
    />
  )
}

/** Dot globe circled by app-style icons for each thing I build. */
export function HeroOrbit({ activeIndex, className }: { activeIndex: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduceMotion = useReducedMotion()
  const time = useMotionValue(0)

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !inView) return
    time.set(time.get() + Math.min(delta, 50) / 1000)
  })

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const springX = useSpring(px, { stiffness: 80, damping: 20 })
  const springY = useSpring(py, { stiffness: 80, damping: 20 })
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10])
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8])

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
      className={cn("relative aspect-square w-full [perspective:1200px]", className)}
      role="img"
      aria-label="A rotating globe of dots, orbited by icons for web apps, APIs, games and developer tools"
    >
      <motion.div style={{ rotateX, rotateY }} className="absolute inset-0">
        {/* Glow */}
        <div
          aria-hidden="true"
          className="absolute inset-[18%] rounded-full bg-[conic-gradient(from_200deg,#0071e3,#a855f7,#ec4899,#0071e3)] opacity-25 blur-3xl dark:opacity-35"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full text-foreground/35"
        >
          <Ring orbit={outer} />
          <Ring orbit={inner} />
        </svg>
        <DotSphere className="absolute inset-[14%] z-10 size-[72%]" pointerX={springX} pointerY={springY} />

        {primary.map((item, i) => (
          <AppIcon
            key={item.label}
            time={time}
            orbit={outer}
            phase={(i / primary.length) * Math.PI * 2 + 0.5}
            icon={item.icon}
            gradient={item.gradient}
            size="lg"
            label={item.label}
            active={i === activeIndex}
          />
        ))}
        {secondary.map((item, i) => (
          <AppIcon
            key={i}
            time={time}
            orbit={inner}
            phase={(i / secondary.length) * Math.PI * 2 + 1.2}
            icon={item.icon}
            gradient={item.gradient}
            size="sm"
          />
        ))}
      </motion.div>
    </div>
  )
}
