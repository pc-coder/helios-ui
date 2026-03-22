function base64UrlEncode(buffer: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i])
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function generateRandomBytes(length: number): Uint8Array {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return array
}

export function generateCodeVerifier(): string {
  return base64UrlEncode(generateRandomBytes(32))
}

export async function generateCodeChallenge(
  verifier: string
): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return base64UrlEncode(new Uint8Array(digest))
}

export function generateRandomState(): string {
  return base64UrlEncode(generateRandomBytes(32))
}

export function encodeState(state: string, verifier: string): string {
  return `${state}|${verifier}`
}

export function decodeState(
  combined: string
): { state: string; verifier: string } | null {
  const separator = combined.indexOf("|")
  if (separator === -1) return null
  return {
    state: combined.slice(0, separator),
    verifier: combined.slice(separator + 1),
  }
}
