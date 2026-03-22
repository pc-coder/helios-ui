import { describe, it, expect, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import {
  useSearchParamUpdater,
  useAutoSubmit,
} from "../use-search-params-state"

function createRouterWrapper(initialEntries?: string[]) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries ?? ["/"]}>
        {children}
      </MemoryRouter>
    )
  }
}

describe("useSearchParamUpdater", () => {
  it("sets a search param", () => {
    const { result } = renderHook(() => useSearchParamUpdater(), {
      wrapper: createRouterWrapper(),
    })

    act(() => {
      result.current.updateParam("q", "test query")
    })

    expect(result.current.searchParams.get("q")).toBe("test query")
  })

  it("deletes param when value is empty", () => {
    const { result } = renderHook(() => useSearchParamUpdater(), {
      wrapper: createRouterWrapper(["/?q=existing"]),
    })

    act(() => {
      result.current.updateParam("q", "")
    })

    expect(result.current.searchParams.has("q")).toBe(false)
  })

  it("deletes param when value is 'all'", () => {
    const { result } = renderHook(() => useSearchParamUpdater(), {
      wrapper: createRouterWrapper(["/?project=payments"]),
    })

    act(() => {
      result.current.updateParam("project", "all")
    })

    expect(result.current.searchParams.has("project")).toBe(false)
  })
})

describe("useAutoSubmit", () => {
  it("calls onSubmit when auto=1 and query present", () => {
    const onSubmit = vi.fn()

    renderHook(
      () => {
        const { searchParams, setSearchParams } = useSearchParamUpdater()
        useAutoSubmit(searchParams, "test", onSubmit, setSearchParams)
      },
      { wrapper: createRouterWrapper(["/?auto=1&q=test"]) }
    )

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it("does not call onSubmit when auto param is absent", () => {
    const onSubmit = vi.fn()

    renderHook(
      () => {
        const { searchParams, setSearchParams } = useSearchParamUpdater()
        useAutoSubmit(searchParams, "test", onSubmit, setSearchParams)
      },
      { wrapper: createRouterWrapper(["/?q=test"]) }
    )

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("does not call onSubmit when query is empty", () => {
    const onSubmit = vi.fn()

    renderHook(
      () => {
        const { searchParams, setSearchParams } = useSearchParamUpdater()
        useAutoSubmit(searchParams, "", onSubmit, setSearchParams)
      },
      { wrapper: createRouterWrapper(["/?auto=1"]) }
    )

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
