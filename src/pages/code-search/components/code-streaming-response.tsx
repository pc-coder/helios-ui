import { StreamingText } from "@/components/streaming-text"
import { CodeSourceCard } from "./code-source-card"
import type { CodeSource } from "@/types/code"

interface CodeStreamingResponseProps {
  content: string
  sources: CodeSource[]
  isStreaming: boolean
}

export function CodeStreamingResponse({
  content,
  sources,
  isStreaming,
}: CodeStreamingResponseProps) {
  if (!content && !isStreaming) return null

  return (
    <div className="space-y-6">
      <StreamingText content={content} isStreaming={isStreaming} />

      {sources.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Sources
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((source, index) => (
              <CodeSourceCard key={index} source={source} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
