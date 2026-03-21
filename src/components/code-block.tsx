import { useEffect, useState, useCallback } from "react"
import { codeToHtml } from "shiki"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language: string
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    codeToHtml(code, {
      lang: language,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    }).then((result) => {
      if (!cancelled) setHtml(result)
    })

    return () => {
      cancelled = true
    }
  }, [code, language])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const copyButton = (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 rounded-md border bg-background/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur transition-opacity hover:text-foreground group-hover/code:opacity-100"
      aria-label="Copy code"
    >
      <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} size={14} />
    </button>
  )

  if (!html) {
    return (
      <div className={cn("group/code relative", className)}>
        <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-xs">
          <code>{code}</code>
        </pre>
        {copyButton}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group/code relative [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:p-4 [&_pre]:text-xs",
        className
      )}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {copyButton}
    </div>
  )
}
