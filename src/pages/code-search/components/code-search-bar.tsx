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
import { useCodeFilters } from "@/hooks/use-code-search"
import type { CodeFilterProject, CodeFilterRepository } from "@/types/code"

function FilterCombobox<T extends { id: string; display_name: string }>({
  items,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  disabled,
  className,
}: {
  items: T[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  searchPlaceholder: string
  disabled?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)

  const selectedLabel =
    value === "all" || !value
      ? placeholder
      : items.find((i) => i.id === value)?.display_name ?? placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={`w-48 justify-between text-xs font-normal ${className ?? ""}`}
        >
          <span className="truncate">{selectedLabel}</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            className="shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                data-checked={value === "all" || !value}
                onSelect={() => {
                  onChange("all")
                  setOpen(false)
                }}
              >
                {placeholder}
              </CommandItem>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.display_name}
                  data-checked={value === item.id}
                  onSelect={() => {
                    onChange(item.id)
                    setOpen(false)
                  }}
                >
                  {item.display_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface CodeSearchBarProps {
  query: string
  onQueryChange: (query: string) => void
  project: string
  repository: string
  onProjectChange: (project: string, resetRepo?: boolean) => void
  onRepositoryChange: (repository: string) => void
  onSubmit: () => void
  isStreaming: boolean
  onStop: () => void
}

export function CodeSearchBar({
  query,
  onQueryChange,
  project,
  repository,
  onProjectChange,
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
          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ask about your codebase..."
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

      <div className="flex gap-2">
        <FilterCombobox<CodeFilterProject>
          items={filters?.projects ?? []}
          value={project || "all"}
          onChange={(value) => onProjectChange(value, true)}
          placeholder="All projects"
          searchPlaceholder="Search projects..."
        />

        <FilterCombobox<CodeFilterRepository>
          items={repositories}
          value={repository || "all"}
          onChange={onRepositoryChange}
          placeholder="All repositories"
          searchPlaceholder="Search repositories..."
          disabled={!project || project === "all"}
        />
      </div>
    </form>
  )
}
