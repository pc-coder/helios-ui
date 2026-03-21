import { describe, it, expect } from "vitest"
import { cn } from "../utils"

describe("cn", () => {
  it("merges multiple class names", () => {
    const result = cn("text-sm", "font-bold")
    expect(result).toBe("text-sm font-bold")
  })

  it("handles conflicting Tailwind classes by keeping the last", () => {
    const result = cn("text-sm", "text-lg")
    expect(result).toBe("text-lg")
  })

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "visible")
    expect(result).toBe("base visible")
  })

  it("returns empty string for no inputs", () => {
    const result = cn()
    expect(result).toBe("")
  })

  it("handles undefined and null values", () => {
    const result = cn("base", undefined, null, "end")
    expect(result).toBe("base end")
  })
})
