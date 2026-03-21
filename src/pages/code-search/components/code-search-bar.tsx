import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCodeFilters } from "@/hooks/use-code-search"

interface CodeSearchBarProps {
  query: string
  onQueryChange: (query: string) => void
  project: string
  onProjectChange: (project: string) => void
  repository: string
  onRepositoryChange: (repository: string) => void
  onSubmit: () => void
  isStreaming: boolean
  onStop: () => void
}

export function CodeSearchBar({
  query,
  onQueryChange,
  project,
  onProjectChange,
  repository,
  onRepositoryChange,
  onSubmit,
  isStreaming,
  onStop,
}: CodeSearchBarProps) {
  const { data: filters } = useCodeFilters()

  const selectedProject = filters?.projects.find((p) => p.id === project)
  const repositories = selectedProject?.repositories ?? []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ask about your codebase..."
          className="h-12 pl-10 pr-24 text-sm"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {isStreaming ? (
            <Button type="button" variant="destructive" size="sm" onClick={onStop}>
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
              Stop
            </Button>
          ) : (
            <Button type="submit" size="sm" disabled={!query.trim()}>
              Search
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Select
          value={project}
          onValueChange={(value) => {
            onProjectChange(value)
            onRepositoryChange("")
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {filters?.projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.display_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={repository}
          onValueChange={onRepositoryChange}
          disabled={!project || project === "all"}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All repositories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All repositories</SelectItem>
            {repositories.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.display_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  )
}
