import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowRight, ChevronRight } from "lucide-react"

import { HeroDevice } from "@/components/hero/hero-device"
import { HeroOrbit } from "@/components/hero/hero-orbit"
import { Button } from "@/components/ui/button"
import { profile } from "@/data/profile"

const ease = [0.16, 1, 0.3, 1] as const

const wordGradients = [
  "from-sky-500 via-blue-500 to-indigo-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-fuchsia-500 via-pink-500 to-orange-400",
  "from-amber-500 via-orange-500 to-rose-500",
]

function useRotatingIndex(length: number, interval = 2400) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % length), interval)
    return () => window.clearInterval(id)
  }, [reduceMotion, length, interval])

  return index
}

function RotatingWord({ index }: { index: number }) {
  return (
    <span className="relative block h-[1.1em] overflow-hidden pb-[0.08em]">
      {/* Screen readers get the full list once instead of a changing word */}
      <span className="sr-only">{profile.builds.join(", ")}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          aria-hidden="true"
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease }}
          className={`block bg-linear-to-r bg-clip-text pb-[0.08em] text-transparent ${wordGradients[index % wordGradients.length]}`}
        >
          {profile.builds[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function Hero() {
  const index = useRotatingIndex(profile.builds.length)

  return (
    <section id="top" className="relative overflow-hidden px-5 pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Soft backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[radial-gradient(ellipse_48rem_30rem_at_50%_0%,color-mix(in_oklab,var(--brand)_14%,transparent),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-50 [mask-image:radial-gradient(ellipse_46rem_30rem_at_50%_0%,#000_10%,transparent_100%)]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div className="text-center lg:text-left">
          <motion.a
            href="#about"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="group inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-background/70 py-1 pr-3 pl-1 text-sm shadow-sm backdrop-blur transition-colors hover:border-border"
          >
            <img
              src={profile.avatar}
              alt=""
              width={28}
              height={28}
              className="size-7 rounded-full bg-muted"
            />
            <span className="font-medium">{profile.name}</span>
            <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
            <span className="hidden text-muted-foreground sm:inline">{profile.role}</span>
            <ChevronRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="mt-8 text-6xl leading-[1.02] font-semibold tracking-tighter sm:text-7xl md:text-8xl"
          >
            <span className="block">I build</span>
            <RotatingWord index={index} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl lg:mx-0"
          >
            {profile.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 lg:justify-start"
          >
            <Button
              asChild
              size="lg"
              className="h-11 rounded-full bg-brand px-6 text-[15px] text-white hover:bg-brand/90"
            >
              <a href="#work">
                View my work
                <ArrowRight data-icon="inline-end" />
              </a>
            </Button>
            <a
              href="#contact"
              className="group inline-flex items-center gap-0.5 text-[17px] text-brand hover:underline"
            >
              Get in touch
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease }}
          className="mx-auto w-full max-w-md lg:max-w-none"
        >
          <HeroOrbit activeIndex={index} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease }}
        className="mt-20 md:mt-24"
      >
        <HeroDevice />
      </motion.div>
    </section>
  )
}
