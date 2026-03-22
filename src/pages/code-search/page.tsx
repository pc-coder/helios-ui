import { useCallback, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SourceCodeIcon } from "@hugeicons/core-free-icons"
import { useSSEStream } from "@/hooks/use-sse-stream"
import {
  useSearchParamUpdater,
  useAutoSubmit,
} from "@/hooks/use-search-params-state"
import { CodeSearchBar } from "./components/code-search-bar"
import { CodeStreamingResponse } from "./components/code-streaming-response"
import type { CodeSource } from "@/types/code"

export function CodeSearchPage() {
  const { searchParams, setSearchParams, updateParam, updateParams } =
    useSearchParamUpdater()

  const [queryInput, setQueryInput] = useState(
    () => searchParams.get("q") ?? ""
  )
  const project = searchParams.get("project") ?? ""
  const repository = searchParams.get("repository") ?? ""

  const { content, sources, isStreaming, error, startStream, abortStream } =
    useSSEStream<CodeSource>()

  const handleSubmit = useCallback(() => {
    const trimmed = queryInput.trim()
    if (!trimmed) return

    updateParam("q", trimmed)

    const filters: Record<string, string> = {}
    if (project && project !== "all") filters.project = project
    if (repository && repository !== "all") filters.repository = repository

    startStream("/v1/code/search", {
      query: trimmed,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    })
  }, [queryInput, project, repository, startStream, updateParam])

  useAutoSubmit(searchParams, queryInput, handleSubmit, setSearchParams)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Code Search</h1>
        <p className="text-sm text-muted-foreground">
          Ask questions about your codebase using natural language
        </p>
      </div>

      <CodeSearchBar
        query={queryInput}
        onQueryChange={setQueryInput}
        project={project}
        repository={repository}
        onProjectChange={(value, resetRepo) =>
          resetRepo
            ? updateParams({ project: value, repository: "" })
            : updateParam("project", value)
        }
        onRepositoryChange={(value) => updateParam("repository", value)}
        onSubmit={handleSubmit}
        isStreaming={isStreaming}
        onStop={abortStream}
      />

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <CodeStreamingResponse
        content={content}
        sources={sources}
        isStreaming={isStreaming}
      />

      {!content && !isStreaming && !error && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <HugeiconsIcon
            icon={SourceCodeIcon}
            size={40}
            className="text-muted-foreground/30"
          />
          <p className="text-sm text-muted-foreground">
            Ask a question to search across your codebases
          </p>
          <p className="text-xs text-muted-foreground">
            e.g. "How does the auth middleware validate tokens?"
          </p>
        </div>
      )}
    </div>
  )
}
