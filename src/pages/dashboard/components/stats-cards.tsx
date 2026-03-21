import { HugeiconsIcon } from "@hugeicons/react"
import { SourceCodeIcon, ApiIcon, FolderOpenIcon, CodeIcon } from "@hugeicons/core-free-icons"
import { Skeleton } from "@/components/ui/skeleton"
import type { CodeStats } from "@/types/code"
import type { ApiStats } from "@/types/api"

interface StatsCardsProps {
  codeStats?: CodeStats
  apiStats?: ApiStats
  isLoading: boolean
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

const stats = [
  {
    key: "projects",
    label: "Projects",
    icon: FolderOpenIcon,
    gradient: "from-blue-500/10 to-blue-600/5 dark:from-blue-500/15 dark:to-blue-600/5",
    iconColor: "text-blue-500 dark:text-blue-400",
    getValue: (code?: CodeStats) => code?.projects_count,
  },
  {
    key: "repos",
    label: "Repositories",
    icon: SourceCodeIcon,
    gradient: "from-violet-500/10 to-violet-600/5 dark:from-violet-500/15 dark:to-violet-600/5",
    iconColor: "text-violet-500 dark:text-violet-400",
    getValue: (code?: CodeStats) => code?.repositories_count,
  },
  {
    key: "loc",
    label: "Lines Indexed",
    icon: CodeIcon,
    gradient: "from-emerald-500/10 to-emerald-600/5 dark:from-emerald-500/15 dark:to-emerald-600/5",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    getValue: (code?: CodeStats) => code?.lines_of_code_indexed,
  },
  {
    key: "apis",
    label: "APIs",
    icon: ApiIcon,
    gradient: "from-amber-500/10 to-amber-600/5 dark:from-amber-500/15 dark:to-amber-600/5",
    iconColor: "text-amber-500 dark:text-amber-400",
    getValue: (_code?: CodeStats, api?: ApiStats) => api?.apis_count,
  },
] as const

export function StatsCards({ codeStats, apiStats, isLoading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const value = stat.getValue(codeStats, apiStats)

        return (
          <div
            key={stat.key}
            className={`relative overflow-hidden rounded-xl border bg-gradient-to-br px-4 py-3 ${stat.gradient}`}
          >
            <div className="absolute -right-2 -top-2 opacity-[0.08]">
              <HugeiconsIcon icon={stat.icon} size={64} />
            </div>

            <div className="relative flex items-center gap-3">
              <div className={`shrink-0 ${stat.iconColor}`}>
                <HugeiconsIcon icon={stat.icon} size={18} />
              </div>
              <div className="min-w-0">
                {isLoading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <p className="text-2xl font-bold tabular-nums tracking-tight">
                    {value !== undefined ? formatNumber(value) : "—"}
                  </p>
                )}
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
