import { useEffect, useState } from "react"
import { codeToHtml } from "shiki"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language: string
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("")

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

  if (!html) {
    return (
      <pre
        className={cn(
          "overflow-x-auto rounded-lg border bg-muted p-4 text-xs",
          className
        )}
      >
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <div
      className={cn(
        "[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:p-4 [&_pre]:text-xs",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
