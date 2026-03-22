import { describe, it, expect } from "vitest"
import { createSSEStream } from "../utils/sse"

async function readStream(
  stream: ReadableStream<Uint8Array>
): Promise<string[]> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  const lines: string[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    lines.push(text)
  }

  return lines
}

describe("createSSEStream", () => {
  it("emits chunks in SSE format", async () => {
    const stream = createSSEStream(["Hello", " World"], [], 0)

    const events = await readStream(stream)

    expect(events[0]).toContain('data: {"type":"chunk","content":"Hello"}')
    expect(events[1]).toContain('data: {"type":"chunk","content":" World"}')
  })

  it("emits sources event after chunks", async () => {
    const sources = [{ file: "test.ts" }]
    const stream = createSSEStream(["chunk"], sources, 0)

    const events = await readStream(stream)

    const sourcesEvent = events.find((e) => e.includes('"type":"sources"'))
    expect(sourcesEvent).toBeDefined()
    expect(sourcesEvent).toContain('"file":"test.ts"')
  })

  it("emits done event and closes stream", async () => {
    const stream = createSSEStream(["x"], [], 0)

    const events = await readStream(stream)

    const doneEvent = events.find((e) => e.includes('"type":"done"'))
    expect(doneEvent).toBeDefined()
  })

  it("emits events with double newline delimiter", async () => {
    const stream = createSSEStream(["test"], [], 0)

    const events = await readStream(stream)

    for (const event of events) {
      expect(event).toMatch(/\n\n$/)
    }
  })
})
