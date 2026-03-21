import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useSSEStream } from "../use-sse-stream"

vi.mock("@/lib/sse-client", () => ({
  streamSSE: vi.fn(),
}))

import { streamSSE } from "@/lib/sse-client"

const mockStreamSSE = vi.mocked(streamSSE)

describe("useSSEStream", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("has empty initial state", () => {
    const { result } = renderHook(() => useSSEStream())

    expect(result.current.content).toBe("")
    expect(result.current.sources).toEqual([])
    expect(result.current.isStreaming).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("sets isStreaming to true when stream starts", async () => {
    mockStreamSSE.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useSSEStream())

    act(() => {
      result.current.startStream("/test", { query: "test" })
    })

    expect(result.current.isStreaming).toBe(true)
  })

  it("accumulates content from chunk events", async () => {
    mockStreamSSE.mockImplementation(async (_path, _body, onEvent) => {
      onEvent({ type: "chunk", content: "Hello" })
      onEvent({ type: "chunk", content: " World" })
    })

    const { result } = renderHook(() => useSSEStream())

    await act(async () => {
      await result.current.startStream("/test", { query: "test" })
    })

    expect(result.current.content).toBe("Hello World")
    expect(result.current.isStreaming).toBe(false)
  })

  it("captures sources from sources event", async () => {
    const sources = [{ file: "test.go", lines: "1-10" }]
    mockStreamSSE.mockImplementation(async (_path, _body, onEvent) => {
      onEvent({ type: "sources", sources })
    })

    const { result } = renderHook(() => useSSEStream())

    await act(async () => {
      await result.current.startStream("/test", {})
    })

    expect(result.current.sources).toEqual(sources)
  })

  it("captures errors", async () => {
    mockStreamSSE.mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useSSEStream())

    await act(async () => {
      await result.current.startStream("/test", {})
    })

    expect(result.current.error?.message).toBe("Network error")
    expect(result.current.isStreaming).toBe(false)
  })

  it("handles AbortError silently", async () => {
    const abortError = new DOMException("Aborted", "AbortError")
    mockStreamSSE.mockRejectedValue(abortError)

    const { result } = renderHook(() => useSSEStream())

    await act(async () => {
      await result.current.startStream("/test", {})
    })

    expect(result.current.error).toBeNull()
    expect(result.current.isStreaming).toBe(false)
  })
})
