import { StreamingText } from "@/components/streaming-text"
import { HttpMethodBadge } from "@/components/http-method-badge"
import type { ApiSource } from "@/types/api"

interface ApiStreamingResponseProps {
  content: string
  sources: ApiSource[]
  isStreaming: boolean
}

export function ApiStreamingResponse({
  content,
  sources,
  isStreaming,
}: ApiStreamingResponseProps) {
  if (!content && !isStreaming) return null

  return (
    <div className="space-y-6">
      <StreamingText content={content} isStreaming={isStreaming} />

      {sources.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Related Endpoints
          </h3>
          <div className="space-y-1.5">
            {sources.map((source, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border px-3 py-2"
              >
                <HttpMethodBadge method={source.method} />
                <p className="min-w-0 truncate font-mono text-xs">
                  {source.path}
                </p>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {source.service}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
