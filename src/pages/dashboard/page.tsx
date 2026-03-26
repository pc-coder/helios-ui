import { useCodeStats } from "@/hooks/use-code-search"
import { useApiStats } from "@/hooks/use-api-search"
import { HeliosLogo } from "@/components/helios-logo"
import { StatsRibbon } from "./components/stats-ribbon"
import { QuickSearch } from "./components/quick-search"

export function DashboardPage() {
  const { data: codeStats, isLoading: codeLoading } = useCodeStats()
  const { data: apiStats, isLoading: apiLoading } = useApiStats()

  return (
    <div className="flex flex-col items-center gap-10 pt-12">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <HeliosLogo size={40} />
          <h1 className="text-3xl font-bold tracking-tight">Helios</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Your enterprise gateway to code intelligence and API discovery
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <QuickSearch />
      </div>

      <div className="w-full">
        <StatsRibbon
          codeStats={codeStats}
          apiStats={apiStats}
          isLoading={codeLoading || apiLoading}
        />
      </div>
    </div>
  )
}
