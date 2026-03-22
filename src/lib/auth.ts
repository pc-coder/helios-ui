import { SSO_CONFIG } from "./constants"
import { getTracingHeaders } from "./tracing"
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateRandomState,
  encodeState,
  decodeState,
} from "./pkce"

// ── Session ──────────────────────────────────────────────────────

export interface Session {
  accessToken: string
  name: string
  email: string
}

const SESSION_KEY = "helios_session"

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

export function getAuthHeaders(): Record<string, string> {
  const session = loadSession()
  if (!session) return {}
  return { Authorization: `Bearer ${session.accessToken}` }
}

// ── SSO / PKCE ───────────────────────────────────────────────────

export async function buildSSOUrl(): Promise<string> {
  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  const state = generateRandomState()

  const params = new URLSearchParams({
    client_id: SSO_CONFIG.CLIENT_ID,
    redirect_uri: SSO_CONFIG.REDIRECT_URL,
    response_type: "code",
    scope: "offline_access openid",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state: encodeState(state, verifier),
  })

  return `${SSO_CONFIG.AUTHORITY_URL}?${params}`
}

// ── Callback parsing ─────────────────────────────────────────────

export function parseCallbackParams(
  searchParams: URLSearchParams
): { code: string; state: string } | null {
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  if (!code || !state) return null
  return { code, state }
}

export { decodeState }

// ── Token exchange ───────────────────────────────────────────────

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
  scope?: string
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<TokenResponse> {
  const response = await fetch(SSO_CONFIG.TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      redirect_uri: SSO_CONFIG.REDIRECT_URL,
      client_id: SSO_CONFIG.CLIENT_ID,
      code_verifier: codeVerifier,
    }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`Token exchange failed: ${response.statusText} - ${text}`)
  }

  return response.json() as Promise<TokenResponse>
}

// ── User info ────────────────────────────────────────────────────

export interface UserInfo {
  email: string
  firstName: string
  lastName: string
  display_name: string
}

export async function fetchUserInfo(accessToken: string): Promise<UserInfo> {
  const response = await fetch(SSO_CONFIG.USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...getTracingHeaders(),
    },
  })

  if (!response.ok) {
    throw new Error(`User info fetch failed: ${response.statusText}`)
  }

  return response.json() as Promise<UserInfo>
}
