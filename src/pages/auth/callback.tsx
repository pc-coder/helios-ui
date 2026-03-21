import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router"
import { useAuth } from "@/components/auth-provider"
import { parseCallbackParams } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setSession } = useAuth()

  useEffect(() => {
    const session = parseCallbackParams(searchParams)

    if (session) {
      setSession(session)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } else {
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [searchParams, setSession, navigate])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing in...</p>
    </div>
  )
}
