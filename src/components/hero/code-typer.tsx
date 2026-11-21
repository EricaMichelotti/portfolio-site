import { useEffect, useMemo, useState } from "react"
import { useReducedMotion } from "motion/react"

type Token = [kind: "kw" | "fn" | "ty" | "str" | "num" | "cm" | "pl", text: string]

const k = (t: string): Token => ["kw", t]
const f = (t: string): Token => ["fn", t]
const y = (t: string): Token => ["ty", t]
const n = (t: string): Token => ["num", t]
const c = (t: string): Token => ["cm", t]
const p = (t: string): Token => ["pl", t]

const lines: Token[][] = [
  [c("// game/update.ts")],
  [k("type "), y("Ship"), p(" = { x: "), y("number"), p("; hp: "), y("number"), p(" }")],
  [],
  [k("export function "), f("update"), p("(ship: "), y("Ship"), p(", dt: "), y("number"), p(") {")],
  [p("  ship.x += input.axis * "), n("SPEED"), p(" * dt")],
  [],
  [p("  "), k("if "), p("(cooldown."), f("ready"), p("()) {")],
  [p("    bullets."), f("push"), p("("), f("spawnBullet"), p("(ship))")],
  [p("  }")],
  [],
  [p("  "), k("for "), p("("), k("const "), p("enemy "), k("of "), p("enemies) {")],
  [p("    "), k("if "), p("("), f("hit"), p("(enemy, bullets)) {")],
  [p("      "), f("explode"), p("(enemy)")],
  [p("      score += "), n("100")],
  [p("    }")],
  [p("  }")],
  [p("}")],
]

const colors: Record<Token[0], string> = {
  kw: "text-[#ff7ab2]",
  fn: "text-[#67b7a4]",
  ty: "text-[#5dd8ff]",
  str: "text-[#ff8170]",
  num: "text-[#d9c97c]",
  cm: "text-[#7f8c98] italic",
  pl: "text-[#dfdfe0]",
}

/** A syntax-highlighted snippet that types itself out once. */
export function CodeTyper({ start }: { start: boolean }) {
  const reduceMotion = useReducedMotion()
  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.reduce((s, [, t]) => s + t.length, 0) + 1, 0),
    [],
  )
  const [shown, setShown] = useState(0)
  const visible = reduceMotion ? total : shown

  useEffect(() => {
    if (!start || reduceMotion) return
    const id = window.setInterval(() => {
      setShown((value) => {
        if (value >= total) {
          window.clearInterval(id)
          return value
        }
        return value + 2
      })
    }, 16)
    return () => window.clearInterval(id)
  }, [start, reduceMotion, total])

  // How many characters of each line are visible, and which line holds the caret.
  const lineLengths = lines.map((line) => line.reduce((s, [, t]) => s + t.length, 0))
  const offsets = lineLengths.map((_, i) => lineLengths.slice(0, i).reduce((s, l) => s + l + 1, 0))
  const takes = lineLengths.map((length, i) => Math.max(0, Math.min(length, visible - offsets[i])))
  const caretLine = Math.min(
    lines.length - 1,
    Math.max(
      0,
      offsets.findLastIndex((offset) => offset <= visible),
    ),
  )

  return (
    <pre className="font-mono text-[11px] leading-[1.7] md:text-[12.5px]">
      <code>
        {lines.map((line, li) => {
          const isCaretLine = li === caretLine
          const starts = line.map((_, ti) => line.slice(0, ti).reduce((s, [, t]) => s + t.length, 0))
          return (
            <div key={li} className="flex min-h-[1.7em] whitespace-pre">
              <span className="mr-4 inline-block w-5 shrink-0 text-right text-[#5c6370] select-none">
                {li + 1}
              </span>
              <span>
                {line.map(([kind, text], ti) => {
                  const part = text.slice(0, Math.max(0, takes[li] - starts[ti]))
                  return part ? (
                    <span key={ti} className={colors[kind]}>
                      {part}
                    </span>
                  ) : null
                })}
                {isCaretLine ? (
                  <span className="ml-px inline-block h-[1.2em] w-[2px] translate-y-[0.2em] animate-pulse bg-[#5dd8ff]" />
                ) : null}
              </span>
            </div>
          )
        })}
      </code>
    </pre>
  )
}
