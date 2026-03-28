import { useState } from "react"
import { useLocation, useNavigate, Navigate } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  LinkSquare01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { HttpMethodBadge } from "@/components/http-method-badge"
import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApiRawResult } from "@/types/api"

/* ---------- OpenAPI type helpers ---------- */

interface SpecSchema {
  type?: string
  required?: string[]
  properties?: Record<string, SpecSchema>
  items?: SpecSchema
  example?: unknown
  additionalProperties?: boolean | SpecSchema
  $ref?: string
  enum?: string[]
  description?: string
  format?: string
}

interface SpecParameter {
  name: string
  in: string
  type?: string
  format?: string
  description?: string
  required?: boolean
  schema?: SpecSchema
  enum?: string[]
}

interface SpecResponse {
  description?: string
  schema?: SpecSchema
}

interface SpecMethod {
  summary?: string
  description?: string
  tags?: string[]
  parameters?: SpecParameter[]
  responses?: Record<string, SpecResponse>
  consumes?: string[]
  produces?: string[]
}

function extractSpec(apiSpec: Record<string, unknown>): SpecMethod | null {
  const paths = Object.entries(apiSpec)
  if (paths.length === 0) return null
  const [, methods] = paths[0]
  const methodEntries = Object.entries(methods as Record<string, SpecMethod>)
  if (methodEntries.length === 0) return null
  return methodEntries[0][1]
}

/* ---------- Schema helpers ---------- */

function formatType(schema: SpecSchema): string {
  if (schema.$ref) return schema.$ref.split("/").pop() ?? "ref"
  if (schema.type === "array") {
    if (schema.items) {
      if (schema.items.type === "object" && schema.items.properties) {
        return "array[object]"
      }
      return `array[${formatType(schema.items)}]`
    }
    return "array"
  }
  if (schema.type === "object" && !schema.properties) {
    if (schema.additionalProperties) return "object (dynamic)"
    return "object"
  }
  const base = schema.type ?? "any"
  return schema.format ? `${base} (${schema.format})` : base
}

