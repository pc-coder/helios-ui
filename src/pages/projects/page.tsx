import { useProjects } from "@/hooks/use-projects"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "./components/project-card"

export function ProjectsPage() {
  const { data, isLoading, error } = useProjects()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Browse project health across your organization
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
