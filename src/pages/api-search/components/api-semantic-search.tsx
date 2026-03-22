import { useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ApiIcon } from "@hugeicons/core-free-icons"
import { useSSEStream } from "@/hooks/use-sse-stream"
import {
  useSearchParamUpdater,
  useAutoSubmit,
} from "@/hooks/use-search-params-state"
import { ApiSearchBar } from "./api-search-bar"
import { ApiStreamingResponse } from "./api-streaming-response"
import type { ApiSource } from "@/types/api"

interface ApiSemanticSearchProps {
  query: string
  method: string
  service: string
  mode: "semantic" | "raw"
  updateParam: (key: string, value: string) => void
}

export function ApiSemanticSearch({
  query,
  method,
  service,
  mode,
  updateParam,
}: ApiSemanticSearchProps) {
  const { searchParams, setSearchParams } = useSearchParamUpdater()
  const { content, sources, isStreaming, error, startStream, abortStream } =
    useSSEStream<ApiSource>()

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim()
    if (!trimmed) return

    const filters: Record<string, string> = {}
    if (method && method !== "all") filters.method = method
    if (service && service !== "all") filters.service = service

    startStream("/v1/api/search", {
      query: trimmed,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    })
  }, [query, method, service, startStream])

  useAutoSubmit(searchParams, query, handleSubmit, setSearchParams)

  return (
    <>
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

      <ApiStreamingResponse
        content={content}
        sources={sources}
        isStreaming={isStreaming}
      />

      {!content && !isStreaming && !error && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <HugeiconsIcon
            icon={ApiIcon}
            size={40}
            className="text-muted-foreground/30"
          />
          <p className="text-sm text-muted-foreground">
            Ask about API endpoints using natural language
          </p>
          <p className="text-xs text-muted-foreground">
            e.g. "Endpoint to create a new user"
          </p>
        </div>
      )}
    </>
  )
}
