import { Skeleton } from "@/components/ui/skeleton"
import { ApiResultCard } from "./api-result-card"
import type { ApiRawResult } from "@/types/api"

interface ApiRawResultsProps {
  results?: ApiRawResult[]
  isLoading: boolean
}

export function ApiRawResults({ results, isLoading }: ApiRawResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  if (!results || results.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {results.length} result{results.length !== 1 ? "s" : ""}
      </p>
      {results.map((result, index) => (
        <ApiResultCard key={index} result={result} />
      ))}
    </div>
  )
}
