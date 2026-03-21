import { useSearchParamUpdater } from "@/hooks/use-search-params-state"
import { ApiSemanticSearch } from "./components/api-semantic-search"
import { ApiRawSearch } from "./components/api-raw-search"

export function ApiSearchPage() {
  const { searchParams, updateParam } = useSearchParamUpdater()
  const query = searchParams.get("q") ?? ""
  const method = searchParams.get("method") ?? ""
  const service = searchParams.get("service") ?? ""
  const mode = (searchParams.get("mode") as "semantic" | "raw") ?? "semantic"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Search</h1>
        <p className="text-sm text-muted-foreground">
          Discover and explore API endpoints across your services
        </p>
      </div>

      {mode === "semantic" ? (
        <ApiSemanticSearch
          query={query}
          method={method}
          service={service}
          mode={mode}
          updateParam={updateParam}
        />
      ) : (
        <ApiRawSearch
          query={query}
          method={method}
          service={service}
          mode={mode}
          updateParam={updateParam}
        />
      )}
    </div>
  )
}
