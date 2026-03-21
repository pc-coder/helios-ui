import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { RepositoryHealth } from "@/types/projects"

interface LargeFilesCardProps {
  repo: RepositoryHealth
}

export function LargeFilesCard({ repo }: LargeFilesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Large Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">&gt; 500 KB</span>
          <span className="tabular-nums">{repo.large_files.above_500kb}</span>
        </div>
        <Separator />
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">&gt; 1 MB</span>
          <span className="tabular-nums">{repo.large_files.above_1mb}</span>
        </div>
        <Separator />
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">&gt; 5 MB</span>
          <span className="tabular-nums">{repo.large_files.above_5mb}</span>
        </div>
      </CardContent>
    </Card>
  )
}
