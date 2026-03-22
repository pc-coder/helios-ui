import { useEffect, useState, useRef } from "react"
import { useSearchParams, useNavigate } from "react-router"
import { useAuth } from "@/components/auth-provider"
import {
  parseCallbackParams,
  decodeState,
  exchangeCodeForTokens,
  fetchUserInfo,
} from "@/lib/auth"
import type { Session } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    async function handleCallback() {
      const params = parseCallbackParams(searchParams)

      if (!params) {
        navigate(ROUTES.LOGIN, { replace: true })
        return
      }

      const decoded = decodeState(params.state)

      if (!decoded) {
        setError("Invalid state parameter")
        return
      }

      try {
        const tokenResponse = await exchangeCodeForTokens(
          params.code,
          decoded.verifier
        )

        const userInfo = await fetchUserInfo(tokenResponse.access_token)

        const session: Session = {
          accessToken: tokenResponse.access_token,
          name: userInfo.display_name || "User",
          email: userInfo.email || "",
        }

        setSession(session)
        navigate(ROUTES.DASHBOARD, { replace: true })
      } catch (err) {
        console.error("Authentication failed:", err)
        setError(err instanceof Error ? err.message : "Authentication failed")
      }
    }

    handleCallback()
  }, [searchParams, setSession, navigate])

  if (error) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <p className="text-sm text-destructive">
          Authentication failed: {error}
        </p>
        <a
          href={ROUTES.LOGIN}
          className="text-sm text-primary hover:underline"
        >
          Back to login
        </a>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing in...</p>
    </div>
  )
}
