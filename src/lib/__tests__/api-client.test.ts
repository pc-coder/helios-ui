import { describe, it, expect, vi, beforeEach } from "vitest"
import { apiGet, apiPost } from "../api-client"
import { HeliosError } from "@/types/errors"

describe("apiGet", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("returns parsed JSON on success", async () => {
    const data = { projects_count: 12 }
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(data),
      })
    )

    const result = await apiGet("/code/stats")

    expect(result).toEqual(data)
  })

  it("throws HeliosError on error response with body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: () =>
          Promise.resolve({
            error: { code: "invalid_request", message: "query is required" },
          }),
      })
    )

    await expect(apiGet("/code/search")).rejects.toThrow(HeliosError)
    await expect(apiGet("/code/search")).rejects.toMatchObject({
      code: "invalid_request",
      message: "query is required",
      status: 400,
    })
  })

  it("throws HeliosError with fallback on error without body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: () => Promise.reject(new Error("no body")),
      })
    )

    await expect(apiGet("/fail")).rejects.toMatchObject({
      code: "internal_error",
      message: "Internal Server Error",
      status: 500,
    })
  })
})

describe("apiPost", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("sends JSON body with correct headers", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    })
    vi.stubGlobal("fetch", mockFetch)

    await apiPost("/api/raw-search", { query: "test" })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/raw-search"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ query: "test" }),
      })
    )
  })

  it("returns parsed JSON on success", async () => {
    const data = { results: [{ service: "test" }] }
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(data),
      })
    )

    const result = await apiPost("/api/raw-search", { query: "test" })

    expect(result).toEqual(data)
  })
})
