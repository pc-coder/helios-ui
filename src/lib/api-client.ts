import { API_BASE_URL } from "./constants"
import { HeliosError } from "@/types/errors"
import type { HeliosApiError } from "@/types/errors"

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as HeliosApiError | null
    throw new HeliosError(
      body?.error?.code ?? "internal_error",
      body?.error?.message ?? response.statusText,
      response.status
    )
  }
  return response.json() as Promise<T>
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)
  return handleResponse<T>(response)
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  return handleResponse<T>(response)
}
