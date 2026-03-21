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
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <h3 className="font-semibold">{repository.display_name}</h3>
              <p className="font-mono text-xs text-muted-foreground">
                {repository.default_branch}
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              {repository.stale_branches_count > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {repository.stale_branches_count} stale
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{repository.total_branches} branches</span>
            <span>{repository.open_prs_count} PRs</span>
            <span>{repository.open_issues_count} issues</span>
            <span>{repository.pipelines_count} pipelines</span>
          </div>

          <div className="mt-3">
            <LanguageBar languages={repository.languages} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
