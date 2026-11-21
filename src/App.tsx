import { MotionConfig } from "motion/react"

import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Experience } from "@/components/experience"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Nav } from "@/components/nav"
import { Skills } from "@/components/skills"
import { Work } from "@/components/work"
import { TooltipProvider } from "@/components/ui/tooltip"
import { experience } from "@/data/profile"
import { useTheme } from "@/hooks/use-theme"

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Expertise" },
  ...(experience.length > 0 ? [{ href: "#experience", label: "Experience" }] : []),
  { href: "#contact", label: "Contact" },
]

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={300}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-full focus:bg-background focus:px-4 focus:py-2 focus:shadow"
        >
          Skip to content
        </a>
        <Nav theme={theme} onToggleTheme={toggle} links={links} />
        <main id="main">
          <Hero />
          <About />
          <Work />
          <Skills />
          <Experience />
          <Contact />
        </main>
        <Footer links={links} />
      </TooltipProvider>
    </MotionConfig>
  )
}
