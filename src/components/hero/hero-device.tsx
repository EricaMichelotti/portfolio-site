import { useRef, useState, type PointerEvent } from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import { Gamepad2 } from "lucide-react"

import { CodeTyper } from "@/components/hero/code-typer"
import { MiniGame } from "@/components/hero/mini-game"

/** A floating editor window: code on the left, the game it drives on the right. */
export function HeroDevice() {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })
  const [hovering, setHovering] = useState(false)

  // Lies back in perspective, then rises flat as you scroll — Apple-style.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const scrollTilt = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : 24, 0])
  const scrollScale = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 1 : 0.9, 1])

  // Subtle pointer parallax.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const springX = useSpring(px, { stiffness: 120, damping: 20 })
  const springY = useSpring(py, { stiffness: 120, damping: 20 })
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6])
  const pointerTilt = useTransform(springY, [-0.5, 0.5], [5, -5])
  const rotateX = useTransform(() => scrollTilt.get() + pointerTilt.get())

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }
  const onPointerLeave = () => {
    px.set(0)
    py.set(0)
    setHovering(false)
  }

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-5xl [perspective:1600px]"
      onPointerMove={onPointerMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={onPointerLeave}
    >
      {/* Glow beneath the window */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[10%] -bottom-10 h-40 rounded-full bg-brand/30 blur-3xl transition-opacity duration-700 dark:bg-brand/25"
        style={{ opacity: hovering ? 1 : 0.6 }}
      />

      <motion.div
        style={{ rotateX, rotateY, scale: scrollScale, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-2xl bg-[#1e1e22] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/10 dark:ring-white/12 md:rounded-[1.25rem]"
      >
        {/* Title bar */}
        <div className="flex h-10 items-center gap-2 border-b border-white/8 bg-[#2a2a2e] px-4">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <p className="flex-1 text-center text-xs font-medium text-white/50">space-shooter — update.ts</p>
          <span className="hidden items-center gap-1.5 rounded-md bg-white/8 px-2 py-0.5 text-[11px] text-white/60 sm:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-[#28c840]" />
            Live
          </span>
        </div>

        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="hidden overflow-hidden border-r border-white/8 px-4 py-5 md:block">
            <CodeTyper start={inView} />
          </div>
          <div className="relative aspect-[4/3] md:aspect-auto">
            <MiniGame className="absolute inset-0 size-full" />
            <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur-md">
              <Gamepad2 className="size-3.5" aria-hidden="true" />
              Rendering live in your browser
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
