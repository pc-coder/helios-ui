import { useMemo, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import type { Branch } from "@/types/projects"

interface BranchesDialogProps {
  branches: Branch[]
}

type SortBy = "oldest" | "newest" | "name"

function formatRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - timestamp
  const days = Math.floor(diff / 86400)

  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(months / 12)
  return `${years}y ago`
}

export function BranchesDialog({ branches }: BranchesDialogProps) {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("oldest")

  const filtered = useMemo(() => {
    let result = branches.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    )

    if (sortBy === "oldest") {
      result = [...result].sort(
        (a, b) => a.last_commit_timestamp - b.last_commit_timestamp
      )
    } else if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) => b.last_commit_timestamp - a.last_commit_timestamp
      )
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [branches, search, sortBy])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          Show all {branches.length} branches
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{branches.length} Branches</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              size={14}
              className="absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter branches..."
              className="h-8 pl-8 text-xs"
            />
          </div>
          <ToggleGroup
            type="single"
            value={sortBy}
            onValueChange={(v) => {
              if (v) setSortBy(v as SortBy)
            }}
            className="gap-0.5"
          >
            <ToggleGroupItem value="oldest" className="h-8 px-2 text-[11px]">
              Oldest
            </ToggleGroupItem>
            <ToggleGroupItem value="newest" className="h-8 px-2 text-[11px]">
              Newest
            </ToggleGroupItem>
            <ToggleGroupItem value="name" className="h-8 px-2 text-[11px]">
              A–Z
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <ScrollArea className="h-80">
          <div className="space-y-0.5 pr-3">
            {filtered.length > 0 ? (
              filtered.map((branch) => (
                <div
                  key={branch.name}
                  className="flex items-center justify-between rounded px-2 py-1.5 text-xs hover:bg-muted"
                >
                  <span className="min-w-0 truncate font-mono">
                    {branch.name}
                  </span>
                  <span className="shrink-0 pl-3 text-[11px] tabular-nums text-muted-foreground">
                    {formatRelativeTime(branch.last_commit_timestamp)}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No branches match "{search}"
              </p>
            )}
          </div>
        </ScrollArea>

        <p className="text-[11px] text-muted-foreground">
          {filtered.length} of {branches.length} branches
        </p>
      </DialogContent>
    </Dialog>
  )
}
