import { useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SourceCodeIcon } from "@hugeicons/core-free-icons"
import { StreamingText } from "@/components/streaming-text"
import { CodeSourceCard } from "./code-source-card"
import { Separator } from "@/components/ui/separator"
import type { CodeSource } from "@/types/code"

interface CodeStreamingResponseProps {
  content: string
  sources: CodeSource[]
  isStreaming: boolean
}

function groupByRepository(sources: CodeSource[]) {
  const groups: Record<string, CodeSource[]> = {}
  for (const source of sources) {
    const key = `${source.project}/${source.repository}`
    if (!groups[key]) groups[key] = []
    groups[key].push(source)
  }
  return groups
}

export function CodeStreamingResponse({
  content,
  sources,
  isStreaming,
}: CodeStreamingResponseProps) {
  const grouped = useMemo(() => groupByRepository(sources), [sources])

  if (!content && !isStreaming) return null

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="space-y-8">
        {isStreaming && !content && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary" />
            Thinking...
          </div>
        )}

        <StreamingText content={content} isStreaming={isStreaming} />

        {sources.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Sources
              </h3>
              <div className="space-y-3">
                {Object.entries(grouped).map(([repo, files]) => (
                  <div key={repo} className="space-y-0.5">
                    <div className="flex items-center gap-1.5 px-2 pb-1">
                      <HugeiconsIcon
                        icon={SourceCodeIcon}
                        size={13}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {repo}
                      </span>
                    </div>
                    {files.map((source, index) => (
                      <CodeSourceCard key={index} source={source} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
