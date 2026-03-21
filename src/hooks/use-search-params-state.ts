import { useCallback, useEffect, useRef } from "react"
import { useSearchParams } from "react-router"

export function useSearchParamUpdater() {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value && value !== "all") {
          next.set(key, value)
        } else {
          next.delete(key)
        }
        return next
      })
    },
    [setSearchParams]
  )

  return { searchParams, setSearchParams, updateParam }
}

export function useAutoSubmit(
  searchParams: URLSearchParams,
  query: string,
  onSubmit: () => void,
  setSearchParams: ReturnType<typeof useSearchParams>[1]
) {
  const autoSubmitted = useRef(false)

  useEffect(() => {
    if (
      searchParams.get("auto") === "1" &&
      query.trim() &&
      !autoSubmitted.current
    ) {
      autoSubmitted.current = true
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.delete("auto")
          return next
        },
        { replace: true }
      )
      onSubmit()
    }
  }, [searchParams, query, onSubmit, setSearchParams])
}
