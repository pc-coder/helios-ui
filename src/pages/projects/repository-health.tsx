import { useParams, Link } from "react-router"
import { useRepositoryHealth, useProjectDetail } from "@/hooks/use-projects"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { LanguageBar } from "./components/health-indicators"

export function RepositoryHealthPage() {
  const { projectId, repositoryId } = useParams<{
    projectId: string
    repositoryId: string
  }>()

  const { data: project } = useProjectDetail(projectId ?? "")
  const {
    data: repo,
    isLoading,
    error,
  } = useRepositoryHealth(projectId ?? "", repositoryId ?? "")

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error.message}
      </div>
    )
  }

  if (!repo) return null

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/projects/${projectId}`}>
                {project?.display_name ?? projectId}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{repo.display_name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {repo.display_name}
        </h1>
        <p className="font-mono text-sm text-muted-foreground">
          Default branch: {repo.default_branch}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Branches */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Branches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">
                Total branches
              </span>
              <span className="text-lg font-semibold tabular-nums">
                {repo.total_branches}
              </span>
            </div>
            <Separator />
            {repo.stale_branches.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  {repo.stale_branches.length} stale branch
                  {repo.stale_branches.length !== 1 ? "es" : ""}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {repo.stale_branches.map((branch) => (
                    <Badge
                      key={branch}
                      variant="secondary"
                      className="font-mono text-xs"
                    >
                      {branch}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                No stale branches
              </p>
            )}
          </CardContent>
        </Card>

        {/* Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Open PRs</span>
              <span className="text-lg font-semibold tabular-nums">
                {repo.open_prs_count}
              </span>
            </div>
            <Separator />
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Open Issues</span>
              <span className="text-lg font-semibold tabular-nums">
                {repo.open_issues_count}
              </span>
            </div>
            <Separator />
            <LanguageBar languages={repo.languages} />
          </CardContent>
        </Card>

        {/* Pipelines */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pipelines</CardTitle>
          </CardHeader>
          <CardContent>
            {repo.pipelines.length > 0 ? (
              <div className="space-y-2">
                {repo.pipelines.map((pipeline) => (
                  <div
                    key={pipeline.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{pipeline.name}</span>
                    <a
                      href={pipeline.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No pipelines configured
              </p>
            )}
          </CardContent>
        </Card>

        {/* Large Files */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Large Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">&gt; 500 KB</span>
              <span className="tabular-nums">
                {repo.large_files.above_500kb}
              </span>
            </div>
            <Separator />
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">&gt; 1 MB</span>
              <span className="tabular-nums">{repo.large_files.above_1mb}</span>
            </div>
            <Separator />
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">&gt; 5 MB</span>
              <span className="tabular-nums">{repo.large_files.above_5mb}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
