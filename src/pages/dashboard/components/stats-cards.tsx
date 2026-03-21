import { HugeiconsIcon } from "@hugeicons/react"
import { SourceCodeIcon, ApiIcon, FolderOpenIcon, CodeIcon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
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
    getValue: (code?: CodeStats) => code?.projects_count,
  },
  {
    key: "repos",
    label: "Repositories",
    icon: SourceCodeIcon,
    getValue: (code?: CodeStats) => code?.repositories_count,
  },
  {
    key: "loc",
    label: "Lines Indexed",
    icon: CodeIcon,
    getValue: (code?: CodeStats) => code?.lines_of_code_indexed,
  },
  {
    key: "apis",
    label: "APIs",
    icon: ApiIcon,
    getValue: (_code?: CodeStats, api?: ApiStats) => api?.apis_count,
  },
] as const

export function StatsCards({ codeStats, apiStats, isLoading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const value = stat.getValue(codeStats, apiStats)

        return (
          <Card key={stat.key}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <HugeiconsIcon icon={stat.icon} size={20} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                {isLoading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <p className="text-2xl font-semibold tabular-nums">
                    {value !== undefined ? formatNumber(value) : "—"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
