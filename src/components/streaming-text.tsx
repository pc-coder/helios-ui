import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { CodeBlock } from "./code-block"

interface StreamingTextProps {
  content: string
  isStreaming: boolean
  className?: string
}

export function StreamingText({
  content,
  isStreaming,
  className,
}: StreamingTextProps) {
  if (!content && !isStreaming) return null

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none prose-stone dark:prose-invert prose-headings:font-semibold prose-p:leading-normal prose-pre:my-3",
        className
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || "")
            const codeString = String(children).replace(/\n$/, "")

            if (match) {
              return <CodeBlock code={codeString} language={match[1]} />
            }

            return (
              <code
                className={cn(
                  "rounded bg-muted px-1.5 py-0.5 font-mono text-xs",
                  codeClassName
                )}
                {...props}
              >
                {children}
              </code>
            )
          },
          pre({ children }) {
            return <>{children}</>
          },
        }}
      >
        {content}
      </Markdown>
      {isStreaming && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground" />
      )}
    </div>
  )
}
