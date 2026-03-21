const TRACING_KEY = "helios_tracing_id"

function generateHexId(bytes: number): string {
  const array = new Uint8Array(bytes)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

export function generateTraceId(): string {
  return generateHexId(16)
}

export function generateSpanId(): string {
  return generateHexId(8)
}

let sessionTracingId: string | null = null

export function getSessionTracingId(): string {
  if (!sessionTracingId) {
    sessionTracingId =
      sessionStorage.getItem(TRACING_KEY) ?? generateHexId(16)
    sessionStorage.setItem(TRACING_KEY, sessionTracingId)
  }
  return sessionTracingId
}

export function resetSessionTracingId(): void {
  sessionTracingId = null
  sessionStorage.removeItem(TRACING_KEY)
}

export function getTracingHeaders(): Record<string, string> {
  return {
    "x-b3-traceid": generateTraceId(),
    "x-b3-spanid": generateSpanId(),
    "Session-Tracing-Id": getSessionTracingId(),
  }
}
