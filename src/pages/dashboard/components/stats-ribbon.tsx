import { HugeiconsIcon } from "@hugeicons/react"
import {
  SourceCodeIcon,
  ApiIcon,
  FolderOpenIcon,
  CodeIcon,
} from "@hugeicons/core-free-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import type { CodeStats } from "@/types/code"
import type { ApiStats } from "@/types/api"

interface StatsRibbonProps {
  codeStats?: CodeStats
  apiStats?: ApiStats
  isLoading: boolean
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

const items = [
  {
    key: "projects",
    label: "Projects",
    icon: FolderOpenIcon,
    iconColor: "text-blue-500 dark:text-blue-400",
    getValue: (code?: CodeStats) => code?.projects_count,
  },
  {
    key: "repos",
    label: "Repositories",
    icon: SourceCodeIcon,
    iconColor: "text-violet-500 dark:text-violet-400",
    getValue: (code?: CodeStats) => code?.repositories_count,
  },
  {
    key: "loc",
    label: "Lines Indexed",
    icon: CodeIcon,
    iconColor: "text-emerald-500 dark:text-emerald-400",
    getValue: (code?: CodeStats) => code?.lines_of_code_indexed,
  },
  {
    key: "apis",
    label: "APIs",
    icon: ApiIcon,
    iconColor: "text-amber-500 dark:text-amber-400",
    getValue: (_code?: CodeStats, api?: ApiStats) => api?.apis_count,
  },
] as const

export function StatsRibbon({
  codeStats,
  apiStats,
  isLoading,
}: StatsRibbonProps) {
  return (
    <div className="rounded-xl border bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-amber-500/5 px-6 py-4 dark:from-blue-500/10 dark:via-violet-500/10 dark:to-amber-500/10">
      <div className="flex items-center justify-center gap-6">
        {items.map((item, index) => (
          <div key={item.key} className="flex items-center gap-6">
            {index > 0 && (
              <Separator orientation="vertical" className="h-8" />
            )}
            <div className="flex items-center gap-2.5">
              <div className={item.iconColor}>
                <HugeiconsIcon icon={item.icon} size={16} />
              </div>
              <div className="flex items-baseline gap-1.5">
                {isLoading ? (
                  <Skeleton className="h-5 w-10" />
                ) : (
                  <span className="text-lg font-semibold tabular-nums">
                    {(() => {
                      const v = item.getValue(codeStats, apiStats)
                      return v !== undefined ? formatNumber(v) : "—"
                    })()}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
