import { Link } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import { LanguageBar } from "./health-indicators"
import { cn } from "@/lib/utils"
import type { ProjectSummary } from "@/types/projects"

interface ProjectCardProps {
  project: ProjectSummary
}

function HealthBadge({
  label,
  value,
  warn = 5,
  danger = 10,
}: {
  label: string
  value: number
  warn?: number
  danger?: number
}) {
  const color =
    value === 0
      ? "text-emerald-600 dark:text-emerald-400"
      : value >= danger
        ? "text-red-600 dark:text-red-400"
        : value >= warn
          ? "text-amber-600 dark:text-amber-400"
          : "text-foreground"

  return (
    <span className="text-xs text-muted-foreground">
      <span className={cn("font-semibold tabular-nums", color)}>{value}</span>{" "}
      {label}
    </span>
  )
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="transition-colors hover:border-primary/30">
        <CardContent className="space-y-2 px-4 py-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate text-sm font-semibold">
              {project.display_name}
            </h3>
            <span className="shrink-0 text-xs text-muted-foreground">
              {project.repositories_count} repos
            </span>
          </div>

          <div className="flex items-center gap-3">
            <HealthBadge label="PRs" value={project.open_prs_count} />
            <HealthBadge label="issues" value={project.open_issues_count} />
            <HealthBadge
              label="stale"
              value={project.stale_branches_count}
              warn={3}
              danger={6}
            />
          </div>

          <LanguageBar languages={project.languages} />
        </CardContent>
      </Card>
    </Link>
  )
}
