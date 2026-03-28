import { useNavigate } from "react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiResultCard } from "./api-result-card"
import type { ApiRawResult } from "@/types/api"

interface ApiRawResultsProps {
  results?: ApiRawResult[]
  isLoading: boolean
}

function groupByService(results: ApiRawResult[]) {
  const groups: Record<string, ApiRawResult[]> = {}
  for (const result of results) {
    const key = result.service
    if (!groups[key]) groups[key] = []
    groups[key].push(result)
  }
  return groups
}

export function ApiRawResults({ results, isLoading }: ApiRawResultsProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (!results || results.length === 0) return null

  const grouped = groupByService(results)

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        {results.length} result{results.length !== 1 ? "s" : ""} across{" "}
        {Object.keys(grouped).length} service
        {Object.keys(grouped).length !== 1 ? "s" : ""}
      </p>
      {Object.entries(grouped).map(([service, items]) => (
        <div key={service} className="space-y-2">
          <h3 className="text-sm font-medium">{service}</h3>
          <div className="space-y-2">
            {items.map((result, index) => (
              <ApiResultCard
                key={index}
                result={result}
                onClick={() =>
                  navigate("/apis/detail", { state: { result } })
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
