import { useState } from "react"
import { useNavigate } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  SourceCodeIcon,
  ApiIcon,
} from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type SearchMode = "code" | "apis"

export function QuickSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<SearchMode>("code")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/${mode}?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">What are you looking for?</h2>
        <p className="text-sm text-muted-foreground">
          Search across codebases and APIs using natural language
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-3">
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

        <div className="flex items-center justify-center">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => {
              if (value) setMode(value as SearchMode)
            }}
            className="gap-1"
          >
            <ToggleGroupItem value="code" className="gap-1.5 text-xs">
              <HugeiconsIcon icon={SourceCodeIcon} size={14} />
              Code
            </ToggleGroupItem>
            <ToggleGroupItem value="apis" className="gap-1.5 text-xs">
              <HugeiconsIcon icon={ApiIcon} size={14} />
              APIs
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </form>
    </div>
  )
}
