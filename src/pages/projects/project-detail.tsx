import { useParams, Link } from "react-router"
import { useProjectDetail } from "@/hooks/use-projects"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { RepositoryCard } from "./components/repository-card"

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project, isLoading, error } = useProjectDetail(projectId ?? "")

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
            <BreadcrumbPage>
              {project?.display_name ?? projectId}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      ) : project ? (
        <>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {project.display_name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {project.repositories.length} repositor
              {project.repositories.length !== 1 ? "ies" : "y"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {project.repositories.map((repo) => (
              <RepositoryCard
                key={repo.id}
                projectId={project.id}
                repository={repo}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
