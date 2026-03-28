import { useLocation, useNavigate, Navigate } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, LinkSquare01Icon } from "@hugeicons/core-free-icons"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { HttpMethodBadge } from "@/components/http-method-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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

/* ---------- Schema type display ---------- */

function formatType(schema: SpecSchema): string {
  if (schema.$ref) return schema.$ref.split("/").pop() ?? "ref"
  if (schema.type === "array") {
    if (schema.items) {
      if (schema.items.type === "object" && schema.items.properties) {
        const keys = Object.keys(schema.items.properties).slice(0, 3)
        const suffix =
          Object.keys(schema.items.properties).length > 3 ? ", ..." : ""
        return `array[{${keys.join(", ")}${suffix}}]`
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

function formatExample(value: unknown): string {
  if (value === undefined || value === null) return "—"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

/* ---------- Recursive schema rows ---------- */

interface SchemaRow {
  name: string
  depth: number
  type: string
  required: boolean
  example: string
  description: string
  enumValues?: string[]
}

function flattenSchema(
  schema: SpecSchema,
  requiredFields: string[] = [],
  prefix = "",
  depth = 0
): SchemaRow[] {
  const rows: SchemaRow[] = []
  if (!schema.properties) return rows

  for (const [name, prop] of Object.entries(schema.properties)) {
    const fullName = prefix ? `${prefix}.${name}` : name
    rows.push({
      name: fullName,
      depth,
      type: formatType(prop),
      required: requiredFields.includes(name),
      example: formatExample(prop.example),
      description: prop.description ?? "",
      enumValues: prop.enum,
    })

    // Recurse into nested objects
    if (prop.type === "object" && prop.properties) {
      rows.push(...flattenSchema(prop, prop.required, fullName, depth + 1))
    }

    // Recurse into array items if they have properties
    if (
      prop.type === "array" &&
      prop.items?.type === "object" &&
      prop.items.properties
    ) {
      rows.push(
        ...flattenSchema(
          prop.items,
          prop.items.required,
          `${fullName}[]`,
          depth + 1
        )
      )
    }
  }
  return rows
}

/* ---------- Components ---------- */

function SchemaTable({
  title,
  rows,
}: {
  title: string
  rows: SchemaRow[]
}) {
  if (rows.length === 0) return null
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground uppercase">
        {title}
      </h4>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2 text-left font-medium">Field</th>
              <th className="px-3 py-2 text-left font-medium">Type</th>
              <th className="px-3 py-2 text-left font-medium">Required</th>
              <th className="px-3 py-2 text-left font-medium">Description</th>
              <th className="px-3 py-2 text-left font-medium">Example</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b last:border-0">
                <td className="px-3 py-2 font-mono" style={{ paddingLeft: `${0.75 + row.depth * 1}rem` }}>
                  {row.name.includes(".") || row.name.includes("[")
                    ? row.name.split(/[.[]+/).pop()?.replace("]", "") ?? row.name
                    : row.name}
                  {row.depth > 0 && (
                    <span className="ml-1 text-[10px] text-muted-foreground/50">
                      ({row.name})
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {row.type}
                  {row.enumValues && (
                    <span className="ml-1 text-[10px]">
                      [{row.enumValues.join(", ")}]
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {row.required ? (
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                      required
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">optional</span>
                  )}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {row.description || "—"}
                </td>
                <td className="max-w-48 truncate px-3 py-2 font-mono text-muted-foreground">
                  {row.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ParametersSection({ parameters }: { parameters: SpecParameter[] }) {
  const bodyParam = parameters.find((p) => p.in === "body")
  const otherParams = parameters.filter((p) => p.in !== "body")

  return (
    <div className="space-y-4">
      {otherParams.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase">
            Parameters
          </h4>
          <div className="overflow-x-auto rounded-lg border">
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
                      {param.type ?? param.schema?.type ?? "—"}
                      {param.enum && (
                        <span className="ml-1 text-[10px]">
                          [{param.enum.join(", ")}]
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {param.required ? (
                        <Badge
                          variant="secondary"
                          className="px-1.5 py-0 text-[10px]"
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

      {bodyParam?.schema && (
        <SchemaTable
          title="Request Body"
          rows={flattenSchema(bodyParam.schema, bodyParam.schema.required)}
        />
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
    <div className="space-y-3">
      <h4 className="text-xs font-medium text-muted-foreground uppercase">
        Responses
      </h4>
      <div className="space-y-4">
        {Object.entries(responses).map(([status, resp]) => {
          const schemaRows = resp.schema
            ? flattenSchema(resp.schema, resp.schema.required)
            : []

          return (
            <div key={status} className="space-y-2">
              <div className="flex items-center gap-2">
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
              {schemaRows.length > 0 && (
                <div className="ml-2">
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-3 py-1.5 text-left font-medium">
                            Field
                          </th>
                          <th className="px-3 py-1.5 text-left font-medium">
                            Type
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {schemaRows.map((row) => (
                          <tr
                            key={row.name}
                            className="border-b last:border-0"
                          >
                            <td className="px-3 py-1.5 font-mono" style={{ paddingLeft: `${0.75 + row.depth * 1}rem` }}>
                              {row.name.includes(".")
                                ? row.name.split(".").pop()
                                : row.name}
                            </td>
                            <td className="px-3 py-1.5 text-muted-foreground">
                              {row.type}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ContentTypeBadges({
  consumes,
  produces,
}: {
  consumes?: string[]
  produces?: string[]
}) {
  if (!consumes?.length && !produces?.length) return null
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      {consumes && consumes.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Accepts:</span>
          {consumes.map((c) => (
            <Badge key={c} variant="outline" className="font-mono text-[10px]">
              {c}
            </Badge>
          ))}
        </div>
      )}
      {produces && produces.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Returns:</span>
          {produces.map((p) => (
            <Badge key={p} variant="outline" className="font-mono text-[10px]">
              {p}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- Page ---------- */

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
            <HttpMethodBadge
              method={result.method}
              className="px-3 py-1 text-sm"
            />
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
          {spec?.description && spec.description !== result.summary && (
            <p className="text-sm text-muted-foreground">{spec.description}</p>
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
        {spec ? (
          <>
            <Separator />
            <div className="space-y-5">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Specification
              </h3>

              <ContentTypeBadges
                consumes={spec.consumes}
                produces={spec.produces}
              />

              {spec.tags && spec.tags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Tags:</span>
                  {spec.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[11px]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {spec.parameters && spec.parameters.length > 0 && (
                <ParametersSection parameters={spec.parameters} />
              )}

              {spec.responses && (
                <ResponsesSection responses={spec.responses} />
              )}
            </div>
          </>
        ) : (
          Object.keys(result.api_spec).length === 0 && (
            <>
              <Separator />
              <p className="text-xs text-muted-foreground">
                No specification available for this endpoint.
              </p>
            </>
          )
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
