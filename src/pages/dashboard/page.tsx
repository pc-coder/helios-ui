import { useCodeStats } from "@/hooks/use-code-search"
import { useApiStats } from "@/hooks/use-api-search"
import { StatsCards } from "./components/stats-cards"
import { QuickSearch } from "./components/quick-search"

export function DashboardPage() {
  const { data: codeStats, isLoading: codeLoading } = useCodeStats()
  const { data: apiStats, isLoading: apiLoading } = useApiStats()

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your codebases and APIs
        </p>
      </div>

      <StatsCards
        codeStats={codeStats}
        apiStats={apiStats}
        isLoading={codeLoading || apiLoading}
      />

      <QuickSearch />

      {codeStats && (
        <div className="text-center text-xs text-muted-foreground">
          Indexing {codeStats.languages.join(", ")} across{" "}
          {codeStats.repositories_count} repositories
        </div>
      )}
    </div>
  )
}
