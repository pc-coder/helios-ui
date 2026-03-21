import { http, HttpResponse } from "msw"
import { codeStats, codeFilters, codeSearchStreamingResponse } from "../data/code"
import { createSSEStream } from "../utils/sse"

const BASE = "/api/helios/v1/code"

export const codeHandlers = [
  http.get(`${BASE}/stats`, () => {
    return HttpResponse.json(codeStats)
  }),

  http.get(`${BASE}/filters`, () => {
    return HttpResponse.json(codeFilters)
  }),

  http.post(`${BASE}/search`, async ({ request }) => {
    const body = (await request.json()) as { query?: string }

    if (!body?.query) {
      return HttpResponse.json(
        { error: { code: "invalid_request", message: "query is required" } },
        { status: 400 }
      )
    }

    const stream = createSSEStream(
      codeSearchStreamingResponse.chunks,
      codeSearchStreamingResponse.sources
    )

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  }),
]
