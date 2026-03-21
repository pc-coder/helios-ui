const encoder = new TextEncoder()

export function createSSEStream(
  chunks: string[],
  sources: unknown[],
  delayMs = 60
): ReadableStream<Uint8Array> {
  let index = 0

  return new ReadableStream({
    async pull(controller) {
      if (index < chunks.length) {
        const event = JSON.stringify({ type: "chunk", content: chunks[index] })
        controller.enqueue(encoder.encode(`data: ${event}\n\n`))
        index++
        await new Promise((resolve) => setTimeout(resolve, delayMs))
        return
      }

      if (index === chunks.length) {
        const sourcesEvent = JSON.stringify({ type: "sources", sources })
        controller.enqueue(encoder.encode(`data: ${sourcesEvent}\n\n`))
        index++
        await new Promise((resolve) => setTimeout(resolve, 10))
        return
      }

      const doneEvent = JSON.stringify({ type: "done" })
      controller.enqueue(encoder.encode(`data: ${doneEvent}\n\n`))
      controller.close()
    },
  })
}
