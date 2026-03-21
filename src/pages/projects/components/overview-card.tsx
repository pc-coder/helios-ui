import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LanguageBar } from "./health-indicators"
import type { RepositoryHealth } from "@/types/projects"

interface OverviewCardProps {
  repo: RepositoryHealth
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
        <LanguageBar languages={repo.languages} />
      </CardContent>
    </Card>
  )
}
