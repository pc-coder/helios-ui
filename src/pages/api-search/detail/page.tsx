import { useLocation, useNavigate, Navigate } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  LinkSquare01Icon,
} from "@hugeicons/core-free-icons"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { HttpMethodBadge } from "@/components/http-method-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ApiRawResult } from "@/types/api"

interface SpecMethod {
  summary?: string
  description?: string
  tags?: string[]
  parameters?: SpecParameter[]
  responses?: Record<string, SpecResponse>
  consumes?: string[]
  produces?: string[]
}

interface SpecParameter {
  name: string
  in: string
  type?: string
  description?: string
  required?: boolean
  schema?: SpecSchema
}

interface SpecResponse {
  description?: string
  schema?: SpecSchema
}

interface SpecSchema {
  type?: string
  required?: string[]
  properties?: Record<
    string,
    { type?: string; example?: unknown; items?: { type?: string } }
  >
}

function extractSpec(apiSpec: Record<string, unknown>) {
  const paths = Object.entries(apiSpec)
  if (paths.length === 0) return null

  const [, methods] = paths[0]
  const methodEntries = Object.entries(methods as Record<string, SpecMethod>)
  if (methodEntries.length === 0) return null

  const [, spec] = methodEntries[0]
  return spec
}

function ParametersTable({ parameters }: { parameters: SpecParameter[] }) {
  const bodyParam = parameters.find((p) => p.in === "body")
  const otherParams = parameters.filter((p) => p.in !== "body")

  return (
    <div className="space-y-4">
      {otherParams.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase">
            Parameters
          </h4>
          <div className="rounded-lg border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">In</th>
                  <th className="px-3 py-2 text-left font-medium">Type</th>
                  <th className="px-3 py-2 text-left font-medium">Required</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {otherParams.map((param) => (
                  <tr key={param.name} className="border-b last:border-0">
                    <td className="px-3 py-2 font-mono">{param.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {param.in}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {param.type ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      {param.required ? (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          required
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">optional</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {param.description ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {bodyParam?.schema?.properties && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase">
            Request Body
          </h4>
          <div className="rounded-lg border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium">Field</th>
                  <th className="px-3 py-2 text-left font-medium">Type</th>
                  <th className="px-3 py-2 text-left font-medium">Required</th>
                  <th className="px-3 py-2 text-left font-medium">Example</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(bodyParam.schema.properties).map(
                  ([name, prop]) => (
                    <tr key={name} className="border-b last:border-0">
                      <td className="px-3 py-2 font-mono">{name}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {prop.type ?? "—"}
                        {prop.items ? `[${prop.items.type}]` : ""}
                      </td>
                      <td className="px-3 py-2">
                        {bodyParam.schema?.required?.includes(name) ? (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                          >
                            required
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            optional
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">
                        {prop.example !== undefined
                          ? String(prop.example)
                          : "—"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function ResponsesSection({
  responses,
}: {
  responses: Record<string, SpecResponse>
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground uppercase">
        Responses
      </h4>
      <div className="space-y-1.5">
        {Object.entries(responses).map(([status, resp]) => (
          <div
            key={status}
            className="flex items-center gap-3 rounded-lg border px-3 py-2"
          >
            <Badge
              variant={status.startsWith("2") ? "default" : "secondary"}
              className="font-mono text-[11px]"
            >
              {status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {resp.description ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ApiDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = (location.state as { result?: ApiRawResult })?.result

  if (!result) {
    return <Navigate to="/apis" replace />
  }

  const spec = extractSpec(result.api_spec)

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="gap-1.5 text-xs text-muted-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
        Back to results
      </Button>

      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <HttpMethodBadge method={result.method} className="text-sm px-3 py-1" />
            <h1 className="min-w-0 truncate font-mono text-lg font-semibold">
              {result.path}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {result.service}
            </span>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {Math.round(result.match_score * 100)}% match
            </span>
          </div>
          {result.summary && (
            <p className="text-sm text-foreground/80">{result.summary}</p>
          )}
        </div>

        <Separator />

        {/* Semantic Summary */}
        {result.generated_semantic_summary && (
          <div className="space-y-2">
            <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Summary
            </h3>
            <div className="prose prose-sm max-w-none prose-stone dark:prose-invert">
              <Markdown remarkPlugins={[remarkGfm]}>
                {result.generated_semantic_summary}
              </Markdown>
            </div>
          </div>
        )}

        {/* API Specification */}
        {spec && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Specification
              </h3>

              {spec.tags && spec.tags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  {spec.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[11px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {spec.parameters && spec.parameters.length > 0 && (
                <ParametersTable parameters={spec.parameters} />
              )}

              {spec.responses && <ResponsesSection responses={spec.responses} />}
            </div>
          </>
        )}

        {/* Source & Link */}
        {result.link && (
          <>
            <Separator />
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-[11px]">
                {result.source}
              </Badge>
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View in catalog
                <HugeiconsIcon icon={LinkSquare01Icon} size={12} />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
