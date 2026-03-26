import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon, Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons"
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
    <div className="group/source flex items-center gap-1.5 rounded py-1 pl-6 pr-2 hover:bg-muted">
      <HugeiconsIcon
        icon={File01Icon}
        size={13}
        className="shrink-0 text-muted-foreground"
      />
      <span className="min-w-0 truncate font-mono text-xs">
        {source.file}
      </span>
      <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
        :{source.lines}
      </span>
      <button
        onClick={handleCopy}
        className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover/source:opacity-100 hover:text-foreground"
        aria-label="Copy file path"
      >
        <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} size={12} />
      </button>
    </div>
  )
}
