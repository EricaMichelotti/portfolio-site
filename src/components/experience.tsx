import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { experience } from "@/data/profile"

export function Experience() {
  if (experience.length === 0) return null

  return (
    <section id="experience" className="bg-surface px-5 py-28 md:py-40">
      <SectionHeading eyebrow="Experience" title="Where I've worked." />

      <ol className="mx-auto mt-16 max-w-3xl md:mt-20">
        {experience.map((item, index) => (
          <li key={`${item.company}-${item.period}`} className="border-t border-border">
            <Reveal delay={index * 0.05} className="grid gap-2 py-8 md:grid-cols-[12rem_1fr] md:gap-8">
              <p className="text-sm text-muted-foreground md:pt-1.5">{item.period}</p>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">{item.role}</h3>
                <p className="mt-1 text-brand">{item.company}</p>
                <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{item.summary}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
