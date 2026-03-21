import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { RepositoryHealth } from "@/types/projects"

interface BranchesCardProps {
  repo: RepositoryHealth
}

export function BranchesCard({ repo }: BranchesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Branches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Total branches</span>
          <span className="text-lg font-semibold tabular-nums">
            {repo.total_branches}
          </span>
        </div>
        <Separator />
        {repo.stale_branches.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {repo.stale_branches.length} stale branch
              {repo.stale_branches.length !== 1 ? "es" : ""}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {repo.stale_branches.map((branch) => (
                <Badge
                  key={branch}
                  variant="secondary"
                  className="font-mono text-xs"
                >
                  {branch}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            No stale branches
          </p>
        )}
      </CardContent>
    </Card>
  )
}
