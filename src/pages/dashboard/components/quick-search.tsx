import { useState } from "react"
import { useNavigate } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  SourceCodeIcon,
  ApiIcon,
} from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SearchMode = "code" | "apis"

export function QuickSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<SearchMode>("code")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/${mode}?q=${encodeURIComponent(trimmed)}&auto=1`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          size={18}
          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            mode === "code"
              ? "How does the auth middleware validate tokens?"
              : "Endpoint to create a new user"
          }
          className="h-12 pl-10 text-sm"
        />
      </div>

      <div className="flex justify-center">
        <Tabs value={mode} onValueChange={(v) => setMode(v as SearchMode)}>
          <TabsList>
            <TabsTrigger value="code" className="gap-1.5 px-4">
              <HugeiconsIcon icon={SourceCodeIcon} size={14} />
              Code
            </TabsTrigger>
            <TabsTrigger value="apis" className="gap-1.5 px-4">
              <HugeiconsIcon icon={ApiIcon} size={14} />
              APIs
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </form>
  )
}
