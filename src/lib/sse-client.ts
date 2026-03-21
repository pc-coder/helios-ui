import { API_BASE_URL } from "./constants"
import { HeliosError } from "@/types/errors"
import { emitSessionExpired } from "./auth-interceptor"
import { getTracingHeaders } from "./tracing"

export async function streamSSE(
  path: string,
  body: unknown,
  onEvent: (data: unknown) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTracingHeaders() },
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    if (response.status === 401) {
      emitSessionExpired()
    }
    const errorBody = await response.json().catch(() => null)
    throw new HeliosError(
      errorBody?.error?.code ?? "internal_error",
      errorBody?.error?.message ?? response.statusText,
      response.status
    )
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new HeliosError("internal_error", "No response body", 500)
  }

  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith("data: ")) continue

        const payload = trimmed.slice(6)
        if (payload === "[DONE]") return

        try {
          onEvent(JSON.parse(payload))
        } catch {
          // skip malformed JSON
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
