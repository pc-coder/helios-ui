import { useParams, Link } from "react-router"
import { useRepositoryHealth, useProjectDetail } from "@/hooks/use-projects"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BranchesCard } from "./components/branches-card"
import { OverviewCard } from "./components/overview-card"
import { PipelinesCard } from "./components/pipelines-card"
import { LargeFilesCard } from "./components/large-files-card"

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
        <BranchesCard repo={repo} />
        <OverviewCard repo={repo} />
        <PipelinesCard repo={repo} />
        <LargeFilesCard repo={repo} />
      </div>
    </div>
  )
}
