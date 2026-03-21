import { useMemo, useState } from "react"
import { useParams, Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { useProjectDetail } from "@/hooks/use-projects"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [search, setSearch] = useState("")
  const [languageFilter, setLanguageFilter] = useState("")

  const allLanguages = useMemo(() => {
    if (!project) return []
    const langs = new Set<string>()
    for (const r of project.repositories) {
      for (const l of r.languages) langs.add(l)
    }
    return Array.from(langs).sort()
  }, [project])

  const filtered = project?.repositories.filter((r) => {
    const matchesName = r.display_name
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesLang =
      !languageFilter || languageFilter === "all"
        ? true
        : r.languages.includes(languageFilter)
    return matchesName && matchesLang
  })

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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
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
                placeholder="Filter repositories..."
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

          {filtered && filtered.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((repo) => (
                <RepositoryCard
                  key={repo.id}
                  projectId={project.id}
                  repository={repo}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No repositories match your filters
            </p>
          )}
        </>
      ) : null}
    </div>
  )
}
