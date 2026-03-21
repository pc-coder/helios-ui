import { useCallback } from "react"
import { useSearchParams } from "react-router"
import { useSSEStream } from "@/hooks/use-sse-stream"
import { useApiRawSearch } from "@/hooks/use-api-search"
import { ApiSearchBar } from "./components/api-search-bar"
import { ApiStreamingResponse } from "./components/api-streaming-response"
import { ApiRawResults } from "./components/api-raw-results"
import type { ApiSource } from "@/types/api"

export function ApiSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const method = searchParams.get("method") ?? ""
  const service = searchParams.get("service") ?? ""
  const mode = (searchParams.get("mode") as "semantic" | "raw") ?? "semantic"

  const { content, sources, isStreaming, error, startStream, abortStream } =
    useSSEStream<ApiSource>()

  const rawSearch = useApiRawSearch(mode === "raw" ? query : "", {
    method: method && method !== "all" ? method : undefined,
    service: service && service !== "all" ? service : undefined,
  })

  const updateParam = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value && value !== "all") {
          next.set(key, value)
        } else {
          next.delete(key)
        }
        return next
      })
    },
    [setSearchParams]
  )

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim()
    if (!trimmed) return

    if (mode === "raw") return // React Query handles raw search

    const filters: Record<string, string> = {}
    if (method && method !== "all") filters.method = method
    if (service && service !== "all") filters.service = service

    startStream("/api/search", {
      query: trimmed,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    })
  }, [query, method, service, mode, startStream])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Search</h1>
        <p className="text-sm text-muted-foreground">
          Discover and explore API endpoints across your services
        </p>
      </div>

      <ApiSearchBar
        query={query}
        onQueryChange={(value) => updateParam("q", value)}
        method={method}
        onMethodChange={(value) => updateParam("method", value)}
        service={service}
        onServiceChange={(value) => updateParam("service", value)}
        mode={mode}
        onModeChange={(value) => updateParam("mode", value)}
        onSubmit={handleSubmit}
        isStreaming={isStreaming}
        onStop={abortStream}
      />

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {mode === "semantic" ? (
        <ApiStreamingResponse
          content={content}
          sources={sources}
          isStreaming={isStreaming}
        />
      ) : (
        <ApiRawResults
          results={rawSearch.data?.results}
          isLoading={rawSearch.isLoading}
        />
      )}

      {!content && !isStreaming && !error && mode === "semantic" && (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
          <p className="text-sm text-muted-foreground">
            Ask about API endpoints using natural language
          </p>
          <p className="text-xs text-muted-foreground">
            e.g. "Endpoint to create a new user"
          </p>
        </div>
      )}

      {mode === "raw" && !rawSearch.data && !rawSearch.isLoading && (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
          <p className="text-sm text-muted-foreground">
            Search for API endpoints by keyword
          </p>
          <p className="text-xs text-muted-foreground">
            e.g. "create user" or "payment"
          </p>
        </div>
      )}
    </div>
  )
}
