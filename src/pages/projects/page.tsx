import { useMemo, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { useProjects } from "@/hooks/use-projects"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProjectCard } from "./components/project-card"

export function ProjectsPage() {
  const { data, isLoading, error } = useProjects()
  const [search, setSearch] = useState("")
  const [languageFilter, setLanguageFilter] = useState("")

  const allLanguages = useMemo(() => {
    if (!data) return []
    const langs = new Set<string>()
    for (const p of data.projects) {
      for (const l of p.languages) langs.add(l)
    }
    return Array.from(langs).sort()
  }, [data])

  const filtered = data?.projects.filter((p) => {
    const matchesName = p.display_name
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesLang =
      !languageFilter || languageFilter === "all"
        ? true
        : p.languages.includes(languageFilter)
    return matchesName && matchesLang
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Browse project health across your organization
        </p>
      </div>

      {!isLoading && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter projects..."
              className="h-9 pl-9 text-sm"
            />
          </div>
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="h-9 w-44 text-sm">
              <SelectValue placeholder="All languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All languages</SelectItem>
              {allLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No projects match your filters
        </p>
      )}
    </div>
  )
}
