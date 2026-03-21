import { cn } from "@/lib/utils"

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
}

const languageColors: Record<string, string> = {
  Java: "bg-orange-500",
  Python: "bg-blue-500",
  Go: "bg-cyan-500",
  TypeScript: "bg-blue-600",
  Kotlin: "bg-purple-500",
  Rust: "bg-orange-600",
  SQL: "bg-green-500",
}

export function LanguageBar({ languages }: LanguageBarProps) {
  if (languages.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {languages.map((lang) => (
        <span
          key={lang}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground"
        >
          <span
            className={cn(
              "inline-block size-2 rounded-full",
              languageColors[lang] ?? "bg-gray-400"
            )}
          />
          {lang}
        </span>
      ))}
    </div>
  )
}
