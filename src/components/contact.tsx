import { ArrowUpRight, Briefcase, Gamepad2, Mail } from "lucide-react"

import { GitHubIcon } from "@/components/icons"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { profile } from "@/data/profile"

export function Contact() {
  const { email, linkedin, github, itch } = profile.links

  return (
    <section id="contact" className="dark bg-black px-5 py-32 text-foreground md:py-48">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-brand">Contact</p>
          <h2 className="mt-3 bg-linear-to-b from-white to-white/60 bg-clip-text text-5xl font-semibold tracking-tighter text-balance text-transparent sm:text-6xl md:text-8xl">
            Let's build something great.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">
            Open to new opportunities, freelance projects and collaborations. The fastest way to reach me is below.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          {email ? (
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-brand px-7 text-base text-white hover:bg-brand/90"
            >
              <a href={`mailto:${email}`}>
                <Mail data-icon="inline-start" />
                Email me
              </a>
            </Button>
          ) : null}
          <Button
            asChild
            size="lg"
            className={
              email
                ? "h-12 rounded-full bg-white/10 px-7 text-base text-white hover:bg-white/20"
                : "h-12 rounded-full bg-brand px-7 text-base text-white hover:bg-brand/90"
            }
          >
            <a href={github} target="_blank" rel="noreferrer">
              <GitHubIcon data-icon="inline-start" />
              GitHub
              <ArrowUpRight data-icon="inline-end" />
            </a>
          </Button>
          {linkedin ? (
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-white/10 px-7 text-base text-white hover:bg-white/20"
            >
              <a href={linkedin} target="_blank" rel="noreferrer">
                <Briefcase data-icon="inline-start" />
                LinkedIn
                <ArrowUpRight data-icon="inline-end" />
              </a>
            </Button>
          ) : null}
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-white/10 px-7 text-base text-white hover:bg-white/20"
          >
            <a href={itch} target="_blank" rel="noreferrer">
              <Gamepad2 data-icon="inline-start" />
              itch.io
              <ArrowUpRight data-icon="inline-end" />
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
