import { http, HttpResponse } from "msw"
import {
  apiStats,
  apiFilters,
  apiSearchStreamingResponse,
  apiRawResults,
} from "../data/api"
import { createSSEStream } from "../utils/sse"

const BASE = "/api/helios/v1/api"

export const apiHandlers = [
  http.get(`${BASE}/stats`, () => {
    return HttpResponse.json(apiStats)
  }),

  http.get(`${BASE}/filters`, () => {
    return HttpResponse.json(apiFilters)
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
      apiSearchStreamingResponse.chunks,
      apiSearchStreamingResponse.sources
    )

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  }),

  http.post(`${BASE}/raw-search`, async ({ request }) => {
    const body = (await request.json()) as {
      query?: string
      filters?: { method?: string; service?: string }
    }

    if (!body?.query) {
      return HttpResponse.json(
        { error: { code: "invalid_request", message: "query is required" } },
        { status: 400 }
      )
    }

    let results = [...apiRawResults]

    if (body.filters?.method) {
      results = results.filter(
        (r) => r.method.toUpperCase() === body.filters!.method!.toUpperCase()
      )
    }
    if (body.filters?.service) {
      results = results.filter((r) => r.service === body.filters!.service)
    }

    return HttpResponse.json({ results })
  }),
]
