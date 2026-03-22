import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useProjects, useProjectDetail, useRepositoryHealth } from "../use-projects"
import { createWrapper } from "@/test/wrapper"

vi.mock("@/lib/api-client", () => ({
  apiGet: vi.fn(),
}))

import { apiGet } from "@/lib/api-client"
const mockApiGet = vi.mocked(apiGet)

describe("useProjects", () => {
  beforeEach(() => vi.restoreAllMocks())

  it("fetches project list", async () => {
    const data = { projects: [{ id: "p1", display_name: "Project 1" }] }
    mockApiGet.mockResolvedValue(data)

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(data)
    expect(mockApiGet).toHaveBeenCalledWith("/v1/projects")
  })
})

describe("useProjectDetail", () => {
  beforeEach(() => vi.restoreAllMocks())

  it("fetches project detail by ID", async () => {
    const data = { id: "payments", display_name: "Payments", repositories: [] }
    mockApiGet.mockResolvedValue(data)

    const { result } = renderHook(() => useProjectDetail("payments"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(data)
    expect(mockApiGet).toHaveBeenCalledWith("/v1/projects/payments")
  })

  it("is disabled when projectId is empty", () => {
    const { result } = renderHook(() => useProjectDetail(""), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe("idle")
  })
})

describe("useRepositoryHealth", () => {
  beforeEach(() => vi.restoreAllMocks())

  it("fetches repository health", async () => {
    const data = { id: "payments-api", display_name: "Payments API" }
    mockApiGet.mockResolvedValue(data)

    const { result } = renderHook(
      () => useRepositoryHealth("payments", "payments-api"),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(data)
    expect(mockApiGet).toHaveBeenCalledWith(
      "/v1/projects/payments/repositories/payments-api"
    )
  })

  it("is disabled when IDs are empty", () => {
    const { result } = renderHook(() => useRepositoryHealth("", ""), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe("idle")
  })
})
