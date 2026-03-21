import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LanguageBar } from "./health-indicators"
import type { RepositoryHealth } from "@/types/projects"

interface OverviewCardProps {
  repo: RepositoryHealth
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`
  return `${bytes} B`
}

export function OverviewCard({ repo }: OverviewCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Open PRs</span>
          <span className="text-lg font-semibold tabular-nums">
            {repo.open_prs_count}
          </span>
        </div>
        <Separator />
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Open Issues</span>
          <span className="text-lg font-semibold tabular-nums">
            {repo.open_issues_count}
          </span>
        </div>
        <Separator />
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Size</span>
          <span className="text-sm tabular-nums">
            {formatBytes(repo.size_in_bytes)}
          </span>
        </div>
        <Separator />
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Files</span>
          <span className="text-sm tabular-nums">
            {repo.count_of_files.toLocaleString()}
          </span>
        </div>
        <Separator />
        <LanguageBar
          languages={Object.keys(repo.languages_stats)}
          stats={repo.languages_stats}
        />
      </CardContent>
    </Card>
  )
}
