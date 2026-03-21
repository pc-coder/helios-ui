import { Card, CardContent } from "@/components/ui/card"
import { HttpMethodBadge } from "@/components/http-method-badge"
import { Badge } from "@/components/ui/badge"
import type { ApiRawResult } from "@/types/api"

interface ApiResultCardProps {
  result: ApiRawResult
}

export function ApiResultCard({ result }: ApiResultCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <HttpMethodBadge method={result.method} />
            <div className="min-w-0">
              <p className="font-mono text-sm font-medium">{result.path}</p>
              <p className="text-xs text-muted-foreground">{result.service}</p>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {Math.round(result.score * 100)}%
          </Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{result.summary}</p>
      </CardContent>
    </Card>
  )
}
