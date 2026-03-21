import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HealthIndicatorProps {
  label: string
  value: number
  thresholds?: { warn: number; danger: number }
}

export function HealthIndicator({
  label,
  value,
  thresholds = { warn: 5, danger: 10 },
}: HealthIndicatorProps) {
  const color =
    value === 0
      ? "text-emerald-600 dark:text-emerald-400"
      : value >= thresholds.danger
        ? "text-red-600 dark:text-red-400"
        : value >= thresholds.warn
          ? "text-amber-600 dark:text-amber-400"
          : "text-foreground"

  return (
    <div className="text-center">
      <p className={cn("text-lg font-semibold tabular-nums", color)}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

interface LanguageBarProps {
  languages: string[]
  stats?: Record<string, number>
  maxVisible?: number
}

const languageColors: Record<string, string> = {
  Java: "bg-orange-500",
  Python: "bg-blue-500",
  Go: "bg-cyan-500",
  TypeScript: "bg-blue-600",
  JavaScript: "bg-yellow-500",
  Kotlin: "bg-purple-500",
  Rust: "bg-orange-600",
  SQL: "bg-green-500",
  C: "bg-gray-600",
  "C++": "bg-pink-600",
  "C#": "bg-violet-600",
  Ruby: "bg-red-500",
  PHP: "bg-indigo-500",
  Swift: "bg-orange-400",
  Scala: "bg-red-600",
  Dart: "bg-sky-500",
  Shell: "bg-emerald-600",
  Lua: "bg-blue-800",
  R: "bg-blue-400",
  Perl: "bg-teal-600",
  Haskell: "bg-purple-700",
  Elixir: "bg-violet-500",
  Zig: "bg-amber-500",
  Groovy: "bg-cyan-700",
  YAML: "bg-rose-400",
  HCL: "bg-violet-400",
  Dockerfile: "bg-sky-600",
  Makefile: "bg-lime-600",
  Markdown: "bg-slate-500",
  HTML: "bg-red-400",
  CSS: "bg-blue-300",
}

function LanguageDot({
  lang,
  percentage,
}: {
  lang: string
  percentage?: number
}) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <span
        className={cn(
          "inline-block size-2 rounded-full",
          languageColors[lang] ?? "bg-gray-400"
        )}
      />
      {lang}
      {percentage !== undefined && (
        <span className="text-[10px] tabular-nums">{percentage}%</span>
      )}
    </span>
  )
}

export function LanguageBar({
  languages,
  stats,
  maxVisible = 4,
}: LanguageBarProps) {
  if (languages.length === 0) return null

  const total = stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0

  function getPercentage(lang: string): number | undefined {
    if (!stats || !total) return undefined
    return Math.round((stats[lang] / total) * 100)
  }

  const visible = languages.slice(0, maxVisible)
  const remaining = languages.slice(maxVisible)

  return (
    <div className="flex items-center gap-1.5">
      {visible.map((lang) => (
        <LanguageDot key={lang} lang={lang} percentage={getPercentage(lang)} />
      ))}
      {remaining.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="shrink-0 cursor-default rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              +{remaining.length} more
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-60">
            <div className="flex flex-wrap gap-1.5">
              {remaining.map((lang) => (
                <LanguageDot key={lang} lang={lang} />
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
