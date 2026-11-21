// All site content lives here. Edit this file to update the portfolio.

export type Project = {
  name: string
  tagline: string
  description: string
  stack: string[]
  href: string
  /** Visual theme for the card artwork */
  tone: "blue" | "violet" | "orange" | "green" | "pink" | "slate"
  featured?: boolean
}

export type Experience = {
  role: string
  company: string
  period: string
  summary: string
}

export const profile = {
  name: "Erica Michelotti",
  shortName: "Erica",
  role: "Full-stack & Game Developer",
  headline: "Software, built with care.",
  intro:
    "Full-stack and game developer with 5+ years of experience shipping web apps, desktop tools, APIs and games — from the first sketch to production.",
  about:
    "I'm a Software Engineering graduate who loves both sides of building software: the precision of well-structured systems and the playfulness of games. I design APIs in C# and Python, build interfaces in React and TypeScript, and make games in Godot. Every project is a chance to make something feel simple, fast and delightful.",
  links: {
    github: "https://github.com/EricaMichelotti",
    itch: "https://artjug.itch.io/",
    // Add these to show them on the site:
    email: "",
    linkedin: "",
  },
}

export const stats = [
  { value: "5+", label: "Years building software" },
  { value: "30+", label: "Public repositories" },
  { value: "6", label: "Programming languages" },
]

export const projects: Project[] = [
  {
    name: "Seat Buddies",
    tagline: "Classroom seating, solved.",
    description:
      "A classroom seating planner: set rules per student and auto-arrange any layout. Bilingual (English and Português) and dependency-free.",
    stack: ["JavaScript", "HTML", "CSS", "i18n"],
    href: "https://github.com/EricaMichelotti/seat-buddies",
    tone: "blue",
    featured: true,
  },
  {
    name: "Automações Dev",
    tagline: "A terminal that works for you.",
    description:
      "A terminal user interface built with Python and Textual that automates the everyday chores of a developer's workflow.",
    stack: ["Python", "Textual", "TUI"],
    href: "https://github.com/EricaMichelotti/automacoes-dev",
    tone: "slate",
    featured: true,
  },
  {
    name: "Service Monitor",
    tagline: "Know before your users do.",
    description:
      "An API and desktop executable that monitors services and applications for developers.",
    stack: ["C#", ".NET", "REST API"],
    href: "https://github.com/EricaMichelotti/MonitoramentoDeServicos",
    tone: "violet",
  },
  {
    name: "Pomo Kirby",
    tagline: "Focus, with a friend.",
    description:
      "A Windows desktop Pomodoro timer with a customizable animated companion — swap the GIF to change the character.",
    stack: ["Python", "Desktop"],
    href: "https://github.com/EricaMichelotti/pomo-kirby",
    tone: "pink",
  },
  {
    name: "Space Shooter",
    tagline: "Top-down. Fast. Retro.",
    description:
      "A top-down space shooter game developed with the Pygame library.",
    stack: ["Python", "Pygame", "Game Dev"],
    href: "https://github.com/EricaMichelotti/python-topdown-space-shooter-game",
    tone: "orange",
  },
  {
    name: "ResultadoOperacao",
    tagline: "Consistent APIs, by design.",
    description:
      "A minimalist library that standardizes API responses across .NET services. Co-authored open-source project.",
    stack: ["C#", ".NET", "Library"],
    href: "https://github.com/EricaMichelotti/ResultadoOperacao",
    tone: "green",
  },
]

export const skills = [
  {
    title: "Frontend",
    description: "Interfaces that feel fast and obvious.",
    items: ["React", "TypeScript", "Next.js", "React Native", "Tailwind CSS"],
  },
  {
    title: "Backend",
    description: "APIs and services built to last.",
    items: ["C# / .NET", "Python", "Node.js", "Supabase", "AWS"],
  },
  {
    title: "Game Development",
    description: "Worlds people want to stay in.",
    items: ["Godot", "GDScript", "Pygame", "raylib", "itch.io"],
  },
  {
    title: "Tools & Desktop",
    description: "Small utilities, big time savings.",
    items: ["Tauri", "Textual", "C++", "Git"],
  },
]

// Add your work history here to show the Experience section, e.g.
// { role: "Software Engineer", company: "Company", period: "2022 — Present", summary: "What you did." }
export const experience: Experience[] = []
