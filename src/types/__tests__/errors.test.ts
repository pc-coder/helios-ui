import { describe, it, expect } from "vitest"
import { HeliosError } from "../errors"

describe("HeliosError", () => {
  it("sets code, message, and status", () => {
    const error = new HeliosError("not_found", "Project not found", 404)

    expect(error.code).toBe("not_found")
    expect(error.message).toBe("Project not found")
    expect(error.status).toBe(404)
    expect(error.name).toBe("HeliosError")
  })

  it("extends Error", () => {
    const error = new HeliosError("internal_error", "Server failure", 500)

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(HeliosError)
  })
})
