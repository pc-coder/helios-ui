import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Cancel01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useApiFilters } from "@/hooks/use-api-search"
import type { ApiFilterService } from "@/types/api"

function ServiceCombobox({
  services,
  value,
  onChange,
}: {
  services: ApiFilterService[]
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)

  const selectedLabel =
    value === "all"
      ? "All services"
      : services.find((s) => s.id === value)?.display_name ?? "All services"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-52 justify-between text-xs font-normal"
        >
          <span className="truncate">{selectedLabel}</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            className="shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search services..." />
          <CommandList>
            <CommandEmpty>No services found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                data-checked={value === "all"}
                onSelect={() => {
                  onChange("all")
                  setOpen(false)
                }}
              >
                All services
              </CommandItem>
              {services.map((s) => (
                <CommandItem
                  key={s.id}
                  value={s.display_name}
                  data-checked={value === s.id}
                  onSelect={() => {
                    onChange(s.id)
                    setOpen(false)
                  }}
                >
                  {s.display_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface ApiSearchBarProps {
  query: string
  onQueryChange: (query: string) => void
  method: string
  onMethodChange: (method: string) => void
  service: string
  onServiceChange: (service: string) => void
  mode: "semantic" | "raw"
  onModeChange: (mode: "semantic" | "raw") => void
  onSubmit: () => void
  isStreaming: boolean
  onStop: () => void
}

export function ApiSearchBar({
  query,
  onQueryChange,
  method,
  onMethodChange,
  service,
  onServiceChange,
  mode,
  onModeChange,
  onSubmit,
  isStreaming,
  onStop,
}: ApiSearchBarProps) {
  const { data: filters } = useApiFilters()

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
          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={
            mode === "semantic"
              ? "Ask about APIs... e.g. endpoint to create a new user"
              : "Search API endpoints..."
          }
          className="h-12 pr-24 pl-10 text-sm"
        />
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          {isStreaming ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onStop}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
              Stop
            </Button>
          ) : (
            <Button type="submit" size="sm" disabled={!query.trim()}>
              Search
              <kbd className="ml-1 rounded border border-current/20 px-1 text-[10px] opacity-50">
                ↵
              </kbd>
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select value={method} onValueChange={onMethodChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All methods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All methods</SelectItem>
            {filters?.methods.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.display_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ServiceCombobox
          services={filters?.services ?? []}
          value={service}
          onChange={onServiceChange}
        />

        <div className="ml-auto">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => {
              if (value) onModeChange(value as "semantic" | "raw")
            }}
            className="gap-1"
          >
            <ToggleGroupItem value="semantic" className="text-xs">
              Semantic
            </ToggleGroupItem>
            <ToggleGroupItem value="raw" className="text-xs">
              Raw
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </form>
  )
}
