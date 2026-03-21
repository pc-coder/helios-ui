import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RepositoryHealth } from "@/types/projects"

interface PipelinesCardProps {
  repo: RepositoryHealth
}

export function PipelinesCard({ repo }: PipelinesCardProps) {
  return (
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
  )
}
