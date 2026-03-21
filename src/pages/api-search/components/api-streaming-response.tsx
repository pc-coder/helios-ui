import { StreamingText } from "@/components/streaming-text"
import { HttpMethodBadge } from "@/components/http-method-badge"
import { Card, CardContent } from "@/components/ui/card"
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
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Related Endpoints
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {sources.map((source, index) => (
              <Card key={index}>
                <CardContent className="flex items-center gap-3 p-4">
                  <HttpMethodBadge method={source.method} />
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm">{source.path}</p>
                    <p className="text-xs text-muted-foreground">{source.service}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
