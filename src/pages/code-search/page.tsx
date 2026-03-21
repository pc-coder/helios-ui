import { useCallback, useEffect, useRef } from "react"
import { useSearchParams } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { SourceCodeIcon } from "@hugeicons/core-free-icons"
import { useSSEStream } from "@/hooks/use-sse-stream"
import { CodeSearchBar } from "./components/code-search-bar"
import { CodeStreamingResponse } from "./components/code-streaming-response"
import type { CodeSource } from "@/types/code"

export function CodeSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const project = searchParams.get("project") ?? ""
  const repository = searchParams.get("repository") ?? ""

  const { content, sources, isStreaming, error, startStream, abortStream } =
    useSSEStream<CodeSource>()

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

    const filters: Record<string, string> = {}
    if (project && project !== "all") filters.project = project
    if (repository && repository !== "all") filters.repository = repository

    startStream("/code/search", {
      query: trimmed,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    })
  }, [query, project, repository, startStream])

  const autoSubmitted = useRef(false)
  useEffect(() => {
    if (searchParams.get("auto") === "1" && query.trim() && !autoSubmitted.current) {
      autoSubmitted.current = true
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete("auto")
        return next
      }, { replace: true })
      handleSubmit()
    }
  }, [searchParams, query, handleSubmit, setSearchParams])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Code Search</h1>
        <p className="text-sm text-muted-foreground">
          Ask questions about your codebase using natural language
        </p>
      </div>

      <CodeSearchBar
        query={query}
        onQueryChange={(value) => updateParam("q", value)}
        project={project}
        onProjectChange={(value) => updateParam("project", value)}
        repository={repository}
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
          <HugeiconsIcon icon={SourceCodeIcon} size={40} className="text-muted-foreground/30" />
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