function formatExample(value: unknown): string | null {
  if (value === undefined || value === null) return null
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

interface SchemaRow {
  name: string
  depth: number
  type: string
  required: boolean
  example: string | null
  description: string
  enumValues?: string[]
}

function flattenSchema(
  schema: SpecSchema,
  requiredFields: string[] = [],
  depth = 0
): SchemaRow[] {
  const rows: SchemaRow[] = []
  if (!schema.properties) return rows

  for (const [name, prop] of Object.entries(schema.properties)) {
    rows.push({
      name,
      depth,
      type: formatType(prop),
      required: requiredFields.includes(name),
      example: formatExample(prop.example),
      description: prop.description ?? "",
      enumValues: prop.enum,
    })

    if (prop.type === "object" && prop.properties) {
      rows.push(...flattenSchema(prop, prop.required, depth + 1))
    }

    if (
      prop.type === "array" &&
      prop.items?.type === "object" &&
      prop.items.properties
    ) {
      rows.push(...flattenSchema(prop.items, prop.items.required, depth + 1))
    }
  }
  return rows
}

/* ---------- Components ---------- */

function SchemaFields({ rows }: { rows: SchemaRow[] }) {
  if (rows.length === 0) return null
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="px-3 py-2 text-left font-medium">Field</th>
            <th className="px-3 py-2 text-left font-medium">Type</th>
            <th className="px-3 py-2 text-left font-medium">Required</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.name}-${i}`} className="border-b last:border-0">
              <td className="px-3 py-2">
                <div
                  className="flex items-start gap-1"
                  style={{ paddingLeft: `${row.depth * 1.25}rem` }}
                >
                  {row.depth > 0 && (
                    <span className="select-none font-mono text-muted-foreground/40">
                      └
                    </span>
                  )}
                  <div className="min-w-0">
                    <span className="font-mono">{row.name}</span>
                    {(row.description || row.example) && (
                      <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                        {row.description}
                        {row.example && (
                          <span className="ml-1 font-mono text-muted-foreground/70">
                            e.g. {row.example}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 align-top font-mono text-muted-foreground">
                {row.type}
                {row.enumValues && (
                  <div className="mt-0.5 text-[11px]">
                    {row.enumValues.join(" | ")}
                  </div>
                )}
              </td>
              <td className="px-3 py-2 align-top">
                {row.required ? (
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 text-[11px]"
                  >
                    required
                  </Badge>
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    optional
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ParametersCard({ parameters }: { parameters: SpecParameter[] }) {
  const bodyParam = parameters.find((p) => p.in === "body")
  const otherParams = parameters.filter((p) => p.in !== "body")

  if (otherParams.length === 0 && !bodyParam?.schema) return null

  return (
    <>
      {otherParams.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">In</th>
                    <th className="px-3 py-2 text-left font-medium">Type</th>
                    <th className="px-3 py-2 text-left font-medium">
                      Required
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {otherParams.map((param) => (
                    <tr
                      key={param.name}
                      className="border-b last:border-0"
                    >
                      <td className="px-3 py-2">
                        <div>
                          <span className="font-mono">{param.name}</span>
                          {param.description && (
                            <div className="mt-0.5 text-[11px] text-muted-foreground">
                              {param.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <Badge
                          variant="outline"
                          className="px-1.5 py-0 text-[11px]"
                        >
                          {param.in}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 align-top font-mono text-muted-foreground">
                        {param.type ?? param.schema?.type ?? "—"}
                        {param.enum && (
                          <div className="mt-0.5 text-[11px]">
                            {param.enum.join(" | ")}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 align-top">
                        {param.required ? (
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0 text-[11px]"
                          >
                            required
                          </Badge>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">
                            optional
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {bodyParam?.schema && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Request Body</CardTitle>
          </CardHeader>
          <CardContent>
            <SchemaFields
              rows={flattenSchema(bodyParam.schema, bodyParam.schema.required)}
            />
          </CardContent>
        </Card>
      )}
    </>
  )
}

function ResponsesCard({
  responses,
}: {
  responses: Record<string, SpecResponse>
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Responses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(responses).map(([status, resp]) => {
          const schemaRows = resp.schema
            ? flattenSchema(resp.schema, resp.schema.required)
            : []

          return (
            <div key={status} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={status.startsWith("2") ? "default" : "secondary"}
                  className="font-mono text-xs"
                >
                  {status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {resp.description ?? "—"}
                </span>
              </div>
              {schemaRows.length > 0 && (
                <SchemaFields rows={schemaRows} />
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

/* ---------- Page ---------- */

export function ApiDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showRaw, setShowRaw] = useState(false)
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

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <HttpMethodBadge
            method={result.method}
            className="px-3 py-1 text-sm"
          />
          <h1 className="min-w-0 truncate font-mono text-lg font-semibold">
            {result.path}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {result.service}
          </span>
          <span className="text-muted-foreground/30">·</span>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {Math.round(result.match_score * 100)}% match
          </span>
          {spec?.consumes?.map((c) => (
            <Badge key={c} variant="outline" className="font-mono text-[11px]">
              {c}
            </Badge>
          ))}
          {spec?.produces?.map((p) => (
            <Badge key={p} variant="outline" className="font-mono text-[11px]">
              {p}
            </Badge>
          ))}
          {spec?.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[11px]">
              {tag}
            </Badge>
          ))}
        </div>
        {result.summary && (
          <p className="text-sm text-foreground/80">{result.summary}</p>
        )}
        {spec?.description && spec.description !== result.summary && (
          <p className="text-sm text-muted-foreground">{spec.description}</p>
        )}
      </div>

      <Separator />

      {/* Semantic Summary */}
      {result.generated_semantic_summary && (
        <div className="rounded-lg border bg-card p-4">
          <div className="prose prose-sm max-w-none prose-stone dark:prose-invert">
            <Markdown remarkPlugins={[remarkGfm]}>
              {result.generated_semantic_summary}
            </Markdown>
          </div>
        </div>
      )}

      {/* API Specification */}
      {spec ? (
        <div className="space-y-4">
          {spec.parameters && spec.parameters.length > 0 && (
            <ParametersCard parameters={spec.parameters} />
          )}

          {spec.responses && <ResponsesCard responses={spec.responses} />}
        </div>
      ) : (
        Object.keys(result.api_spec).length === 0 && (
          <p className="py-6 text-center text-xs text-muted-foreground">
            No specification available for this endpoint.
          </p>
        )
      )}

      {/* Raw JSON */}
      <div className="space-y-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRaw(!showRaw)}
          className="gap-1.5 text-xs"
        >
          <HugeiconsIcon
            icon={showRaw ? ArrowUp01Icon : ArrowDown01Icon}
            size={14}
          />
          {showRaw ? "Hide Raw JSON" : "View Raw JSON"}
        </Button>
        {showRaw && (
          <CodeBlock
            code={JSON.stringify(result, null, 2)}
            language="json"
          />
        )}
      </div>

      {/* Source & Link */}
      {result.link && (
        <>
          <Separator />
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
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
  )
}
