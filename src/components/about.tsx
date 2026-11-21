import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"

import { Reveal } from "@/components/reveal"
import { Separator } from "@/components/ui/separator"
import { profile, stats } from "@/data/profile"

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  )
}

export function About() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] })
  const words = profile.about.split(" ")

  return (
    <section id="about" className="px-5 py-28 md:py-40">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-brand">About</p>
        </Reveal>

        <p
          ref={ref}
          className="mt-6 text-3xl leading-tight font-semibold tracking-tight text-pretty md:text-5xl md:leading-[1.1]"
        >
          {words.map((word, index) => (
            <Word
              key={index}
              progress={scrollYProgress}
              range={[index / words.length, (index + 1) / words.length]}
            >
              {word}
            </Word>
          ))}
        </p>

        <Separator className="my-16 md:my-20" />

        <dl className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.1}>
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">{stat.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
