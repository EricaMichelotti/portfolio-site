import { profile } from "@/data/profile"

const YEAR = new Date().getFullYear()

export function Footer({ links }: { links: { href: string; label: string }[] }) {
  return (
    <footer className="dark bg-black px-5 text-muted-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 border-t border-white/10 py-8 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>
          Copyright © {YEAR} {profile.name}. All rights reserved.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
