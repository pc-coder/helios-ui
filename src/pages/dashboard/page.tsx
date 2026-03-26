import { useCodeStats } from "@/hooks/use-code-search"
import { useApiStats } from "@/hooks/use-api-search"
import { HeliosLogo } from "@/components/helios-logo"
import { StatsRibbon } from "./components/stats-ribbon"
import { QuickSearch } from "./components/quick-search"

export function DashboardPage() {
  const { data: codeStats, isLoading: codeLoading } = useCodeStats()
  const { data: apiStats, isLoading: apiLoading } = useApiStats()

  return (
    <div className="flex min-h-[calc(100vh-3rem-3rem)] flex-col items-center">
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-14 pb-24">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <HeliosLogo size={40} />
            <h1 className="text-3xl font-bold tracking-tight">Helios</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Your enterprise gateway to code intelligence and API discovery
          </p>
        </div>

        <div className="w-full max-w-3xl px-6">
          <QuickSearch />
        </div>
      </div>

      <div className="mt-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 pb-6">
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            What&apos;s indexed
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="w-full">
          <StatsRibbon
            codeStats={codeStats}
            apiStats={apiStats}
            isLoading={codeLoading || apiLoading}
          />
        </div>
      </div>
    </div>
  )
}
