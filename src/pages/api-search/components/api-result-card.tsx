import { HttpMethodBadge } from "@/components/http-method-badge"
import type { ApiRawResult } from "@/types/api"

interface ApiResultCardProps {
  result: ApiRawResult
  onClick?: () => void
}

export function ApiResultCard({ result, onClick }: ApiResultCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick()
            }
          : undefined
      }
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${onClick ? "cursor-pointer transition-colors hover:border-primary/30 hover:bg-muted/50" : ""}`}
    >
      <HttpMethodBadge method={result.method} />
      <p className="shrink-0 font-mono text-xs">{result.path}</p>
      <p className="hidden min-w-0 flex-1 truncate text-xs text-muted-foreground sm:block">
        {result.summary}
      </p>
      <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
        {Math.round(result.match_score * 100)}%
      </span>
    </div>
  )
}
