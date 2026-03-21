import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  parseCallbackParams,
  buildSSOUrl,
  saveSession,
  loadSession,
  clearSession,
} from "../auth"
import type { Session } from "../auth"

describe("parseCallbackParams", () => {
  it("returns session when all params present", () => {
    const params = new URLSearchParams({
      access_token: "tok-123",
      name: "Jane Doe",
      email: "jane@example.com",
    })

    const result = parseCallbackParams(params)

    expect(result).toEqual({
      accessToken: "tok-123",
      name: "Jane Doe",
      email: "jane@example.com",
    })
  })

  it("returns null when access_token is missing", () => {
    const params = new URLSearchParams({ name: "Jane", email: "jane@test.com" })

    const result = parseCallbackParams(params)

    expect(result).toBeNull()
  })

  it("defaults name to 'User' when missing", () => {
    const params = new URLSearchParams({ access_token: "tok-123" })

    const result = parseCallbackParams(params)

    expect(result?.name).toBe("User")
  })

  it("defaults email to empty string when missing", () => {
    const params = new URLSearchParams({ access_token: "tok-123" })

    const result = parseCallbackParams(params)

    expect(result?.email).toBe("")
  })
})

describe("buildSSOUrl", () => {
  it("builds URL with correct params", () => {
    const url = buildSSOUrl()

    expect(url).toContain("/sso/authorize?")
    expect(url).toContain("client_id=helios-ui")
    expect(url).toContain("response_type=code")
    expect(url).toContain("scope=openid+profile+email")
    expect(url).toContain("redirect_uri=")
    expect(url).toContain(encodeURIComponent("/helios/auth/callback"))
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
