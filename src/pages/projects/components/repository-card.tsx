import { Link } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageBar } from "./health-indicators"
import type { RepositorySummary } from "@/types/projects"

interface RepositoryCardProps {
  projectId: string
  repository: RepositorySummary
}

export function RepositoryCard({ projectId, repository }: RepositoryCardProps) {
  return (
    <Link to={`/projects/${projectId}/repos/${repository.id}`}>
      <Card className="transition-colors hover:border-primary/30">
        <CardContent className="space-y-1.5 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold">
              {repository.display_name}
            </h3>
            {repository.stale_branches_count > 0 && (
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                {repository.stale_branches_count} stale
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">{repository.default_branch}</span>
            <span>{repository.total_branches} branches</span>
            <span>{repository.open_prs_count} PRs</span>
            <span>{repository.open_issues_count} issues</span>
          </div>

          <LanguageBar languages={repository.languages} />
        </CardContent>
      </Card>
    </Link>
  )
}
