import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import type { CodeSource } from "@/types/code"

interface CodeSourceCardProps {
  source: CodeSource
}

export function CodeSourceCard({ source }: CodeSourceCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded bg-muted">
          <HugeiconsIcon icon={File01Icon} size={16} className="text-muted-foreground" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="truncate font-mono text-sm font-medium">{source.file}</p>
          <p className="text-xs text-muted-foreground">
            {source.repository} &middot; Lines {source.lines}
          </p>
          <p className="text-xs text-muted-foreground">{source.project}</p>
        </div>
      </CardContent>
    </Card>
  )
}
