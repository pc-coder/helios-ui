export type HeliosErrorCode = "invalid_request" | "not_found" | "internal_error"

export interface HeliosApiError {
  error: {
    code: HeliosErrorCode
    message: string
  }
}

export class HeliosError extends Error {
  code: HeliosErrorCode
  status: number

  constructor(code: HeliosErrorCode, message: string, status: number) {
    super(message)
    this.name = "HeliosError"
    this.code = code
    this.status = status
  }
}
