import { describe, it, expect, beforeEach } from "vitest"
import {
  parseCallbackParams,
  buildSSOUrl,
  saveSession,
  loadSession,
  clearSession,
  getAuthHeaders,
} from "../auth"
import type { Session } from "../auth"

describe("parseCallbackParams", () => {
  it("returns code and state when present", () => {
    const params = new URLSearchParams({
      code: "auth-code-123",
      state: "state-abc|verifier-xyz",
    })

    const result = parseCallbackParams(params)

    expect(result).toEqual({
      code: "auth-code-123",
      state: "state-abc|verifier-xyz",
    })
  })

  it("returns null when code is missing", () => {
    const params = new URLSearchParams({ state: "some-state" })

    const result = parseCallbackParams(params)

    expect(result).toBeNull()
  })

  it("returns null when state is missing", () => {
    const params = new URLSearchParams({ code: "some-code" })

    const result = parseCallbackParams(params)

    expect(result).toBeNull()
  })
})

describe("buildSSOUrl", () => {
  it("builds URL with PKCE params", async () => {
    const url = await buildSSOUrl()

    expect(url).toContain("/sso/authorize?")
    expect(url).toContain("response_type=code")
    expect(url).toContain("code_challenge=")
    expect(url).toContain("code_challenge_method=S256")
    expect(url).toContain("state=")
    expect(url).toContain("redirect_uri=")
  })
})

describe("session storage", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("saveSession and loadSession round-trip", () => {
    const session: Session = {
      accessToken: "tok-abc",
      name: "Jane",
      email: "jane@test.com",
    }

    saveSession(session)
    const loaded = loadSession()

    expect(loaded).toEqual(session)
  })

  it("loadSession returns null when no session stored", () => {
    const result = loadSession()

    expect(result).toBeNull()
  })

  it("loadSession returns null for invalid JSON", () => {
    sessionStorage.setItem("helios_session", "not-valid-json")

    const result = loadSession()

    expect(result).toBeNull()
  })

  it("clearSession removes the session", () => {
    saveSession({ accessToken: "tok", name: "X", email: "x@test.com" })

    clearSession()
    const result = loadSession()

    expect(result).toBeNull()
  })
})

describe("getAuthHeaders", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("returns Authorization header when session exists", () => {
    saveSession({ accessToken: "tok-123", name: "X", email: "" })

    const headers = getAuthHeaders()

    expect(headers).toEqual({ Authorization: "Bearer tok-123" })
  })

  it("returns empty object when no session", () => {
    const headers = getAuthHeaders()

    expect(headers).toEqual({})
  })
})
