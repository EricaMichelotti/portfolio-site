import { Reveal } from "@/components/reveal"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("mx-auto max-w-3xl text-center", className)}>
      <p className="text-sm font-semibold tracking-wide text-brand">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
