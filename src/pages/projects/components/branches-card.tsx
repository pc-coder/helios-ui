import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { RepositoryHealth } from "@/types/projects"

interface BranchesCardProps {
  repo: RepositoryHealth
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - timestamp
  const days = Math.floor(diff / 86400)

  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(months / 12)
  return `${years}y ago`
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
                  key={branch.name}
                  variant="secondary"
                  className="gap-1 font-mono text-xs"
                >
                  {branch.name}
                  <span className="font-sans text-[10px] text-muted-foreground">
                    {formatRelativeTime(branch.last_commit_timestamp)}
                  </span>
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
