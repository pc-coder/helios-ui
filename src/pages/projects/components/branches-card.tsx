import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BranchesDialog } from "./branches-dialog"
import type { RepositoryHealth } from "@/types/projects"

interface BranchesCardProps {
  repo: RepositoryHealth
}

const MAX_INLINE = 10

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
  const allBranches = repo.branches
  const visible = allBranches.slice(0, MAX_INLINE)

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
        {allBranches.length > 0 ? (
          <div className="space-y-2">
            <div className="space-y-0.5">
              {visible.map((branch) => (
                <div
                  key={branch.name}
                  className="flex items-center justify-between rounded px-1.5 py-1 text-xs hover:bg-muted"
                >
                  <span className="min-w-0 truncate font-mono text-[11px]">
                    {branch.name}
                  </span>
                  <span className="shrink-0 pl-2 text-[10px] tabular-nums text-muted-foreground">
                    {formatRelativeTime(branch.last_commit_timestamp)}
                  </span>
                </div>
              ))}
            </div>
            {allBranches.length > MAX_INLINE && (
              <BranchesDialog branches={allBranches} />
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No branches</p>
        )}
      </CardContent>
    </Card>
  )
}
