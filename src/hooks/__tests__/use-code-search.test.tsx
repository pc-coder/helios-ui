import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useCodeStats, useCodeFilters } from "../use-code-search"
import { createWrapper } from "@/test/wrapper"

vi.mock("@/lib/api-client", () => ({
  apiGet: vi.fn(),
}))

import { apiGet } from "@/lib/api-client"
const mockApiGet = vi.mocked(apiGet)

describe("useCodeStats", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("fetches and returns code stats", async () => {
    const stats = { projects_count: 12, repositories_count: 48 }
    mockApiGet.mockResolvedValue(stats)

    const { result } = renderHook(() => useCodeStats(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(stats)
    expect(mockApiGet).toHaveBeenCalledWith("/v1/code/stats")
  })
})

describe("useCodeFilters", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("fetches and returns code filters", async () => {
    const filters = {
      projects: [{ id: "p1", display_name: "P1", repositories: [] }],
    }
    mockApiGet.mockResolvedValue(filters)

    const { result } = renderHook(() => useCodeFilters(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(filters)
    expect(mockApiGet).toHaveBeenCalledWith("/v1/code/filters")
  })
})
