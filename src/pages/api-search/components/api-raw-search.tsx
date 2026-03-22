import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ApiIcon } from "@hugeicons/core-free-icons"
import { useApiRawSearch } from "@/hooks/use-api-search"
import { ApiSearchBar } from "./api-search-bar"
import { ApiRawResults } from "./api-raw-results"

interface ApiRawSearchProps {
  query: string
  method: string
  service: string
  mode: "semantic" | "raw"
  updateParam: (key: string, value: string) => void
}

export function ApiRawSearch({
  query,
  method,
  service,
  mode,
  updateParam,
}: ApiRawSearchProps) {
  const [queryInput, setQueryInput] = useState(() => query)

  const rawSearch = useApiRawSearch(query, {
    method: method && method !== "all" ? method : undefined,
    service: service && service !== "all" ? service : undefined,
  })

  function handleSubmit() {
    const trimmed = queryInput.trim()
    if (trimmed) updateParam("q", trimmed)
  }

  return (
    <>
      <ApiSearchBar
        query={queryInput}
        onQueryChange={setQueryInput}
        method={method}
        onMethodChange={(value) => updateParam("method", value)}
        service={service}
        onServiceChange={(value) => updateParam("service", value)}
        mode={mode}
        onModeChange={(value) => updateParam("mode", value)}
        onSubmit={handleSubmit}
        isStreaming={false}
        onStop={() => {}}
      />

      <ApiRawResults
        results={rawSearch.data?.results}
        isLoading={rawSearch.isLoading}
      />

      {!rawSearch.data && !rawSearch.isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <HugeiconsIcon
            icon={ApiIcon}
            size={40}
            className="text-muted-foreground/30"
          />
          <p className="text-sm text-muted-foreground">
            Search for API endpoints by keyword
          </p>
          <p className="text-xs text-muted-foreground">
            e.g. "create user" or "payment"
          </p>
        </div>
      )}
    </>
  )
}
