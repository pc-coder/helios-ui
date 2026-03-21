import { useCallback, useRef, useState } from "react"
import { streamSSE } from "@/lib/sse-client"

interface StreamState<TSource> {
  content: string
  sources: TSource[]
  isStreaming: boolean
  error: Error | null
}

export function useSSEStream<TSource>() {
  const [state, setState] = useState<StreamState<TSource>>({
    content: "",
    sources: [],
    isStreaming: false,
    error: null,
  })

  const contentRef = useRef("")
  const abortControllerRef = useRef<AbortController | null>(null)
  const rafRef = useRef<number | null>(null)

  const abortStream = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const startStream = useCallback(
    async (path: string, body: unknown) => {
      abortStream()

      contentRef.current = ""
      setState({ content: "", sources: [], isStreaming: true, error: null })

      const controller = new AbortController()
      abortControllerRef.current = controller

      const scheduleFlush = () => {
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null
            setState((prev) => ({ ...prev, content: contentRef.current }))
          })
        }
      }

      try {
        await streamSSE(
          path,
          body,
          (event) => {
            const data = event as { type: string; content?: string; sources?: TSource[] }

            if (data.type === "chunk" && data.content) {
              contentRef.current += data.content
              scheduleFlush()
            } else if (data.type === "sources" && data.sources) {
              setState((prev) => ({ ...prev, sources: data.sources! }))
            }
          },
          controller.signal
        )

        // Final flush
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
        setState((prev) => ({
          ...prev,
          content: contentRef.current,
          isStreaming: false,
        }))
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setState((prev) => ({ ...prev, isStreaming: false }))
          return
        }
        setState((prev) => ({
          ...prev,
          content: contentRef.current,
          isStreaming: false,
          error: err instanceof Error ? err : new Error(String(err)),
        }))
      }
    },
    [abortStream]
  )

  return { ...state, startStream, abortStream }
}
