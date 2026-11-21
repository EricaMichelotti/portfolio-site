import { motion } from "motion/react"
import {
  Activity,
  ArrowUpRight,
  Braces,
  Code,
  Gamepad2,
  LayoutGrid,
  Rocket,
  Terminal,
  Timer,
  type LucideIcon,
} from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GitHubIcon } from "@/components/icons"
import { profile, projects, type Project } from "@/data/profile"
import { cn } from "@/lib/utils"

const tones: Record<Project["tone"], { art: string; glyph: string }> = {
  blue: { art: "from-sky-400 via-blue-500 to-indigo-600", glyph: "text-white" },
  violet: { art: "from-fuchsia-500 via-violet-500 to-indigo-500", glyph: "text-white" },
  orange: { art: "from-amber-300 via-orange-500 to-rose-500", glyph: "text-white" },
  green: { art: "from-emerald-300 via-teal-500 to-cyan-600", glyph: "text-white" },
  pink: { art: "from-rose-300 via-pink-400 to-fuchsia-500", glyph: "text-white" },
  slate: { art: "from-zinc-700 via-zinc-800 to-black", glyph: "text-emerald-400" },
}

const icons: Record<string, LucideIcon> = {
  "Seat Buddies": LayoutGrid,
  "Automações Dev": Terminal,
  "Service Monitor": Activity,
  "Pomo Kirby": Timer,
  "Space Shooter": Rocket,
  ResultadoOperacao: Braces,
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tone = tones[project.tone]
  const Icon = icons[project.name] ?? Code

  return (
    <Reveal delay={(index % 2) * 0.1} className={cn(project.featured && "md:col-span-2")}>
      <motion.a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="group block h-full rounded-3xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label={`${project.name} on GitHub`}
      >
        <Card
          className={cn(
            "h-full gap-0 rounded-3xl border-0 bg-card py-0 ring-0 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow duration-500 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-none dark:ring-1 dark:ring-white/10",
            project.featured && "md:flex-row",
          )}
        >
          <div
            className={cn(
              "relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-linear-to-br",
              tone.art,
              project.featured && "md:aspect-auto md:w-1/2 md:min-h-80",
            )}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]"
            />
            <div
              aria-hidden="true"
              className="absolute -right-10 -bottom-10 size-48 rounded-full bg-white/10 blur-2xl"
            />
            <Icon
              aria-hidden="true"
              strokeWidth={1.25}
              className={cn(
                "relative size-20 drop-shadow-lg transition-transform duration-700 ease-out group-hover:scale-110 md:size-24",
                tone.glyph,
              )}
            />
          </div>

          <div className={cn("flex flex-1 flex-col p-7 md:p-8", project.featured && "md:justify-center")}>
            <p className="text-sm font-medium text-muted-foreground">{project.tagline}</p>
            <h3 className="mt-1.5 flex items-center gap-1.5 text-2xl font-semibold tracking-tight md:text-3xl">
              {project.name}
              <ArrowUpRight className="size-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
            </h3>
            <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{project.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <Badge variant="secondary" className="h-6 px-2.5 font-normal">
                    {tech}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </motion.a>
    </Reveal>
  )
}

export function Work() {
  return (
    <section id="work" className="bg-surface px-5 py-28 md:py-40">
      <SectionHeading
        eyebrow="Selected work"
        title="Made to be used."
        description="A selection of open-source projects — from developer tools and APIs to desktop apps and games."
      />

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:mt-20 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>

      <Reveal className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild variant="outline" size="lg" className="h-11 rounded-full px-6 text-[15px]">
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            <GitHubIcon data-icon="inline-start" />
            More on GitHub
          </a>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 rounded-full px-6 text-[15px]">
          <a href={profile.links.itch} target="_blank" rel="noreferrer">
            <Gamepad2 data-icon="inline-start" />
            Play my games on itch.io
          </a>
        </Button>
      </Reveal>
    </section>
  )
}
