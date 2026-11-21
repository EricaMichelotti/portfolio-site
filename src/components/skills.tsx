import { Code, Gamepad2, Server, Wrench, type LucideIcon } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { skills } from "@/data/profile"

const icons: Record<string, LucideIcon> = {
  Frontend: Code,
  Backend: Server,
  "Game Development": Gamepad2,
  "Tools & Desktop": Wrench,
}

export function Skills() {
  return (
    <section id="skills" className="px-5 py-28 md:py-40">
      <SectionHeading
        eyebrow="Expertise"
        title="The whole stack. And then some."
        description="Comfortable across the stack, from pixel-level UI to the services and engines behind it."
      />

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:mt-20">
        {skills.map((group, index) => {
          const Icon = icons[group.title] ?? Code
          return (
            <Reveal key={group.title} delay={(index % 2) * 0.1} className="h-full">
              <Card className="h-full gap-6 rounded-3xl border-0 bg-surface py-8 ring-0">
                <CardHeader className="px-8">
                  <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-background text-brand shadow-sm">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <CardTitle className="text-2xl font-semibold tracking-tight">{group.title}</CardTitle>
                  <CardDescription className="text-base">{group.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-8">
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item}>
                        <Badge
                          variant="outline"
                          className="h-8 rounded-full bg-background px-3.5 text-sm font-normal"
                        >
                          {item}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
