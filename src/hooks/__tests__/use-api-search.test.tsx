import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useApiStats, useApiFilters, useApiRawSearch } from "../use-api-search"
import { createWrapper } from "@/test/wrapper"

vi.mock("@/lib/api-client", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}))

import { apiGet, apiPost } from "@/lib/api-client"
const mockApiGet = vi.mocked(apiGet)
const mockApiPost = vi.mocked(apiPost)

describe("useApiStats", () => {
  beforeEach(() => vi.restoreAllMocks())

  it("fetches and returns API stats", async () => {
    const stats = { apis_count: 320, services_count: 15 }
    mockApiGet.mockResolvedValue(stats)

    const { result } = renderHook(() => useApiStats(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(stats)
    expect(mockApiGet).toHaveBeenCalledWith("/v1/api/stats")
  })
})

describe("useApiFilters", () => {
  beforeEach(() => vi.restoreAllMocks())

  it("fetches and returns API filters", async () => {
    const filters = { methods: [], services: [] }
    mockApiGet.mockResolvedValue(filters)

    const { result } = renderHook(() => useApiFilters(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(filters)
    expect(mockApiGet).toHaveBeenCalledWith("/v1/api/filters")
  })
})

describe("useApiRawSearch", () => {
  beforeEach(() => vi.restoreAllMocks())

  it("is disabled when query is empty", () => {
    const { result } = renderHook(() => useApiRawSearch("", {}), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe("idle")
    expect(mockApiPost).not.toHaveBeenCalled()
  })

  it("fetches results when query is provided", async () => {
    const response = { results: [{ service: "test", method: "GET", path: "/", summary: "x", score: 0.9 }] }
    mockApiPost.mockResolvedValue(response)

    const { result } = renderHook(() => useApiRawSearch("user", {}), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(response)
    expect(mockApiPost).toHaveBeenCalledWith("/v1/api/raw-search", {
      query: "user",
      filters: {},
    })
  })
})
