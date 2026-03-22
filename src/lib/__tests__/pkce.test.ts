import { describe, it, expect } from "vitest"
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateRandomState,
  encodeState,
  decodeState,
} from "../pkce"

describe("generateCodeVerifier", () => {
  it("returns a base64url string", () => {
    const verifier = generateCodeVerifier()

    expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(verifier.length).toBeGreaterThan(20)
  })

  it("generates unique values", () => {
    const a = generateCodeVerifier()
    const b = generateCodeVerifier()

    expect(a).not.toBe(b)
  })
})

describe("generateCodeChallenge", () => {
  it("returns a base64url string", async () => {
    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)

    expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it("is deterministic for same input", async () => {
    const verifier = "test-verifier-123"
    const a = await generateCodeChallenge(verifier)
    const b = await generateCodeChallenge(verifier)

    expect(a).toBe(b)
  })

  it("produces different output for different input", async () => {
    const a = await generateCodeChallenge("verifier-a")
    const b = await generateCodeChallenge("verifier-b")

    expect(a).not.toBe(b)
  })
})

describe("generateRandomState", () => {
  it("returns a base64url string", () => {
    const state = generateRandomState()

    expect(state).toMatch(/^[A-Za-z0-9_-]+$/)
  })
})

describe("encodeState / decodeState", () => {
  it("round-trips state and verifier", () => {
    const encoded = encodeState("my-state", "my-verifier")
    const decoded = decodeState(encoded)

    expect(decoded).toEqual({ state: "my-state", verifier: "my-verifier" })
  })

  it("returns null for string without separator", () => {
    const result = decodeState("no-pipe-here")

    expect(result).toBeNull()
  })

  it("handles verifier containing special characters", () => {
    const verifier = "abc_def-ghi"
    const encoded = encodeState("state", verifier)
    const decoded = decodeState(encoded)

    expect(decoded?.verifier).toBe(verifier)
  })
})
