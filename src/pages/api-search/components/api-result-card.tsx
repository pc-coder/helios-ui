import { HttpMethodBadge } from "@/components/http-method-badge"
import type { ApiRawResult } from "@/types/api"

interface ApiResultCardProps {
  result: ApiRawResult
}

export function ApiResultCard({ result }: ApiResultCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
      <HttpMethodBadge method={result.method} />
      <p className="min-w-0 truncate font-mono text-xs">{result.path}</p>
      <p className="ml-auto hidden shrink-0 text-xs text-muted-foreground sm:block">
        {result.summary}
      </p>
      <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
        {Math.round(result.score * 100)}%
      </span>
    </div>
  )
}
