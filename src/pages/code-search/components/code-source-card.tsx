import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon, Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import type { CodeSource } from "@/types/code"

interface CodeSourceCardProps {
  source: CodeSource
}

export function CodeSourceCard({ source }: CodeSourceCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(
      `${source.repository}/${source.file}:${source.lines}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [source])

  return (
    <Card className="group/source transition-colors hover:border-primary/30">
      <CardContent className="flex items-start gap-3 p-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded bg-muted">
          <HugeiconsIcon
            icon={File01Icon}
            size={14}
            className="text-muted-foreground"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="truncate font-mono text-xs font-medium">
            {source.file}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {source.repository} · L{source.lines}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity group-hover/source:opacity-100 hover:text-foreground"
          aria-label="Copy file path"
        >
          <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} size={12} />
        </button>
      </CardContent>
    </Card>
  )
}
