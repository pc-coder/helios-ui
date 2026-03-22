import { describe, it, expect, vi, beforeEach } from "vitest"
import { streamSSE } from "../sse-client"
import { HeliosError } from "@/types/errors"

function createMockSSEResponse(events: string[]) {
  const encoder = new TextEncoder()
  const chunks = events.map((e) => encoder.encode(e))
  let index = 0

  return {
    ok: true,
    body: {
      getReader: () => ({
        read: () => {
          if (index < chunks.length) {
            return Promise.resolve({ done: false, value: chunks[index++] })
          }
          return Promise.resolve({ done: true, value: undefined })
        },
        releaseLock: vi.fn(),
      }),
    },
  }
}

describe("streamSSE", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("calls onEvent for each SSE data line", async () => {
    const onEvent = vi.fn()
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          createMockSSEResponse([
            'data: {"type":"chunk","content":"Hello"}\n\n',
            'data: {"type":"chunk","content":" World"}\n\n',
            'data: {"type":"done"}\n\n',
          ])
        )
    )

    await streamSSE("/code/search", { query: "test" }, onEvent)

    expect(onEvent).toHaveBeenCalledWith({ type: "chunk", content: "Hello" })
    expect(onEvent).toHaveBeenCalledWith({ type: "chunk", content: " World" })
    expect(onEvent).toHaveBeenCalledWith({ type: "done" })
  })

  it("stops on [DONE] marker", async () => {
    const onEvent = vi.fn()
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          createMockSSEResponse([
            'data: {"type":"chunk","content":"x"}\n\ndata: [DONE]\n\n',
          ])
        )
    )

    await streamSSE("/test", {}, onEvent)

    expect(onEvent).toHaveBeenCalledTimes(1)
  })

  it("skips malformed JSON lines", async () => {
    const onEvent = vi.fn()
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          createMockSSEResponse([
            "data: not-json\n\n",
            'data: {"type":"chunk","content":"ok"}\n\n',
          ])
        )
    )

    await streamSSE("/test", {}, onEvent)

    expect(onEvent).toHaveBeenCalledTimes(1)
    expect(onEvent).toHaveBeenCalledWith({ type: "chunk", content: "ok" })
  })

  it("throws HeliosError on non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: () =>
          Promise.resolve({
            error: { code: "invalid_request", message: "query required" },
          }),
      })
    )

    await expect(streamSSE("/test", {}, vi.fn())).rejects.toThrow(HeliosError)
  })

  it("throws HeliosError when response body is missing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        body: null,
      })
    )

    await expect(streamSSE("/test", {}, vi.fn())).rejects.toThrow(HeliosError)
  })

  it("skips empty and non-data lines", async () => {
    const onEvent = vi.fn()
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          createMockSSEResponse([
            '\n\n: comment\n\ndata: {"type":"chunk","content":"x"}\n\n',
          ])
        )
    )

    await streamSSE("/test", {}, onEvent)

    expect(onEvent).toHaveBeenCalledTimes(1)
  })
})
