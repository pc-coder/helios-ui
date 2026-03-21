import { Link } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import { HealthIndicator, LanguageBar } from "./health-indicators"
import type { ProjectSummary } from "@/types/projects"

interface ProjectCardProps {
  project: ProjectSummary
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="transition-colors hover:border-primary/30">
        <CardContent className="space-y-4 p-5">
          <div>
            <h3 className="font-semibold">{project.display_name}</h3>
            <p className="text-xs text-muted-foreground">
              {project.repositories_count} repositor
              {project.repositories_count !== 1 ? "ies" : "y"}
            </p>
          </div>

          <div className="flex justify-between">
            <HealthIndicator label="PRs" value={project.open_prs_count} />
            <HealthIndicator label="Issues" value={project.open_issues_count} />
            <HealthIndicator
              label="Stale"
              value={project.stale_branches_count}
              thresholds={{ warn: 3, danger: 6 }}
            />
          </div>

          <LanguageBar languages={project.languages} />
        </CardContent>
      </Card>
    </Link>
  )
}
