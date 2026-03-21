import { SSO_CLIENT_ID, SSO_AUTHORITY_URL } from "./constants"

export interface Session {
  accessToken: string
  name: string
  email: string
}

const SESSION_KEY = "helios_session"

export function buildSSOUrl(): string {
  const params = new URLSearchParams({
    client_id: SSO_CLIENT_ID,
    redirect_uri: `${window.location.origin}/helios/auth/callback`,
    response_type: "code",
    scope: "openid profile email",
  })
  return `${SSO_AUTHORITY_URL}/sso/authorize?${params}`
}

export function parseCallbackParams(
  searchParams: URLSearchParams
): Session | null {
  const accessToken = searchParams.get("access_token")
  const name = searchParams.get("name")
  const email = searchParams.get("email")

  if (!accessToken) return null

  return {
    accessToken,
    name: name ?? "User",
    email: email ?? "",
  }
}

export function saveSession(session: Session): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function loadSession(): Session | null {
  const stored = sessionStorage.getItem(SESSION_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as Session
  } catch {
    return null
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}
